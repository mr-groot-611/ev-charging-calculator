import type {
    CPO,
    SubscriptionPlan,
    DrivingStats,
    HomeCharging,
    ChargingSplit,
    PublicChargingMode,
    ScenarioResult
} from '../types';

/**
 * Core energy calculation step
 */
export function calculateAnnualEnergy(driving: DrivingStats, split: ChargingSplit) {
    // Step 1: Consumption (at battery)
    const monthlyConsumed = (driving.monthlyDistance * driving.efficiency) / 100;
    const annualConsumed = monthlyConsumed * 12;

    // Step 2: Split Consumed
    const annualACConsumed = annualConsumed * (split.homePct / 100);
    const annualDCConsumed = annualConsumed * ((100 - split.homePct) / 100);

    // Step 3: Billed (Losses)
    let annualACBilled = annualACConsumed;
    let annualDCBilled = annualDCConsumed;

    if (driving.includeLosses) {
        annualACBilled = annualACConsumed / (1 - driving.acLossPct / 100);
        annualDCBilled = annualDCConsumed / (1 - driving.dcLossPct / 100);
    }

    return {
        consumed: annualConsumed,
        billedAC: annualACBilled,
        billedDC: annualDCBilled,
        totalBilled: annualACBilled + annualDCBilled
    };
}

/**
 * Generate all comparison scenarios
 */
