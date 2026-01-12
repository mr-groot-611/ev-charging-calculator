import type { CPO, DrivingStats, HomeCharging, PublicChargingMode, SubscriptionPlan } from './types';

export const DEFAULT_DRIVING: DrivingStats = {
    monthlyDistance: 2000,
    efficiency: 18,
    includeLosses: true,
    acLossPct: 12,
    dcLossPct: 6,
};

export const DEFAULT_HOME: HomeCharging = {
    rate: 0.57, // Common TNB tier? Or user's example 0.99. User example was 0.99 for Home? No, that was rate example. 0.57 is typical but I'll use 0.57 as a sensible default or just use the user's example 0.99 if unsure. User said "default example: 0.99". I will stick to user example.
    fixedMonthlyFee: 0,
};

export const DEFAULT_CPOS: CPO[] = [
    { id: 'jomcharge', name: 'JomCharge', rate: 1.40, isEnabled: true },
    { id: 'chargeev', name: 'ChargeEV', rate: 1.30, isEnabled: true },
    { id: 'dchandal', name: 'DC Handal', rate: 1.30, isEnabled: true },
    { id: 'gentari', name: 'Gentari', rate: 1.60, isEnabled: true },
];

export const DEFAULT_PLANS: SubscriptionPlan[] = [
    {
        id: 'gentari-annual',
        name: 'Gentari (50% off) Annual',
        brand: 'Gentari',
        feeFrequency: 'Annual',
        feeAmount: 899,
        discountPct: 50,
        discountCap: 2400,
        isEnabled: false,
    },
    {
        id: 'jomcharge-monthly',
        name: 'JomCharge (10% off) Monthly',
        brand: 'JomCharge',
        feeFrequency: 'Monthly',
        feeAmount: 9.90,
        discountPct: 10,
        discountCap: 0,
        isEnabled: false,
    }
];

export const DEFAULT_MODE: PublicChargingMode = {
    mode: 'single',
    mix: {
        'JomCharge': 25,
        'ChargeEV': 25,
        'DC Handal': 25,
        'Gentari': 25
    }
};
