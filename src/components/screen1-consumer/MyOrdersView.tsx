import React, { useState } from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Truck, 
  Tractor, 
  Warehouse, 
  IndianRupee, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  ExternalLink,
  QrCode,
  Leaf
} from 'lucide-react';
import { useSupplyChain } from '../../store/supplyChainStore';
import { ConsumerOrder, OrderStatus } from '../../types/supplyChain';
import { ecoImpactService } from '../../services/ecoImpactService';

export const MyOrdersView: React.FC = () => {
  const { orders, setActiveScreen, setIsTraceModalOpen, setSelectedTraceBatchId } = useSupplyChain();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(orders[0]?.id || null);

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const getStepProgress = (status: OrderStatus) => {
    switch (status) {
      case 'Order Confirmed': return 1;
      case 'Pending FPO': return 1;
      case 'Harvest Assigned': return 2;
      case 'In Transit to Hub': return 3;
      case 'Sorting at Dark Store': return 4;
      case 'Out for Delivery': return 5;
      case 'Delivered': return 6;
      default: return 1;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">My Farmgate Orders</h2>
          <p className="text-xs text-slate-500">Live multi-stage traceability from rural FPO harvest to your doorstep</p>
        </div>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
          {orders.length} Active Order(s)
        </span>
      </div>

      {/* AgroDirect Green Logistics Impact Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white p-4 rounded-3xl shadow-md border border-emerald-500/30 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-400/30">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wide text-emerald-400 uppercase">
                Eco Logistics Impact
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                Direct Farm-to-Fork
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Your orders have saved an estimated <strong className="text-white font-extrabold">18.6 kg CO₂</strong> emissions via direct farmgate consolidation & Tata Ace EV routing.
            </p>
          </div>
        </div>
        <div className="text-right shrink-0 hidden sm:block">
          <span className="text-xs font-bold text-emerald-300 block">🌳 ~5 Trees</span>
          <span className="text-[10px] text-slate-400 block">Equivalent Offset</span>
        </div>
      </div>

      {orders.map((order) => {
        const isExpanded = expandedOrderId === order.id;
        const currentStep = getStepProgress(order.status);

        return (
          <div
            key={order.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all overflow-hidden"
          >
            {/* Card Summary Header */}
            <div 
              onClick={() => toggleExpand(order.id)}
              className="p-5 cursor-pointer flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-white via-slate-50/30 to-slate-50/60"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-black text-slate-900">{order.id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    {order.consumerType}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    order.status === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800 animate-pulse'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                  <span>Placed: {order.orderDate}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    Slot: {order.deliverySlot}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-base font-black text-slate-900 block">
                    ₹{order.totalAmount.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-bold block">
                    Saved ₹{order.totalSavings}
                  </span>
                </div>

                <button className="text-slate-400 p-1">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Produce Tags & Trace Action */}
            <div className="px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/50">
              <div className="flex flex-wrap gap-1.5">
                {order.items.map((it, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 text-xs font-medium border border-emerald-100"
                  >
                    {it.quantity} {it.unit} • {it.productName}
                  </span>
                ))}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTraceBatchId(order.id.includes('001') ? 'HB-1041' : 'HB-1042');
                  setIsTraceModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-800 text-emerald-400 hover:text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                title="Scan QR Code & View Farmgate Provenance"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Trace Farmgate QR</span>
              </button>
            </div>

            {/* Expandable Multi-Stage Traceability Timeline */}
            {isExpanded && (
              <div className="p-5 bg-slate-50/70 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Live Farm-to-Fork Timeline
                  </h4>
                  {order.status !== 'Delivered' && (
                    <button
                      onClick={() => setActiveScreen('driver')}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                    >
                      <span>Track Driver Delivery</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* 5-Stage Stepper */}
                <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {/* Step 1: Order Confirmed */}
                  <div className="relative flex items-start gap-3">
                    <div className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      currentStep >= 1 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'
                    }`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">1. Order Confirmed & Paid</h5>
                      <p className="text-[11px] text-slate-500">
                        Payment verified via UPI ({order.transactionRef || 'Pre-authorized'}). Demand transmitted to FPO network.
                      </p>
                    </div>
                  </div>

                  {/* Step 2: FPO Harvest Planning */}
                  <div className="relative flex items-start gap-3">
                    <div className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      currentStep >= 2 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'
                    }`}>
                      {currentStep >= 2 ? <CheckCircle2 className="w-3.5 h-3.5" /> : '2'}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">2. Rural FPO Harvest & AI Assaying</h5>
                      <p className="text-[11px] text-slate-500">
                        Assigned to Kolar Horti Farmers FPO. Computer Vision (OpenCV) verified Grade A quality.
                      </p>
                    </div>
                  </div>

                  {/* Step 3: Reefer Line-Haul In Transit */}
                  <div className="relative flex items-start gap-3">
                    <div className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      currentStep >= 3 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'
                    }`}>
                      {currentStep >= 3 ? <CheckCircle2 className="w-3.5 h-3.5" /> : '3'}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">3. Middle-Mile Line-Haul In Transit</h5>
                      <p className="text-[11px] text-slate-500">
                        Cold-chain reefer truck en route to Bengaluru urban micro-hub (4.2°C chilled container).
                      </p>
                    </div>
                  </div>

                  {/* Step 4: Dark Store Inwarded & Slotted */}
                  <div className="relative flex items-start gap-3">
                    <div className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      currentStep >= 4 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'
                    }`}>
                      {currentStep >= 4 ? <CheckCircle2 className="w-3.5 h-3.5" /> : '4'}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">4. Micro-Hub Sorting & Slotting</h5>
                      <p className="text-[11px] text-slate-500">
                        Inwarded at Indiranagar MFC-04. Sorted into FEFO crates and slotted for {order.deliverySlot}.
                      </p>
                    </div>
                  </div>

                  {/* Step 5: Out for Delivery */}
                  <div className="relative flex items-start gap-3">
                    <div className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      currentStep >= 5 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'
                    }`}>
                      {currentStep >= 6 ? <CheckCircle2 className="w-3.5 h-3.5" /> : '5'}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">5. Driver Milk-Run Delivery</h5>
                      <p className="text-[11px] text-slate-500">
                        Assigned to Driver Arun Gowda (Tata Ace • KA-04-E-8812). Optimized via Google OR-Tools.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Environmental Savings per Order */}
                {(() => {
                  const totalKg = order.items.reduce((s, it) => s + (it.unit.toLowerCase().includes('kg') ? it.quantity : 1), 0);
                  const eco = ecoImpactService.calculateOrderSavings(totalKg);
                  return (
                    <div className="p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Leaf className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h6 className="text-xs font-black text-emerald-950">
                            🌱 Environmental Carbon Savings: {eco.co2SavedKg} kg CO₂ Saved
                          </h6>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-200/60 px-2 py-0.5 rounded-full">
                            {eco.equivalentTreesPlanted} tree offset
                          </span>
                        </div>
                        <ul className="text-[11px] text-emerald-800/90 mt-1 space-y-0.5 list-disc list-inside">
                          {eco.reasons.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })()}

                {/* Delivery Address Details */}
                <div className="pt-2 border-t border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Destination:</strong> {order.location}
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
