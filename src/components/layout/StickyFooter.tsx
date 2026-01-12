import { useScenarios } from '../../hooks/useScenarios';
import { ChevronUp } from 'lucide-react';

export function StickyFooter({ onExpand }: { onExpand: () => void }) {
    const { bestOverall, bestScenarios } = useScenarios();

    if (!bestOverall) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] p-4 z-40 lg:hidden">
            <div className="flex items-center justify-between max-w-md mx-auto">
                <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Best Option</span>
                        <span className="text-sm font-bold text-emerald-600">RM {bestOverall.costs.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}/yr</span>
                    </div>
                    <div className="font-bold text-slate-800 text-sm leading-tight line-clamp-2" title={bestScenarios && bestScenarios.length > 1 ? bestScenarios.map(s => s.scenarioName).join(', ') : bestOverall.scenarioName}>
                        {bestScenarios && bestScenarios.length > 1
                            ? (bestScenarios.length <= 2
                                ? bestScenarios.map(s => s.scenarioName).join(' & ')
                                : `${bestScenarios.length} Options Available`)
                            : bestOverall.scenarioName}
                    </div>
                </div>
                <button
                    onClick={onExpand}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 active:scale-95 transition-all"
                >
                    Full Results
                    <ChevronUp className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
