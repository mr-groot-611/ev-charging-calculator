import { useCalculator } from '../../store/CalculatorContext';
import { Settings, Plus } from 'lucide-react';

export function PlanSelector({ onManage }: { onManage: () => void }) {
    const { plans, setPlans } = useCalculator();

    const togglePlan = (id: string, checked: boolean) => {
        setPlans(plans.map(p => p.id === id ? { ...p, isEnabled: checked } : p));
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-700">Subscription Plans</label>
                <button
                    onClick={onManage}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-md"
                >
                    <Settings className="w-3 h-3" /> Configure
                </button>
            </div>

            <div className="space-y-2">
                {plans.map(plan => (
                    <div key={plan.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => togglePlan(plan.id, !plan.isEnabled)}>
                        <input
                            type="checkbox"
                            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300"
                            checked={plan.isEnabled}
                            onChange={(e) => togglePlan(plan.id, e.target.checked)}
                            onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex-1 min-w-0">
                            <div className={`text-sm font-medium truncate ${plan.isEnabled ? 'text-slate-700' : 'text-slate-400'}`}>
                                {plan.name}
                            </div>
                            {plan.isEnabled && (
                                <div className="text-xs text-slate-500">
                                    RM {plan.feeAmount}/{plan.feeFrequency === 'Annual' ? 'yr' : 'mo'} • {plan.discountPct}% off
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {plans.length === 0 && (
                    <div className="text-sm text-slate-400 italic px-2">
                        No plans added.
                    </div>
                )}

                <button
                    onClick={onManage}
                    className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-700 hover:border-slate-400 transition-all flex items-center justify-center gap-1"
                >
                    <Plus className="w-3 h-3" /> Add New Plan
                </button>
            </div>
        </div>
    );
}
