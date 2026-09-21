import React, { useState } from 'react';
import { 
  Check, 
  ChevronRight, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  Info,
  ArrowRight
} from 'lucide-react';
import { useSupplyChain } from '../../store/supplyChainStore';

const WORKFLOW_STEPS = [
  { step: 1, label: '1. Discover Produce', screen: 'consumer', desc: 'Browse commodities & AgMarknet 2.0 price comparison' },
  { step: 2, label: '2. Place 100kg Pre-Order', screen: 'consumer', desc: 'Select bulk institutional quantity & morning slot' },
  { step: 3, label: '3. FPO Demand Surge', screen: 'fpo', desc: 'FPO incoming demand rises & AI forecast updates' },
  { step: 4, label: '4. CV Quality Assaying', screen: 'fpo', desc: 'Inspect batch HB-1042 via OpenCV grading model' },
  { step: 5, label: '5. Farmer Digital Payout', screen: 'fpo', desc: 'Instant UPI payout (₹7,840) disbursed to Ramesh Kumar' },
  { step: 6, label: '6. Urban Hub Inwarding', screen: 'darkstore', desc: 'Batch received & verified at Indiranagar MFC-04' },
  { step: 7, label: '7. Sort & Slot Allocation', screen: 'darkstore', desc: 'Produce sorted and assigned to morning delivery fleet' },
  { step: 8, label: '8. OR-Tools Route Planning', screen: 'driver', desc: 'Driver Arun assigned 42.6km milk-run route' },
  { step: 9, label: '9. Driver Delivery', screen: 'driver', desc: 'Driver marks institutional drop-off as completed' },
  { step: 10, label: '10. Consumer Receipt', screen: 'consumer', desc: 'Consumer live tracker reflects status: Delivered' },
];

export const DemoWorkflowBar: React.FC = () => {
  const { demoStep, runDemoStep, isDemoRunning } = useSupplyChain();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const currentStepInfo = WORKFLOW_STEPS.find(s => s.step === demoStep) || WORKFLOW_STEPS[0];

  return (
    <div className="bg-slate-900 text-slate-100 border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-4">
          {/* Step Pill & Current Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SIH DEMO MODE</span>
            </div>

            <div className="hidden sm:block">
              <span className="text-xs text-slate-400">Current Milestone:</span>{' '}
              <span className="text-xs font-bold text-white">{currentStepInfo.label}</span>
              <span className="text-slate-400 text-xs hidden md:inline"> — {currentStepInfo.desc}</span>
            </div>
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => runDemoStep(Math.max(1, demoStep - 1))}
              disabled={demoStep <= 1 || isDemoRunning}
              className="px-2 py-1 text-xs text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Prev
            </button>

            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-300 font-semibold border border-slate-700">
              {demoStep} / 10
            </span>

            <button
              onClick={() => runDemoStep(Math.min(10, demoStep + 1))}
              disabled={demoStep >= 10 || isDemoRunning}
              className="flex items-center gap-1 px-3 py-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-slate-400 hover:text-white rounded ml-2"
              title={isExpanded ? 'Collapse Workflow' : 'Expand Workflow'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 10-Step Interactive Horizontal Timeline */}
        {isExpanded && (
          <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 overflow-x-auto pb-1 scrollbar-thin">
            <div className="flex items-center gap-1 min-w-[760px]">
              {WORKFLOW_STEPS.map((stepItem, index) => {
                const isCompleted = stepItem.step < demoStep;
                const isCurrent = stepItem.step === demoStep;

                return (
                  <React.Fragment key={stepItem.step}>
                    <button
                      onClick={() => runDemoStep(stepItem.step)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left whitespace-nowrap ${
                        isCurrent
                          ? 'bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-400/40'
                          : isCompleted
                          ? 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
                          : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isCurrent 
                          ? 'bg-white text-emerald-800' 
                          : isCompleted 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-slate-700 text-slate-300'
                      }`}>
                        {isCompleted ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : stepItem.step}
                      </span>
                      <span>{stepItem.label}</span>
                    </button>

                    {index < WORKFLOW_STEPS.length - 1 && (
                      <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
