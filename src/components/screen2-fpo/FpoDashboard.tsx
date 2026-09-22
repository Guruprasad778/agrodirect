import React, { useState } from 'react';
import { 
  Tractor, 
  TrendingUp, 
  Users, 
  Layers, 
  IndianRupee, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  Calendar, 
  MapPin, 
  Sparkles, 
  Building, 
  ScanLine, 
  Check, 
  Clock, 
  ChevronRight,
  Mic,
  Wallet
} from 'lucide-react';
import { useSupplyChain } from '../../store/supplyChainStore';
import { HarvestBatch, FPO } from '../../types/supplyChain';
import { VoiceVernacularBotModal } from './VoiceVernacularBotModal';
import { PreHarvestScannerModal } from './PreHarvestScannerModal';

export const FpoDashboard: React.FC = () => {
  const { 
    fpos, 
    products, 
    batches, 
    forecastData, 
    gradeBatch, 
    triggerFarmerPayout, 
    setActiveScreen,
    expectedSupplies,
    workingCapitalRequests,
    requestWorkingCapitalAdvance,
    setIsVoiceBotOpen,
    setIsCropScannerOpen
  } = useSupplyChain();

  const [selectedFpoId, setSelectedFpoId] = useState<string>('FPO-KLR-01');
  const [selectedBatch, setSelectedBatch] = useState<HarvestBatch | null>(null);
  const [isGradingInProgress, setIsGradingInProgress] = useState<boolean>(false);
  const [payoutSuccess, setPayoutSuccess] = useState<boolean>(false);

  const currentFpo = fpos.find(f => f.id === selectedFpoId) || fpos[0];

  // Batches for this FPO
  const fpoBatches = batches.filter(b => b.fpoId === currentFpo.id);

  // Total payout ready or paid
  const totalPayout = fpoBatches.reduce((acc, b) => acc + (b.payoutStatus === 'Paid' ? b.payoutAmount : 0), currentFpo.totalPayoutsDisbursed);

  const handleOpenBatch = (batch: HarvestBatch) => {
    setSelectedBatch(batch);
    setPayoutSuccess(false);
  };

  const handleRunAssay = async (batchId: string) => {
    setIsGradingInProgress(true);
    await gradeBatch(batchId);
    setIsGradingInProgress(false);
    // Refresh selectedBatch reference
    const updated = batches.find(b => b.id === batchId);
    if (updated) setSelectedBatch({ ...updated, payoutStatus: 'Ready for Digital Payout', batchStatus: 'Quality Checked' });
  };

  const handlePayout = async (batchId: string) => {
    await triggerFarmerPayout(batchId);
    setPayoutSuccess(true);
    const updated = batches.find(b => b.id === batchId);
    if (updated) setSelectedBatch({ ...updated, payoutStatus: 'Paid', batchStatus: 'In Transit' });
  };

  // Calculations for incoming demand table
  const demandItems = [
    { product: 'Tomato', variety: 'Hybrid Desi', requiredKg: products.find(p => p.id === 'PROD-TOMATO')?.demand || 1280, orders: 34, delivery: 'Tomorrow', priority: 'High' as const },
    { product: 'Onion', variety: 'Nashik Red', requiredKg: products.find(p => p.id === 'PROD-ONION')?.demand || 1650, orders: 21, delivery: 'Tomorrow', priority: 'Medium' as const },
    { product: 'Potato', variety: 'Agra Jyoti', requiredKg: products.find(p => p.id === 'PROD-POTATO')?.demand || 2100, orders: 27, delivery: 'Tomorrow', priority: 'High' as const },
    { product: 'Carrot', variety: 'Ooty Red', requiredKg: products.find(p => p.id === 'PROD-CARROT')?.demand || 640, orders: 16, delivery: 'Tomorrow', priority: 'Medium' as const },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* FPO Hub Header */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest text-emerald-400 flex items-center justify-center shadow-sm">
              <Tractor className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-slate-900">
                  Rural FPO Aggregation Hub Portal
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  {currentFpo.district}, {currentFpo.state}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-2">
                <span>{currentFpo.name}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <MapPin className="w-3 h-3" /> {currentFpo.location}
                </span>
              </p>
            </div>
          </div>

          {/* FPO Switcher, Voice Bot & Crop Scanner Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Action 1: Voice Bot */}
            <button
              onClick={() => setIsVoiceBotOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all"
              title="Voice-Guided Vernacular Assistant in Kannada, Hindi, Tamil & English"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>🎙️ Talk to Agri Assistant</span>
            </button>

            {/* Action 2: Crop Scanner */}
            <button
              onClick={() => setIsCropScannerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all"
              title="Pre-Harvest Computer Vision Crop Scanner"
            >
              <Camera className="w-3.5 h-3.5 text-emerald-400" />
              <span>📷 Crop Scanner</span>
            </button>

            <select
              value={selectedFpoId}
              onChange={(e) => setSelectedFpoId(e.target.value)}
              className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {fpos.map(f => (
                <option key={f.id} value={f.id}>{f.name} ({f.district})</option>
              ))}
            </select>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>21 Sep 2026 • Live</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* 5 KPI CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Card 1: Today's Demand */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold text-slate-600">Today's Demand</span>
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {currentFpo.incomingDemandKg.toLocaleString()} <span className="text-sm font-semibold text-slate-400">kg</span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
              <ArrowUpRight className="w-3 h-3" />
              <span>+100 kg from recent orders</span>
            </div>
          </div>

          {/* Card 2: Harvest Required */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold text-slate-600">Harvest Required</span>
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {currentFpo.harvestRequirementKg.toLocaleString()} <span className="text-sm font-semibold text-slate-400">kg</span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              Assigned to 8 collection points
            </p>
          </div>

          {/* Card 3: Active Farmers */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold text-slate-600">Active Farmers</span>
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {currentFpo.farmersCount}
            </div>
            <p className="mt-2 text-[11px] text-emerald-600 font-semibold">
              100% UPI KYC verified
            </p>
          </div>

          {/* Card 4: Pending Batches */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold text-slate-600">Pending Batches</span>
              <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                <ScanLine className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {currentFpo.pendingBatchesCount}
            </div>
            <p className="mt-2 text-[11px] text-amber-600 font-semibold">
              Needs CV grading assay
            </p>
          </div>

          {/* Card 5: Estimated Farmer Payout */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-emerald-300 transition-all col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold text-slate-600">Farmer Payout</span>
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                <IndianRupee className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              ₹84,500
            </div>
            <p className="mt-2 text-[11px] text-emerald-700 font-semibold">
              Disbursed in &lt; 2 hrs post-assay
            </p>
          </div>
        </div>

        {/* AI DEMAND FORECASTING CHART & ARCHITECTURE */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  AI Demand Forecast & Intake Projection
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-extrabold uppercase tracking-wider">
                  XGBoost / Prophet ML
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Multi-horizon time-series predicting institutional demand surges, weekend hostel spikes, and mandi price elasticity.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                <span className="text-slate-600">Historical</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-slate-900 font-semibold">Today (Actual)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                <span className="text-purple-700 font-semibold">AI Forecast (Tomorrow)</span>
              </div>
            </div>
          </div>

          {/* Interactive Responsive SVG Demand Curve Chart */}
          <div className="h-56 w-full pt-4">
            <div className="relative h-full flex items-end justify-between gap-2 border-b border-l border-slate-200 px-2 pb-2">
              {forecastData.map((pt, idx) => {
                const maxVal = 1600;
                const histHeight = pt.historicalKg ? (pt.historicalKg / maxVal) * 100 : 0;
                const curHeight = pt.currentDemandKg ? (pt.currentDemandKg / maxVal) * 100 : 0;
                const forecastHeight = pt.forecastKg ? (pt.forecastKg / maxVal) * 100 : 0;
                const isToday = pt.day.includes('Today');
                const isTomorrow = pt.day.includes('Tmrw');

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                    {/* Tooltip */}
                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[10px] rounded-lg px-2 py-1 pointer-events-none transition-opacity whitespace-nowrap z-20 shadow-md">
                      <div>{pt.date} ({pt.day})</div>
                      <div className="font-bold text-emerald-300">
                        {pt.currentDemandKg ? `${pt.currentDemandKg} kg (Actual)` : pt.historicalKg ? `${pt.historicalKg} kg` : `${pt.forecastKg} kg (AI Forecast)`}
                      </div>
                    </div>

                    {/* Bars */}
                    <div className="w-full max-w-[42px] flex items-end justify-center h-full">
                      {pt.historicalKg && (
                        <div 
                          style={{ height: `${histHeight}%` }} 
                          className="w-full bg-slate-200 group-hover:bg-slate-300 rounded-t-lg transition-all duration-300"
                        />
                      )}
                      {pt.currentDemandKg && (
                        <div 
                          style={{ height: `${curHeight}%` }} 
                          className="w-full bg-emerald-500 group-hover:bg-emerald-600 rounded-t-lg transition-all duration-300 shadow-sm shadow-emerald-500/30"
                        />
                      )}
                      {!pt.currentDemandKg && pt.forecastKg && (
                        <div 
                          style={{ height: `${forecastHeight}%` }} 
                          className={`w-full rounded-t-lg transition-all duration-300 ${
                            isTomorrow 
                              ? 'bg-purple-500 group-hover:bg-purple-600 shadow-sm shadow-purple-500/30' 
                              : 'bg-purple-200 group-hover:bg-purple-300'
                          }`}
                        />
                      )}
                    </div>

                    {/* Label below axis */}
                    <span className={`text-[10px] mt-2 whitespace-nowrap ${
                      isToday ? 'font-bold text-emerald-700' : isTomorrow ? 'font-bold text-purple-700' : 'text-slate-400'
                    }`}>
                      {pt.day.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
            <span>Model: <strong>XGBoost Regressor v2.4 + Prophet Seasonality</strong> (Confidence interval: 95%)</span>
            <span>MAE: <strong>3.8%</strong> vs APMC Mandi Modal Arrivals</span>
          </div>
        </div>

        {/* INCOMING DEMAND TABLE & HARVEST BATCHES GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Incoming Demand Breakdown (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Incoming Demand Aggregation by Commodity
              </h3>
              <span className="text-xs text-slate-500 font-medium">Synced from Consumer Pre-Orders</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                    <th className="py-2.5 font-bold">Product</th>
                    <th className="py-2.5 font-bold text-right">Required (kg)</th>
                    <th className="py-2.5 font-bold text-center">Orders</th>
                    <th className="py-2.5 font-bold">Delivery</th>
                    <th className="py-2.5 font-bold">Priority</th>
                    <th className="py-2.5 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {demandItems.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3">
                        <div className="font-bold text-slate-900">{item.product}</div>
                        <div className="text-[10px] text-slate-400">{item.variety}</div>
                      </td>
                      <td className="py-3 text-right font-black text-slate-900 text-sm">
                        {item.requiredKg.toLocaleString()} kg
                      </td>
                      <td className="py-3 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                          {item.orders}
                        </span>
                      </td>
                      <td className="py-3 text-slate-600">{item.delivery}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.priority === 'High' 
                            ? 'bg-rose-100 text-rose-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => {
                            const b = fpoBatches.find(bat => bat.productName.includes(item.product)) || fpoBatches[0];
                            if (b) handleOpenBatch(b);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-semibold text-[11px] transition-all"
                        >
                          View Batch
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Harvest Batches for Quality & Payout (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Ready Harvest Batches
                </h3>
                <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  OpenCV AI Assaying Ready
                </span>
              </div>

              <div className="space-y-3">
                {fpoBatches.map(batch => (
                  <div
                    key={batch.id}
                    onClick={() => handleOpenBatch(batch)}
                    className="p-3.5 rounded-xl border border-slate-200/90 hover:border-emerald-400 bg-slate-50/50 hover:bg-white transition-all cursor-pointer shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">{batch.id}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {batch.qualityGrade}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        batch.payoutStatus === 'Paid'
                          ? 'bg-purple-100 text-purple-800'
                          : batch.payoutStatus === 'Ready for Digital Payout'
                          ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {batch.payoutStatus}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-slate-800">{batch.productName}</span>
                        <span className="text-slate-400 block text-[11px]">Farmer: {batch.farmerName}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900">{batch.quantityKg} kg</span>
                        <span className="text-emerald-700 block text-[11px] font-extrabold">₹{batch.payoutAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Computer Vision Model: YOLOv8-Agri</span>
              <span className="text-emerald-700 font-semibold">Instant UPI Enabled</span>
            </div>
          </div>
        </div>

        {/* EXPECTED SUPPLY (PRE-HARVEST REGISTRATION) & WORKING CAPITAL ADVANCE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Expected Supply Section (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    Expected Supply: Pre-Harvest Intake
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Connected to Demand Forecast
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Future crop volume registered by farmers via Voice Bot & Pre-Harvest Scanner.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsVoiceBotOpen(true)}
                  className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-1"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>+ Voice Supply</span>
                </button>
                <button
                  onClick={() => setIsCropScannerOpen(true)}
                  className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-200 transition-colors flex items-center gap-1"
                >
                  <Camera className="w-3.5 h-3.5 text-emerald-600" />
                  <span>+ Scan Plot</span>
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              {expectedSupplies.map(sup => (
                <div 
                  key={sup.id} 
                  className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white transition-all flex flex-wrap items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      {sup.productName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{sup.productName}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                          {sup.status}
                        </span>
                      </div>
                      <span className="text-slate-500 block text-[11px]">
                        Farmer: {sup.farmerName} • {sup.sourceLocation}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-sm font-black text-emerald-800 block">
                        {sup.quantityKg.toLocaleString()} kg
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        Expected in {sup.daysRemaining} days ({sup.expectedDate})
                      </span>
                    </div>

                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                      ✓ Confirmed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Working Capital Advance Section (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-50/60 via-teal-50/40 to-slate-50 rounded-2xl border border-emerald-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <IndianRupee className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Working Capital Advance
                    </h3>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                      Pre-Harvest Input Financing
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200/70 text-emerald-900">
                  Confirmed Forward Order
                </span>
              </div>

              <p className="text-xs text-slate-600">
                Qualify for zero-collateral working capital credit against verified forward demand orders before harvesting.
              </p>

              {/* Advance details */}
              <div className="mt-3.5 space-y-2.5 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>Eligible Farmer:</span>
                    <strong className="text-slate-900">Ramesh Kumar</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>Confirmed Demand:</span>
                    <strong className="text-slate-900">500 kg Tomato</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>Estimated Order Value:</span>
                    <strong className="text-slate-900">₹16,000</strong>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-slate-800">Eligible Advance:</span>
                    <span className="text-base font-black text-emerald-700">₹5,000</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              {workingCapitalRequests[0]?.status === 'Submitted' ? (
                <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Advance Request Submitted (Ref: WCA-KLR-7842)</span>
                </div>
              ) : (
                <button
                  onClick={() => requestWorkingCapitalAdvance('FARM-01', 5000)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <IndianRupee className="w-3.5 h-3.5" />
                  <span>Request Advance (₹5,000)</span>
                </button>
              )}

              <p className="text-[10px] text-slate-400 mt-2 text-center">
                *Prototype simulation: Connectable to NABARD / RBI-regulated NBFC & Kisan Credit Card rails.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* COMPUTER VISION QUALITY GRADING & FARMER PAYOUT MODAL */}
      {selectedBatch && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-500">BATCH ID:</span>
                  <span className="font-mono text-sm font-extrabold text-slate-900">{selectedBatch.id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {selectedBatch.qualityGrade}
                  </span>
                </div>
                <h2 className="text-lg font-extrabold text-slate-900 mt-1">
                  {selectedBatch.productName} — Harvest Quality Assaying
                </h2>
              </div>
              <button
                onClick={() => setSelectedBatch(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            {/* Batch Info Summary */}
            <div className="grid grid-cols-3 gap-3 my-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Farmer</span>
                <p className="font-bold text-slate-900">{selectedBatch.farmerName}</p>
                <p className="text-[10px] text-slate-500">Mandya / Vemgal</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Harvest Quantity</span>
                <p className="font-extrabold text-slate-900">{selectedBatch.quantityKg} kg</p>
                <p className="text-[10px] text-emerald-600 font-semibold">Accepted: {selectedBatch.acceptedQuantityKg} kg</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">FPO Hub</span>
                <p className="font-bold text-slate-900 truncate">{selectedBatch.fpoName}</p>
                <p className="text-[10px] text-slate-500">Arrival: Today</p>
              </div>
            </div>

            {/* COMPUTER VISION QUALITY GRADING SECTION */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-gradient-to-b from-white to-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Automated Quality Grading
                    </h4>
                    <span className="text-[10px] text-slate-500">
                      Technology: <strong className="text-emerald-700">OpenCV / Computer Vision (YOLOv8)</strong>
                    </span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold flex items-center gap-1">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>{selectedBatch.cvGrading.status}</span>
                </span>
              </div>

              {/* Simulated Assaying Viewfinder */}
              <div className="relative h-36 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80"
                  alt="Assayed Produce"
                  className="w-full h-full object-cover opacity-60"
                />
                
                {/* Viewfinder Overlay with Defect Detection Boxes */}
                <div className="absolute inset-0 border-2 border-dashed border-emerald-400/50 m-2 rounded-lg pointer-events-none flex flex-col justify-between p-2">
                  <div className="flex justify-between items-center text-[10px] text-emerald-300 font-mono">
                    <span>ASSAY: CALIBER_RGB</span>
                    <span className="animate-pulse">REC ● 60 FPS</span>
                  </div>
                  
                  {/* Bounding box mock */}
                  <div className="self-center border-2 border-emerald-400 bg-emerald-500/20 px-3 py-1 rounded text-emerald-100 text-xs font-mono font-bold">
                    TOMATO_GRADE_A (98.4%)
                  </div>

                  <div className="flex justify-between text-[10px] text-emerald-300 font-mono">
                    <span>DEFECT: 2.1% (TOLERABLE)</span>
                    <span>COLOR_UNIFORM: 95.4%</span>
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-4 gap-2 pt-1">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 font-semibold block">Quality Score</span>
                  <span className="text-base font-black text-emerald-700">
                    {selectedBatch.cvGrading.qualityScore}/100
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 font-semibold block">Caliber Size</span>
                  <span className="text-base font-black text-slate-800">
                    {selectedBatch.cvGrading.size}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 font-semibold block">Color Index</span>
                  <span className="text-base font-black text-slate-800">
                    {selectedBatch.cvGrading.colorUniformity}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 font-semibold block">Defect Rate</span>
                  <span className="text-base font-black text-emerald-600">
                    {selectedBatch.cvGrading.defectRate}
                  </span>
                </div>
              </div>
            </div>

            {/* FARMER DIGITAL PAYOUT SECTION */}
            <div className="mt-4 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Farmer Instant Digital Payout
                  </h4>
                  <span className="text-[10px] text-slate-500">
                    Direct-to-Bank via UPI Auto-Disbursement
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  selectedBatch.payoutStatus === 'Paid'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {selectedBatch.payoutStatus}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs py-1 border-t border-emerald-200/60">
                <span className="text-slate-600">
                  Accepted Quantity: <strong>{selectedBatch.acceptedQuantityKg} kg</strong> @ ₹{selectedBatch.pricePerKg}/kg
                </span>
                <span className="text-base font-black text-emerald-900">
                  ₹{selectedBatch.payoutAmount.toLocaleString()}
                </span>
              </div>

              {payoutSuccess || selectedBatch.payoutStatus === 'Paid' ? (
                <div className="p-3 rounded-xl bg-white border border-emerald-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Digital Payout Initiated Successfully</p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        Ref: {selectedBatch.transactionId || 'UPI-98402819034'} • Disbursed
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedBatch(null);
                      setActiveScreen('darkstore');
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                  >
                    Track in Dark Store →
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handlePayout(selectedBatch.id)}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <IndianRupee className="w-4 h-4" />
                    <span>Trigger Digital Payout (₹{selectedBatch.payoutAmount.toLocaleString()})</span>
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => setSelectedBatch(null)}
                className="text-xs text-slate-400 hover:text-slate-600 font-medium"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VERNACULAR VOICE-GUIDED AGRI ASSISTANT BOT MODAL */}
      <VoiceVernacularBotModal />

      {/* PRE-HARVEST COMPUTER VISION CROP SCANNER MODAL */}
      <PreHarvestScannerModal />
    </div>
  );
};
