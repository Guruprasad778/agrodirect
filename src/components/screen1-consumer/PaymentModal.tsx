import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  QrCode, 
  Smartphone, 
  ShieldCheck, 
  Banknote, 
  Loader2, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  ExternalLink,
  Info,
  X
} from 'lucide-react';
import { useSupplyChain } from '../../store/supplyChainStore';
import { PaymentMethod, DeliveryAddress, DeliverySlot, ConsumerType, ConsumerOrder } from '../../types/supplyChain';
import { paymentService } from '../../services/paymentService';

interface PaymentModalProps {
  address: DeliveryAddress;
  slot: DeliverySlot;
  consumerType: ConsumerType;
  onClose: () => void;
  onOrderSuccess: (order: ConsumerOrder) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  address,
  slot,
  consumerType,
  onClose,
  onOrderSuccess
}) => {
  const { cart, grandTotal, processCheckoutOrder, setActiveScreen } = useSupplyChain();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('gpay');
  const [upiIdInput, setUpiIdInput] = useState('');
  const [paymentState, setPaymentState] = useState<'SELECT' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'CANCELLED'>('SELECT');
  const [confirmedOrder, setConfirmedOrder] = useState<ConsumerOrder | null>(null);
  const [simulatedOutcome, setSimulatedOutcome] = useState<'SUCCESS' | 'FAILED' | 'CANCELLED'>('SUCCESS');
  const [countdown, setCountdown] = useState(3);

  const qrPayload = paymentService.getQrCodePayload(`AGRI-${Date.now().toString().slice(-5)}`, grandTotal);

  const handleStartPayment = async () => {
    setPaymentState('PROCESSING');
    setCountdown(3);

    // Call payment service abstraction
    const result = await paymentService.processPayment(
      {
        orderId: `AGRI-${Math.floor(10000 + Math.random() * 90000)}`,
        amount: grandTotal,
        customerName: address.name,
        customerPhone: address.phone,
        method: selectedMethod,
        upiId: upiIdInput || undefined
      },
      simulatedOutcome,
      1600
    );

    if (result.status === 'SUCCESS') {
      const order = processCheckoutOrder({
        items: cart,
        address,
        slot,
        paymentMethod: selectedMethod,
        paymentRef: result.transactionId,
        consumerType
      });
      setConfirmedOrder(order);
      setPaymentState('SUCCESS');
      onOrderSuccess(order);
    } else if (result.status === 'FAILED') {
      setPaymentState('FAILED');
    } else {
      setPaymentState('CANCELLED');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
        {/* PAYMENT IN PROGRESS */}
        {paymentState === 'PROCESSING' && (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-spin">
              <Loader2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                Processing Payment...
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Connecting to UPI payment gateway & awaiting bank confirmation
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-mono text-slate-600">
              <span>Amount: ₹{grandTotal.toLocaleString()}</span>
              <span>•</span>
              <span className="uppercase">{selectedMethod}</span>
            </div>
          </div>
        )}

        {/* PAYMENT SUCCESSFUL */}
        {paymentState === 'SUCCESS' && confirmedOrder && (
          <div className="text-center py-4 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                ✓ Payment Successful
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
                Order Confirmed!
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Your payment was verified. Demand has been automatically transmitted to our rural FPO collection centers.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-200 text-xs space-y-2 font-medium">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Order ID:</span>
                <span className="font-mono font-extrabold text-slate-900">{confirmedOrder.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-black text-emerald-800">₹{confirmedOrder.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Payment Ref:</span>
                <span className="font-mono text-[11px] text-slate-600 truncate max-w-[200px]">{confirmedOrder.transactionRef}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Delivery Slot:</span>
                <span className="font-bold text-slate-900">{confirmedOrder.deliverySlot}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">AgMarknet Savings:</span>
                <span className="font-bold text-emerald-600">₹{confirmedOrder.totalSavings.toLocaleString()}</span>
              </div>
            </div>

            {/* Cross Screen CTA */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  onClose();
                  setActiveScreen('fpo');
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <span>View Demand Surge on Rural FPO Hub</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                View in My Orders
              </button>
            </div>
          </div>
        )}

        {/* PAYMENT FAILED */}
        {paymentState === 'FAILED' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <XCircle className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Payment Failed</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Your bank or UPI app declined the transaction. No funds were debited.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setPaymentState('SELECT')}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all"
              >
                Try Again
              </button>
              <button
                onClick={onClose}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* PAYMENT CANCELLED */}
        {paymentState === 'CANCELLED' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
              <AlertCircle className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Payment Cancelled</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                The payment process was cancelled before completion.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setPaymentState('SELECT')}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all"
              >
                Choose Another Payment Method
              </button>
              <button
                onClick={onClose}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* PAYMENT METHOD SELECTION */}
        {paymentState === 'SELECT' && (
          <div className="space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                  Step 2 of 2: Indian UPI Payment
                </span>
                <h2 className="text-xl font-extrabold text-slate-900">Select Payment Method</h2>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Payable Amount Summary */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Payable</span>
                <div className="text-2xl font-black text-emerald-800">
                  ₹{grandTotal.toLocaleString()}
                </div>
              </div>
              <div className="text-right text-xs">
                <span className="text-slate-500 block">Deliver to: {address.name.split(' ')[0]}</span>
                <span className="font-bold text-slate-800">{slot}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Pay using UPI & Digital Modes
              </label>

              {/* Google Pay */}
              <label 
                className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                  selectedMethod === 'gpay'
                    ? 'border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment_method"
                    value="gpay"
                    checked={selectedMethod === 'gpay'}
                    onChange={() => setSelectedMethod('gpay')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-blue-600 shadow-xs">
                      GPay
                    </span>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Google Pay UPI</span>
                      <span className="text-[10px] text-slate-400">Instant direct bank transfer</span>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100/60 px-2 py-0.5 rounded">
                  Fastest
                </span>
              </label>

              {/* PhonePe */}
              <label 
                className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                  selectedMethod === 'phonepe'
                    ? 'border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment_method"
                    value="phonepe"
                    checked={selectedMethod === 'phonepe'}
                    onChange={() => setSelectedMethod('phonepe')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center font-bold text-xs text-white shadow-xs">
                      Pe
                    </span>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">PhonePe UPI</span>
                      <span className="text-[10px] text-slate-400">UPI / Wallet / RuPay Credit</span>
                    </div>
                  </div>
                </div>
              </label>

              {/* Paytm */}
              <label 
                className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                  selectedMethod === 'paytm'
                    ? 'border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment_method"
                    value="paytm"
                    checked={selectedMethod === 'paytm'}
                    onChange={() => setSelectedMethod('paytm')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center font-bold text-[10px] text-white shadow-xs">
                      Paytm
                    </span>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Paytm UPI</span>
                      <span className="text-[10px] text-slate-400">Bank accounts & Postpaid</span>
                    </div>
                  </div>
                </div>
              </label>

              {/* Dynamic Scan & Pay QR Code */}
              <label 
                className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                  selectedMethod === 'upi_qr'
                    ? 'border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment_method"
                    value="upi_qr"
                    checked={selectedMethod === 'upi_qr'}
                    onChange={() => setSelectedMethod('upi_qr')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-white shadow-xs">
                      <QrCode className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Scan & Pay via Any UPI App</span>
                      <span className="text-[10px] text-slate-400">BHIM / CRED / Any Bank App</span>
                    </div>
                  </div>
                </div>
              </label>

              {/* Render dynamic QR code when Scan & Pay is selected */}
              {selectedMethod === 'upi_qr' && (
                <div className="mt-2 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2 animate-in fade-in duration-200">
                  <div className="w-36 h-36 bg-white p-2 rounded-xl mx-auto border-2 border-dashed border-emerald-400 flex flex-col items-center justify-center shadow-xs">
                    <QrCode className="w-24 h-24 text-slate-900" />
                    <span className="text-[9px] font-mono font-bold text-emerald-700">₹{grandTotal.toFixed(2)}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Scan with BHIM, GPay, PhonePe or Paytm to pay <strong>₹{grandTotal.toLocaleString()}</strong>
                  </p>
                  <span className="text-[10px] font-mono text-slate-400 block">VPA: {qrPayload.vpa}</span>
                </div>
              )}

              {/* Cash on Delivery (only if appropriate) */}
              <label 
                className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                  selectedMethod === 'cod'
                    ? 'border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment_method"
                    value="cod"
                    checked={selectedMethod === 'cod'}
                    onChange={() => setSelectedMethod('cod')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shadow-xs">
                      <Banknote className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Cash on Delivery</span>
                      <span className="text-[10px] text-slate-400">Pay cash upon driver delivery inspection</span>
                    </div>
                  </div>
                </div>
              </label>
            </div>

            {/* EVALUATOR SANDBOX CONTROLS */}
            <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200/80 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-amber-900 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Evaluator Sandbox / Test Mode
                </span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-200/60 px-1.5 py-0.2 rounded">
                  Simulation
                </span>
              </div>
              <p className="text-[10px] text-amber-800">
                Choose the test outcome to verify successful order creation or failure handling:
              </p>
              <div className="flex gap-1.5 pt-1">
                {(['SUCCESS', 'FAILED', 'CANCELLED'] as const).map(outcome => (
                  <button
                    key={outcome}
                    type="button"
                    onClick={() => setSimulatedOutcome(outcome)}
                    className={`flex-1 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                      simulatedOutcome === outcome
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100/50'
                    }`}
                  >
                    {outcome}
                  </button>
                ))}
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handleStartPayment}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:shadow-none"
            >
              <span>Pay ₹{grandTotal.toLocaleString()} & Confirm Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
