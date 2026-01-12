import { useCalculator } from '../../store/CalculatorContext';

export function SplitSlider() {
    const { split, setSplit } = useCalculator();

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-indigo-50 p-8 space-y-6 relative overflow-hidden">
            {/* Decorative background gradient */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -z-0 opacity-50"></div>

            <div className="flex flex-col md:flex-row justify-between items-end md:items-center relative z-10">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Charging Split</h2>
                    <p className="text-sm text-slate-500 mt-1">Adjust based on your expected charging habits (Energy based)</p>
                </div>
            </div>

            <div className="pt-4 pb-2 relative z-10">
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={split.homePct}
                    onChange={(e) => setSplit({ homePct: Number(e.target.value) })}
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                />

                <div className="flex justify-between mt-4">
                    <div className={`flex flex-col items-start transition-all duration-300 ${split.homePct > 50 ? 'opacity-100 transform scale-105' : 'opacity-70'}`}>
                        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Home (AC)</span>
                        <span className="text-2xl font-black text-slate-800">{split.homePct}%</span>
                    </div>

                    <div className={`flex flex-col items-end transition-all duration-300 ${split.homePct < 50 ? 'opacity-100 transform scale-105' : 'opacity-70'}`}>
                        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">Public (DC)</span>
                        <span className="text-2xl font-black text-slate-800">{100 - split.homePct}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
