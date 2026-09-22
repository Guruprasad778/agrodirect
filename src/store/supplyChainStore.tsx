import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Product, 
  Farmer, 
  FPO, 
  HarvestBatch, 
  DarkStoreHub, 
  Driver, 
  ConsumerOrder, 
  DemandForecastPoint,
  DeliverySlot,
  ConsumerType,
  SortingStage,
  CartItem,
  DeliveryAddress,
  PaymentMethod
} from '../types/supplyChain';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_FPOS, 
  INITIAL_FARMERS, 
  INITIAL_BATCHES, 
  INITIAL_DARK_STORE, 
  INITIAL_CONSUMER_ORDERS, 
  INITIAL_DRIVER,
  INITIAL_DEMAND_FORECAST 
} from '../data/mockData';
import { demandForecastService } from '../services/demandForecastService';
import { qualityGradingService } from '../services/qualityGradingService';

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'info' | 'warning' | 'payment';
  timestamp: string;
}

interface SupplyChainContextType {
  // Data entities
  products: Product[];
  fpos: FPO[];
  farmers: Farmer[];
  batches: HarvestBatch[];
  darkStore: DarkStoreHub;
  driver: Driver;
  orders: ConsumerOrder[];
  forecastData: DemandForecastPoint[];
  toasts: ToastMessage[];

  // E-Commerce Cart & Checkout State
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  cartSavings: number;
  deliveryFee: number;
  grandTotal: number;
  deliveryAddress: DeliveryAddress;
  setDeliveryAddress: (address: DeliveryAddress) => void;

  // Modals & Active View Controls
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAdminPriceControlOpen: boolean;
  setIsAdminPriceControlOpen: (open: boolean) => void;

  // Cart Operations
  addToCart: (product: Product, quantityKg: number) => void;
  updateCartQuantity: (productId: string, quantityKg: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;

  // Checkout Execution
  processCheckoutOrder: (params: {
    items: CartItem[];
    address: DeliveryAddress;
    slot: DeliverySlot;
    paymentMethod: PaymentMethod;
    paymentRef: string;
    consumerType?: ConsumerType;
  }) => ConsumerOrder;

  // Admin / Developer Price & Product Management (Section 16)
  updateProductPrice: (productId: string, newSellingPrice: number) => void;
  updateProductDetails: (productId: string, updates: Partial<Product>) => void;
  addNewProduct: (productData: Omit<Product, 'id'>) => Product;

  // UI state
  activeScreen: 'consumer' | 'fpo' | 'darkstore' | 'driver';
  setActiveScreen: (screen: 'consumer' | 'fpo' | 'darkstore' | 'driver') => void;
  viewMode: 'desktop' | 'mobile';
  setViewMode: (mode: 'desktop' | 'mobile') => void;
  demoStep: number;
  isDemoRunning: boolean;

  // Legacy Pre-order compatibility
  placePreOrder: (params: {
    productId: string;
    quantityKg: number;
    deliverySlot: DeliverySlot;
    consumerType: ConsumerType;
    consumerName: string;
    location: string;
  }) => ConsumerOrder;
  
  gradeBatch: (batchId: string) => Promise<void>;
  triggerFarmerPayout: (batchId: string) => Promise<void>;
  advanceBatchToHub: (batchId: string) => void;
  updateSortingStage: (batchId: string, stage: SortingStage) => void;
  assignBatchToSlot: (batchId: string, slot: 'morning' | 'afternoon' | 'evening') => void;
  markDeliveryCompleted: (orderId: string) => void;
  
  // Presentation / Demo controls
  runDemoStep: (stepNumber: number) => Promise<void>;
  startAutoDemo: () => void;
  stopAutoDemo: () => void;
  resetAllData: () => void;
  dismissToast: (id: string) => void;
}

const SupplyChainContext = createContext<SupplyChainContextType | undefined>(undefined);

const DEFAULT_ADDRESS: DeliveryAddress = {
  name: 'Nandi Grand Tiffin Center',
  phone: '+91 98451 90234',
  address: '42, 100ft Road, HAL 2nd Stage, Indiranagar',
  city: 'Bengaluru',
  pincode: '560038',
  saveAddress: true
};

export const SupplyChainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load products (supporting admin price overrides from localStorage if present)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('agrodirect_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [fpos, setFpos] = useState<FPO[]>(INITIAL_FPOS);
  const [farmers, setFarmers] = useState<Farmer[]>(INITIAL_FARMERS);
  const [batches, setBatches] = useState<HarvestBatch[]>(INITIAL_BATCHES);
  const [darkStore, setDarkStore] = useState<DarkStoreHub>(INITIAL_DARK_STORE);
  const [driver, setDriver] = useState<Driver>(INITIAL_DRIVER);

  // Orders initialized from mock + localStorage
  const [orders, setOrders] = useState<ConsumerOrder[]>(() => {
    try {
      const saved = localStorage.getItem('agrodirect_orders');
      return saved ? JSON.parse(saved) : INITIAL_CONSUMER_ORDERS;
    } catch {
      return INITIAL_CONSUMER_ORDERS;
    }
  });

  const [forecastData, setForecastData] = useState<DemandForecastPoint[]>(INITIAL_DEMAND_FORECAST);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Cart initialized from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('agrodirect_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Saved Delivery Address
  const [deliveryAddress, setDeliveryAddressState] = useState<DeliveryAddress>(() => {
    try {
      const saved = localStorage.getItem('agrodirect_address');
      return saved ? JSON.parse(saved) : DEFAULT_ADDRESS;
    } catch {
      return DEFAULT_ADDRESS;
    }
  });

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminPriceControlOpen, setIsAdminPriceControlOpen] = useState(false);

  // Navigation and demo states
  const [activeScreen, setActiveScreen] = useState<'consumer' | 'fpo' | 'darkstore' | 'driver'>('consumer');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [demoStep, setDemoStep] = useState<number>(1);
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);

