import { useState, useRef } from 'react';
import { CalculatorProvider } from './store/CalculatorContext';
import { DrivingInputs } from './components/inputs/DrivingInputs';
import { HomeInputs } from './components/inputs/HomeInputs';
import { PublicModeSwitch } from './components/inputs/PublicModeSwitch';
import { CPOManager } from './components/inputs/CPOManager';
import { PlanManager } from './components/inputs/PlanManager';
import { SplitSlider } from './components/inputs/SplitSlider';
import { ComparisonTable } from './components/outputs/ComparisonTable';
import { RecommendationPanel } from './components/outputs/RecommendationPanel';
import { SummaryCards } from './components/outputs/SummaryCards';
import { Settings } from 'lucide-react';
import { Modal } from './components/ui/Modal';
import { PlanSelector } from './components/inputs/PlanSelector';
import { StickyFooter } from './components/layout/StickyFooter';

function CalculatorContent() {
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showCPOModal, setShowCPOModal] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  const scrollToResults = () => {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen lg:h-screen flex flex-col bg-slate-50 text-slate-900 font-sans overflow-x-hidden lg:overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shrink-0 z-30">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
              ⚡
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
              EV Charging Calculator
            </h1>
          </div>
        </div>
      </header>

      {/* Main Split Interface */}
      <main className="flex-1 lg:overflow-hidden">
        <div className="h-auto lg:h-full grid grid-cols-1 lg:grid-cols-12">

          {/* LEFT COLUMN: Controls - Independent Scroll */}
          <div className="lg:col-span-4 h-auto lg:h-full lg:overflow-y-auto border-r border-slate-200 bg-white">
            <div className="p-6 md:p-8 space-y-8 pb-8 lg:pb-8"> {/* Reduced mobile padding since footer is for results */}

              {/* 1. Quick Parameters */}
              <div className="space-y-6">
                <DrivingInputs />
                <SplitSlider />
              </div>

              <hr className="border-slate-100" />

              {/* 2. Public Charging Config */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Public Charging</h3>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                      DC ONLY
                    </span>
                  </div>
                  <button
                    onClick={() => setShowCPOModal(true)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-md"
                  >
                    <Settings className="w-3 h-3" /> Configure
                  </button>
                </div>
                <PublicModeSwitch />

                <div className="pt-2">
                  <PlanSelector onManage={() => setShowPlanModal(true)} />
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* 3. Home / Condo Charging */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Home / Condo Charging</h3>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                    AC ONLY
                  </span>
                </div>
                <HomeInputs />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Results - Independent Scroll */}
          {/* On mobile, this pushes below. On desktop, it takes remaining width and scrolls independently */}
          <div ref={resultsRef} className="lg:col-span-8 h-auto lg:h-full lg:overflow-y-auto bg-slate-50/50">
            <div className="p-6 md:p-8 space-y-6 pb-32 lg:pb-8"> {/* Increased mobile padding for sticky footer */}
              <RecommendationPanel />
              <SummaryCards />
              <ComparisonTable />
            </div>
          </div>

        </div>
      </main>

      {/* Modals */}
      <Modal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        title="Manage Subscription Plans"
      >
        <PlanManager />
      </Modal>

      <Modal
        isOpen={showCPOModal}
        onClose={() => setShowCPOModal(false)}
        title="Manage Charging Networks"
      >
        <CPOManager />
      </Modal>

      {/* Mobile Sticky Footer */}
      <StickyFooter onExpand={scrollToResults} />

    </div>
  );
}

function App() {
  return (
    <CalculatorProvider>
      <CalculatorContent />
    </CalculatorProvider>
  );
}

export default App;
