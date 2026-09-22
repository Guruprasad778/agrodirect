import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  IndianRupee, 
  Plus, 
  Minus, 
  Sparkles, 
  CheckCircle2, 
  Store, 
  Layers, 
  ShoppingBag, 
  Tractor, 
  ArrowRight, 
  X,
  PackagePlus,
  ShieldCheck
} from 'lucide-react';
import { useSupplyChain } from '../../store/supplyChainStore';
import { Product } from '../../types/supplyChain';

export const AdminPriceControlModal: React.FC = () => {
  const { 
    products, 
    updateProductPrice, 
    updateProductDetails, 
    addNewProduct, 
    isAdminPriceControlOpen, 
    setIsAdminPriceControlOpen,
    toggleFlashSale 
  } = useSupplyChain();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<'Vegetables' | 'Staples' | 'Fruits' | 'Dairy'>('Vegetables');
  const [newProdVariety, setNewProdVariety] = useState('');
  const [newProdSellingPrice, setNewProdSellingPrice] = useState(30);
  const [newProdMarketPrice, setNewProdMarketPrice] = useState(35);
  const [newProdUnit, setNewProdUnit] = useState('kg');
  const [newProdQuantity, setNewProdQuantity] = useState(1000);
  const [newProdGrade, setNewProdGrade] = useState<'Grade A' | 'Grade B' | 'Grade C'>('Grade A');

  if (!isAdminPriceControlOpen) return null;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    addNewProduct({
      name: newProdName,
      category: newProdCategory,
      variety: newProdVariety || 'Standard Grade',
      currentMarketPrice: newProdMarketPrice,
      platformPrice: newProdSellingPrice,
      unit: newProdUnit,
      availableQuantity: newProdQuantity,
      demand: 0,
      expectedDemand: 0,
      qualityGrade: newProdGrade,
      sourceFpoId: 'FPO-KLR-01',
      sourceFpoName: 'Kolar Horti Farmers FPO',
      sourceLocation: 'Kolar, Karnataka',
      description: 'Direct farmgate procurement, quality assayed.',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
      mandiBenchmarkLocation: 'Bengaluru APMC Mandi',
      shelfLifeDays: 7
    });

    setIsAddingNew(false);
    setNewProdName('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center shadow-md">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-slate-900">
                  Developer / Admin Product & Price Control
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                  Live Sync Active
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Direct manual control over selling prices. Changes propagate immediately to Catalog ➔ Cart ➔ Checkout ➔ FPO Demand.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminPriceControlOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Architecture Flow Banner */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-900 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-semibold">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Real-Time Propagation:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
            <span className="bg-white px-2 py-0.5 rounded border border-emerald-200 font-bold">Admin Price</span>
            <span>➔</span>
            <span className="bg-white px-2 py-0.5 rounded border border-emerald-200 font-bold">Product Card</span>
            <span>➔</span>
            <span className="bg-white px-2 py-0.5 rounded border border-emerald-200 font-bold">Active Cart</span>
            <span>➔</span>
            <span className="bg-white px-2 py-0.5 rounded border border-emerald-200 font-bold">Order Total</span>
            <span>➔</span>
            <span className="bg-white px-2 py-0.5 rounded border border-emerald-200 font-bold">FPO Demand</span>
          </div>
          <span className="text-[10px] text-slate-500">
            *AgMarknet APMC rate is benchmark reference only
          </span>
        </div>

        {/* Action Controls Bar */}
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            All Commodities ({products.length})
          </h3>

          <button
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
          >
            <PackagePlus className="w-3.5 h-3.5" />
            <span>{isAddingNew ? 'Close Form' : 'Add New Commodity'}</span>
          </button>
        </div>

        {/* Add New Product Collapsible Form */}
        {isAddingNew && (
          <form onSubmit={handleCreateProduct} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-in fade-in duration-200">
            <h4 className="text-xs font-bold text-slate-900">Add New Agricultural Commodity</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[11px] text-slate-600 font-semibold mb-1">Product Name *</label>
                <input
                  type="text"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Green Capsicum"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 font-semibold mb-1">Category</label>
                <select
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                >
                  <option value="Vegetables">Vegetables</option>
                  <option value="Staples">Staples</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Dairy">Dairy</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 font-semibold mb-1">Variety</label>
                <input
                  type="text"
                  value={newProdVariety}
                  onChange={(e) => setNewProdVariety(e.target.value)}
                  placeholder="e.g. California Wonder"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 font-semibold mb-1">Our Selling Price (₹) *</label>
                <input
                  type="number"
                  value={newProdSellingPrice}
                  onChange={(e) => setNewProdSellingPrice(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-emerald-700"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 font-semibold mb-1">AgMarknet Reference (₹)</label>
                <input
                  type="number"
                  value={newProdMarketPrice}
                  onChange={(e) => setNewProdMarketPrice(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 font-semibold mb-1">Unit</label>
                <input
                  type="text"
                  value={newProdUnit}
                  onChange={(e) => setNewProdUnit(e.target.value)}
                  placeholder="kg / litre / piece"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs"
              >
                Save & Publish
              </button>
            </div>
          </form>
        )}

        {/* Product Pricing Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto max-h-[55vh] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-slate-100/95 backdrop-blur-xs border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Commodity</th>
                  <th className="py-3 px-2">AgMarknet Ref</th>
                  <th className="py-3 px-4 text-center">Our Selling Price</th>
                  <th className="py-3 px-2 text-center">Group Buy (₹)</th>
                  <th className="py-3 px-2 text-center">Flash Sale (₹)</th>
                  <th className="py-3 px-2">Grade</th>
                  <th className="py-3 px-2">Stock (kg)</th>
                  <th className="py-3 px-4 text-right">Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700 bg-white">
                {products.map((product) => {
                  const isTomato = product.id === 'PROD-TOMATO';

                  return (
                    <tr 
                      key={product.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        isTomato ? 'bg-emerald-50/20' : ''
                      }`}
                    >
                      {/* Name & Variety */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-100 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block truncate max-w-[140px]">
                              {product.name}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate max-w-[140px]">
                              {product.variety}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* AgMarknet Reference Benchmark */}
                      <td className="py-3 px-2">
                        <span className="font-mono text-slate-500 line-through">
                          ₹{product.currentMarketPrice}/{product.unit}
                        </span>
                        <span className="block text-[9px] text-slate-400">
                          {product.mandiBenchmarkLocation.split(' ')[0]}
                        </span>
                      </td>

                      {/* Direct Selling Price Stepper & Manual Entry */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => updateProductPrice(product.id, Math.max(1, product.platformPrice - 5))}
                            className="px-1.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold"
                            title="Decrease by ₹5"
                          >
                            -5
                          </button>
                          <button
                            type="button"
                            onClick={() => updateProductPrice(product.id, Math.max(1, product.platformPrice - 1))}
                            className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                            title="Decrease by ₹1"
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          <div className="flex items-center bg-white border border-emerald-300 rounded-lg px-2 py-0.5 shadow-xs">
                            <span className="text-xs font-bold text-emerald-700">₹</span>
                            <input
                              type="number"
                              value={product.platformPrice}
                              onChange={(e) => updateProductPrice(product.id, Math.max(0, Number(e.target.value)))}
                              className="w-12 text-center text-xs font-black text-slate-900 focus:outline-none"
                            />
                            <span className="text-[10px] text-slate-400">/{product.unit}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => updateProductPrice(product.id, product.platformPrice + 1)}
                            className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                            title="Increase by ₹1"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => updateProductPrice(product.id, product.platformPrice + 5)}
                            className="px-1.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold"
                            title="Increase by ₹5"
                          >
                            +5
                          </button>
                        </div>
                      </td>

                      {/* Group Buy Manual Price */}
                      <td className="py-3 px-2 text-center">
                        <div className="inline-flex items-center bg-white border border-emerald-300 rounded-lg px-2 py-0.5 shadow-2xs">
                          <span className="text-xs font-bold text-emerald-700">₹</span>
                          <input
                            type="number"
                            value={product.groupBuyPrice || Math.round(product.platformPrice * 0.85)}
                            onChange={(e) => updateProductDetails(product.id, { groupBuyPrice: Number(e.target.value) })}
                            className="w-10 text-center text-xs font-black text-slate-900 focus:outline-none"
                            title="Manual Community Group Buy Price"
                          />
                        </div>
                      </td>

                      {/* Flash Sale Manual Price & Toggle */}
                      <td className="py-3 px-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => toggleFlashSale(product.id, !product.isFlashSaleActive, product.flashSalePrice || Math.round(product.platformPrice * 0.75))}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold transition-all ${
                              product.isFlashSaleActive ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'
                            }`}
                            title="Toggle Flash Sale"
                          >
                            {product.isFlashSaleActive ? 'ON' : 'OFF'}
                          </button>
                          <div className="inline-flex items-center bg-white border border-rose-300 rounded-lg px-1.5 py-0.5 shadow-2xs">
                            <span className="text-[11px] font-bold text-rose-600">₹</span>
                            <input
                              type="number"
                              value={product.flashSalePrice || Math.round(product.platformPrice * 0.75)}
                              onChange={(e) => updateProductDetails(product.id, { flashSalePrice: Number(e.target.value) })}
                              className="w-8 text-center text-xs font-black text-rose-700 focus:outline-none"
                              title="Manual Flash Sale Price"
                            />
                          </div>
                        </div>
                      </td>

                      {/* Grade Selector */}
                      <td className="py-3 px-2">
                        <select
                          value={product.qualityGrade}
                          onChange={(e) => updateProductDetails(product.id, { qualityGrade: e.target.value as any })}
                          className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-800"
                        >
                          <option value="Grade A">Grade A</option>
                          <option value="Grade B">Grade B</option>
                          <option value="Grade C">Grade C</option>
                        </select>
                      </td>

                      {/* Stock Quantity */}
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          value={product.availableQuantity}
                          onChange={(e) => updateProductDetails(product.id, { availableQuantity: Number(e.target.value) })}
                          className="w-16 px-1.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-center"
                        />
                      </td>

                      {/* In Stock Toggle */}
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => updateProductDetails(product.id, { inStock: product.inStock === false ? true : false })}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                            product.inStock !== false
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {product.inStock !== false ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
          <span>All changes persist in <strong>localStorage</strong> during live evaluation</span>
          <button
            onClick={() => setIsAdminPriceControlOpen(false)}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors"
          >
            Done Editing
          </button>
        </div>
      </div>
    </div>
  );
};
