import React from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  TrendingDown, 
  ShieldCheck, 
  Truck, 
  X,
  Store
} from 'lucide-react';
import { useSupplyChain } from '../../store/supplyChainStore';

interface CartPageProps {
  onClose?: () => void;
  onProceedToCheckout: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onClose, onProceedToCheckout }) => {
  const { 
    cart, 
    cartSubtotal, 
    cartSavings, 
    deliveryFee, 
    grandTotal, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart 
  } = useSupplyChain();

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center max-w-xl mx-auto my-8 shadow-xs space-y-4">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-extrabold text-slate-900">Your Basket is Empty</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Explore farm-fresh produce direct from certified FPOs with guaranteed Grade A quality and AgMarknet benchmark savings.
        </p>
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
        >
          <Store className="w-4 h-4" />
          <span>Browse Fresh Produce</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-2xl mx-auto my-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Cart Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Your Fresh Cart</h2>
            <p className="text-[11px] text-slate-500">{cart.length} unique produce item(s) selected</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearCart}
            className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
          >
            Clear All
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Cart Items List */}
      <div className="divide-y divide-slate-100 max-h-[50vh] overflow-y-auto p-4 sm:p-6 space-y-3">
        {cart.map((item) => {
          const unitSavings = Math.max(0, item.marketPrice - item.pricePerUnit);
          const totalItemSavings = unitSavings * item.quantity;

          return (
            <div 
              key={item.productId}
              className="pt-3 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
            >
              {/* Product Info */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {item.productName}
                    </h4>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {item.qualityGrade}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">
                    {item.variety} • <span className="text-slate-400">{item.sourceFpoName}</span>
                  </p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xs font-black text-emerald-800">
                      ₹{item.pricePerUnit}/{item.unit}
                    </span>
                    <span className="text-[10px] text-slate-400 line-through">
                      ₹{item.marketPrice}/{item.unit}
                    </span>
                    {totalItemSavings > 0 && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                        Save ₹{totalItemSavings}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity Stepper & Item Total */}
              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                  <button
                    onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                    className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shadow-xs transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-xs font-black text-slate-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-[70px]">
                  <span className="text-sm font-extrabold text-slate-900 block">
                    ₹{item.itemTotal.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {item.quantity} {item.unit}
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="text-slate-300 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bill Breakdown & Checkout Footer */}
      <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
        {/* Bill Summary */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Produce Subtotal:</span>
            <span className="font-bold text-slate-900">₹{cartSubtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-slate-600">
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              Delivery Fee (Indiranagar Chilled Hub):
            </span>
            {deliveryFee === 0 ? (
              <span className="font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                FREE Delivery
              </span>
            ) : (
              <span className="font-bold text-slate-900">₹{deliveryFee}</span>
            )}
          </div>

          {cartSavings > 0 && (
            <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50/80 p-2 rounded-xl border border-emerald-100">
              <span className="flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" />
                AgMarknet 2.0 Mandi Benchmark Savings:
              </span>
              <span className="font-black">₹{cartSavings.toLocaleString()}</span>
            </div>
          )}

          <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-slate-900">
            <div>
              <span className="text-sm font-extrabold">Grand Total:</span>
              <p className="text-[10px] text-slate-400">Inclusive of cold-chain handling & GST</p>
            </div>
            <span className="text-2xl font-black text-emerald-800">
              ₹{grandTotal.toLocaleString()}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onProceedToCheckout}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:shadow-none"
        >
          <span>Proceed to Delivery & Payment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