  // Sync Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('agrodirect_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [cart]);

  // Sync Orders to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('agrodirect_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('Could not save orders to localStorage', e);
    }
  }, [orders]);

  // Sync Products to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('agrodirect_products', JSON.stringify(products));
    } catch (e) {
      console.warn('Could not save products to localStorage', e);
    }
  }, [products]);

  const setDeliveryAddress = (addr: DeliveryAddress) => {
    setDeliveryAddressState(addr);
    if (addr.saveAddress) {
      localStorage.setItem('agrodirect_address', JSON.stringify(addr));
    }
  };

  const addToast = (title: string, description: string, type: 'success' | 'info' | 'warning' | 'payment' = 'info') => {
    const newToast: ToastMessage = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      description,
      type,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setToasts(prev => [newToast, ...prev.slice(0, 4)]);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  /* =========================================================================
   * 1. CART COMPUTATIONS & OPERATIONS
   * ========================================================================= */
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);
  const cartSavings = cart.reduce((sum, item) => {
    const unitSaving = Math.max(0, item.marketPrice - item.pricePerUnit);
    return sum + (unitSaving * item.quantity);
  }, 0);
  // Free delivery for orders >= ₹499, otherwise ₹40
  const deliveryFee = cartSubtotal === 0 || cartSubtotal >= 499 ? 0 : 40;
  const grandTotal = cartSubtotal + deliveryFee;

  const addToCart = (product: Product, quantityKg: number) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.productId === product.id);
      if (existingIndex > -1) {
        // Increase quantity of existing product
        const updated = [...prev];
        const current = updated[existingIndex];
        const newQty = current.quantity + quantityKg;
        updated[existingIndex] = {
          ...current,
          quantity: newQty,
          itemTotal: newQty * current.pricePerUnit
        };
        return updated;
      } else {
        // Add new cart item with the latest admin-configured selling price
        const newItem: CartItem = {
          productId: product.id,
          productName: product.name,
          variety: product.variety,
          qualityGrade: product.qualityGrade,
          unit: product.unit,
          image: product.image,
          pricePerUnit: product.platformPrice,
          marketPrice: product.currentMarketPrice,
          quantity: quantityKg,
          itemTotal: quantityKg * product.platformPrice,
          sourceFpoName: product.sourceFpoName
        };
        return [...prev, newItem];
      }
    });

    addToast(
      'Added to Cart',
      `✓ ${product.name} (${quantityKg} ${product.unit}) added to cart`,
      'success'
    );
  };

  const updateCartQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        return {
          ...item,
          quantity: newQuantity,
          itemTotal: newQuantity * item.pricePerUnit
        };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => {
    const target = cart.find(i => i.productId === productId);
    setCart(prev => prev.filter(item => item.productId !== productId));
    if (target) {
      addToast('Cart Updated', `Removed ${target.productName} from cart`, 'info');
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  /* =========================================================================
   * 2. CHECKOUT & FPO SUPPLY CHAIN INTEGRATION
   * ========================================================================= */
  const processCheckoutOrder = ({
    items,
    address,
    slot,
    paymentMethod,
    paymentRef,
    consumerType = 'Household'
  }: {
    items: CartItem[];
    address: DeliveryAddress;
    slot: DeliverySlot;
    paymentMethod: PaymentMethod;
    paymentRef: string;
    consumerType?: ConsumerType;
  }): ConsumerOrder => {
    const newOrderId = `AGRI-${Math.floor(10000 + Math.random() * 90000)}`;
    const totalQty = items.reduce((sum, it) => sum + it.quantity, 0);
    const subtotal = items.reduce((sum, it) => sum + it.itemTotal, 0);
    const fee = subtotal >= 499 ? 0 : 40;
    const finalTotal = subtotal + fee;
    const totalSavings = items.reduce((sum, it) => {
      return sum + (Math.max(0, it.marketPrice - it.pricePerUnit) * it.quantity);
    }, 0);

    const orderItems = items.map(it => ({
      productId: it.productId,
      productName: it.productName,
      quantity: it.quantity,
      unit: it.unit,
      platformPrice: it.pricePerUnit,
      marketPrice: it.marketPrice
    }));

    const newOrder: ConsumerOrder = {
      id: newOrderId,
      consumerId: `CONS-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      consumerName: address.name,
      consumerType,
      location: `${address.address}, ${address.city} - ${address.pincode}`,
      deliveryAddress: address,
      items: orderItems,
      totalQuantity: totalQty,
      totalAmount: finalTotal,
      totalSavings,
      orderDate: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      deliverySlot: slot,
      status: 'Order Confirmed',
      paymentStatus: 'Paid',
      paymentMethod,
      transactionRef: paymentRef,
      assignedDarkStoreId: 'DS-BLR-01',
      assignedDriverId: 'DRV-ARUN-01',
      stopSequence: driver.stops.length + 1,
      eta: slot === 'Tomorrow Morning' ? '08:50 AM' : '02:30 PM'
    };

    // 1. Add to active orders
    setOrders(prev => [newOrder, ...prev]);

    // 2. Clear Cart
    clearCart();

    // 3. PROPAGATE TO FPO & SUPPLY CHAIN DATA LAYER
    items.forEach(cartItem => {
      const prod = products.find(p => p.id === cartItem.productId);
      const fpoId = prod?.sourceFpoId || 'FPO-KLR-01';
      const fpoName = prod?.sourceFpoName || 'Kolar Horti Farmers FPO';

      // Update Product Demand
      setProducts(prev => prev.map(p => {
        if (p.id === cartItem.productId) {
          return {
            ...p,
            demand: p.demand + cartItem.quantity,
            expectedDemand: p.expectedDemand + Math.round(cartItem.quantity * 1.1)
          };
        }
        return p;
      }));

      // Update FPO Demand & Harvest Requirement
      setFpos(prev => prev.map(f => {
        if (f.id === fpoId) {
          return {
            ...f,
            incomingDemandKg: f.incomingDemandKg + cartItem.quantity,
            harvestRequirementKg: f.harvestRequirementKg + cartItem.quantity,
            pendingBatchesCount: f.pendingBatchesCount + 1
          };
        }
        return f;
      }));

      // Recalculate AI forecast point
      setForecastData(prev => demandForecastService.projectDemandWithNewOrder(prev, cartItem.quantity));

      // Queue new linked harvest batch for FPO inspection
      const newBatchId = `HB-${1040 + batches.length + 1}`;
      const newBatch: HarvestBatch = {
        id: newBatchId,
        productId: cartItem.productId,
        productName: cartItem.productName,
        farmerId: 'FARM-01',
        farmerName: 'Ramesh Kumar',
        fpoId,
        fpoName,
        quantityKg: cartItem.quantity,
        acceptedQuantityKg: Math.max(1, Math.round(cartItem.quantity * 0.98)),
        harvestDate: new Date().toISOString().split('T')[0],
        expectedDelivery: 'Tomorrow',
        qualityGrade: 'Grade A',
        pricePerKg: cartItem.pricePerUnit,
        payoutAmount: Math.round(cartItem.quantity * 0.98 * cartItem.pricePerUnit),
        payoutStatus: 'Pending Grading',
        batchStatus: 'Harvested',
        linkedOrderId: newOrderId,
        cvGrading: {
          qualityScore: 92,
          grade: 'A',
          size: 'Medium',
          colorUniformity: '95%',
          defectRate: '2.1%',
          defectDetails: ['Minor surface scuff (1.2%)'],
          status: 'Accepted',
          assayTimestamp: 'Ready for CV Assaying',
          modelConfidence: '98.4%'
        }
      };
      setBatches(prevBatches => [newBatch, ...prevBatches]);
    });

    addToast(
      'Order Confirmed & Routed to FPO',
      `Order ${newOrderId} placed successfully via ${paymentMethod.toUpperCase()} (${paymentRef})`,
      'payment'
    );

    return newOrder;
  };

  /* =========================================================================
   * 3. DEVELOPER / ADMIN SELLING PRICE & PRODUCT MANAGEMENT (SECTION 16)
   * ========================================================================= */
  const updateProductPrice = (productId: string, newSellingPrice: number) => {
    if (newSellingPrice < 0) return;

    // 1. Update product catalog price
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          platformPrice: newSellingPrice
        };
      }
      return p;
    }));

    // 2. IMMEDIATELY RECALCULATE CART ITEMS
    setCart(prevCart => prevCart.map(item => {
      if (item.productId === productId) {
        return {
          ...item,
          pricePerUnit: newSellingPrice,
          itemTotal: item.quantity * newSellingPrice
        };
      }
      return item;
    }));

    const prod = products.find(p => p.id === productId);
    addToast(
      'Developer Price Updated',
      `${prod?.name || 'Product'} selling price set to ₹${newSellingPrice}/kg. Reflected in Cart & Catalog.`,
      'info'
    );
  };

  const updateProductDetails = (productId: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          ...updates
        };
      }
      return p;
    }));

    // If name or variety changed, sync with cart
    if (updates.name || updates.qualityGrade) {
      setCart(prevCart => prevCart.map(item => {
        if (item.productId === productId) {
          return {
            ...item,
            productName: updates.name || item.productName,
            qualityGrade: updates.qualityGrade || item.qualityGrade
          };
        }
        return item;
      }));
    }

    addToast('Product Updated', 'Product details saved successfully', 'success');
  };

  const addNewProduct = (newProductData: Omit<Product, 'id'>): Product => {
    const newId = `PROD-${newProductData.name.toUpperCase().replace(/\s+/g, '-').slice(0, 10)}-${Math.floor(100 + Math.random() * 900)}`;
    const fullProduct: Product = {
      ...newProductData,
      id: newId,
      inStock: true
    };

    setProducts(prev => [fullProduct, ...prev]);
    addToast('New Commodity Added', `${fullProduct.name} is now live on AgroDirect catalog`, 'success');
    return fullProduct;
  };

  /* =========================================================================
   * 4. LEGACY PRE-ORDER & SUPPLY CHAIN STEPS
   * ========================================================================= */
  const placePreOrder = ({
    productId,
    quantityKg,
    deliverySlot,
    consumerType,
    consumerName,
    location
  }: {
    productId: string;
    quantityKg: number;
    deliverySlot: DeliverySlot;
    consumerType: ConsumerType;
    consumerName: string;
    location: string;
  }): ConsumerOrder => {
    const product = products.find(p => p.id === productId) || products[0];
    const dummyCartItem: CartItem = {
      productId: product.id,
      productName: product.name,
      variety: product.variety,
      qualityGrade: product.qualityGrade,
      unit: product.unit,
      image: product.image,
      pricePerUnit: product.platformPrice,
      marketPrice: product.currentMarketPrice,
      quantity: quantityKg,
      itemTotal: quantityKg * product.platformPrice,
      sourceFpoName: product.sourceFpoName
    };

    return processCheckoutOrder({
      items: [dummyCartItem],
      address: {
        name: consumerName,
        phone: '+91 98451 22345',
        address: location,
        city: 'Bengaluru',
        pincode: '560038',
        saveAddress: false
      },
      slot: deliverySlot,
      paymentMethod: 'upi_id',
      paymentRef: `UPI-DIR-${Math.floor(100000 + Math.random() * 900000)}`,
      consumerType
    });
  };

  const gradeBatch = async (batchId: string) => {
    const targetBatch = batches.find(b => b.id === batchId);
    if (!targetBatch) return;

    addToast('OpenCV Assaying Started', `Running computer vision inspection on Batch ${batchId}...`, 'info');
    const cvResult = await qualityGradingService.assayBatch(batchId, targetBatch.productName);

    setBatches(prev => prev.map(b => {
      if (b.id === batchId) {
        return {
          ...b,
          cvGrading: cvResult,
          qualityScore: cvResult.qualityScore,
          batchStatus: 'Quality Checked',
          payoutStatus: 'Ready for Digital Payout'
        };
      }
      return b;
    }));

    addToast(
      'Quality Inspection Passed', 
      `Batch ${batchId} verified: Grade ${cvResult.grade}, Score ${cvResult.qualityScore}/100 (Defect: ${cvResult.defectRate})`,
      'success'
    );
  };

  const triggerFarmerPayout = async (batchId: string) => {
    const targetBatch = batches.find(b => b.id === batchId);
    if (!targetBatch) return;

    const txnRef = `UPI-${Math.floor(100000000000 + Math.random() * 900000000000)}`;

    setBatches(prev => prev.map(b => {
      if (b.id === batchId) {
        return {
          ...b,
          payoutStatus: 'Paid',
          transactionId: txnRef,
          batchStatus: 'In Transit',
          dispatchedToHub: 'DS-BLR-01'
        };
      }
      return b;
    }));

    setFarmers(prev => prev.map(f => {
      if (f.id === targetBatch.farmerId) {
        return {
          ...f,
          payoutStatus: 'Paid',
          paidAt: new Date().toLocaleTimeString(),
          transactionRef: txnRef
        };
      }
      return f;
    }));

    setFpos(prev => prev.map(f => {
      if (f.id === targetBatch.fpoId) {
        return {
          ...f,
          totalPayoutsDisbursed: f.totalPayoutsDisbursed + targetBatch.payoutAmount,
          completedBatchesCount: f.completedBatchesCount + 1,
          pendingBatchesCount: Math.max(0, f.pendingBatchesCount - 1)
        };
      }
      return f;
    }));

    if (targetBatch.linkedOrderId) {
      setOrders(prev => prev.map(ord => {
        if (ord.id === targetBatch.linkedOrderId) {
          return { ...ord, status: 'In Transit to Hub' };
        }
        return ord;
      }));
    }

    setDarkStore(prev => ({
      ...prev,
      incomingBatchesCount: prev.incomingBatchesCount + 1
    }));

    addToast(
      'Digital Payout Disbursed', 
      `₹${targetBatch.payoutAmount.toLocaleString()} credited to ${targetBatch.farmerName} via UPI (${txnRef})`,
      'payment'
    );
  };

  const advanceBatchToHub = (batchId: string) => {
    const targetBatch = batches.find(b => b.id === batchId);
    if (!targetBatch) return;

    setBatches(prev => prev.map(b => {
      if (b.id === batchId) {
        return { ...b, batchStatus: 'Received at Hub' };
      }
      return b;
    }));

    setDarkStore(prev => {
      const currentQty = prev.inventoryKg[targetBatch.productName] || 0;
      return {
        ...prev,
        inventoryKg: {
          ...prev.inventoryKg,
          [targetBatch.productName]: currentQty + targetBatch.acceptedQuantityKg
        },
        incomingBatchesCount: Math.max(0, prev.incomingBatchesCount - 1)
      };
    });

    if (targetBatch.linkedOrderId) {
      setOrders(prev => prev.map(ord => {
        if (ord.id === targetBatch.linkedOrderId) {
          return { ...ord, status: 'Sorting at Dark Store' };
        }
        return ord;
      }));
    }

    addToast(
      'Freight Inwarded at Dark Store', 
      `Batch ${batchId} (${targetBatch.acceptedQuantityKg}kg ${targetBatch.productName}) unloaded at Indiranagar MFC-04`,
      'success'
    );
  };

  const updateSortingStage = (batchId: string, _stage: SortingStage) => {
    addToast('Sorting Workflow Updated', `Batch ${batchId} moved to stage: ${_stage}`, 'info');
  };

  const assignBatchToSlot = (_batchId: string, slot: 'morning' | 'afternoon' | 'evening') => {
    setDarkStore(prev => ({
      ...prev,
      slots: {
        ...prev.slots,
        [slot]: prev.slots[slot] + 1
      },
      ordersReadyCount: prev.ordersReadyCount + 1,
      dispatchPendingCount: Math.max(0, prev.dispatchPendingCount - 1)
    }));

    addToast('Order Slotted & Dispatched', `Assigned to ${slot.toUpperCase()} delivery fleet`, 'success');
  };

  const markDeliveryCompleted = (orderId: string) => {
    setDriver(prev => {
      const updatedStops = prev.stops.map(stop => {
        if (stop.orderId === orderId) {
          return { ...stop, status: 'Delivered' as const, deliveredAt: new Date().toLocaleTimeString() };
        }
        return stop;
      });
      const completedCount = updatedStops.filter(s => s.status === 'Delivered').length;
      return {
        ...prev,
        stops: updatedStops,
        completedStops: completedCount,
        status: completedCount === updatedStops.length ? 'Completed' : 'On Route'
      };
    });

    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: 'Delivered',
          eta: 'Delivered at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return order;
    }));

    addToast(
      'Delivery Completed', 
      `Order ${orderId} delivered and verified via digital POD`,
      'success'
    );
  };

  /* =========================================================================
   * 5. PRESENTATION / DEMO CONTROLLER
   * ========================================================================= */
  const runDemoStep = async (stepNumber: number) => {
    setDemoStep(stepNumber);

    switch (stepNumber) {
      case 1:
        setActiveScreen('consumer');
        addToast('Demo Step 1', 'AgroDirect: Discover fresh farm produce & AgMarknet 2.0 price comparison', 'info');
        break;
      
      case 2:
        // Add 100 kg Tomatoes to cart & checkout
        addToCart(products.find(p => p.id === 'PROD-TOMATO') || products[0], 100);
        setIsCartOpen(true);
        addToast('Demo Step 2', 'Added 100 kg Tomatoes to cart. Proceeding to checkout...', 'info');
        break;

      case 3:
        // Simulate checkout completion
        setIsCartOpen(false);
        processCheckoutOrder({
          items: [{
            productId: 'PROD-TOMATO',
            productName: 'Tomato (Hybrid Desi)',
            variety: 'Shivam Hybrid & Desi Pink',
            qualityGrade: 'Grade A',
            unit: 'kg',
            image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
            pricePerUnit: products.find(p => p.id === 'PROD-TOMATO')?.platformPrice || 32,
            marketPrice: 36,
            quantity: 100,
            itemTotal: 100 * (products.find(p => p.id === 'PROD-TOMATO')?.platformPrice || 32),
            sourceFpoName: 'Kolar Horti Farmers FPO'
          }],
          address: DEFAULT_ADDRESS,
          slot: 'Tomorrow Morning',
          paymentMethod: 'gpay',
          paymentRef: `UPI-DEMO-${Math.floor(100000 + Math.random() * 900000)}`,
          consumerType: 'Restaurant'
        });
        setActiveScreen('fpo');
        addToast('Demo Step 3', 'FPO Hub: Tomato demand surged by 100 kg!', 'success');
        break;

      case 4:
        setActiveScreen('fpo');
        await gradeBatch('HB-1042');
        break;

      case 5:
        await triggerFarmerPayout('HB-1042');
        break;

      case 6:
        setActiveScreen('darkstore');
        advanceBatchToHub('HB-1042');
        break;

      case 7:
        setActiveScreen('darkstore');
        assignBatchToSlot('HB-1042', 'morning');
        break;

      case 8:
        setActiveScreen('driver');
        addToast('Demo Step 8', 'Driver App: OR-Tools route optimized for Arun Gowda (Tata Ace)', 'info');
        break;

      case 9:
        setActiveScreen('driver');
        markDeliveryCompleted('ORD-BLR-8901');
        break;

      case 10:
        setActiveScreen('consumer');
        addToast('Demo Step 10 Complete', 'Consumer Order marked Delivered in AgroDirect My Orders!', 'success');
        break;

      default:
        break;
    }
  };

  const startAutoDemo = () => {
    setIsDemoRunning(true);
    let current = 1;
    const interval = setInterval(async () => {
      if (current <= 10) {
        await runDemoStep(current);
        current += 1;
      } else {
        clearInterval(interval);
        setIsDemoRunning(false);
      }
    }, 4000);
  };

  const stopAutoDemo = () => {
    setIsDemoRunning(false);
  };

  const resetAllData = () => {
    setProducts(INITIAL_PRODUCTS);
    setFpos(INITIAL_FPOS);
    setFarmers(INITIAL_FARMERS);
    setBatches(INITIAL_BATCHES);
    setDarkStore(INITIAL_DARK_STORE);
    setDriver(INITIAL_DRIVER);
    setOrders(INITIAL_CONSUMER_ORDERS);
    setForecastData(INITIAL_DEMAND_FORECAST);
    setCart([]);
    setDeliveryAddressState(DEFAULT_ADDRESS);
    setDemoStep(1);
    setIsDemoRunning(false);
    setToasts([]);
    setIsCartOpen(false);
    setIsCheckoutOpen(false);
    setIsAdminPriceControlOpen(false);

    try {
      localStorage.removeItem('agrodirect_cart');
      localStorage.removeItem('agrodirect_products');
      localStorage.removeItem('agrodirect_orders');
    } catch {}

    addToast('Data Reset', 'Restored pristine AgroDirect agricultural datasets', 'info');
  };

  return (
    <SupplyChainContext.Provider value={{
      products,
      fpos,
      farmers,
      batches,
      darkStore,
      driver,
      orders,
      forecastData,
      toasts,
      cart,
      cartCount,
      cartSubtotal,
      cartSavings,
      deliveryFee,
      grandTotal,
      deliveryAddress,
      setDeliveryAddress,
      isCartOpen,
      setIsCartOpen,
      isCheckoutOpen,
      setIsCheckoutOpen,
      isAdminPriceControlOpen,
      setIsAdminPriceControlOpen,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      processCheckoutOrder,
      updateProductPrice,
      updateProductDetails,
      addNewProduct,
      activeScreen,
      setActiveScreen,
      viewMode,
      setViewMode,
      demoStep,
      isDemoRunning,
      placePreOrder,
      gradeBatch,
      triggerFarmerPayout,
      advanceBatchToHub,
      updateSortingStage,
      assignBatchToSlot,
      markDeliveryCompleted,
      runDemoStep,
      startAutoDemo,
      stopAutoDemo,
      resetAllData,
      dismissToast
    }}>
      {children}
    </SupplyChainContext.Provider>
  );
};

export const useSupplyChain = () => {
  const context = useContext(SupplyChainContext);
  if (!context) {
    throw new Error('useSupplyChain must be used within a SupplyChainProvider');
  }
  return context;
};
