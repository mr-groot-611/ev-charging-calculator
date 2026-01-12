import { useScenarios } from '../../hooks/useScenarios';
import { Zap, Home, Car } from 'lucide-react';

export function SummaryCards() {
    const { bestOverall, bestScenarios } = useScenarios();

    if (!bestOverall) return null;

    const { annualKWh, costs } = bestOverall;

    // Use destructured values if needed, or remove them from destructuring if unused.
    // The error was "All destructured elements are unused" for useCalculator previously?
    // Ah, in previous version I had: const { driving, split } = useCalculator();
    // And I didn't use them. So I just removed that line.

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Energy Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                    <div>
                        <span className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Annual Energy</span>
                        <div className="mt-1 flex items-baseline gap-1">
                            <span className="text-3xl font-black text-slate-900">{annualKWh.totalBilled.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                            <span className="text-sm font-medium text-slate-500">kWh billed</span>
                        </div>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <Car className="w-6 h-6" />
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between text-sm">
                    <div>
                        <span className="block text-slate-400 text-xs">Home (AC)</span>
                        <span className="font-bold text-slate-700">{annualKWh.billedAC.toFixed(0)} kWh</span>
                    </div>
                    <div className="text-right">
                        <span className="block text-slate-400 text-xs">Public (DC)</span>
                        <span className="font-bold text-slate-700">{annualKWh.billedDC.toFixed(0)} kWh</span>
                    </div>
                </div>
            </div>

            {/* Home Cost Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                    <div>
                        <span className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Home Cost</span>
                        <div className="mt-1 flex items-baseline gap-1">
                            <span className="text-lg font-medium text-slate-500">RM</span>
                            <span className="text-3xl font-black text-slate-900">{costs.homeTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <Home className="w-6 h-6" />
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-50 text-sm text-slate-500">
                    Includes {costs.homeFixed > 0 ? `RM${costs.homeFixed} fixed fees` : 'electricity rates'}
                </div>
            </div>

            {/* Total Cost Card (Best) */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 shadow-lg shadow-indigo-200 text-white flex flex-col justify-between">
                <div className="flex items-start justify-between">
                    <div>
                        <span className="text-xs font-bold text-indigo-200 uppercase tracking-wide">Lowest Annual Spend</span>
                        <div className="mt-1 flex items-baseline gap-1">
                            <span className="text-lg font-medium text-indigo-200">RM</span>
                            <span className="text-4xl font-black">{costs.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl">
                        <Zap className="w-6 h-6 text-white" />
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 text-indigo-100 text-sm">
                    Best Option: <span className="font-bold text-white">
                        {bestScenarios && bestScenarios.length > 1
                            ? (bestScenarios.length <= 2
                                ? bestScenarios.map(s => s.scenarioName).join(' & ')
                                : `${bestScenarios.length} Options Available`)
                            : bestOverall.scenarioName}
                    </span>
                </div>
            </div>
        </div>
    );
}
