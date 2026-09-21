import React from 'react';
import { SupplyChainProvider, useSupplyChain } from './store/supplyChainStore';
import { TopNavBar } from './components/layout/TopNavBar';
import { DemoWorkflowBar } from './components/layout/DemoWorkflowBar';
import { ToastContainer } from './components/layout/ToastContainer';
import { DeviceFrame } from './components/layout/DeviceFrame';
import { ConsumerApp } from './components/screen1-consumer/ConsumerApp';
import { FpoDashboard } from './components/screen2-fpo/FpoDashboard';
import { DarkStoreDashboard } from './components/screen3-darkstore/DarkStoreDashboard';
import { DriverApp } from './components/screen4-driver/DriverApp';
import { Sprout, ExternalLink, ShieldCheck, Database, Cpu, GitBranch } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeScreen, viewMode } = useSupplyChain();

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/60 font-sans selection:bg-emerald-200">
      {/* 1. Global Navigation Bar */}
      <TopNavBar />

      {/* 2. Interactive Presentation Demo Stepper */}
      <DemoWorkflowBar />

      {/* 3. Screen Switcher */}
      <main className="flex-1">
        {activeScreen === 'consumer' && (
          <DeviceFrame isMobileMode={viewMode === 'mobile'} title="Consumer & Bulk Buyer App">
            <ConsumerApp />
          </DeviceFrame>
        )}

        {activeScreen === 'fpo' && (
          <FpoDashboard />
        )}

        {activeScreen === 'darkstore' && (
          <DarkStoreDashboard />
        )}

        {activeScreen === 'driver' && (
          <DeviceFrame isMobileMode={viewMode === 'mobile'} title="Driver Route & Delivery App">
            <DriverApp />
          </DeviceFrame>
        )}
      </main>

      {/* Global Notifications */}
      <ToastContainer />

      {/* Footer & Architecture Metadata */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              AS
            </div>
            <span className="font-bold text-slate-800">AgriSetu Autonomous Supply Chain Prototype</span>
            <span>•</span>
            <span className="text-slate-400 hidden sm:inline">SIH AgriTech Innovation Showcase</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1 text-slate-600">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              Unified Mock Store
            </span>
            <span className="flex items-center gap-1 text-slate-600">
              <Cpu className="w-3.5 h-3.5 text-purple-600" />
              Pluggable ML Interfaces
            </span>
            <span className="flex items-center gap-1 text-slate-600">
              <GitBranch className="w-3.5 h-3.5 text-blue-600" />
              AgMarknet • Prophet • OpenCV • OR-Tools
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <SupplyChainProvider>
      <MainLayout />
    </SupplyChainProvider>
  );
}

export default App;
