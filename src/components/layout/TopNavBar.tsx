import React from 'react';
import { 
  Sprout, 
  ShoppingBag, 
  Tractor, 
  Warehouse, 
  Truck, 
  RotateCcw, 
  Pause, 
  Smartphone, 
  Monitor, 
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  Activity
} from 'lucide-react';
import { useSupplyChain } from '../../store/supplyChainStore';

export const TopNavBar: React.FC = () => {
  const { 
    activeScreen, 
    setActiveScreen, 
    viewMode, 
    setViewMode, 
    demoStep, 
    runDemoStep,
    isDemoRunning, 
    startAutoDemo, 
    stopAutoDemo, 
    resetAllData,
    orders,
    batches,
    cartCount,
    setIsAdminPriceControlOpen,
    setIsShockSimulatorOpen
  } = useSupplyChain();

  const pendingBatches = batches.filter(b => b.payoutStatus !== 'Paid').length;
  const activeOrders = orders.filter(o => o.status !== 'Delivered').length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Banner Ticker */}
      <div className="bg-forest text-emerald-100 text-xs py-1.5 px-4 flex flex-wrap items-center justify-between gap-2 border-b border-forest-dark font-medium">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-400/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            SIH LIVE PROTOTYPE
          </span>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <span className="text-slate-200 text-[11px] hidden md:inline">
            AgroDirect: Unified Indian Farmgate-to-Fork Autonomous Logistics Network
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1 text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Central Reactive Store Active
          </span>
          <span className="text-slate-400 hidden lg:inline">|</span>
          <span className="text-slate-300 hidden lg:inline">
            APIs: <span className="text-white font-semibold">AgMarknet 2.0</span> • <span className="text-white font-semibold">UPI Intent</span> • <span className="text-white font-semibold">XGBoost</span> • <span className="text-white font-semibold">OpenCV</span> • <span className="text-white font-semibold">OR-Tools</span>
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo - AgroDirect */}
          <div 
            onClick={() => setActiveScreen('consumer')}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-forest flex items-center justify-center shadow-md shadow-emerald-500/20 text-white">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 font-sans">
                  Agro<span className="text-emerald-600">Direct</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                  v2.5
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Farmgate-to-Fork Direct Agriculture Marketplace
              </p>
            </div>
          </div>

          {/* 4 Screen Switcher Tabs */}
          <nav className="flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveScreen('consumer')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 relative ${
                activeScreen === 'consumer'
                  ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
              title="Screen 1: Consumer & Bulk Buyer App"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline">1. Consumer App</span>
              <span className="md:hidden">Shop</span>
              {cartCount > 0 && (
                <span className="px-1.5 py-0.2 bg-emerald-600 text-white text-[9px] font-black rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveScreen('fpo')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 relative ${
                activeScreen === 'fpo'
                  ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
              title="Screen 2: Rural FPO Hub Portal"
            >
              <Tractor className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline">2. FPO Hub</span>
              <span className="md:hidden">FPO</span>
              {pendingBatches > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              )}
            </button>

            <button
              onClick={() => setActiveScreen('darkstore')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                activeScreen === 'darkstore'
                  ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
              title="Screen 3: Urban Dark Store Dashboard"
            >
              <Warehouse className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline">3. Dark Store</span>
              <span className="md:hidden">Hub</span>
            </button>

            <button
              onClick={() => setActiveScreen('driver')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 relative ${
                activeScreen === 'driver'
                  ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
              title="Screen 4: Driver Mobile App"
            >
              <Truck className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline">4. Driver App</span>
              <span className="md:hidden">Driver</span>
              {activeOrders > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              )}
            </button>
          </nav>

          {/* Action Buttons: Price Control, Auto Demo, View Mode, Reset */}
          <div className="flex items-center gap-2">
            {/* Admin Price Control Button */}
            <button
              onClick={() => setIsAdminPriceControlOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 shadow-xs transition-all"
              title="Admin Price Control: Manually Configure Selling Prices"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden xl:inline">Price Control</span>
            </button>

            {/* Shock Simulator Button */}
            <button
              onClick={() => setIsShockSimulatorOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300 shadow-xs transition-all"
              title="Shock & What-If Simulator: Stress-test demand surges and climate shocks"
            >
              <Activity className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden xl:inline">Shock Simulator</span>
            </button>

            {/* View Mode (Desktop vs Mobile Frame for consumer/driver) */}
            {(activeScreen === 'consumer' || activeScreen === 'driver') && (
              <div className="hidden lg:flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                <button
                  onClick={() => setViewMode('desktop')}
                  className={`p-1.5 rounded-md text-xs ${
                    viewMode === 'desktop' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Full Width Responsive View"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('mobile')}
                  className={`p-1.5 rounded-md text-xs ${
                    viewMode === 'mobile' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Simulate Mobile Device Frame"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Auto Demo Play/Pause */}
            <button
              onClick={isDemoRunning ? stopAutoDemo : startAutoDemo}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isDemoRunning
                  ? 'bg-amber-50 text-amber-700 border-amber-300 animate-pulse'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
              }`}
              title="Automatically advance through all 10 milestones"
            >
              {isDemoRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden sm:inline">Pause Tour</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Auto Demo</span>
                </>
              )}
            </button>

            {/* Reset Data Button */}
            <button
              onClick={resetAllData}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              title="Reset data to factory baseline"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
