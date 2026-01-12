import React, { useState, useMemo } from 'react';
import { useScenarios } from '../../hooks/useScenarios';
import type { ScenarioResult } from '../../types';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

export function ComparisonTable() {
    const { scenarios, bestOverall } = useScenarios();
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    // Default Sort: Brand (A-Z) -> PAYG first (isPlan false < true) -> Total Cost
    const sortedScenarios = useMemo(() => {
        return [...scenarios].sort((a, b) => {
            // 1. Brand
            const brandCompare = a.brand.localeCompare(b.brand);
            if (brandCompare !== 0) return brandCompare;

            // 2. Plan Type (PAYG first)
            if (a.isPlan !== b.isPlan) return a.isPlan ? 1 : -1;

            // 3. Price
            return a.costs.total - b.costs.total;
        });
    }, [scenarios]);

    if (scenarios.length === 0) return null;

    const toggleExpand = (name: string) => {
        setExpandedRow(expandedRow === name ? null : name);
    };

    // Grab first scenario for context (all have same context)
    const context = scenarios[0].annualKWh;
    const homePct = (context.billedAC / context.totalBilled) * 100;
    const publicPct = 100 - homePct;

    return (
        <div className="space-y-6">

            {/* Result Context Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col md:flex-row items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-slate-500 font-medium whitespace-nowrap">
                    <Info className="w-4 h-4" />
                    <span>Based on your usage:</span>
                </div>
                <div className="flex-1 w-full flex flex-wrap sm:flex-nowrap items-center gap-y-2 gap-x-3">
                    <span className="font-bold text-emerald-700 whitespace-nowrap order-1">{context.billedAC.toLocaleString()} kWh Home ({homePct.toFixed(0)}%)</span>
                    <span className="font-bold text-blue-700 whitespace-nowrap order-2 sm:order-3 ml-auto sm:ml-0">{context.billedDC.toLocaleString()} kWh Public ({publicPct.toFixed(0)}%)</span>
                    <div className="order-3 sm:order-2 w-full sm:flex-1 h-3 bg-slate-100 rounded-full overflow-hidden flex">
                        <div style={{ width: `${homePct}%` }} className="h-full bg-emerald-400"></div>
                        <div style={{ width: `${publicPct}%` }} className="h-full bg-blue-500"></div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800">Detailed Comparison</h3>
                    <p className="text-sm text-slate-400 mt-1">Grouped by Charging Network</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">
                                <th className="py-4 px-6 border-b border-slate-200 sticky left-0 bg-slate-50 z-10 w-1/3">Scenario</th>
                                <th className="py-4 px-4 border-b border-slate-200 text-right text-blue-600">Public Cost</th>
                                <th className="py-4 px-4 border-b border-slate-200 text-right text-emerald-600">Home Cost</th>
                                <th className="py-4 px-4 border-b border-slate-200 text-right">Total / Yr</th>
                                <th className="py-4 px-4 border-b border-slate-200 text-right">Avg Rate</th>
                                <th className="py-4 px-4 border-b border-slate-200"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {sortedScenarios.map((s) => (
                                <React.Fragment key={s.scenarioName}>
                                    <tr
                                        onClick={() => toggleExpand(s.scenarioName)}
                                        className={`cursor-pointer transition-colors hover:bg-slate-50 ${bestOverall?.scenarioName === s.scenarioName ? 'bg-indigo-50/10' : ''}`}
                                    >
                                        <td className="py-4 px-6 sticky left-0 bg-inherit z-10">
                                            <div className="flex items-center gap-2">
                                                {/* Highlight if this scenario is one of the best (lowest cost) */}
                                                {Math.abs(s.costs.total - (bestOverall?.costs.total ?? 0)) < 0.01 && (
                                                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" title="Best Option"></span>
                                                )}
                                                <div className="min-w-0">
                                                    <div className={`font-bold truncate ${Math.abs(s.costs.total - (bestOverall?.costs.total ?? 0)) < 0.01 ? 'text-indigo-700' : 'text-slate-900'}`}>
                                                        {s.scenarioName}

                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        {s.isPlan
                                                            ? <span className="text-indigo-600 font-medium">Subscription</span>
                                                            : 'Pay-As-You-Go'
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Public Cost (Variable) */}
                                        <td className="py-4 px-4 text-right">
                                            <div className="font-bold text-slate-700">RM {s.costs.publicTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                                            {s.savings.planDiscount > 0 && (
                                                <div className="text-[10px] text-emerald-600 font-medium">
                                                    Saved RM{s.savings.planDiscount.toFixed(0)}
                                                </div>
                                            )}
                                        </td>

                                        {/* Home Cost (Fixed) */}
                                        <td className="py-4 px-4 text-right">
                                            <div className="font-medium text-slate-400">RM {s.costs.homeTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                                        </td>

                                        {/* Total */}
                                        <td className="py-4 px-4 text-right">
                                            <div className="font-black text-slate-900">RM {s.costs.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                                        </td>

                                        <td className="py-4 px-4 text-right">
                                            <div className="text-sm font-medium text-slate-600">{s.effectiveRates.total.toFixed(2)}</div>
                                            <span className="text-[10px] text-slate-400">/kWh</span>
                                        </td>

                                        <td className="py-4 px-4 text-right text-slate-400">
                                            {expandedRow === s.scenarioName ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                        </td>
                                    </tr>
                                    {expandedRow === s.scenarioName && (
                                        <tr className="bg-slate-50/50">
                                            <td colSpan={6} className="p-0">
                                                <MonthlyBreakdown scenario={s} />
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function MonthlyBreakdown({ scenario }: { scenario: ScenarioResult }) {
    const monthlyKWh = {
        consumed: scenario.annualKWh.consumed / 12,
        billedAC: scenario.annualKWh.billedAC / 12,
        billedDC: scenario.annualKWh.billedDC / 12,
    };

    const monthlyCost = {
        home: scenario.costs.homeTotal / 12,
        publicEnergy: (scenario.costs.publicEnergy - scenario.savings.planDiscount) / 12,
        planFee: (scenario.costs.publicTotal - (scenario.costs.publicEnergy - scenario.savings.planDiscount)) / 12,
        total: scenario.costs.total / 12
    };

    return (
        <div className="p-6 overflow-x-auto animate-in slide-in-from-top-2 duration-200">
            <h4 className="text-sm font-bold text-slate-700 mb-3">Monthly Breakdown (Average)</h4>
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-100/50">
                    <tr>
                        <th className="px-4 py-2 rounded-l-lg">Metric</th>
                        <th className="px-4 py-2 text-right">Value / Month</th>
                        <th className="px-4 py-2 text-right rounded-r-lg">Annual Equivalent</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    <tr>
                        <td className="px-4 py-2 font-medium text-slate-600">Energy Consumed</td>
                        <td className="px-4 py-2 text-right">{monthlyKWh.consumed.toFixed(1)} kWh</td>
                        <td className="px-4 py-2 text-right text-slate-400">{scenario.annualKWh.consumed.toFixed(0)} kWh</td>
                    </tr>
                    <tr>
                        <td className="px-4 py-2 font-medium text-slate-600">Billable Energy (inc. Loss)</td>
                        <td className="px-4 py-2 text-right">{(monthlyKWh.billedAC + monthlyKWh.billedDC).toFixed(1)} kWh</td>
                        <td className="px-4 py-2 text-right text-slate-400">{scenario.annualKWh.totalBilled.toFixed(0)} kWh</td>
                    </tr>
                    <tr>
                        <td className="px-4 py-2 font-medium text-slate-600">Home Charging Cost</td>
                        <td className="px-4 py-2 text-right">RM {monthlyCost.home.toFixed(2)}</td>
                        <td className="px-4 py-2 text-right text-slate-400">RM {scenario.costs.homeTotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td className="px-4 py-2 font-medium text-slate-600">Public Charging Cost</td>
                        <td className="px-4 py-2 text-right">RM {monthlyCost.publicEnergy.toFixed(2)}</td>
                        <td className="px-4 py-2 text-right text-slate-400">RM {(scenario.costs.publicEnergy - scenario.savings.planDiscount).toFixed(2)}</td>
                    </tr>
                    {monthlyCost.planFee > 0 && (
                        <tr>
                            <td className="px-4 py-2 font-medium text-slate-600">Subscription Fee</td>
                            <td className="px-4 py-2 text-right">RM {monthlyCost.planFee.toFixed(2)}</td>
                            <td className="px-4 py-2 text-right text-slate-400">RM {(scenario.costs.publicTotal - (scenario.costs.publicEnergy - scenario.savings.planDiscount)).toFixed(2)}</td>
                        </tr>
                    )}
                    <tr className="bg-slate-100/50 font-bold text-slate-900">
                        <td className="px-4 py-2 rounded-l-lg">Total Cost</td>
                        <td className="px-4 py-2 text-right">RM {monthlyCost.total.toFixed(2)}</td>
                        <td className="px-4 py-2 text-right rounded-r-lg">RM {scenario.costs.total.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
