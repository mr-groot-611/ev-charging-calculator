import { useCalculator } from '../../store/CalculatorContext';
import { InfoTooltip } from '../ui/InfoTooltip';

export function DrivingInputs() {
    const { driving, setDriving } = useCalculator();

    const update = (field: keyof typeof driving, value: any) => {
        setDriving({ ...driving, [field]: value });
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
            <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xl font-bold text-slate-800">Driving & Vehicle</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Distance */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600 block">
                        Monthly Distance (km)
                    </label>
                    <input
                        type="number"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium text-slate-900"
                        value={driving.monthlyDistance}
                        onChange={(e) => update('monthlyDistance', Number(e.target.value))}
                    />
                </div>

                {/* Efficiency */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600 flex items-center">
                        Efficiency (kWh/100km)
                        <InfoTooltip content="Energy consumed to travel 100km. Lower is better. Check your car dashboard (e.g., BYD Atto 3 ~15 kWh/100km)." />
                    </label>
                    <input
                        type="number"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium text-slate-900"
                        value={driving.efficiency}
                        onChange={(e) => update('efficiency', Number(e.target.value))}
                    />
                </div>
            </div>

            {/* Losses Toggle */}
            <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                            checked={driving.includeLosses}
                            onChange={(e) => update('includeLosses', e.target.checked)}
                        />
                        <span className="text-sm font-medium text-slate-700">Include Charging Efficiency Losses</span>
                        <InfoTooltip content="Energy lost as heat during charging (Charger → Battery). AC is typically 80-90% efficient, DC is 90-95%." />
                    </label>
                </div>

                {driving.includeLosses && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                AC Charging Loss (%)
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    className="w-full px-4 py-2 pl-4 pr-8 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium text-slate-900"
                                    value={driving.acLossPct}
                                    onChange={(e) => update('acLossPct', Number(e.target.value))}
                                />
                                <span className="absolute right-3 top-2.5 text-slate-400 text-sm">%</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center">
                                DC Charging Loss (%)
                                <InfoTooltip content="Energy lost as heat during fast charging. Typically 90-95% efficient (5-10% loss)." />
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    className="w-full px-4 py-2 pl-4 pr-8 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium text-slate-900"
                                    value={driving.dcLossPct}
                                    onChange={(e) => update('dcLossPct', Number(e.target.value))}
                                />
                                <span className="absolute right-3 top-2.5 text-slate-400 text-sm">%</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
