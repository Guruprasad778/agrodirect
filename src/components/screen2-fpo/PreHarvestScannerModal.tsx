import React, { useState } from 'react';
import { 
  Camera, 
  Upload, 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ScanLine, 
  Calendar, 
  Layers, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Image as ImageIcon
} from 'lucide-react';
import { useSupplyChain } from '../../store/supplyChainStore';
import { 
  cropScannerService, 
  SAMPLE_FIELD_IMAGES, 
  SampleCropImage 
} from '../../services/cropScannerService';
import { PreHarvestScanResult } from '../../types/supplyChain';

export const PreHarvestScannerModal: React.FC = () => {
  const { 
    isCropScannerOpen, 
    setIsCropScannerOpen, 
    registerExpectedSupply 
  } = useSupplyChain();

  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_FIELD_IMAGES[0].thumbnail);
  const [selectedSample, setSelectedSample] = useState<SampleCropImage>(SAMPLE_FIELD_IMAGES[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<PreHarvestScanResult | null>(null);

  if (!isCropScannerOpen) return null;

  const handleRunScan = async (imgUrl: string) => {
    setIsScanning(true);
    setScanResult(null);

    const result = await cropScannerService.scanCropImage(imgUrl);
    setScanResult(result);
    setIsScanning(false);
  };

  const handleSelectSample = (sample: SampleCropImage) => {
    setSelectedSample(sample);
    setSelectedImage(sample.thumbnail);
    handleRunScan(sample.thumbnail);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setSelectedImage(previewUrl);
      handleRunScan(file.name);
    }
  };

  const handleRegisterToSupply = () => {
    if (scanResult) {
      registerExpectedSupply({
        productId: scanResult.crop.includes('Onion') ? 'PROD-ONION' : scanResult.crop.includes('Potato') ? 'PROD-POTATO' : 'PROD-TOMATO',
        productName: scanResult.crop,
        farmerName: 'Ramesh Kumar (Plot B-14)',
        quantityKg: 450,
        expectedDate: scanResult.harvestWindow.split('–')[0].trim(),
        daysRemaining: 6
      });
      setIsCropScannerOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900">
                  Pre-Harvest Computer Vision Crop Scanner
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                  Edge AI Inference
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Inspect standing crops in the field to predict maturity days, pest vulnerability, quality grade and yield.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCropScannerOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Image Source Selector: File Upload vs Preloaded Field Samples */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              Select Field Crop Sample or Upload Photo:
            </span>
            <label className="cursor-pointer px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Custom Photo</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {SAMPLE_FIELD_IMAGES.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className={`p-2 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                  selectedSample.id === sample.id
                    ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
                }`}
              >
                <img
                  src={sample.thumbnail}
                  alt={sample.crop}
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-900 block truncate">
                    {sample.crop}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    {sample.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Visual Field Inspection Preview with Scanning Overlay */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 h-52 flex items-center justify-center">
          <img
            src={selectedImage}
            alt="Field Crop"
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isScanning ? 'opacity-70 blur-2xs' : 'opacity-90'
            }`}
          />

          {/* Scanning Animation */}
          {isScanning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-2xs">
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-lg shadow-emerald-400 animate-pulse" />
              <div className="mt-4 px-4 py-2 rounded-xl bg-slate-900/90 text-white border border-emerald-500/40 text-xs font-bold flex items-center gap-2 shadow-xl">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
                <span>Running Pre-Harvest CNN Feature Extractor (YOLOv8 + ResNet-50)...</span>
              </div>
            </div>
          )}

          {!isScanning && !scanResult && (
            <button
              onClick={() => handleRunScan(selectedImage)}
              className="absolute px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-xs flex items-center gap-2 shadow-xl transition-all"
            >
              <ScanLine className="w-4 h-4" />
              <span>Run AI Pre-Harvest Assessment</span>
            </button>
          )}

          {/* Badge */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 text-white text-[10px] font-bold backdrop-blur-xs flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Camera Sensor: 48MP Multispectral Geo-tagged</span>
          </div>
        </div>

        {/* 3. Computer Vision Results Card */}
        {scanResult && !isScanning && (
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Pre-Harvest Diagnostic & Readiness Assessment
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Confidence: {scanResult.confidence}%
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[10px] text-slate-400 block font-semibold">Identified Crop</span>
                <span className="font-extrabold text-slate-900">{scanResult.crop}</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[10px] text-slate-400 block font-semibold">Estimated Readiness</span>
                <span className="font-black text-emerald-700 text-sm">{scanResult.readinessDays}</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[10px] text-slate-400 block font-semibold">Quality Prediction</span>
                <span className="font-black text-purple-700">{scanResult.qualityGrade} (Export Grade)</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[10px] text-slate-400 block font-semibold">Harvest Window</span>
                <span className="font-bold text-slate-800">{scanResult.harvestWindow}</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[10px] text-slate-400 block font-semibold">Potential Yield</span>
                <span className="font-bold text-slate-800">{scanResult.potentialYieldKg}</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[10px] text-slate-400 block font-semibold">Crop Condition</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{scanResult.diseasePestIndication.split('(')[0].trim()}</span>
                </span>
              </div>
            </div>

            {/* Disease details & action */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-1 text-xs">
              <div className="font-bold text-emerald-900">
                Pest & Disease Pathology: <span className="font-medium text-emerald-800">{scanResult.diseasePestIndication}</span>
              </div>
              <div className="text-[11px] text-slate-600">
                <strong>Recommended Farmer Action:</strong> {scanResult.recommendedAction}
              </div>
            </div>

            {/* Supply Registration Action */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500">
                Sync with Kolar FPO intake planning to reserve cold-storage crates.
              </span>

              <button
                onClick={handleRegisterToSupply}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span>Register to FPO Expected Supply</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Decoupled CV Inference Architecture (PyTorch / TensorFlow.js / ONNX compatible)</span>
          <span className="text-[10px] font-mono text-slate-400">Model: CropNet-India-v3.1</span>
        </div>
      </div>
    </div>
  );
};
