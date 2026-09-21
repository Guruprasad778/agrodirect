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
  SortingStage
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

  // UI state
  activeScreen: 'consumer' | 'fpo' | 'darkstore' | 'driver';
  setActiveScreen: (screen: 'consumer' | 'fpo' | 'darkstore' | 'driver') => void;
  viewMode: 'desktop' | 'mobile';
  setViewMode: (mode: 'desktop' | 'mobile') => void;
  demoStep: number;
  isDemoRunning: boolean;

  // Actions
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

export const SupplyChainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [fpos, setFpos] = useState<FPO[]>(INITIAL_FPOS);
  const [farmers, setFarmers] = useState<Farmer[]>(INITIAL_FARMERS);
  const [batches, setBatches] = useState<HarvestBatch[]>(INITIAL_BATCHES);
  const [darkStore, setDarkStore] = useState<DarkStoreHub>(INITIAL_DARK_STORE);
  const [driver, setDriver] = useState<Driver>(INITIAL_DRIVER);
  const [orders, setOrders] = useState<ConsumerOrder[]>(INITIAL_CONSUMER_ORDERS);
  const [forecastData, setForecastData] = useState<DemandForecastPoint[]>(INITIAL_DEMAND_FORECAST);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [activeScreen, setActiveScreen] = useState<'consumer' | 'fpo' | 'darkstore' | 'driver'>('consumer');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [demoStep, setDemoStep] = useState<number>(1);
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);

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

  /**
   * STEP 1-5: CONSUMER PRE-ORDER
   * Places an order, updates FPO incoming demand and harvest requirement,
   * adds to shared orders, and alerts the supply chain.
   */
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
    const totalAmount = quantityKg * product.platformPrice;
    const totalSavings = quantityKg * Math.max(0, product.currentMarketPrice - product.platformPrice);
    
    const newOrderId = `ORD-BLR-${Math.floor(8900 + Math.random() * 900)}`;

    const newOrder: ConsumerOrder = {
      id: newOrderId,
      consumerId: `CONS-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      consumerName,
      consumerType,
      location,
      items: [{
        productId: product.id,
        productName: product.name,
        quantity: quantityKg,
        unit: product.unit,
        platformPrice: product.platformPrice,
        marketPrice: product.currentMarketPrice
      }],
      totalQuantity: quantityKg,
      totalAmount,
      totalSavings,
      orderDate: new Date().toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      deliverySlot,
      status: 'Pending FPO',
      paymentStatus: 'Paid',
      assignedFpoId: product.sourceFpoId,
      assignedDarkStoreId: 'DS-BLR-01',
      assignedDriverId: 'DRV-ARUN-01',
      stopSequence: driver.stops.length + 1,
      eta: deliverySlot === 'Tomorrow Morning' ? '08:50 AM' : '02:30 PM'
    };

    // 1. Update orders list
    setOrders(prev => [newOrder, ...prev]);

    // 2. Propagate to Products: demand increases
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          demand: p.demand + quantityKg,
          expectedDemand: p.expectedDemand + Math.round(quantityKg * 1.1)
        };
      }
      return p;
    }));

    // 3. Propagate to FPO: incoming demand & harvest requirement increases
    setFpos(prev => prev.map(fpo => {
      if (fpo.id === product.sourceFpoId) {
        return {
          ...fpo,
          incomingDemandKg: fpo.incomingDemandKg + quantityKg,
          harvestRequirementKg: fpo.harvestRequirementKg + quantityKg,
          pendingBatchesCount: fpo.pendingBatchesCount + 1
        };
      }
      return fpo;
    }));

    // 4. Update AI forecast chart via demandForecastService
    setForecastData(prev => demandForecastService.projectDemandWithNewOrder(prev, quantityKg));

    // 5. Create or queue linked harvest batch
    const newBatchId = `HB-${1040 + batches.length + 1}`;
    const newBatch: HarvestBatch = {
      id: newBatchId,
      productId: product.id,
      productName: product.name,
      farmerId: 'FARM-01',
      farmerName: 'Ramesh Kumar',
      fpoId: product.sourceFpoId,
      fpoName: product.sourceFpoName,
      quantityKg: quantityKg,
      acceptedQuantityKg: Math.round(quantityKg * 0.98),
      harvestDate: new Date().toISOString().split('T')[0],
      expectedDelivery: 'Tomorrow',
      qualityGrade: 'Grade A',
      pricePerKg: product.platformPrice,
      payoutAmount: Math.round(quantityKg * 0.98 * product.platformPrice),
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
        assayTimestamp: 'Ready for CV Camera Assaying',
        modelConfidence: '98.4%'
      }
    };
    setBatches(prev => [newBatch, ...prev]);

    addToast(
      'Demand Transmitted to FPO', 
      `Pre-order ${newOrderId} (${quantityKg}kg ${product.name}) routed to ${product.sourceFpoName}`,
      'success'
    );

    return newOrder;
  };

  /**
   * STEP 8-10: COMPUTER VISION QUALITY GRADING
   */
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

  /**
   * STEP 11-12: FARMER DIGITAL PAYOUT
   */
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

    // Update farmer entity
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

    // Update FPO total disbursements
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

    // Update linked order if any
    if (targetBatch.linkedOrderId) {
      setOrders(prev => prev.map(ord => {
        if (ord.id === targetBatch.linkedOrderId) {
          return { ...ord, status: 'In Transit to Hub' };
        }
        return ord;
      }));
    }

    // Auto-update Dark Store incoming freight
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

  /**
   * STEP 13: ADVANCE BATCH TO URBAN DARK STORE
   */
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

  /**
   * STEP 14: BATCH SORTING WORKFLOW
   */
  const updateSortingStage = (batchId: string, _stage: SortingStage) => {
    addToast('Sorting Workflow Updated', `Batch ${batchId} moved to stage: ${_stage}`, 'info');
  };

  /**
   * SMART SLOT ALLOCATION & DISPATCH
   */
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

  /**
   * STEP 17-18: DRIVER DELIVERY EXECUTION
   */
  const markDeliveryCompleted = (orderId: string) => {
    // 1. Update driver stops
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

    // 2. Update consumer order status
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

  /**
   * PRESENTATION / DEMO MODE: Automated or Step-by-Step Walkthrough
   */
  const runDemoStep = async (stepNumber: number) => {
    setDemoStep(stepNumber);

    switch (stepNumber) {
      case 1:
        setActiveScreen('consumer');
        addToast('Demo Step 1-5', 'Consumer App: Selecting 100 kg Tomatoes with Tomorrow Morning slot...', 'info');
        break;
      
      case 2:
        // Place demo pre-order
        placePreOrder({
          productId: 'PROD-TOMATO',
          quantityKg: 100,
          deliverySlot: 'Tomorrow Morning',
          consumerType: 'Restaurant',
          consumerName: 'Nandi Grand Tiffin Center',
          location: 'Indiranagar 100ft Road, Bengaluru'
        });
        break;

      case 3:
        setActiveScreen('fpo');
        addToast('Demo Step 6-7', 'FPO Hub: Incoming demand increased by 100 kg; AI forecast updated.', 'info');
        break;

      case 4:
        // Trigger CV grading on Tomato batch
        setActiveScreen('fpo');
        await gradeBatch('HB-1042');
        break;

      case 5:
        // Trigger farmer payout
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
        addToast('Demo Step 15-16', 'Driver App: OR-Tools route optimized for Arun Gowda (Tata Ace)', 'info');
        break;

      case 9:
        setActiveScreen('driver');
        markDeliveryCompleted('ORD-BLR-8901');
        break;

      case 10:
        setActiveScreen('consumer');
        addToast('Demo Step 18 Complete', 'Consumer Order #ORD-BLR-8901 marked Delivered!', 'success');
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
    setDemoStep(1);
    setIsDemoRunning(false);
    setToasts([]);
    addToast('Data Reset', 'Restored pristine initial Indian agricultural dataset', 'info');
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
