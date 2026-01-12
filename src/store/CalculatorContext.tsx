import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type {
    DrivingStats,
    HomeCharging,
    ChargingSplit,
    PublicChargingMode,
    CPO,
    SubscriptionPlan
} from '../types';
import {
    DEFAULT_DRIVING,
    DEFAULT_HOME,
    DEFAULT_CPOS,
    DEFAULT_PLANS,
    DEFAULT_MODE
} from '../defaults';

interface CalculatorState {
    driving: DrivingStats;
    home: HomeCharging;
    split: ChargingSplit;
    publicMode: PublicChargingMode;
    cpos: CPO[];
    plans: SubscriptionPlan[];
}

interface CalculatorActions {
    setDriving: (stats: DrivingStats) => void;
    setHome: (home: HomeCharging) => void;
    setSplit: (split: ChargingSplit) => void;
    setPublicMode: (mode: PublicChargingMode) => void;
    setCpos: (cpos: CPO[]) => void;
    setPlans: (plans: SubscriptionPlan[]) => void;
    resetAll: () => void;
}

const CalculatorContext = createContext<(CalculatorState & CalculatorActions) | null>(null);

const STORAGE_KEY = 'ev-calculator-state-v1';

export function CalculatorProvider({ children }: { children: ReactNode }) {
    const [driving, setDriving] = useState<DrivingStats>(DEFAULT_DRIVING);
    const [home, setHome] = useState<HomeCharging>(DEFAULT_HOME);
    const [split, setSplit] = useState<ChargingSplit>({ homePct: 70 });
    const [publicMode, setPublicMode] = useState<PublicChargingMode>(DEFAULT_MODE);
    const [cpos, setCpos] = useState<CPO[]>(DEFAULT_CPOS);
    const [plans, setPlans] = useState<SubscriptionPlan[]>(DEFAULT_PLANS);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.driving) setDriving(parsed.driving);
                if (parsed.home) setHome(parsed.home);
                if (parsed.split) setSplit(parsed.split);
                if (parsed.publicMode) setPublicMode(parsed.publicMode);
                if (parsed.cpos) setCpos(parsed.cpos);
                if (parsed.plans) setPlans(parsed.plans);
            } catch (e) {
                console.error("Failed to load state", e);
            }
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        const state = { driving, home, split, publicMode, cpos, plans };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [driving, home, split, publicMode, cpos, plans]);

    const resetAll = () => {
        setDriving(DEFAULT_DRIVING);
        setHome(DEFAULT_HOME);
        setSplit({ homePct: 70 });
        setPublicMode(DEFAULT_MODE);
        setCpos(DEFAULT_CPOS);
        setPlans(DEFAULT_PLANS);
        localStorage.removeItem(STORAGE_KEY);
    };

    return (
        <CalculatorContext.Provider value={{
            driving, setDriving,
            home, setHome,
            split, setSplit,
            publicMode, setPublicMode,
            cpos, setCpos,
            plans, setPlans,
            resetAll
        }}>
            {children}
        </CalculatorContext.Provider>
    );
}

export function useCalculator() {
    const context = useContext(CalculatorContext);
    if (!context) {
        throw new Error('useCalculator must be used within a CalculatorProvider');
    }
    return context;
}
