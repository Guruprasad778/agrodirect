import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  ShoppingBag, 
  Filter, 
  TrendingDown, 
  ShieldCheck, 
  Clock, 
  Building2, 
  CheckCircle2, 
  Plus, 
  Minus,
  SlidersHorizontal,
  Store,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import { useSupplyChain } from '../../store/supplyChainStore';
import { Product, DeliverySlot, ConsumerType, ConsumerOrder, DeliveryAddress } from '../../types/supplyChain';
import { CartPage } from './CartPage';
import { CheckoutModal } from './CheckoutModal';
import { PaymentModal } from './PaymentModal';
import { MyOrdersView } from './MyOrdersView';
import { AdminPriceControlModal } from '../admin/AdminPriceControlModal';

export const ConsumerApp: React.FC = () => {
  const { 
    products, 
    cart, 
    cartCount, 
    addToCart, 
    orders, 
    isCartOpen, 
    setIsCartOpen,
    isCheckoutOpen, 
    setIsCheckoutOpen,
    isAdminPriceControlOpen, 
    setIsAdminPriceControlOpen,
    setActiveScreen 
  } = useSupplyChain();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'catalog' | 'cart' | 'orders'>('catalog');

  // Quantity per product card state
  const [cardQuantities, setCardQuantities] = useState<Record<string, number>>({});

  // Checkout flow state
  const [checkoutAddress, setCheckoutAddress] = useState<DeliveryAddress | null>(null);
  const [checkoutSlot, setCheckoutSlot] = useState<DeliverySlot>('Tomorrow Morning');
  const [checkoutBuyerType, setCheckoutBuyerType] = useState<ConsumerType>('Restaurant');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const getCardQty = (prodId: string) => cardQuantities[prodId] || 1;

  const setCardQty = (prodId: string, delta: number) => {
    const current = getCardQty(prodId);
    const newQty = Math.max(1, current + delta);
    setCardQuantities(prev => ({ ...prev, [prodId]: newQty }));
  };

  // Filter products by query and category
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.variety.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Vegetables', 'Fruits', 'Staples', 'Dairy'];

  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const qty = getCardQty(product.id);
    addToCart(product, qty);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleAddressStepComplete = (data: {
    address: DeliveryAddress;
    slot: DeliverySlot;
    consumerType: ConsumerType;
  }) => {
    setCheckoutAddress(data.address);
    setCheckoutSlot(data.slot);
    setCheckoutBuyerType(data.consumerType);
    setIsCheckoutOpen(false);
    setIsPaymentOpen(true);
  };

  const handleOrderSuccess = (order: ConsumerOrder) => {
    // Keep payment modal open to show receipt; user can dismiss or navigate to orders
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Consumer Header & Search */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-20 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Delivery Destination */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <span>Delivering Direct From Farm</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <div className="text-xs font-semibold text-slate-800">
                  Indiranagar Hub, Bengaluru (560038)
                </div>
              </div>
            </div>

            {/* Navigation Tabs (Catalog vs Cart vs Orders vs Admin Price Control) */}
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
                onClick={() => setActiveTab('cart')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all relative ${
                  activeTab === 'cart'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>My Cart</span>
                {cartCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-emerald-600 text-white text-[10px] font-extrabold rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'orders'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>My Orders</span>
                <span className="px-1.5 py-0.2 bg-slate-200 text-slate-700 text-[10px] rounded-full">
                  {orders.length}
                </span>
              </button>

              {/* Admin Price Control Button */}
              <button
                onClick={() => setIsAdminPriceControlOpen(true)}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 text-[11px] font-bold border border-transparent hover:border-emerald-200 transition-colors"
                title="Developer Price Control: Manual Selling Price Adjustments"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
                <span>Price Control</span>
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
                  placeholder="Search fresh produce..."
                  className="w-full pl-10 pr-16 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-emerald-700 bg-slate-200/60 hover:bg-slate-200 px-2 py-0.5 rounded-md transition-colors"
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
        {activeTab === 'catalog' && (
          <>
            {/* Banner: AgMarknet Transparency & Direct Procurement */}
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-50 to-teal-50 border border-emerald-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      AgroDirect: Direct Farmgate Procurement & AgMarknet 2.0 Benchmarks
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200/60 text-emerald-900">
                      Zero Middlemen
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Selling prices are configured directly with rural FPOs. AgMarknet APMC prices provide verified open-market savings comparison.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAdminPriceControlOpen(true)}
                className="flex items-center gap-1.5 shrink-0 text-xs font-bold text-emerald-800 bg-white px-3 py-1.5 rounded-xl border border-emerald-300 shadow-xs hover:bg-emerald-50 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                <span>Adjust Selling Prices</span>
              </button>
            </div>

            {/* Produce Grid with Direct Add to Cart */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No produce found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {searchQuery 
                    ? `No commodities matched "${searchQuery}". Try a different search term or reset filters.`
                    : `No produce found under category "${selectedCategory}".`}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  Show All Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map(product => {
                const savingsPerKg = Math.max(0, product.currentMarketPrice - product.platformPrice);
                const discountPct = Math.round((savingsPerKg / product.currentMarketPrice) * 100);
                const currentQty = getCardQty(product.id);

                return (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-elevated transition-all duration-200 overflow-hidden flex flex-col justify-between"
                  >
                    {/* Image Container with Badges */}
                    <div 
                      onClick={() => setSelectedProduct(product)}
                      className="relative h-44 bg-slate-100 overflow-hidden cursor-pointer"
                    >
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
                            Save ₹{savingsPerKg}/{product.unit} ({discountPct}%)
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded-md bg-black/60 text-white text-[10px] font-medium backdrop-blur-xs">
                        Avail: {product.availableQuantity.toLocaleString()} {product.unit}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div 
                        onClick={() => setSelectedProduct(product)}
                        className="cursor-pointer"
                      >
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
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
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
                          <span className="text-[10px] text-slate-400 block">
                            Mandi Ref: {product.mandiBenchmarkLocation.split(' ')[0]}
                          </span>
                        </div>

                        {/* Quantity Stepper for this Card */}
                        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                          <button
                            onClick={() => setCardQty(product.id, -1)}
                            className="w-5 h-5 rounded bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                          >
                            -
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-slate-800">
                            {currentQty}
                          </span>
                          <button
                            onClick={() => setCardQty(product.id, 1)}
                            className="w-5 h-5 rounded bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Direct Add to Cart Action */}
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-2">
                        <button
                          onClick={(e) => handleAddToCart(product, e)}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add {currentQty} {product.unit} (₹{currentQty * product.platformPrice})</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            )}
          </>
        )}

        {/* Tab 2: Shopping Cart Page */}
        {activeTab === 'cart' && (
          <CartPage 
            onClose={() => setActiveTab('catalog')} 
            onProceedToCheckout={handleProceedToCheckout} 
          />
        )}

        {/* Tab 3: My Orders View */}
        {activeTab === 'orders' && (
          <MyOrdersView />
        )}
      </div>

      {/* MODAL 1: CHECKOUT MODAL (Address & Slot) */}
      {isCheckoutOpen && (
        <CheckoutModal
          onClose={() => setIsCheckoutOpen(false)}
          onProceedToPayment={handleAddressStepComplete}
        />
      )}

      {/* MODAL 2: INDIAN UPI PAYMENT MODAL */}
      {isPaymentOpen && checkoutAddress && (
        <PaymentModal
          address={checkoutAddress}
          slot={checkoutSlot}
          consumerType={checkoutBuyerType}
          onClose={() => {
            setIsPaymentOpen(false);
            setActiveTab('orders');
          }}
          onOrderSuccess={handleOrderSuccess}
        />
      )}

      {/* MODAL 3: DEVELOPER / ADMIN PRICE CONTROL MODAL */}
      <AdminPriceControlModal />

      {/* Floating Bottom Cart Bar on Mobile when items in cart */}
      {cartCount > 0 && activeTab === 'catalog' && (
        <div className="fixed bottom-4 left-4 right-4 z-30 max-w-lg mx-auto">
          <div 
            onClick={() => setActiveTab('cart')}
            className="bg-forest text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between cursor-pointer hover:bg-forest-light transition-all border border-emerald-500/40 animate-in slide-in-from-bottom-3"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-900 flex items-center justify-center font-black text-xs">
                {cartCount}
              </div>
              <div>
                <span className="text-xs font-bold block">Items in AgroDirect Basket</span>
                <span className="text-[11px] text-emerald-300">Total: ₹{cart.reduce((s, i) => s + i.itemTotal, 0).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-300">
              <span>View Cart</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
