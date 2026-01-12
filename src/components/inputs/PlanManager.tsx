import { useState } from 'react';
import { useCalculator } from '../../store/CalculatorContext';
import type { SubscriptionPlan } from '../../types';
import { DEFAULT_PLANS } from '../../defaults';
import { Plus, Trash2, RotateCcw, ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../ui/InfoTooltip';

export function PlanManager() {
    const { plans, setPlans, cpos } = useCalculator();
    const [isAdding, setIsAdding] = useState(false);

    // New Plan State
    const [newPlan, setNewPlan] = useState<Partial<SubscriptionPlan>>({
        feeFrequency: 'Monthly',
        discountPct: 0,
        discountCap: 0,
        isEnabled: true
    });

    const activeCPOs = cpos.filter(c => c.isEnabled);
    const availableBrands = activeCPOs.map(c => c.name);

    const getAutoPlanName = (brand: string, discount: number, frequency: string) => {
        return `${brand} (${discount}% off) ${frequency}`;
    };

    const updatePlan = (id: string, field: keyof SubscriptionPlan, value: any) => {
        setPlans(plans.map(p => {
            if (p.id !== id) return p;

            const updated = { ...p, [field]: value };
            // Auto-update name if related fields change
            if (field === 'brand' || field === 'discountPct' || field === 'feeFrequency') {
                updated.name = getAutoPlanName(updated.brand, updated.discountPct, updated.feeFrequency);
            }
            return updated;
        }));
    };

    const removePlan = (id: string) => {
        setPlans(plans.filter(p => p.id !== id));
    };

    const saveNewPlan = () => {
        if (!newPlan.brand || !newPlan.feeAmount) return;

        const feeFrequency = newPlan.feeFrequency as 'Monthly' | 'Annual';
        const discountPct = Number(newPlan.discountPct || 0);

        const plan: SubscriptionPlan = {
            id: `plan-${Date.now()}`,
            name: getAutoPlanName(newPlan.brand, discountPct, feeFrequency),
            brand: newPlan.brand,
            feeFrequency,
            feeAmount: Number(newPlan.feeAmount),
            discountPct,
            discountCap: Number(newPlan.discountCap || 0),
            isEnabled: true
        };

        setPlans([...plans, plan]);
        setIsAdding(false);
        setNewPlan({
            feeFrequency: 'Monthly',
            discountPct: 0,
            discountCap: 0,
            isEnabled: true
        });
    };

    const resetDefaults = () => {
        if (confirm("Reset plans to default?")) setPlans(DEFAULT_PLANS);
    };



    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <button onClick={resetDefaults} className="text-sm font-medium text-slate-400 hover:text-slate-600 flex items-center gap-1">
                    <RotateCcw className="w-3 h-3" /> Reset Defaults
                </button>
            </div>

            <div className="space-y-4">
                {plans.map(plan => (
                    <div key={plan.id} className={`p-4 rounded-xl border-2 transition-all ${plan.isEnabled ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 opacity-75'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3 w-full">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                    checked={plan.isEnabled}
                                    onChange={(e) => updatePlan(plan.id, 'isEnabled', e.target.checked)}
                                />
                                <div className="font-bold text-lg text-slate-800">
                                    {plan.name}
                                </div>
                            </div>
                            <button onClick={() => removePlan(plan.id)} className="text-slate-400 hover:text-red-500 transition-colors ml-2">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                            <div className="md:col-span-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase">Brand</label>
                                <select
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 mt-1"
                                    value={plan.brand}
                                    onChange={(e) => updatePlan(plan.id, 'brand', e.target.value)}
                                >
                                    {activeCPOs.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>

                            <div className="md:col-span-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase">Fee</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-slate-400">RM</span>
                                    <input
                                        type="number" className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1"
                                        value={plan.feeAmount}
                                        onChange={(e) => updatePlan(plan.id, 'feeAmount', Number(e.target.value))}
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase">Frequency</label>
                                <select
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 mt-1 font-medium"
                                    value={plan.feeFrequency}
                                    onChange={(e) => updatePlan(plan.id, 'feeFrequency', e.target.value)}
                                >
                                    <option value="Monthly">Monthly</option>
                                    <option value="Annual">Annual</option>
                                </select>
                            </div>

                            <div className="md:col-span-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase">Discount</label>
                                <div className="flex items-center gap-1 mt-1">
                                    <input
                                        type="number" className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1"
                                        value={plan.discountPct}
                                        onChange={(e) => updatePlan(plan.id, 'discountPct', Number(e.target.value))}
                                    />
                                    <span className="text-slate-400">%</span>
                                </div>
                            </div>

                            <div className="md:col-span-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase flex items-center">
                                    Annual Cap
                                    <InfoTooltip content="The maximum discount value you can receive. Once your savings hit this limit, you pay full price." />
                                </label>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className="text-slate-400">RM</span>
                                    <input
                                        type="number" className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1"
                                        value={plan.discountCap || ''}
                                        placeholder="No limit"
                                        onChange={(e) => updatePlan(plan.id, 'discountCap', Number(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {!isAdding ? (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center gap-2 text-slate-500 font-medium hover:border-slate-300 hover:text-slate-700 transition-all"
                    >
                        <Plus className="w-5 h-5" /> Add Subscription Plan
                    </button>
                ) : (
                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
                        <h3 className="font-bold text-slate-800 mb-4">New Plan Details</h3>
                        <div className="space-y-4 mb-6">
                            {/* Row 1: Brand (Full) */}
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Brand</label>
                                <div className="relative">
                                    <select
                                        className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium text-slate-900"
                                        value={newPlan.brand || ''}
                                        onChange={(e) => setNewPlan({ ...newPlan, brand: e.target.value })}
                                    >
                                        <option value="">Select Brand</option>
                                        {availableBrands.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                                </div>
                            </div>

                            {/* Row 2: Fee & Frequency */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Fee</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-slate-400 font-medium z-10">RM</span>
                                        <input
                                            type="number"
                                            className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium text-slate-900"
                                            placeholder="0.00"
                                            value={newPlan.feeAmount || ''}
                                            onChange={(e) => setNewPlan({ ...newPlan, feeAmount: parseFloat(e.target.value) })}
                                        />
                                    </div>
                                </div>
                                <div className="col-span-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Frequency</label>
                                    <div className="relative">
                                        <select
                                            className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium text-slate-900"
                                            value={newPlan.feeFrequency}
                                            onChange={(e) => setNewPlan({ ...newPlan, feeFrequency: e.target.value as 'Monthly' | 'Annual' })}
                                        >
                                            <option value="Monthly">Monthly</option>
                                            <option value="Annual">Annual</option>
                                        </select>
                                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Row 3: Discount & Cap */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Discount</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium text-slate-900"
                                            placeholder="20"
                                            value={newPlan.discountPct || ''}
                                            onChange={e => setNewPlan({ ...newPlan, discountPct: Number(e.target.value) })}
                                        />
                                        <span className="absolute right-3 top-2.5 text-slate-400 font-medium">%</span>
                                    </div>
                                </div>
                                <div className="col-span-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center">
                                        Annual Cap
                                        <InfoTooltip content="The maximum discount value you can receive. Once your savings hit this limit, you pay full price." />
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-slate-400 font-medium z-10">RM</span>
                                        <input
                                            type="number"
                                            className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium text-slate-900"
                                            placeholder="No limit"
                                            value={newPlan.discountCap || ''}
                                            onChange={e => setNewPlan({ ...newPlan, discountCap: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={saveNewPlan} className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700">Save Plan</button>
                            <button onClick={() => setIsAdding(false)} className="px-6 py-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