export function generateScenarios(
    driving: DrivingStats,
    home: HomeCharging,
    split: ChargingSplit,
    publicMode: PublicChargingMode,
    cpos: CPO[],
    plans: SubscriptionPlan[]
): ScenarioResult[] {
    const energy = calculateAnnualEnergy(driving, split);

    // Step 4: Home Cost
    const homeEnergyCost = energy.billedAC * home.rate;
    const homeFixedCost = home.fixedMonthlyFee * 12;
    const homeTotalCost = homeEnergyCost + homeFixedCost;

    const scenarios: ScenarioResult[] = [];
    const activeCPOs = cpos.filter(c => c.isEnabled);

    // --- Helper to build a result object ---
    const createResult = (
        name: string,
        brand: string,
        isPlan: boolean,
        publicLines: { cost: number, fee: number, discount: number },
        planName?: string
    ): ScenarioResult => {
        const publicTotal = publicLines.cost + publicLines.fee;
        const total = homeTotalCost + publicTotal;

        // Effective rates
        // Public Energy Only: (Cost after discount) / DC Billed
        const publicEnergyOnlyRate = energy.billedDC > 0
            ? publicLines.cost / energy.billedDC
            : 0;

        // Public With Fee: (Cost after discount + Fee) / DC Billed
        const publicWithFeeRate = energy.billedDC > 0
            ? publicTotal / energy.billedDC
            : 0;

        // Total Effective: Total Cost / Total Billed kWh
        const totalRate = energy.totalBilled > 0
            ? total / energy.totalBilled
            : 0;

        return {
            scenarioName: name,
            brand,
            isPlan,
            planName,
            annualKWh: energy,
            costs: {
                homeEnergy: homeEnergyCost,
                homeFixed: homeFixedCost,
                homeTotal: homeTotalCost,
                publicEnergy: publicLines.cost + publicLines.discount, // Original cost
                publicTotal,
                total
            },
            savings: {
                planDiscount: publicLines.discount
            },
            effectiveRates: {
                total: totalRate,
                publicEnergyOnly: publicEnergyOnlyRate,
                publicWithFee: publicWithFeeRate
            }
        };
    };

    // --- Scenario Generation ---

    if (publicMode.mode === 'single') {
        // Mode 1: Compare each CPO as 100% of public charging

        // 1. PAYG Scenarios (one per CPO)
        activeCPOs.forEach(cpo => {
            const dcCost = energy.billedDC * cpo.rate;
            scenarios.push(createResult(
                `${cpo.name} (PAYG)`,
                cpo.name,
                false,
                { cost: dcCost, fee: 0, discount: 0 }
            ));
        });

        // 2. Plan Scenarios
        // Logic: A plan applies to its brand. We assume 100% usage of that brand.
        plans.filter(p => p.isEnabled).forEach(plan => {
            const cpo = activeCPOs.find(c => c.name === plan.brand || c.id === plan.brand); // Robust matching
            if (!cpo) return; // Skip if plan's CPO is unknown/disabled

            // Calculate costs
            const rawCost = energy.billedDC * cpo.rate;
            const discountAmount = rawCost * (plan.discountPct / 100);

            // Apply Cap
            const finalDiscount = plan.discountCap > 0
                ? Math.min(discountAmount, plan.discountCap)
                : discountAmount;

            const costAfterDiscount = Math.max(0, rawCost - finalDiscount);

            const annualFee = plan.feeFrequency === 'Monthly'
                ? plan.feeAmount * 12
                : plan.feeAmount;

            scenarios.push(createResult(
                `${plan.name}`,
                cpo.name,
                true,
                { cost: costAfterDiscount, fee: annualFee, discount: finalDiscount },
                plan.name
            ));
        });

    } else {
        // Mode 2: Public Mix
        // We have one specific mix of CPOs defined in publicMode.mix (Record<cpoName, pct>)

        // Helper to calc mixed cost (Base PAYG)
        let mixBaseCost = 0;
        // Normalize mix just in case, though UI should handle it. 
        // We assume publicMode.mix matches activeCPOs names.

        // Calculate weighted average rate handling
        // Actually better to sum (kwh * share * rate)
        activeCPOs.forEach(cpo => {
            const share = publicMode.mix[cpo.name] || 0;
            if (share > 0) {
                const cpoKwh = energy.billedDC * (share / 100);
                mixBaseCost += cpoKwh * cpo.rate;
            }
        });

        // 1. PAYG Mixed Scenario
        scenarios.push(createResult(
            "Mixed Public Charging",
            "Mixed",
            false,
            { cost: mixBaseCost, fee: 0, discount: 0 }
        ));

        // 2. Plan Scenarios in Mix Mode
        // For each plan, we take the Mixed Scenario, add the fee, and apply discount ONLY to that brand's portion.
        plans.filter(p => p.isEnabled).forEach(plan => {
            const cpo = activeCPOs.find(c => c.name === plan.brand);
            if (!cpo) return;

            const share = publicMode.mix[cpo.name] || 0;
            // If share is 0, they still pay the fee! (As per clarification)

            const cpoKwh = energy.billedDC * (share / 100);
            const cpoBaseCost = cpoKwh * cpo.rate;

            const discountAmount = cpoBaseCost * (plan.discountPct / 100);
            // Apply Cap
            const finalDiscount = plan.discountCap > 0
                ? Math.min(discountAmount, plan.discountCap)
                : discountAmount;

            // The DC cost for the mix is: (mixBaseCost - finalDiscount)
            const costAfterDiscount = Math.max(0, mixBaseCost - finalDiscount);
            const annualFee = plan.feeFrequency === 'Monthly'
                ? plan.feeAmount * 12
                : plan.feeAmount;

            scenarios.push(createResult(
                `${plan.name} (Mixed)`,
                "Mixed",
                true,
                { cost: costAfterDiscount, fee: annualFee, discount: finalDiscount },
                plan.name
            ));
        });
    }

    // Sort by Total Cost Ascending, then by Commitment (PAYG first), then Name
    return scenarios.sort((a, b) => {
        // 1. Primary: Total Cost
        const costDiff = a.costs.total - b.costs.total;
        if (Math.abs(costDiff) > 0.01) return costDiff; // Use epsilon for float comparison

        // 2. Secondary: Commitment (PAYG preferred over Plan)
        // isPlan: false < true
        if (a.isPlan !== b.isPlan) return a.isPlan ? 1 : -1;

        // 3. Tertiary: Name (Deterministic tie-breaker)
        return a.scenarioName.localeCompare(b.scenarioName);
    });
}
