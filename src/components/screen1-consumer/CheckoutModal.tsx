import React, { useState } from 'react';
import { 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Building, 
  ShieldCheck, 
  ArrowRight, 
  X,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useSupplyChain } from '../../store/supplyChainStore';
import { DeliverySlot, DeliveryAddress, ConsumerType } from '../../types/supplyChain';

interface CheckoutModalProps {
  onClose: () => void;
  onProceedToPayment: (data: {
    address: DeliveryAddress;
    slot: DeliverySlot;
    consumerType: ConsumerType;
  }) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose, onProceedToPayment }) => {
  const { 
    cart, 
    cartSubtotal, 
    deliveryFee, 
    grandTotal, 
    deliveryAddress, 
    setDeliveryAddress 
  } = useSupplyChain();

  const [name, setName] = useState(deliveryAddress.name || 'Nandi Grand Tiffin Center');
  const [phone, setPhone] = useState(deliveryAddress.phone || '+91 98451 90234');
  const [address, setAddress] = useState(deliveryAddress.address || '42, 100ft Road, HAL 2nd Stage, Indiranagar');
  const [city, setCity] = useState(deliveryAddress.city || 'Bengaluru');
  const [pincode, setPincode] = useState(deliveryAddress.pincode || '560038');
  const [saveAddress, setSaveAddress] = useState(deliveryAddress.saveAddress ?? true);

  const [selectedSlot, setSelectedSlot] = useState<DeliverySlot>('Tomorrow Morning');
  const [buyerType, setBuyerType] = useState<ConsumerType>('Restaurant');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!phone.trim() || phone.length < 10) errs.phone = 'Valid 10-digit mobile number required';
    if (!address.trim()) errs.address = 'Street address is required';
    if (!pincode.trim() || pincode.length < 6) errs.pincode = 'Valid 6-digit PIN code required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const validatedAddress: DeliveryAddress = {
      name,
      phone,
      address,
      city,
      pincode,
      saveAddress
    };

    setDeliveryAddress(validatedAddress);

    onProceedToPayment({
      address: validatedAddress,
      slot: selectedSlot,
      consumerType: buyerType
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
              Step 1 of 2: Fulfilment Details
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
              Delivery Address & Slotting
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleContinue} className="mt-5 space-y-5">
          {/* Institution / Buyer Profile */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Customer / Institutional Profile
            </label>
            <select
              value={buyerType}
              onChange={(e) => setBuyerType(e.target.value as ConsumerType)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="Restaurant">Restaurant (Bulk Kitchen)</option>
              <option value="Hostel">Hostel / College Mess</option>
              <option value="Temple">Temple / Community Kitchen</option>
              <option value="Corporate Canteen">Corporate Tech Park Canteen</option>
              <option value="PG">PG Community</option>
              <option value="Household">Household Consumer</option>
            </select>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name / Organization *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Reddy / Nandi Kitchen"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              {errors.name && <span className="text-[10px] text-rose-500 mt-0.5 block">{errors.name}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile Number *
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98451 XXXXX"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-mono"
              />
              {errors.phone && <span className="text-[10px] text-rose-500 mt-0.5 block">{errors.phone}</span>}
            </div>
          </div>

          {/* Street Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Delivery Address (Building, Street, Landmark) *
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 42, 100ft Rd, near Metro Pillar 124"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            {errors.address && <span className="text-[10px] text-rose-500 mt-0.5 block">{errors.address}</span>}
          </div>

          {/* City & PIN Code */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City / Urban Hub
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                PIN Code *
              </label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none font-mono"
              />
              {errors.pincode && <span className="text-[10px] text-rose-500 mt-0.5 block">{errors.pincode}</span>}
            </div>
          </div>

          {/* Save Address Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
            <input
              type="checkbox"
              checked={saveAddress}
              onChange={(e) => setSaveAddress(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
            />
            <span>Save this address for future AgroDirect orders</span>
          </label>

          {/* Delivery Slot Selection */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Select Delivery Slot
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Tomorrow Morning', 'Tomorrow Afternoon', 'Tomorrow Evening'] as DeliverySlot[]).map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-3 rounded-2xl text-left border text-xs transition-all ${
                    selectedSlot === slot
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-500 ring-2 ring-emerald-500/20 font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <span className="block font-bold truncate">{slot.replace('Tomorrow ', '')}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {slot === 'Tomorrow Morning' ? '06:00 - 09:00 AM' : slot === 'Tomorrow Afternoon' ? '12:00 - 03:00 PM' : '05:00 - 08:00 PM'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Order Summary Strip */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">{cart.length} item(s) • Tomorrow Delivery</span>
              <span className="font-extrabold text-slate-900 text-sm">
                Payable: ₹{grandTotal.toLocaleString()}
              </span>
            </div>

            <button
              type="submit"
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
            >
              <span>Continue to Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
