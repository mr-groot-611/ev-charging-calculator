import { useState } from 'react';
import { useCalculator } from '../../store/CalculatorContext';
import type { CPO } from '../../types';
import { DEFAULT_CPOS, DEFAULT_MODE } from '../../defaults';
import { Plus, Trash2, RotateCcw, AlertCircle } from 'lucide-react';

export function CPOManager() {
    const { cpos, setCpos, publicMode, setPublicMode } = useCalculator();
    const [newCpoName, setNewCpoName] = useState('');
    const [newCpoRate, setNewCpoRate] = useState('');

    const updateCpo = (id: string, field: keyof CPO, value: any) => {
        // If renaming, need to update the publicMode mix keys too if in mix mode?
        // Complexity: User defined CPOs + Defaults.
        // For simplicity, we just update the CPO list.
        const newCpos = cpos.map(c => c.id === id ? { ...c, [field]: value } : c);
        setCpos(newCpos);

        // If name changed, we might want to update the ID or just keep ID stable.
        // For now, ID is stable.
    };

    const addCpo = () => {
        if (!newCpoName || !newCpoRate) return;
        const id = newCpoName.toLowerCase().replace(/\s+/g, '-');
        const newCpo: CPO = {
            id: `custom-${id}-${Date.now()}`,
            name: newCpoName,
            rate: Number(newCpoRate),
            isEnabled: true
        };
        setCpos([...cpos, newCpo]);
        setNewCpoName('');
        setNewCpoRate('');
    };

    const removeCpo = (id: string) => {
        setCpos(cpos.filter(c => c.id !== id));
    };

    const resetDefaults = () => {
        if (confirm('Reset CPO list to defaults?')) {
            setCpos(DEFAULT_CPOS);
            setPublicMode(DEFAULT_MODE); // Reset mix too
        }
    };

    // Mix Calculation Logic
    const totalMix = cpos.reduce((sum, c) => sum + (c.isEnabled && publicMode.mix[c.name] ? publicMode.mix[c.name] : 0), 0);
    const mixError = publicMode.mode === 'mix' && Math.abs(totalMix - 100) > 0.1;

    const updateMix = (cpoName: string, pct: number) => {
        setPublicMode({
            ...publicMode,
            mix: { ...publicMode.mix, [cpoName]: pct }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <button onClick={resetDefaults} className="text-sm font-medium text-slate-400 hover:text-slate-600 flex items-center gap-1">
                    <RotateCcw className="w-3 h-3" /> Reset Defaults
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-xs font-semibold text-slate-500 uppercase border-b border-slate-100">
                            <th className="py-3 pl-2">Enable</th>
                            <th className="py-3">Network Name</th>
                            <th className="py-3">Rate (RM/kWh)</th>
                            {publicMode.mode === 'mix' && <th className="py-3">Mix %</th>}
                            <th className="py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {cpos.map((cpo) => (
                            <tr key={cpo.id} className="group hover:bg-slate-50 transition-colors">
                                <td className="py-3 pl-2">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                        checked={cpo.isEnabled}
                                        onChange={(e) => updateCpo(cpo.id, 'isEnabled', e.target.checked)}
                                    />
                                </td>
                                <td className="py-3 pr-4">
                                    <input
                                        type="text"
                                        className="w-full bg-transparent border-none focus:ring-0 font-medium text-slate-900 p-0"
                                        value={cpo.name}
                                        onChange={(e) => updateCpo(cpo.id, 'name', e.target.value)}
                                    />
                                </td>
                                <td className="py-3 pr-4">
                                    <div className="flex items-center">
                                        <span className="text-slate-400 mr-1 text-sm">RM</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="w-24 bg-transparent border border-transparent hover:border-slate-200 focus:bg-white focus:border-blue-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium text-slate-900"
                                            value={cpo.rate}
                                            onChange={(e) => updateCpo(cpo.id, 'rate', Number(e.target.value))}
                                        />
                                    </div>
                                </td>
                                {publicMode.mode === 'mix' && (
                                    <td className="py-3 pr-4">
                                        {cpo.isEnabled ? (
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    className="w-20 bg-white border border-slate-200 rounded px-2 py-1 text-sm"
                                                    value={publicMode.mix[cpo.name] || 0}
                                                    onChange={(e) => updateMix(cpo.name, Number(e.target.value))}
                                                />
                                                <span className="absolute right-6 top-1.5 text-slate-400 text-xs">%</span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-300 text-sm">—</span>
                                        )}
                                    </td>
                                )}
                                <td className="py-3">
                                    <button
                                        onClick={() => removeCpo(cpo.id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                        title="Remove"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {/* Add New Row */}
                        <tr className="bg-slate-50/50">
                            <td className="py-3 pl-2">
                                <div className="w-4 h-4 border-2 border-slate-200 rounded border-dashed"></div>
                            </td>
                            <td className="py-3 pr-4">
                                <input
                                    type="text"
                                    placeholder="Add Provider Name"
                                    className="w-full bg-transparent border-none focus:ring-0 text-sm p-0 placeholder-slate-400"
                                    value={newCpoName}
                                    onChange={(e) => setNewCpoName(e.target.value)}
                                />
                            </td>
                            <td className="py-3 pr-4">
                                <div className="flex items-center">
                                    <span className="text-slate-400 mr-1 text-sm">RM</span>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="w-24 bg-transparent border-none focus:ring-0 text-sm p-0 placeholder-slate-400"
                                        value={newCpoRate}
                                        onChange={(e) => setNewCpoRate(e.target.value)}
                                    />
                                </div>
                            </td>
                            {publicMode.mode === 'mix' && <td className="py-3"></td>}
                            <td className="py-3">
                                <button
                                    onClick={addCpo}
                                    disabled={!newCpoName || !newCpoRate}
                                    className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {mixError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 animate-pulse">
                    <AlertCircle className="w-4 h-4" />
                    <span>Total mix must equal 100% (Current: {totalMix}%)</span>
                </div>
            )}
        </div>
    );
}
