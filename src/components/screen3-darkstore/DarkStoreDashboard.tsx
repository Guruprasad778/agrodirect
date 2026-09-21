import React, { useState } from 'react';
import { 
  Warehouse, 
  Package, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Boxes, 
  ThermometerSnowflake, 
  Truck, 
  BarChart3, 
  Layers, 
  ArrowUpRight,
  Sparkles,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { useSupplyChain } from '../../store/supplyChainStore';
import { SortingStage } from '../../types/supplyChain';

const SORTING_STAGES: SortingStage[] = [
  'Received',
  'Quality Checked',
  'Sorted',
  'Packed',
  'Slotted',
  'Ready'
];

export const DarkStoreDashboard: React.FC = () => {
  const { 
    darkStore, 
    batches, 
    advanceBatchToHub, 
    assignBatchToSlot, 
    setActiveScreen 
  } = useSupplyChain();

  const [activeStage, setActiveStage] = useState<SortingStage>('Sorted');
  const [selectedSlotFilter, setSelectedSlotFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');

  // Filter batches received or in transit to dark store
  const hubBatches = batches.filter(
    b => b.payoutStatus === 'Paid' || b.batchStatus === 'Received at Hub' || b.batchStatus === 'In Transit' || b.batchStatus === 'Sorted & Slotted'
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Dark Store Header */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shadow-sm">
              <Warehouse className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-slate-900">
                  Urban Micro-Fulfilment Hub (MFC-04)
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  Cold-Chain Verified
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {darkStore.name} • {darkStore.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-xs font-semibold text-sky-800">
              <ThermometerSnowflake className="w-4 h-4 text-sky-600" />
              <span>Chiller: <strong>4.2°C</strong> (Optimal 2° - 8°C)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* 4 KPI CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Incoming Batches */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold text-slate-600">Incoming Batches</span>
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {darkStore.incomingBatchesCount}
            </div>
            <p className="mt-2 text-[11px] text-blue-600 font-semibold flex items-center gap-1">
              <span>Arriving from Kolar & Mandya FPOs</span>
            </p>
          </div>

          {/* Card 2: Today's Orders */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold text-slate-600">Today's Orders</span>
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {darkStore.todayOrdersCount}
            </div>
            <p className="mt-2 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <span>Aggregated across 3 urban clusters</span>
            </p>
          </div>

          {/* Card 3: Orders Ready */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold text-slate-600">Orders Ready</span>
              <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {darkStore.ordersReadyCount}
            </div>
            <p className="mt-2 text-[11px] text-purple-600 font-semibold">
              Packed & Slotted for dispatch
            </p>
          </div>

          {/* Card 4: Dispatch Pending */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold text-slate-600">Dispatch Pending</span>
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {darkStore.dispatchPendingCount}
            </div>
            <p className="mt-2 text-[11px] text-amber-600 font-semibold">
              Driver Arun route staging
            </p>
          </div>
        </div>

        {/* BATCH SORTING WORKFLOW PROGRESS TRACKER */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Batch Sorting & Fulfilment Workflow
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  FEFO Bin Allocation
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Standard operating pipeline from truck dock unloading to delivery route crate staging.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Active Stage: <strong className="text-emerald-700">{activeStage}</strong>
            </span>
          </div>

          {/* Interactive 6-Stage Progress Indicator */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2">
            {SORTING_STAGES.map((stage, idx) => {
              const stageIdx = SORTING_STAGES.indexOf(stage);
              const activeIdx = SORTING_STAGES.indexOf(activeStage);
              const isPast = stageIdx < activeIdx;
              const isCurrent = stageIdx === activeIdx;

              return (
                <button
                  key={stage}
                  onClick={() => setActiveStage(stage)}
                  className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                    isCurrent
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                      : isPast
                      ? 'bg-slate-50 text-slate-800 border-emerald-200'
                      : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      STAGE 0{idx + 1}
                    </span>
                    {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <div className="text-xs font-bold truncate">{stage}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* INCOMING FREIGHT TABLE & SMART SLOT ALLOCATION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Incoming Freight Inwarding (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Incoming Line-Haul Freight Arrivals
                </h3>
                <span className="text-xs text-slate-500">Kolar, Nashik & Mandya FPO Reefers</span>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                Dock 02 & 03 Active
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                    <th className="py-2.5 font-bold">Batch ID</th>
                    <th className="py-2.5 font-bold">Product</th>
                    <th className="py-2.5 font-bold text-right">Quantity</th>
                    <th className="py-2.5 font-bold">Source FPO</th>
                    <th className="py-2.5 font-bold">Arrival</th>
                    <th className="py-2.5 font-bold">Status</th>
                    <th className="py-2.5 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {hubBatches.map((batch) => {
                    const isReceived = batch.batchStatus === 'Received at Hub' || batch.batchStatus === 'Sorted & Slotted';

                    return (
                      <tr key={batch.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 font-mono font-bold text-slate-900">{batch.id}</td>
                        <td className="py-3">
                          <span className="font-bold text-slate-900">{batch.productName}</span>
                          <span className="block text-[10px] text-slate-400">{batch.qualityGrade}</span>
                        </td>
                        <td className="py-3 text-right font-black text-slate-900">
                          {batch.acceptedQuantityKg} kg
                        </td>
                        <td className="py-3 text-slate-500 truncate max-w-[120px]">
                          {batch.fpoName}
                        </td>
                        <td className="py-3 text-slate-600">04:50 AM</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isReceived
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {isReceived ? 'Received' : 'In Transit'}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          {!isReceived ? (
                            <button
                              onClick={() => advanceBatchToHub(batch.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] shadow-xs transition-all"
                            >
                              Inward Freight
                            </button>
                          ) : (
                            <span className="text-[11px] text-emerald-600 font-bold flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Inwarded
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Smart Slot Allocation (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Smart Delivery Slot Allocation
                  </h3>
                  <span className="text-xs text-slate-500">Automated Dispatch Balancing</span>
                </div>
                <span className="p-1 rounded-lg bg-emerald-50 text-emerald-600">
                  <SlidersHorizontal className="w-4 h-4" />
                </span>
              </div>

              {/* 3 Delivery Slots */}
              <div className="space-y-3">
                {/* Morning Slot */}
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">Morning Slot</span>
                        <span className="px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900 text-[10px] font-bold">
                          06:00 - 09:00 AM
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Restaurants, Hostels & Temple kitchens
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-emerald-800">{darkStore.slots.morning}</span>
                      <span className="text-xs text-slate-400 block">orders</span>
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-700 font-semibold">Assigned Fleet: Driver Arun (Tata Ace)</span>
                    <button
                      onClick={() => assignBatchToSlot('HB-1042', 'morning')}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition-all shadow-xs"
                    >
                      + Allocate Produce
                    </button>
                  </div>
                </div>

                {/* Afternoon Slot */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">Afternoon Slot</span>
                        <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-800 text-[10px] font-bold">
                          12:00 - 03:00 PM
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Corporate Tech Park Canteens
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-slate-900">{darkStore.slots.afternoon}</span>
                      <span className="text-xs text-slate-400 block">orders</span>
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Fleet Staging at 11:15 AM</span>
                    <button
                      onClick={() => assignBatchToSlot('HB-1042', 'afternoon')}
                      className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[10px] font-semibold transition-all"
                    >
                      + Allocate Produce
                    </button>
                  </div>
                </div>

                {/* Evening Slot */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">Evening Slot</span>
                        <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-800 text-[10px] font-bold">
                          05:00 - 08:00 PM
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        PGs & Residential Kitchens
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-slate-900">{darkStore.slots.evening}</span>
                      <span className="text-xs text-slate-400 block">orders</span>
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Fleet Staging at 04:30 PM</span>
                    <button
                      onClick={() => assignBatchToSlot('HB-1042', 'evening')}
                      className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[10px] font-semibold transition-all"
                    >
                      + Allocate Produce
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveScreen('driver')}
              className="mt-4 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <span>View Route Dispatch in Driver App</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* LIVE INVENTORY CAPACITY LEVELS */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Live Dark Store Produce Inventory (FEFO Bins)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Current stock vs maximum chilled bin capacity. Auto-reorders triggered when stock &lt; 25%.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
              Total Inwarded: 1,255 kg
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {Object.entries(darkStore.inventoryKg).map(([name, currentKg]) => {
              const maxKg = darkStore.maxCapacityKg[name] || 500;
              const fillPct = Math.min(100, Math.round((currentKg / maxKg) * 100));

              return (
                <div key={name} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-bold text-slate-900 truncate">{name}</span>
                    <span className="font-extrabold text-emerald-700">{currentKg} kg</span>
                  </div>

                  {/* Horizontal Progress Bar */}
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${fillPct}%` }}
                      className={`h-full transition-all duration-500 ${
                        fillPct > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                    />
                  </div>

                  <div className="mt-1.5 flex justify-between text-[10px] text-slate-400">
                    <span>Capacity: {maxKg} kg</span>
                    <span>{fillPct}% utilized</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
