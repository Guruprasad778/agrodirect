import React, { ReactNode } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface DeviceFrameProps {
  children: ReactNode;
  isMobileMode: boolean;
  title: string;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children, isMobileMode, title }) => {
  if (!isMobileMode) {
    return <>{children}</>;
  }

  return (
    <div className="py-8 px-4 flex flex-col items-center justify-center bg-slate-900/10 min-h-[calc(100vh-100px)]">
      <div className="mb-3 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
          Mobile Device Simulator — {title}
        </span>
      </div>

      {/* Smartphone Mockup Chassis */}
      <div className="w-full max-w-[410px] bg-slate-950 rounded-[48px] p-3 shadow-2xl ring-1 ring-slate-800 border-4 border-slate-800 relative">
        {/* Dynamic Island / Speaker cutout */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-between px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800"></div>
          <div className="w-2 h-2 rounded-full bg-emerald-950 border border-emerald-800"></div>
        </div>

        {/* Screen Bezel inner content */}
        <div className="bg-slate-900 rounded-[38px] overflow-hidden border border-slate-800 h-[780px] flex flex-col relative shadow-inner">
          {/* Simulated Mobile Status Bar */}
          <div className="h-10 bg-black/60 backdrop-blur-md px-6 flex items-center justify-between text-[11px] font-bold text-white z-30 shrink-0">
            <span>09:41</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Scrollable app viewport */}
          <div className="flex-1 overflow-y-auto scrollbar-none">
            {children}
          </div>

          {/* Home Indicator Bar */}
          <div className="h-5 bg-black/80 flex items-center justify-center shrink-0 z-30">
            <div className="w-32 h-1 bg-slate-500/60 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
