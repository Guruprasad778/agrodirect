/**
 * Live Cold-Chain & Reefer IoT Monitoring Service
 * 
 * Tracks telemetry for perishable agricultural produce transit:
 * - Temperature (°C) with threshold alerts (> 8°C triggers warning)
 * - Relative Humidity (%)
 * - Vehicle identification & GPS location
 * 
 * Decoupled Architecture Note:
 * This service handles telemetry data streams. To connect physical hardware:
 * 1. Connect an MQTT broker (e.g. AWS IoT Core, EMQX, HiveMQ) subscribing to `agrodirect/reefer/{vehicleId}/telemetry`
 * 2. Feed incoming sensor payloads into `updateTelemetry(payload)`
 */

import { IotSensorReading } from '../types/supplyChain';

export type IotListener = (reading: IotSensorReading) => void;

class IotMonitoringService {
  private currentReading: IotSensorReading = {
    temperatureC: 4.2,
    humidityPercent: 72,
    vehicleNumber: 'KA-04-E-8821',
    driverName: 'Arun Kumar (Tata Ace EV)',
    isAlert: false,
    timestamp: 'Just now',
    location: 'Indiranagar Urban Hub Dock 2'
  };

  private listeners: Set<IotListener> = new Set();
  private intervalId: any = null;

  constructor() {
    this.startSimulation();
  }

  /**
   * Subscribe to live IoT telemetry updates
   */
  public subscribe(listener: IotListener): () => void {
    this.listeners.add(listener);
    listener(this.currentReading);
    return () => this.listeners.delete(listener);
  }

  public getCurrentReading(): IotSensorReading {
    return { ...this.currentReading };
  }

  /**
   * Trigger a simulated temperature breach for evaluator presentation
   */
  public triggerSpike(): IotSensorReading {
    this.currentReading = {
      ...this.currentReading,
      temperatureC: 9.8,
      humidityPercent: 84,
      isAlert: true,
      alertMessage: '⚠️ Critical Temperature Alert: Reefer Chiller Breached 8.0°C! Pre-cooling compressor override initiated.',
      timestamp: 'Immediate Alert'
    };
    this.notify();
    return { ...this.currentReading };
  }

  /**
   * Restore optimal reefer temperatures
   */
  public resetToOptimal(): IotSensorReading {
    this.currentReading = {
      ...this.currentReading,
      temperatureC: 4.2,
      humidityPercent: 72,
      isAlert: false,
      alertMessage: undefined,
      timestamp: 'Just now'
    };
    this.notify();
    return { ...this.currentReading };
  }

  private notify() {
    this.listeners.forEach(listener => listener({ ...this.currentReading }));
  }

  private startSimulation() {
    // Subtle realistic micro-fluctuation every 15 seconds unless in alert mode
    if (typeof window !== 'undefined') {
      this.intervalId = setInterval(() => {
        if (!this.currentReading.isAlert) {
          const delta = (Math.random() - 0.5) * 0.2;
          const newTemp = Math.round((this.currentReading.temperatureC + delta) * 10) / 10;
          this.currentReading = {
            ...this.currentReading,
            temperatureC: Math.max(3.8, Math.min(4.8, newTemp)),
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          };
          this.notify();
        }
      }, 12000);
    }
  }
}

export const iotMonitoringService = new IotMonitoringService();
