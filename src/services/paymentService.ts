/**
 * Indian Payment Gateway & UPI Service Layer (AgroDirect)
 * 
 * SECURITY & ARCHITECTURAL NOTE:
 * ==============================
 * Production payment gateways (e.g. Razorpay, Cashfree, PhonePe Payment Gateway)
 * require server-to-server signature verification and API secret keys.
 * NEVER store key_secret or private credentials in this frontend client code!
 * 
 * HOW TO CONNECT REAL PAYMENT GATEWAYS LATER:
 * -------------------------------------------
 * 1. Razorpay:
 *    - Backend creates order via `POST https://api.razorpay.com/v1/orders` using RAZORPAY_KEY_ID & RAZORPAY_SECRET.
 *    - Frontend loads `https://checkout.razorpay.com/v1/checkout.js` with only the public `key_id` and `order_id`.
 *    - Backend verifies `razorpay_signature` in webhook endpoint `/api/v1/payments/verify`.
 * 
 * 2. PhonePe Payment Gateway:
 *    - Backend computes SHA256(Base64Payload + "/pg/v1/pay" + SALT_KEY) and initiates `/pg/v1/pay`.
 *    - Opens PhonePe Intent URL on mobile or QR on desktop.
 * 
 * Below is the frontend abstraction providing realistic UPI Intent, Dynamic QR generation,
 * and an interactive developer Sandbox Test Mode.
 */

import { PaymentMethod } from '../types/supplyChain';

export interface PaymentInitiateRequest {
  orderId: string;
  amount: number;
  customerName: string;
  customerPhone: string;
  method: PaymentMethod;
  upiId?: string;
}

export interface PaymentTransactionResult {
  transactionId: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  status: 'SUCCESS' | 'FAILED' | 'CANCELLED';
  gatewayResponseCode: string;
  timestamp: string;
  failureReason?: string;
}

export const paymentService = {
  /**
   * Build standard Indian NPCI UPI Deep Link URI
   * Format: upi://pay?pa={VPA}&pn={NAME}&am={AMOUNT}&tr={TXN}&tn={NOTE}&cu=INR
   */
  generateUpiUri(orderId: string, amount: number, note = 'AgroDirect Farm Fresh Produce'): string {
    const vpa = 'agrodirect@icici';
    const payeeName = 'AgroDirect AgriTech';
    const params = new URLSearchParams({
      pa: vpa,
      pn: payeeName,
      am: amount.toFixed(2),
      tr: orderId,
      tn: note,
      cu: 'INR',
      mode: '02',
      orgid: '159781'
    });
    return `upi://pay?${params.toString()}`;
  },

  /**
   * Generate dynamic SVG QR code data or standard QR renderer input
   */
  getQrCodePayload(orderId: string, amount: number) {
    const uri = this.generateUpiUri(orderId, amount);
    return {
      uri,
      vpa: 'agrodirect@icici',
      accountName: 'AgroDirect AgriTech Ltd.',
      amount,
      orderId,
      generatedAt: new Date().toLocaleTimeString()
    };
  },

  /**
   * Simulate payment verification through gateway
   * In sandbox mode, evaluators can choose outcome or default to success
   */
  async processPayment(
    request: PaymentInitiateRequest,
    simulateOutcome: 'SUCCESS' | 'FAILED' | 'CANCELLED' = 'SUCCESS',
    latencyMs = 1500
  ): Promise<PaymentTransactionResult> {
    // Simulate real gateway network handshake
    await new Promise(resolve => setTimeout(resolve, latencyMs));

    const timestamp = new Date().toISOString();
    const txnId = `TXN-UPI-${Math.floor(100000000000 + Math.random() * 900000000000)}`;

    if (simulateOutcome === 'SUCCESS') {
      return {
        transactionId: txnId,
        orderId: request.orderId,
        amount: request.amount,
        method: request.method,
        status: 'SUCCESS',
        gatewayResponseCode: 'UPI_00_SUCCESS',
        timestamp
      };
    } else if (simulateOutcome === 'FAILED') {
      return {
        transactionId: txnId,
        orderId: request.orderId,
        amount: request.amount,
        method: request.method,
        status: 'FAILED',
        gatewayResponseCode: 'UPI_U30_DECLINED_BY_BANK',
        failureReason: 'Bank server timeout or insufficient balance in selected VPA',
        timestamp
      };
    } else {
      return {
        transactionId: txnId,
        orderId: request.orderId,
        amount: request.amount,
        method: request.method,
        status: 'CANCELLED',
        gatewayResponseCode: 'USER_ABORTED',
        failureReason: 'Customer aborted UPI app intent prompt',
        timestamp
      };
    }
  }
};
