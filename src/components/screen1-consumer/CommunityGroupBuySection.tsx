import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShoppingBag, 
  ChevronRight,
  TrendingDown,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useSupplyChain } from '../../store/supplyChainStore';
import { Product } from '../../types/supplyChain';

export const CommunityGroupBuySection: React.FC = () => {
  const { products, joinCommunityGroupBuy, addToCart } = useSupplyChain();
  const [selectedQty, setSelectedQty] = useState<number>(5);

  // Focus on Tomato for the community group buy showcase
  const groupProduct = products.find(p => p.id === 'PROD-TOMATO') || products[0];

  const currentKg = groupProduct.groupBuyCurrentKg || 47;
  const minTargetKg = groupProduct.groupBuyMinKg || 50;
  const isUnlocked = currentKg >= minTargetKg;
  const normalPrice = groupProduct.platformPrice;
  const bulkPrice = groupProduct.groupBuyPrice || Math.max(1, normalPrice - 4);
  const savingsPerKg = Math.max(0, normalPrice - bulkPrice);
  const progressPercent = Math.min(100, Math.round((currentKg / minTargetKg) * 100));

  const handleJoin = () => {
    joinCommunityGroupBuy(groupProduct.id, selectedQty);
    // Also directly add to user's cart at bulk price
    addToCart(
      {
        ...groupProduct,
        platformPrice: isUnlocked ? bulkPrice : normalPrice
      },
      selectedQty
    );
  };

  return (
    <div className="mb-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-forest to-slate-950 text-white p-5 sm:p-6 shadow-elevated border border-emerald-500/30 overflow-hidden relative">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left column: Overview & Live Progress */}
        <div className="space-y-3 flex-1 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold tracking-wider uppercase flex items-center gap-1.5">
              <Users className="w-3 h-3 text-emerald-400" />
              <span>Community Group Buying</span>
            </span>

            {isUnlocked ? (
              <span className="px-2.5 py-1 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black flex items-center gap-1 animate-pulse">
                <CheckCircle2 className="w-3 h-3" />
                <span>✓ Bulk Price Unlocked</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold">
                {minTargetKg - currentKg} kg left to unlock ₹{bulkPrice}/kg
              </span>
            )}
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              Indiranagar Neighborhood Hub: Pool & Save on {groupProduct.name}
            </h3>
            <p className="text-xs text-emerald-200/80 mt-1">
              Join nearby households & restaurants in Indiranagar to pool fresh harvest crates direct from Kolar FPO. When the collective pool hits {minTargetKg} kg, everyone gets the admin-configured bulk rate!
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-emerald-300 flex items-center gap-1">
                <span>Current Group Pool:</span>
                <strong className="text-white text-sm">{currentKg} kg</strong>
                <span className="text-slate-400 font-normal">/ {minTargetKg} kg target</span>
              </span>
              <span className="text-emerald-400">{progressPercent}%</span>
            </div>

            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div 
                style={{ width: `${progressPercent}%` }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300 transition-all duration-500 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Right column: Pricing card & Quick Join Action */}
        <div className="w-full lg:w-80 bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-4 shadow-xl backdrop-blur-md space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Collective Bulk Rate</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-400">₹{bulkPrice}</span>
                <span className="text-xs text-slate-400">/{groupProduct.unit}</span>
                <span className="text-xs text-slate-500 line-through">₹{normalPrice}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold block">
                Save ₹{savingsPerKg}/kg
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Admin-configured</span>
            </div>
          </div>

          {/* Stepper to join */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Your Quantity Pledge:</span>
              <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                <button
                  onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                  className="w-6 h-6 rounded bg-slate-700 text-white flex items-center justify-center font-bold text-xs hover:bg-slate-600"
                >
                  -
                </button>
                <span className="w-10 text-center text-xs font-bold text-white">
                  {selectedQty} {groupProduct.unit}
                </span>
                <button
                  onClick={() => setSelectedQty(selectedQty + 1)}
                  className="w-6 h-6 rounded bg-slate-700 text-white flex items-center justify-center font-bold text-xs hover:bg-slate-600"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleJoin}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-slate-950" />
              <span>Join Group & Add {selectedQty} {groupProduct.unit} (₹{selectedQty * (isUnlocked ? bulkPrice : normalPrice)})</span>
            </button>
          </div>

          <div className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Developer/admin controlled price • Zero algorithmic surge</span>
          </div>
        </div>
      </div>
    </div>
  );
};
