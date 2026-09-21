import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  ShoppingBag, 
  User, 
  Filter, 
  TrendingDown, 
  ShieldCheck, 
  Clock, 
  Building2, 
  CheckCircle2, 
  Truck, 
  Package, 
  ArrowRight,
  Info,
  Calendar,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useSupplyChain } from '../../store/supplyChainStore';
import { Product, DeliverySlot, ConsumerType, ConsumerOrder } from '../../types/supplyChain';

export const ConsumerApp: React.FC = () => {
  const { products, placePreOrder, orders, setActiveScreen } = useSupplyChain();

  const [searchQuery, setSearchQuery] = useState('Tomatoes');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<DeliverySlot>('Tomorrow Morning');
  const [selectedBuyerType, setSelectedBuyerType] = useState<ConsumerType>('Restaurant');
  const [quantityKg, setQuantityKg] = useState<number>(100);
  const [confirmedOrder, setConfirmedOrder] = useState<ConsumerOrder | null>(null);
  const [activeTab, setActiveTab] = useState<'catalog' | 'orders'>('catalog');

  // Filter products by query and category
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.variety.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Vegetables', 'Staples', 'Fruits'];

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setConfirmedOrder(null);
  };

  const handlePlaceOrder = () => {
    if (!selectedProduct) return;

    const newOrder = placePreOrder({
      productId: selectedProduct.id,
      quantityKg,
      deliverySlot: selectedSlot,
      consumerType: selectedBuyerType,
      consumerName: selectedBuyerType === 'Restaurant' ? 'Nandi Grand Kitchen' : `${selectedBuyerType} Direct Order`,
      location: 'Indiranagar 100ft Rd, Bengaluru'
    });

    setConfirmedOrder(newOrder);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Consumer App Top Navigation / Header */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-20 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Location selector */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <span>Delivering to</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-800">
                  <span>Indiranagar Hub, Bengaluru (560038)</span>
                </div>
              </div>
            </div>

            {/* Catalog vs Orders Tab Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('catalog')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'catalog'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Fresh Produce
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'orders'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Active Pre-Orders</span>
                <span className="px-1.5 py-0.2 bg-emerald-600 text-white text-[10px] rounded-full">
                  {orders.length}
                </span>
              </button>
            </div>
          </div>

          {/* Search bar & Category filters */}
          {activeTab === 'catalog' && (
            <div className="mt-3 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search fresh farm produce (e.g. Tomatoes, Onions, Potatoes)..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-forest text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {activeTab === 'catalog' ? (
          <>
            {/* Banner: AgMarknet 2.0 Transparency Callout */}
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-50 to-teal-50 border border-emerald-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      Direct Farmgate Procurement with AgMarknet 2.0 Benchmarks
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200/60 text-emerald-900">
                      Live Mandi Spread
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Pre-orders are aggregated and routed directly to certified FPOs in Kolar, Nashik & Mandya. Eliminates 3 mandi middlemen layers.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 text-xs font-semibold text-emerald-800 bg-white/80 px-3 py-1.5 rounded-xl border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Grade A Assayed</span>
              </div>
            </div>

            {/* Produce Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map(product => {
                const savingsPerKg = Math.max(0, product.currentMarketPrice - product.platformPrice);
                const discountPct = Math.round((savingsPerKg / product.currentMarketPrice) * 100);

                return (
                  <div
                    key={product.id}
                    onClick={() => handleOpenProduct(product)}
                    className="group bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-elevated transition-all duration-200 overflow-hidden flex flex-col cursor-pointer"
                  >
                    {/* Image Container with Badges */}
                    <div className="relative h-44 bg-slate-100 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-600/90 text-white text-[10px] font-bold backdrop-blur-xs shadow-xs">
                          {product.qualityGrade}
                        </span>
                        {discountPct > 0 && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/90 text-white text-[10px] font-bold backdrop-blur-xs shadow-xs">
                            Save ₹{savingsPerKg}/kg ({discountPct}%)
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded-md bg-black/60 text-white text-[10px] font-medium backdrop-blur-xs">
                        Avail: {product.availableQuantity.toLocaleString()} kg
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                          <span>{product.category}</span>
                          <span className="truncate max-w-[120px]">{product.sourceFpoName}</span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                          {product.variety}
                        </p>
                      </div>

                      {/* Pricing Comparison */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-black text-emerald-700">
                              ₹{product.platformPrice}
                            </span>
                            <span className="text-xs text-slate-400 font-normal">/{product.unit}</span>
                            <span className="text-xs line-through text-slate-400 ml-1">
                              ₹{product.currentMarketPrice}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500">
                            AgMarknet Ref: {product.mandiBenchmarkLocation}
                          </span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenProduct(product);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 group-hover:bg-emerald-600 text-emerald-700 group-hover:text-white text-xs font-bold transition-all shadow-xs"
                        >
                          Pre-Order
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Orders Tracking View */
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Your Fresh Pre-Orders</h2>
              <span className="text-xs text-slate-500 font-medium">Auto-synced with Rural FPO & Driver fleet</span>
            </div>

            {orders.map(order => (
              <div 
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{order.id}</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                        {order.consumerType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Placed: {order.orderDate}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-extrabold text-slate-900">₹{order.totalAmount.toLocaleString()}</span>
                    <span className="block text-[11px] text-emerald-600 font-semibold">Saved ₹{order.totalSavings}</span>
                  </div>
                </div>

                {/* Items summary */}
                <div className="flex flex-wrap items-center gap-2">
                  {order.items.map((it, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 text-xs font-medium border border-emerald-100"
                    >
                      {it.quantity} {it.unit} • {it.productName}
                    </span>
                  ))}
                </div>

                {/* Status Stepper */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      Slot: {order.deliverySlot}
                    </span>
                    <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      order.status === 'Delivered' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Visual Tracker Bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        order.status === 'Delivered'
                          ? 'w-full bg-emerald-500'
                          : order.status === 'Out for Delivery'
                          ? 'w-4/5 bg-emerald-500'
                          : order.status === 'Sorting at Dark Store'
                          ? 'w-3/5 bg-amber-500'
                          : order.status === 'In Transit to Hub'
                          ? 'w-2/5 bg-blue-500'
                          : 'w-1/5 bg-slate-400'
                      }`}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Farm Harvest</span>
                    <span>Transit</span>
                    <span>Dark Store</span>
                    <span>Driver Delivery</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Detail & Bulk Order Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
            {confirmedOrder ? (
              /* Pre-Order Confirmation Screen */
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                    Pre-Order Confirmed
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                    Demand Sent to FPO Network!
                  </h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1">
                    Your institutional requirement is registered. The rural FPO harvest schedule and dark store bin have been allocated.
                  </p>
                </div>

                {/* Receipt Card */}
                <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-200 space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Order ID:</span>
                    <span className="font-mono font-bold text-slate-900">{confirmedOrder.id}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Commodity:</span>
                    <span className="font-bold text-slate-900">{confirmedOrder.items[0].productName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Quantity:</span>
                    <span className="font-extrabold text-emerald-700">{confirmedOrder.totalQuantity} kg</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Delivery Slot:</span>
                    <span className="font-bold text-slate-900">{confirmedOrder.deliverySlot}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Total Payable:</span>
                    <span className="font-extrabold text-slate-900">₹{confirmedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">AgMarknet Savings:</span>
                    <span className="font-bold text-emerald-600">₹{confirmedOrder.totalSavings.toLocaleString()}</span>
                  </div>
                </div>

                {/* Cross Screen Link */}
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setSelectedProduct(null);
                      setConfirmedOrder(null);
                      setActiveScreen('fpo');
                    }}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <span>View Demand Surge on Rural FPO Hub</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedProduct(null);
                      setConfirmedOrder(null);
                    }}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Product Detail & Selector Form */
              <div className="space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                      {selectedProduct.category} • {selectedProduct.qualityGrade}
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900">{selectedProduct.name}</h3>
                    <p className="text-xs text-slate-500">{selectedProduct.variety}</p>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    ✕
                  </button>
                </div>

                {/* Image & Source info */}
                <div className="h-40 rounded-2xl overflow-hidden relative">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                    <span className="text-white text-xs font-medium">
                      Direct from: <strong className="font-bold">{selectedProduct.sourceFpoName}</strong> ({selectedProduct.sourceLocation})
                    </span>
                  </div>
                </div>

                {/* Price Benchmark Breakdown */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Direct Platform Price</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-emerald-800">₹{selectedProduct.platformPrice}</span>
                      <span className="text-xs text-slate-500">/kg</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">AgMarknet 2.0 APMC Mandi</span>
                    <div className="flex items-baseline gap-1 justify-end">
                      <span className="text-sm font-semibold line-through text-slate-400">₹{selectedProduct.currentMarketPrice}/kg</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        Save ₹{selectedProduct.currentMarketPrice - selectedProduct.platformPrice}/kg
                      </span>
                    </div>
                  </div>
                </div>

                {/* Institutional Quantity Selector */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-800">
                      Bulk Order Quantity (kg)
                    </label>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Total: ₹{(quantityKg * selectedProduct.platformPrice).toLocaleString()}
                    </span>
                  </div>

                  {/* Institutional Quick Select Buttons */}
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[50, 100, 250, 500].map(qty => (
                      <button
                        key={qty}
                        type="button"
                        onClick={() => setQuantityKg(qty)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          quantityKg === qty
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {qty} kg
                      </button>
                    ))}
                  </div>

                  {/* Custom stepper */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantityKg(Math.max(10, quantityKg - 25))}
                      className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-base flex items-center justify-center"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantityKg}
                      onChange={(e) => setQuantityKg(Math.max(1, Number(e.target.value)))}
                      className="flex-1 py-2 text-center border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantityKg(quantityKg + 25)}
                      className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-base flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Delivery Slot Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    Select Delivery Slot
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Tomorrow Morning', 'Tomorrow Afternoon', 'Tomorrow Evening'] as DeliverySlot[]).map(slot => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                          selectedSlot === slot
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-500 ring-2 ring-emerald-500/20 font-bold'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 font-medium'
                        }`}
                      >
                        <span className="block font-bold truncate">{slot.replace('Tomorrow ', '')}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {slot === 'Tomorrow Morning' ? '06 - 09 AM' : slot === 'Tomorrow Afternoon' ? '12 - 03 PM' : '05 - 08 PM'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Institutional Buyer Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Institution / Buyer Type
                  </label>
                  <select
                    value={selectedBuyerType}
                    onChange={(e) => setSelectedBuyerType(e.target.value as ConsumerType)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="Restaurant">Restaurant (e.g. Vidyarthi Bhavan)</option>
                    <option value="Hostel">Hostel (e.g. College Mess)</option>
                    <option value="Temple">Temple (e.g. Akshaya Patra)</option>
                    <option value="Corporate Canteen">Corporate Canteen (Tech Park)</option>
                    <option value="PG">PG Community</option>
                    <option value="Household">Household Consumer</option>
                  </select>
                </div>

                {/* Pre-Order CTA */}
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:shadow-none"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Place Pre-Order • ₹{(quantityKg * selectedProduct.platformPrice).toLocaleString()}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
