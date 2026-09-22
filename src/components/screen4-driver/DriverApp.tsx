import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Weight, 
  ShieldCheck, 
  ChevronRight, 
  Route, 
  ExternalLink,
  Sparkles,
  Layers,
  ArrowRight,
  RotateCcw,
  Radio,
  Leaf,
  AlertTriangle,
  Activity
} from 'lucide-react';
import { useSupplyChain } from '../../store/supplyChainStore';
import { DeliveryStop } from '../../types/supplyChain';

export const DriverApp: React.FC = () => {
  const { driver, markDeliveryCompleted, setActiveScreen, iotTelemetry } = useSupplyChain();
  const [selectedStop, setSelectedStop] = useState<DeliveryStop | null>(driver.stops[0] || null);
  const [activeTab, setActiveTab] = useState<'map' | 'stops'>('map');

  const handleCompleteDelivery = (orderId: string) => {
    markDeliveryCompleted(orderId);
  };

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 pb-20">
      {/* Driver Mobile Top App Header */}
      <div className="bg-slate-950 border-b border-slate-800 sticky top-16 z-20 shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-forest flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-extrabold text-white">
                  Driver: {driver.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {driver.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {driver.vehicle} • <span className="font-mono text-emerald-400">{driver.vehicleNumber}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex text-xs">
              <button
                onClick={() => setActiveTab('map')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'map' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Map & AI Route
              </button>
              <button
                onClick={() => setActiveTab('stops')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'stops' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Stops ({driver.completedStops}/{driver.stops.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-5 space-y-5">
        {/* AI ROUTE OPTIMIZATION STATS PANEL */}
        <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-4 shadow-lg space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">
                  AI Route Optimization
                </h3>
                <span className="text-[10px] text-slate-400">
                  Engine: <strong className="text-emerald-400">Google OR-Tools + OSRM Road Graph</strong>
                </span>
              </div>
            </div>

            <span className="text-[11px] font-bold text-slate-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
              Payload: {driver.capacityUsedKg} / {driver.vehicleCapacityKg} kg ({driver.capacityPercent}% Used)
            </span>
          </div>

          {/* 4 Stats Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Stops Queue</span>
              <span className="text-base font-extrabold text-white">{driver.stops.length} Drops</span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Optimized Distance</span>
              <span className="text-base font-extrabold text-emerald-400">{driver.distanceKm} km</span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Est. Drive Time</span>
              <span className="text-base font-extrabold text-white">{driver.estimatedTime}</span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Delivery Clusters</span>
              <span className="text-base font-extrabold text-purple-400">4 Urban Zones</span>
            </div>
          </div>

          {/* Route Sequence Pills */}
          <div className="pt-1 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
            <span className="text-[11px] text-slate-400 font-semibold shrink-0">Sequence:</span>
            {driver.stops.map((stop, idx) => (
              <React.Fragment key={stop.stopNumber}>
                <button
                  onClick={() => setSelectedStop(stop)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-all ${
                    stop.status === 'Delivered'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 line-through'
                      : selectedStop?.stopNumber === stop.stopNumber
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  Stop {stop.stopNumber}: {stop.customerName.split(' ')[0]}
                </button>
                {idx < driver.stops.length - 1 && (
                  <span className="text-slate-600">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* DUAL TELEMATICS & ECO IMPACT CARDS */}
        {(() => {
          const isAlert = Boolean(iotTelemetry.isAlert || iotTelemetry.isAlertActive);
          const vehicle = iotTelemetry.vehiclePlate || iotTelemetry.vehicleNumber || 'KA-04-E-8821';
          const humidity = iotTelemetry.humidityPct ?? iotTelemetry.humidityPercent ?? 72;

          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Onboard Reefer Chiller IoT Sensor */}
              <div className={`p-4 rounded-2xl border transition-all ${
                isAlert 
                  ? 'bg-rose-950/60 border-rose-500/80 ring-1 ring-rose-500' 
                  : 'bg-slate-950/80 border-slate-800'
              }`}>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${
                      isAlert ? 'bg-rose-500 text-white animate-pulse' : 'bg-sky-500/20 text-sky-400'
                    }`}>
                      <Radio className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Onboard Reefer Chiller</h4>
                      <span className="text-[10px] text-slate-400 font-mono">Sensors: SHT40 + ESP32</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isAlert 
                      ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50' 
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {isAlert ? 'TEMP ALERT' : 'CHILLED 4.2°C'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Chamber Temp</span>
                    <span className={`text-xl font-black ${
                      isAlert ? 'text-rose-400' : 'text-sky-400'
                    }`}>
                      {iotTelemetry.temperatureC}°C
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Humidity</span>
                    <span className="text-xl font-black text-slate-200">
                      {humidity}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Vehicle Box</span>
                    <span className="text-xs font-bold text-slate-300">
                      {vehicle}
                    </span>
                  </div>
                </div>

                {isAlert && (
                  <div className="mt-2.5 p-2 rounded-lg bg-rose-900/60 border border-rose-700/60 text-[11px] text-rose-200 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Critical spike: Chiller re-engagement command triggered.</span>
                  </div>
                )}
              </div>

              {/* Card 2: Green Fleet Route Eco Impact */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                        <Leaf className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Route Eco Impact</h4>
                        <span className="text-[10px] text-emerald-400 font-medium">Tata Ace EV Logistics</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Zero Emission
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-emerald-400">24.8 kg</span>
                    <span className="text-xs text-slate-400">CO₂ emissions prevented</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
                  OR-Tools TSP dynamic routing reduced route by 35.8 km vs traditional uncoordinated diesel mandi trips.
                </p>
              </div>
            </div>
          );
        })()}

        {/* INTERACTIVE DELIVERY MAP VIEW */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
          {/* Map Header with tech notice */}
          <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bengaluru Micro-Hub Milk-Run Route</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Live GPS Simulation • Leaflet/Vector
            </span>
          </div>

          {/* Interactive Simulated Map Canvas */}
          <div className="relative h-72 sm:h-96 bg-[#16202c] overflow-hidden">
            {/* Grid Pattern overlay for tech map aesthetic */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />

            {/* SVG Roads & Route Polyline */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 450">
              {/* Background arterial road outlines */}
              <path d="M 50 200 Q 250 150 450 220 T 750 180" fill="none" stroke="#253342" strokeWidth="6" />
              <path d="M 200 50 Q 220 220 280 400" fill="none" stroke="#253342" strokeWidth="6" />
              <path d="M 550 50 Q 520 240 600 400" fill="none" stroke="#253342" strokeWidth="6" />
              <path d="M 100 350 C 300 280 500 380 700 320" fill="none" stroke="#253342" strokeWidth="5" />

              {/* ACTIVE OPTIMIZED ROUTE POLYLINE */}
              <path 
                d="M 620 240 L 480 320 L 380 260 L 260 140 L 520 180 L 620 240" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="4" 
                strokeDasharray="6,4"
                className="animate-pulse"
              />
            </svg>

            {/* Hub Depot Pin */}
            <div 
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ left: '77%', top: '53%' }}
            >
              <div className="flex flex-col items-center">
                <span className="px-1.5 py-0.5 rounded bg-slate-900/90 text-white text-[9px] font-bold border border-slate-700 whitespace-nowrap shadow-sm mb-1">
                  Depot: Indiranagar Hub
                </span>
                <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-slate-900 shadow-lg shadow-emerald-500/50">
                  <Truck className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Stop Pins 1 to 5 */}
            {driver.stops.map((stop, idx) => {
              // Normalized coordinates mapped to SVG canvas percentage
              const coords: Record<number, { left: string; top: string }> = {
                1: { left: '60%', top: '71%' }, // Basavanagudi
                2: { left: '47%', top: '58%' }, // Shanti Nagar
                3: { left: '32%', top: '31%' }, // Rajajinagar
                4: { left: '65%', top: '40%' }, // Bagmane Tech
                5: { left: '77%', top: '65%' }, // Indiranagar PG
              };
              const pos = coords[stop.stopNumber] || { left: '50%', top: '50%' };
              const isSelected = selectedStop?.stopNumber === stop.stopNumber;
              const isDelivered = stop.status === 'Delivered';

              return (
                <div
                  key={stop.stopNumber}
                  onClick={() => setSelectedStop(stop)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer transition-all ${
                    isSelected ? 'scale-125 z-20' : 'hover:scale-110'
                  }`}
                  style={{ left: pos.left, top: pos.top }}
                >
                  <div className="flex flex-col items-center">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold whitespace-nowrap shadow-md mb-1 ${
                      isDelivered 
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' 
                        : isSelected
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-900 text-slate-200 border border-slate-700'
                    }`}>
                      #{stop.stopNumber} {stop.customerName.split(' ')[0]}
                    </span>

                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-lg ${
                      isDelivered
                        ? 'bg-emerald-700 text-white border-2 border-emerald-400'
                        : isSelected
                        ? 'bg-emerald-400 text-slate-950 border-2 border-white ring-4 ring-emerald-500/40'
                        : 'bg-slate-800 text-white border border-slate-600'
                    }`}>
                      {isDelivered ? <CheckCircle2 className="w-4 h-4" /> : stop.stopNumber}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Map Controls */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-xs p-2 rounded-xl border border-slate-800 text-[10px] text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Active Milk-Run Route (42.6 km)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                <span>Pending Deliveries</span>
              </div>
            </div>
          </div>
        </div>

        {/* SELECTED STOP DETAIL & DELIVERY COMPLETION */}
        {selectedStop && (
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
                    STOP {selectedStop.stopNumber} OF {driver.stops.length}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    ETA: <strong className="text-white">{selectedStop.eta}</strong>
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white mt-1">
                  {selectedStop.customerName}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{selectedStop.address} ({selectedStop.landmark})</span>
                </p>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                selectedStop.status === 'Delivered'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {selectedStop.status}
              </span>
            </div>

            {/* Cargo Manifest for this stop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Produce Items</span>
                <p className="font-bold text-white mt-0.5">{selectedStop.productSummary}</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Drop Weight</span>
                <p className="font-black text-emerald-400 text-sm mt-0.5">{selectedStop.weightKg} kg</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Institution Type</span>
                <p className="font-bold text-white mt-0.5">{selectedStop.customerType}</p>
              </div>
            </div>

            {/* Action Buttons: Call Customer & Mark Delivered */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href="tel:+919845012345"
                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Call Receiving Manager</span>
              </a>

              {selectedStop.status === 'Delivered' ? (
                <div className="flex-1 py-3 px-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Delivery Completed & Digital POD Signed
                  </span>
                  <button
                    onClick={() => setActiveScreen('consumer')}
                    className="text-[11px] text-white underline hover:text-emerald-200"
                  >
                    View in Consumer App →
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleCompleteDelivery(selectedStop.orderId)}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Delivered (Complete Stop #{selectedStop.stopNumber})</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ALL STOPS LIST ACCORDION */}
        {activeTab === 'stops' && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white">
              All Assigned Drops for Today's Run
            </h3>

            {driver.stops.map(stop => (
              <div
                key={stop.stopNumber}
                onClick={() => setSelectedStop(stop)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedStop?.stopNumber === stop.stopNumber
                    ? 'bg-slate-950 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      stop.status === 'Delivered' 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {stop.status === 'Delivered' ? <CheckCircle2 className="w-3.5 h-3.5" /> : stop.stopNumber}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{stop.customerName}</h4>
                      <p className="text-[11px] text-slate-400">{stop.productSummary}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400">{stop.weightKg} kg</span>
                    <span className="block text-[10px] text-slate-400 font-mono">ETA {stop.eta}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
