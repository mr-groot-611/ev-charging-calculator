export interface CPO {
    id: string;
    name: string;
    rate: number; // RM per kWh
    isEnabled: boolean;
}

export interface SubscriptionPlan {
    id: string;
    name: string;
    brand: string; // Should match a CPO name
    feeFrequency: 'Monthly' | 'Annual';
    feeAmount: number; // RM
    discountPct: number; // 0-100
    discountCap: number; // RM per year, 0 = no cap
    isEnabled: boolean;
}

export interface DrivingStats {
    monthlyDistance: number; // km
    efficiency: number; // kWh/100km
    includeLosses: boolean;
    acLossPct: number; // 0-100
    dcLossPct: number; // 0-100
}

export interface HomeCharging {
    rate: number; // RM per kWh
    fixedMonthlyFee: number; // RM
}

export interface ChargingSplit {
    homePct: number; // 0-100
}

export interface PublicChargingMode {
    mode: 'single' | 'mix';
    mix: Record<string, number>; // cpo.name -> percentage (0-100)
}

// Calculation Results
export interface CalculationResult {
    annualKWh: {
        consumed: number;
        billedAC: number;
        billedDC: number;
        totalBilled: number;
    };
    costs: {
        homeEnergy: number;
        homeFixed: number;
        homeTotal: number;
        publicEnergy: number; // Base cost before plans
        publicTotal: number; // After plans/discounts
        total: number;
    };
    savings: {
        planDiscount: number;
    };
    effectiveRates: {
        total: number; // RM/kWh
        publicEnergyOnly: number; // RM/kWh
        publicWithFee: number; // RM/kWh
    };
}

export interface ScenarioResult extends CalculationResult {
    scenarioName: string;
    isPlan: boolean;
    planName?: string;
    brand: string;
}
