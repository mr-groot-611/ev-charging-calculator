import { useScenarios } from '../../hooks/useScenarios';
import { Award, ThumbsUp, Wallet } from 'lucide-react';

export function RecommendationPanel() {
    const { bestOverall, bestScenarios, bestNoPlan, bestPlanSavings } = useScenarios();

    if (!bestOverall) return null;

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-500" />
                Recommendations
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Cheapest Overall */}
                <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100 rounded-full blur-2xl -mr-10 -mt-10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold text-sm uppercase tracking-wide">
                            <Wallet className="w-4 h-4" /> Cheapest Overall
                        </div>
                        <div className="text-2xl font-black text-indigo-900 pb-1 leading-none">
                            {bestScenarios && bestScenarios.length > 1 ? (
                                <div className="text-lg flex flex-col gap-1">
                                    {bestScenarios.slice(0, 2).map(s => (
                                        <div key={s.scenarioName} className="truncate">{s.scenarioName}</div>
                                    ))}
                                    {bestScenarios.length > 2 && <div className="text-xs text-indigo-500">+{bestScenarios.length - 2} more</div>}
                                </div>
                            ) : (
                                bestOverall.scenarioName
                            )}
                        </div>
                        <div className="text-indigo-600 font-medium">
                            RM {bestOverall.costs.total.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-xs">/ year</span>
                        </div>
                    </div>
                </div>

                {/* 2. Cheapest No-Subscription */}
                {bestNoPlan && bestNoPlan.scenarioName !== bestOverall.scenarioName && (
                    <div className="p-4 rounded-xl border border-slate-200 bg-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2 text-slate-500 font-bold text-sm uppercase tracking-wide">
                                <ThumbsUp className="w-4 h-4" /> Best No-Commitment
                            </div>
                            <div className="text-xl font-bold text-slate-800 pb-1 truncate" title={bestNoPlan.scenarioName}>
                                {bestNoPlan.scenarioName}
                            </div>
                            <div className="text-slate-600 font-medium">
                                RM {bestNoPlan.costs.total.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-xs">/ year</span>
                            </div>
                            <div className="text-xs text-red-500 mt-1 font-medium">
                                +RM {(bestNoPlan.costs.total - bestOverall.costs.total).toFixed(2)} vs best
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. Best Subscription Value */}
                {bestPlanSavings.savings > 0 && bestPlanSavings.scenario && (
                    <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100 rounded-full blur-2xl -mr-10 -mt-10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2 text-emerald-700 font-bold text-sm uppercase tracking-wide">
                                <Award className="w-4 h-4" /> Best Value Plan
                            </div>
                            <div className="text-xl font-bold text-emerald-900 pb-1 truncate" title={bestPlanSavings.scenario?.scenarioName}>
                                {bestPlanSavings.scenario?.scenarioName}
                            </div>
                            <div className="text-emerald-700 font-medium text-sm">
                                Saves <span className="font-bold underline">RM {bestPlanSavings.savings.toFixed(2)}</span> vs PAYG
                            </div>
                        </div>
                    </div>
                )}

                {bestPlanSavings.savings <= 0 && (
                    <div className="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-center text-slate-400 text-sm">
                        No subscription plan beats PAYG rates based on your usage.
                    </div>
                )}
            </div>
        </div>
    );
}
