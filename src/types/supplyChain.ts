export type ConsumerType = 
  | 'Household' 
  | 'Hostel' 
  | 'PG' 
  | 'Temple' 
  | 'Restaurant' 
  | 'Corporate Canteen';

export type DeliverySlot = 
  | 'Tomorrow Morning' 
  | 'Tomorrow Afternoon' 
  | 'Tomorrow Evening';

export type OrderStatus = 
  | 'Order Confirmed'
  | 'Pending FPO' 
  | 'Harvest Assigned' 
  | 'In Transit to Hub' 
  | 'Sorting at Dark Store' 
  | 'Out for Delivery' 
  | 'Delivered';

export type PaymentStatus = 'Paid' | 'Pre-Authorized' | 'Pending' | 'Failed' | 'Cancelled';

export type PaymentMethod = 
  | 'gpay' 
  | 'phonepe' 
  | 'paytm' 
  | 'upi_id' 
  | 'upi_qr' 
  | 'cod';

export interface DeliveryAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  saveAddress?: boolean;
}

export interface CartItem {
  productId: string;
  productName: string;
  variety: string;
  qualityGrade: string;
  unit: string;
  image: string;
  pricePerUnit: number;
  marketPrice: number;
  quantity: number;
  itemTotal: number;
  sourceFpoName: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  platformPrice: number;
  marketPrice: number;
}

export interface ConsumerOrder {
  id: string;
  consumerId: string;
  consumerName: string;
  consumerType: ConsumerType;
  location: string;
  deliveryAddress?: DeliveryAddress;
  items: OrderItem[];
  totalQuantity: number;
  totalAmount: number;
  totalSavings: number;
  orderDate: string;
  deliverySlot: DeliverySlot;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  transactionRef?: string;
  assignedFpoId?: string;
  assignedDarkStoreId?: string;
  assignedDriverId?: string;
  stopSequence?: number;
  eta?: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'Vegetables' | 'Staples' | 'Fruits' | 'Dairy';
  variety: string;
  currentMarketPrice: number; // AgMarknet 2.0 reference price (₹/kg) - benchmark ONLY
  platformPrice: number;       // Direct platform selling price (₹/kg) - 100% ADMIN CONTROLLED
  unit: string;
  availableQuantity: number;
  demand: number;
  expectedDemand: number;
  qualityGrade: 'Grade A' | 'Grade B' | 'Grade C';
  sourceFpoId: string;
  sourceFpoName: string;
  sourceLocation: string;
  description: string;
  image: string;
  mandiBenchmarkLocation: string;
  shelfLifeDays: number;
  inStock?: boolean;
}

export interface Farmer {
  id: string;
  name: string;
  village: string;
  district: string;
  fpoId: string;
  fpoName: string;
  crop: string;
  harvestQuantity: number;
  qualityGrade: string;
  expectedPayout: number;
  payoutStatus: 'Pending Grading' | 'Ready for Digital Payout' | 'Paid';
  upiId: string;
  phone: string;
  paidAt?: string;
  transactionRef?: string;
}

export interface FPO {
  id: string;
  name: string;
  location: string;
  district: string;
  state: string;
  farmersCount: number;
  incomingDemandKg: number;
  harvestRequirementKg: number;
  availableStockKg: number;
  pendingBatchesCount: number;
  completedBatchesCount: number;
  totalPayoutsDisbursed: number;
}

export interface ComputerVisionInspection {
  qualityScore: number;       // 0-100
  grade: 'A' | 'B' | 'C';
  size: 'Small' | 'Medium' | 'Large';
  colorUniformity: string;    // e.g. "95%"
  defectRate: string;         // e.g. "2.1%"
  defectDetails: string[];
  status: 'Accepted' | 'Rejected' | 'Pending Review';
  assayTimestamp: string;
  modelConfidence: string;    // e.g. "98.4%"
}

export interface HarvestBatch {
  id: string;
  productId: string;
  productName: string;
  farmerId: string;
  farmerName: string;
  fpoId: string;
  fpoName: string;
  quantityKg: number;
  acceptedQuantityKg: number;
  harvestDate: string;
  expectedDelivery: string;
  qualityGrade: 'Grade A' | 'Grade B' | 'Grade C';
  cvGrading: ComputerVisionInspection;
  pricePerKg: number;
  payoutAmount: number;
  payoutStatus: 'Pending Grading' | 'Ready for Digital Payout' | 'Paid';
  batchStatus: 'Harvested' | 'Quality Checked' | 'In Transit' | 'Received at Hub' | 'Sorted & Slotted';
  linkedOrderId?: string;
  transactionId?: string;
  dispatchedToHub?: string;
}

export type SortingStage = 
  | 'Received' 
  | 'Quality Checked' 
  | 'Sorted' 
  | 'Packed' 
  | 'Slotted' 
  | 'Ready';

export interface DarkStoreHub {
  id: string;
  name: string;
  location: string;
  incomingBatchesCount: number;
  todayOrdersCount: number;
  ordersReadyCount: number;
  dispatchPendingCount: number;
  inventoryKg: Record<string, number>;
  maxCapacityKg: Record<string, number>;
  slots: {
    morning: number;
    afternoon: number;
    evening: number;
  };
}

export interface DeliveryStop {
  stopNumber: number;
  orderId: string;
  customerName: string;
  customerType: ConsumerType;
  address: string;
  landmark: string;
  productSummary: string;
  weightKg: number;
  eta: string;
  status: 'Pending' | 'En Route' | 'Delivered';
  lat: number;
  lng: number;
  deliveredAt?: string;
  signatureRequired: boolean;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  vehicleNumber: string;
  currentLocationName: string;
  status: 'Idle' | 'On Route' | 'Completed';
  totalStops: number;
  completedStops: number;
  distanceKm: number;
  estimatedTime: string;
  vehicleCapacityKg: number;
  capacityUsedKg: number;
  capacityPercent: number;
  stops: DeliveryStop[];
}

export interface DemandForecastPoint {
  date: string;
  day: string;
  historicalKg?: number;
  currentDemandKg?: number;
  forecastKg?: number;
  lowerBoundKg?: number;
  upperBoundKg?: number;
}
