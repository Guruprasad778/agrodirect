/**
 * Pre-Harvest Computer Vision Crop Scanner Service
 * 
 * Analyzes pre-harvest crop field photos to predict:
 * - Crop readiness & days to harvest
 * - Pest & disease presence (Early blight, leaf curl, thrips)
 * - Yield estimation (kg/acre)
 * - Projected post-harvest quality grade
 * 
 * Decoupled Architecture Note:
 * This service encapsulates the CV inference pipeline. To connect a live model:
 * 1. Replace the mock result generator with a POST request to an ONNX/TensorFlow Serving/PyTorch endpoint
 * 2. Example: `fetch('/api/cv/preharvest-inspect', { method: 'POST', body: formData })`
 */

import { PreHarvestScanResult } from '../types/supplyChain';

export interface SampleCropImage {
  id: string;
  name: string;
  crop: string;
  thumbnail: string;
  description: string;
}

export const SAMPLE_FIELD_IMAGES: SampleCropImage[] = [
  {
    id: 'sample-tomato-1',
    name: 'Kolar Desi Tomato Field (Day 65)',
    crop: 'Tomato (Hybrid Desi)',
    thumbnail: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    description: 'Vibrant green canopy with uniform fruit sets entering breaker stage (pink blush).'
  },
  {
    id: 'sample-onion-2',
    name: 'Lasalgaon Red Onion Plot',
    crop: 'Nashik Red Onion',
    thumbnail: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80',
    description: 'Bulb tops falling at 60% neck maturity, optimal dry skin pigmentation.'
  },
  {
    id: 'sample-potato-3',
    name: 'Agra Kufri Jyoti Tubers',
    crop: 'Agra Jyoti Potato',
    thumbnail: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80',
    description: 'Tuber skin set complete, no hollow heart or scab symptoms detected.'
  }
];

export const cropScannerService = {
  /**
   * Run computer vision inference on a field crop image
   */
  async scanCropImage(imageUrlOrFile: string | File): Promise<PreHarvestScanResult> {
    // Simulated deep learning CNN inference latency
    await new Promise(resolve => setTimeout(resolve, 800));

    // Determine crop type from sample URL or default to Tomato
    let cropName = 'Tomato (Hybrid Desi)';
    let readinessDays = '5–7 days';
    let diseasePestIndication = 'Healthy (Early Blight risk < 2.1%, zero whitefly)';
    let harvestWindow = '26 Sep – 28 Sep 2026';
    let qualityGrade: 'Grade A' | 'Grade B' | 'Grade C' = 'Grade A';
    let potentialYieldKg = '420–450 kg (Plot B-14)';
    let recommendedAction = 'Maintain drip irrigation at 40% deficit; book line-haul crates with Kolar FPO for morning harvest.';
    let confidence = 96.8;

    if (typeof imageUrlOrFile === 'string') {
      if (imageUrlOrFile.includes('onion') || imageUrlOrFile.includes('sample-onion')) {
        cropName = 'Nashik Red Onion';
        readinessDays = '7–9 days';
        diseasePestIndication = 'Healthy (Dry skin cure complete, zero purple blotch)';
        harvestWindow = '28 Sep – 30 Sep 2026';
        potentialYieldKg = '350–380 kg (Sector 3)';
        recommendedAction = 'Cease surface irrigation; begin field sun-curing to optimize shelf life.';
        confidence = 97.4;
      } else if (imageUrlOrFile.includes('potato') || imageUrlOrFile.includes('sample-potato')) {
        cropName = 'Agra Jyoti Potato';
        readinessDays = '4–6 days';
        diseasePestIndication = 'Optimal (Zero late-blight lesion, skin set: 98%)';
        harvestWindow = '25 Sep – 27 Sep 2026';
        potentialYieldKg = '580–620 kg (Acre 2)';
        recommendedAction = 'Schedule mechanical digger for dawn extraction; avoid midday heat.';
        confidence = 98.2;
      }
    }

    return {
      crop: cropName,
      readinessDays,
      diseasePestIndication,
      harvestWindow,
      qualityGrade,
      potentialYieldKg,
      recommendedAction,
      confidence,
      sampleImageUrl: typeof imageUrlOrFile === 'string' ? imageUrlOrFile : undefined
    };
  }
};
