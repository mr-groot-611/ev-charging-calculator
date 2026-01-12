import { useState, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
    content: string;
}

export function InfoTooltip({ content }: InfoTooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);

    return (
        <>
            <button
                ref={triggerRef}
                type="button"
                className="text-slate-400 hover:text-blue-500 transition-colors focus:outline-none ml-1.5 align-middle"
                onClick={() => setIsVisible(!isVisible)}
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                aria-label="More information"
            >
                <Info className="w-4 h-4" />
            </button>

            {isVisible && (
                <TooltipPortal
                    content={content}
                    triggerRef={triggerRef}
                />
            )}
        </>
    );
}

function TooltipPortal({ content, triggerRef }: { content: string, triggerRef: React.RefObject<HTMLButtonElement | null> }) {
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<{ top: number, left: number, arrowOffset: number } | null>(null);

    useLayoutEffect(() => {
        if (!triggerRef.current || !tooltipRef.current) return;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const margin = 16; // Safe zone

        // Initial Position: Center above trigger
        let top = triggerRect.top - tooltipRect.height - 8; // 8px gap
        let left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);

        // Horizontal Collision Detection
        let shift = 0;

        // Check Right Edge
        if (left + tooltipRect.width > viewportWidth - margin) {
            shift = (viewportWidth - margin) - (left + tooltipRect.width);
        }

        // Check Left Edge
        if (left < margin) {
            shift = margin - left;
        }

        // Apply Shift
        left += shift;

        // Calculate Arrow Offset (counter-shift to keep pointing at trigger)
        const triggerCenter = triggerRect.left + (triggerRect.width / 2);
        const arrowRelativePos = triggerCenter - left;

        // Clamp arrow position
        const maxOffset = tooltipRect.width - 20;
        const minOffset = 20;
        const clampedArrowOffset = Math.min(Math.max(arrowRelativePos, minOffset), maxOffset);

        setPosition({
            top: top,
            left: left,
            arrowOffset: clampedArrowOffset
        });

    }, []);

    // Render logic:
    // 1. Initially render invisible (opacity-0) to allow measurement.
    // 2. Once 'position' is set, render with visible styles and position.

    // We render into body
    return createPortal(
        <div
            ref={tooltipRef}
            className={`fixed z-[9999] w-64 max-w-[calc(100vw-2rem)] bg-slate-800 text-white text-xs rounded-lg py-3 px-4 shadow-xl pointer-events-none transition-opacity duration-200 ${position ? 'opacity-100' : 'opacity-0'}`}
            style={{
                top: position ? position.top : 0,
                left: position ? position.left : 0,
                visibility: position ? 'visible' : 'hidden', // Extra safety: keep hidden while measuring
            }}
        >
            <div className="relative leading-relaxed">
                {content}
                {/* Arrow */}
                {position && (
                    <div
                        className="absolute -bottom-2 w-3 h-3 bg-slate-800 rotate-45 transform origin-center"
                        style={{
                            left: position.arrowOffset,
                            transform: 'translateX(-50%) rotate(45deg)'
                        }}
                    ></div>
                )}
            </div>
        </div>,
        document.body
    );
}
