import { useCalculator } from '../../store/CalculatorContext';
import { InfoTooltip } from '../ui/InfoTooltip';

export function HomeInputs() {
    const { home, setHome } = useCalculator();

    const update = (field: keyof typeof home, value: number) => {
        setHome({ ...home, [field]: value });
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
            <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xl font-bold text-slate-800">Home Charging (AC)</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Rate */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600 flex items-center">
                        Home Electricity Rate (RM/kWh)
                        <InfoTooltip content="Your electricity tariff. Common TNB rates: RM0.57 (Top Tier), RM0.218 (Off-Peak)." />
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 font-medium">RM</span>
                        <input
                            type="number"
                            step="0.01"
                            className="w-full pl-10 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all font-medium text-slate-900"
                            value={home.rate}
                            onChange={(e) => update('rate', Number(e.target.value))}
                        />
                    </div>
                </div>

                {/* Fixed Fee */}
                <div className="space-y-2">
                    <div className="flex items-center gap-1">
                        <label className="text-sm font-medium text-slate-600 block">
                            Fixed Monthly Fee (Optional)
                        </label>
                    </div>

                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 font-medium">RM</span>
                        <input
                            type="number"
                            className="w-full pl-10 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all font-medium text-slate-900"
                            value={home.fixedMonthlyFee}
                            onChange={(e) => update('fixedMonthlyFee', Number(e.target.value))}
                            placeholder="0"
                        />
                        <span className="absolute right-3 top-2.5 text-slate-400 text-sm">/mo</span>
                    </div>
                    <p className="text-xs text-slate-400">E.g. Condo charging access fee</p>
                </div>
            </div>
        </div>
    );
}
