import { useMemo } from 'react';
import { useCalculator } from '../store/CalculatorContext';
import { generateScenarios } from '../logic/calculator';

export function useScenarios() {
    const { driving, home, split, publicMode, cpos, plans } = useCalculator();

    const results = useMemo(() => {
        return generateScenarios(driving, home, split, publicMode, cpos, plans);
    }, [driving, home, split, publicMode, cpos, plans]);

    const bestScenario = results[0]; // Already sorted by total cost

    // Find ALL best scenarios (within epsilon tolerance)
    const minCost = bestScenario?.costs.total ?? 0;
    const bestScenarios = results.filter(s => Math.abs(s.costs.total - minCost) < 0.01);

    const bestNoPlan = results.find(s => !s.isPlan);

    // Best Subscription Value logic: 
    // "among plan scenarios for each brand: compute savings vs brand PAYG... pick max savings"
    // This is a bit complex. We need to find the plan that saves the most MONEY compared to paying PAYG for that SAME brand.

    let bestPlanSavings = { savings: 0, scenario: null as typeof results[0] | null };

    // Group plans by brand?
    // We iterate through all Plan Scenarios.
    // For "Gentari Annual", we find "Gentari (PAYG)" cost.
    // Difference is savings.

    results.filter(s => s.isPlan).forEach(planScenario => {
        // Find matching PAYG scenario for this brand (or Mix if mixed)
        const paygScenario = results.find(s => !s.isPlan && s.brand === planScenario.brand);

        if (paygScenario) {
            // Savings = PAYG Cost - Plan Cost
            const savings = paygScenario.costs.publicTotal - planScenario.costs.publicTotal;
            if (savings > bestPlanSavings.savings) {
                bestPlanSavings = { savings, scenario: planScenario };
            }
        }
    });

    return {
        scenarios: results,
        bestOverall: bestScenario,
        bestScenarios, // Export list of all winners
        bestNoPlan,
        bestPlanSavings
    };
}
