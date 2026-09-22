import React from 'react';
import { 
  QrCode, 
  X, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Tractor, 
  Warehouse, 
  Truck, 
  UserCheck, 
  Sparkles,
  ExternalLink,
  Copy
} from 'lucide-react';
import { useSupplyChain } from '../../store/supplyChainStore';

export const FarmToForkQrModal: React.FC = () => {
  const { 
    isTraceModalOpen, 
    setIsTraceModalOpen, 
    selectedTraceBatchId, 
    batches,
    products,
    orders
  } = useSupplyChain();

  if (!isTraceModalOpen) return null;

  // Find linked batch or use default batch
  const batch = batches.find(b => b.id === selectedTraceBatchId) || batches[0];
  const prod = products.find(p => p.id === batch.productId) || products[0];

  const traceUrl = `https://agrodirect.app/trace?batch=${batch.id}&fpo=${batch.fpoId}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center shadow-md">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900">
                  Farm-to-Fork 100% Traceability
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Batch: {batch.id}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Verified farmgate provenance, AI optical grading & cold-chain journey.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsTraceModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code & Scan Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
          {/* Visual QR Pattern SVG */}
          <div className="w-32 h-32 bg-white rounded-xl border border-slate-300 p-2 shrink-0 flex items-center justify-center shadow-xs">
            <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
              {/* Corner 1 */}
              <rect x="5" y="5" width="25" height="25" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
              <rect x="12" y="12" width="11" height="11" rx="2" />
              {/* Corner 2 */}
              <rect x="70" y="5" width="25" height="25" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
              <rect x="77" y="12" width="11" height="11" rx="2" />
              {/* Corner 3 */}
              <rect x="5" y="70" width="25" height="25" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
              <rect x="12" y="77" width="11" height="11" rx="2" />
              {/* Data Blocks */}
              <rect x="36" y="8" width="6" height="6" />
              <rect x="46" y="8" width="6" height="6" />
              <rect x="56" y="14" width="6" height="6" />
              <rect x="36" y="24" width="6" height="6" />
              <rect x="46" y="20" width="6" height="6" />
              <rect x="8" y="40" width="6" height="6" />
              <rect x="20" y="46" width="6" height="6" />
              <rect x="36" y="40" width="12" height="12" rx="2" fill="#16a34a" />
              <rect x="54" y="44" width="6" height="6" />
              <rect x="66" y="40" width="6" height="6" />
              <rect x="78" y="48" width="6" height="6" />
              <rect x="88" y="40" width="6" height="6" />
              <rect x="36" y="60" width="6" height="6" />
              <rect x="48" y="66" width="6" height="6" />
              <rect x="60" y="60" width="6" height="6" />
              <rect x="74" y="72" width="6" height="6" />
              <rect x="84" y="80" width="6" height="6" />
              <rect x="40" y="80" width="8" height="8" />
              <rect x="56" y="84" width="6" height="6" />
            </svg>
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
              Scan with Any Mobile Camera
            </span>
            <h4 className="text-sm font-extrabold text-slate-900">
              {prod.name} ({batch.qualityGrade})
            </h4>
            <p className="text-xs text-slate-500">
              Harvested at {batch.fpoName}, cold-docked at MFC-04 Indiranagar.
            </p>
            <div className="pt-1.5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                ID: {batch.id}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                100% Fair Farmgate Return
              </span>
            </div>
          </div>
        </div>

        {/* 5-Stage Farm-to-Fork Timeline */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Farm-to-Fork Journey
          </h4>

          <div className="relative pl-6 space-y-4 border-l-2 border-emerald-500/40 ml-2 text-xs">
            {/* Stage 1: Farmer Harvest */}
            <div className="relative group">
              <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow-xs flex items-center justify-center text-white text-[9px] font-bold">
                ✓
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">1. Rural Farmer Harvest</span>
                  <span className="text-[10px] text-slate-400">22 Sep 2026 • 06:30 AM</span>
                </div>
                <div className="text-slate-600 text-[11px]">
                  Farmer: <strong className="text-slate-800">{batch.farmerName}</strong> • Village: Srinivaspur, Kolar
                </div>
              </div>
            </div>

            {/* Stage 2: FPO Hub Quality Check */}
            <div className="relative group">
              <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow-xs flex items-center justify-center text-white text-[9px] font-bold">
                ✓
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">2. FPO Aggregation & AI Assaying</span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">
                    OpenCV 98.4% Passed
                  </span>
                </div>
                <div className="text-slate-600 text-[11px]">
                  FPO: <strong className="text-slate-800">{batch.fpoName}</strong> • Lycopene: High • Sizing: 60mm
                </div>
              </div>
            </div>

            {/* Stage 3: Cold-Chain Line-Haul */}
            <div className="relative group">
              <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow-xs flex items-center justify-center text-white text-[9px] font-bold">
                ✓
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">3. Reefer Cold Transit</span>
                  <span className="text-[10px] text-slate-400">Chiller: 4.2°C Controlled</span>
                </div>
                <div className="text-slate-600 text-[11px]">
                  Line-haul transit from Kolar farmgate dock to Bengaluru Urban Hub.
                </div>
              </div>
            </div>

            {/* Stage 4: Dark Store Sorting & Slotting */}
            <div className="relative group">
              <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow-xs flex items-center justify-center text-white text-[9px] font-bold">
                ✓
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">4. Urban Dark Store MFC-04</span>
                  <span className="text-[10px] text-slate-500 font-medium">Slotted & Packed</span>
                </div>
                <div className="text-slate-600 text-[11px]">
                  Inwarded at Indiranagar Micro-Fulfilment Center; allocated to morning delivery wave.
                </div>
              </div>
            </div>

            {/* Stage 5: Final Delivery */}
            <div className="relative group">
              <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-purple-600 border-2 border-white shadow-xs flex items-center justify-center text-white text-[9px] font-bold">
                5
              </div>
              <div className="bg-purple-50/70 p-3 rounded-xl border border-purple-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-950">5. Driver Milk-Run Delivery</span>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded">
                    Tata Ace EV
                  </span>
                </div>
                <div className="text-purple-900 text-[11px]">
                  Driver: <strong className="text-purple-950">Arun Kumar</strong> • OR-Tools Route: Stop #3 (Indiranagar Hub)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Immutable Supply Chain Ledger (Simulation Prototype)</span>
          </span>
          <button
            onClick={() => setIsTraceModalOpen(false)}
            className="font-bold text-emerald-700 hover:text-emerald-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
