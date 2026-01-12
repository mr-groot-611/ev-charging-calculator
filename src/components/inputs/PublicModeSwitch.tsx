import { useCalculator } from '../../store/CalculatorContext';
import { Zap } from 'lucide-react';

export function PublicModeSwitch() {
    const { publicMode, setPublicMode } = useCalculator();

    return (
        <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Public Charging Strategy</h4>

            <div className={`grid grid-cols-1 gap-3`}>
                {/* Mode: Single Network */}
                <button
                    onClick={() => setPublicMode({ mode: 'single', mix: publicMode.mix })}
                    className={`relative flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${publicMode.mode === 'single'
                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        }`}
                >
                    <div className={`p-2 rounded-lg shrink-0 ${publicMode.mode === 'single' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        <Zap className="w-5 h-5" />
                    </div>
                    <div>
                        <div className={`font-bold ${publicMode.mode === 'single' ? 'text-blue-700' : 'text-slate-700'}`}>
                            Compare Networks Individually
                        </div>
                        <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                            Assume I use one network for all my public charging. Best for finding the single cheapest provider.
                        </div>
                    </div>
                </button>

                {/* Mode: Mix (Hidden per user request) */}
                {/* <button
                    onClick={() => setPublicMode({ mode: 'mix', mix: publicMode.mix })}
                    className={`relative flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${publicMode.mode === 'mix'
                            ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        }`}
                >
                    <div className={`p-2 rounded-lg shrink-0 ${publicMode.mode === 'mix' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        <Share2 className="w-5 h-5" />
                    </div>
                    <div>
                        <div className={`font-bold ${publicMode.mode === 'mix' ? 'text-indigo-700' : 'text-slate-700'}`}>
                            Split Across Networks
                        </div>
                        <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                            I use a mix of different networks. Calculate weighted cost based on my usage habits.
                        </div>
                    </div>
                </button> */}
            </div>

            {publicMode.mode === 'mix' && (
                <div className="mt-2 p-4 bg-orange-50 border border-orange-100 rounded-lg text-orange-800 text-sm">
                    <strong>Note on Mixed Mode:</strong> In this mode, Subscription Plans will only apply discounts to the portion of energy charged at their specific brand. You still pay the full subscription fee.
                </div>
            )}
        </div>
    );
}
