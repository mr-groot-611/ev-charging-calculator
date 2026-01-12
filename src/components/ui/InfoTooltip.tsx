import { useState } from 'react';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
    content: string;
}

export function InfoTooltip({ content }: InfoTooltipProps) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="relative inline-flex items-center ml-1.5">
            <button
                type="button"
                className="text-slate-400 hover:text-blue-500 transition-colors focus:outline-none"
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                onClick={() => setIsVisible(!isVisible)}
                aria-label="More information"
            >
                <Info className="w-4 h-4" />
            </button>

            {isVisible && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-800 text-white text-xs rounded-lg py-2 px-3 shadow-xl z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-200">
                    <div className="relative">
                        {content}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45 translate-y-1"></div>
                    </div>
                </div>
            )}
        </div>
    );
}
