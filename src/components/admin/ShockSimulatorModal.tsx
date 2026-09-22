import React from 'react';
import { 
  Activity, 
  CloudRain, 
  TrendingUp, 
  AlertTriangle, 
  RotateCcw, 
  CheckCircle2, 
  X, 
  Zap, 
  Flame, 
  Truck, 
  Sliders, 
  Sparkles
} from 'lucide-react';
import { useSupplyChain } from '../../store/supplyChainStore';

export const ShockSimulatorModal: React.FC = () => {
  const { 
    shockScenario, 
    applyShockScenario, 
    resetShockScenario, 
    isShockSimulatorOpen, 
    setIsShockSimulatorOpen,
    products,
    darkStore
  } = useSupplyChain();

  if (!isShockSimulatorOpen) return null;

  // Compute live simulated impact metrics
  const surgeMultiplier = 1 + (shockScenario.demandSurgePercent / 100);
  const baseTotalDemand = products.reduce((s, p) => s + (p.demand || 240), 0);
  const simulatedDemand = Math.round(baseTotalDemand * surgeMultiplier);
  const trucksRequired = Math.ceil(simulatedDemand / 1200);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-md">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900">
                  Supply Chain Shock & What-If Simulator
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
                  Presenter Engine
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Stress-test demand surges, climate shocks, and logistics resilience in real-time.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsShockSimulatorOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Quick Scenarios */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Quick Preset Demo Scenarios
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => applyShockScenario({
                demandSurgePercent: 60,
                unseasonalRainActive: false,
                priceShockType: 'fuel_spike'
              })}
              className="p-3 rounded-2xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100/60 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span>Diwali Festival Surge</span>
                <Flame className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-[11px] text-amber-700/80 block mt-1">+60% Demand, Fuel +15%</span>
            </button>

            <button
              onClick={() => applyShockScenario({
                demandSurgePercent: 25,
                unseasonalRainActive: true,
                priceShockType: 'none'
              })}
              className="p-3 rounded-2xl border border-sky-200 bg-sky-50/60 hover:bg-sky-100/60 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-sky-900">
                <span>Monsoon Flood Shock</span>
                <CloudRain className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-[11px] text-sky-700/80 block mt-1">-40% Harvest, 2h Delay</span>
            </button>

            <button
              onClick={() => applyShockScenario({
                demandSurgePercent: 40,
                unseasonalRainActive: true,
                priceShockType: 'mandi_shortage'
              })}
              className="p-3 rounded-2xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100/60 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-purple-900">
                <span>Severe Mandi Deficit</span>
                <AlertTriangle className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-[11px] text-purple-700/80 block mt-1">+35% Wholesale Deficit</span>
            </button>
          </div>
        </div>

        {/* 3 Interactive Parameter Controls */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          {/* Parameter 1: Demand Surge Slider */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-900">
                  Simulated Consumer Demand Surge
                </span>
              </div>
              <span className="text-base font-black text-emerald-700">
                +{shockScenario.demandSurgePercent}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={shockScenario.demandSurgePercent}
              onChange={(e) => applyShockScenario({ demandSurgePercent: Number(e.target.value) })}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
              <span>Normal Baseline (0%)</span>
              <span>Moderate (+50%)</span>
              <span>2x Emergency (+100%)</span>
            </div>
          </div>

          {/* Parameter 2: Unseasonal Rain Toggle */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                shockScenario.unseasonalRainActive ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                <CloudRain className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Unseasonal Rain & Harvest Disruption
                </span>
                <span className="text-[11px] text-slate-500">
                  Simulates 40% farmgate yield drop in Kolar and 2-hour logistics transit delay
                </span>
              </div>
            </div>

            <button
              onClick={() => applyShockScenario({ unseasonalRainActive: !shockScenario.unseasonalRainActive })}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all shadow-2xs ${
                shockScenario.unseasonalRainActive 
                  ? 'bg-sky-600 text-white ring-2 ring-sky-300' 
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              {shockScenario.unseasonalRainActive ? 'SHOCK ACTIVE' : 'INACTIVE'}
            </button>
          </div>

          {/* Parameter 3: External Market Price Shock */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-900 block mb-2">
              External Market Shock
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'none', label: 'Stable Baseline', desc: 'No macro shocks' },
                { type: 'fuel_spike', label: 'Fuel Spike (+15%)', desc: 'Diesel price hike' },
                { type: 'mandi_shortage', label: 'Mandi Deficit (+35%)', desc: 'Crop disease shortage' }
              ].map((opt) => (
                <button
                  key={opt.type}
                  onClick={() => applyShockScenario({ priceShockType: opt.type as any })}
                  className={`p-2.5 rounded-xl text-left border transition-all text-xs ${
                    shockScenario.priceShockType === opt.type
                      ? 'border-emerald-500 bg-emerald-50/80 text-emerald-900 font-bold ring-1 ring-emerald-400'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="block font-bold">{opt.label}</span>
                  <span className="text-[10px] text-slate-400">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live System Stress Metrics */}
        <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
            <span className="font-bold text-slate-300">Live Shock Stress Telemetry</span>
            <span className="text-emerald-400 font-mono text-[11px]">Sync: FPO ➔ MFC-04 ➔ Fleet</span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block font-medium">Aggregated Demand</span>
              <span className="text-base font-black text-emerald-400">{simulatedDemand.toLocaleString()} kg</span>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block font-medium">Line-Haul Trucks</span>
              <span className="text-base font-black text-white">{trucksRequired} Reefer(s)</span>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block font-medium">Farmer Realization</span>
              <span className="text-base font-black text-amber-300">100% Guaranteed</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            <strong>System Safeguard:</strong> AgroDirect forward contracts insulate registered FPO farmers from spot market collapses while dynamic FEFO slotting prioritizes perishable crates.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            onClick={resetShockScenario}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Scenarios</span>
          </button>

          <button
            onClick={() => setIsShockSimulatorOpen(false)}
            className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all shadow-md"
          >
            Apply & View Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
