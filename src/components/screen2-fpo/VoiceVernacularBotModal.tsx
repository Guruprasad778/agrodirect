import React, { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  X, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  IndianRupee, 
  Languages, 
  Volume2, 
  ArrowRight,
  Tractor,
  Layers,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { useSupplyChain } from '../../store/supplyChainStore';
import { 
  vernacularVoiceBotService, 
  SupportedLanguage, 
  SUPPORTED_LANGUAGES, 
  SAMPLE_PROMPTS,
  VoiceBotParsedResult
} from '../../services/vernacularVoiceBotService';

export const VoiceVernacularBotModal: React.FC = () => {
  const { 
    isVoiceBotOpen, 
    setIsVoiceBotOpen, 
    registerExpectedSupply 
  } = useSupplyChain();

  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('kn');
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedResult, setParsedResult] = useState<VoiceBotParsedResult | null>(null);

  if (!isVoiceBotOpen) return null;

  const handleProcess = async (text: string) => {
    if (!text.trim()) return;
    setIsProcessing(true);
    setParsedResult(null);

    const result = await vernacularVoiceBotService.processUtterance(text, selectedLang);
    setParsedResult(result);
    setIsProcessing(false);
  };

  const handleSimulateVoice = (sampleText: string) => {
    setInputText(sampleText);
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      handleProcess(sampleText);
    }, 1200);
  };

  const handleConfirmSupplyRegistration = () => {
    if (parsedResult && parsedResult.intent === 'register_harvest') {
      registerExpectedSupply({
        productId: parsedResult.productId,
        productName: parsedResult.product,
        farmerName: parsedResult.farmerName,
        quantityKg: parsedResult.expectedQuantityKg,
        expectedDate: new Date(Date.now() + parsedResult.horizonDays * 86400000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        daysRemaining: parsedResult.horizonDays
      });
      setIsVoiceBotOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-forest text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900">
                  Agri Assistant: Voice-Guided Vernacular Bot
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                  AI Multi-Lingual
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Natural speech & text interface for rural farmers in Kannada, Hindi, Tamil & English.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsVoiceBotOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Selector */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-emerald-600" />
              <span>Select Language / ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Bhashini / ASR Architecture</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SUPPORTED_LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => {
                  setSelectedLang(lang.code);
                  setParsedResult(null);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-between ${
                  selectedLang === lang.code
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{lang.nativeName}</span>
                <span className="text-[11px] opacity-80">{lang.flag}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Sample Prompts (Interactive Voice Chips) */}
        <div>
          <span className="text-xs font-bold text-slate-600 block mb-2">
            Tap a quick sample to simulate farmer voice input:
          </span>
          <div className="space-y-1.5">
            {SAMPLE_PROMPTS[selectedLang].map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSimulateVoice(prompt.text)}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200/90 bg-white hover:bg-emerald-50/50 hover:border-emerald-300 transition-all flex items-center justify-between group text-xs text-slate-700 shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-emerald-600 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-slate-900">{prompt.label}:</span>
                  <span className="text-slate-600 italic">"{prompt.text}"</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* Voice Input & Text Box */}
        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleProcess(inputText)}
              placeholder="Speak or type (e.g. 'I expect 500 kg tomatoes next week')..."
              className="w-full pl-4 pr-24 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleSimulateVoice(inputText || 'I expect 500 kg tomatoes next week')}
                className={`p-2 rounded-xl text-white transition-all shadow-sm ${
                  isListening 
                    ? 'bg-rose-500 animate-pulse ring-4 ring-rose-200' 
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
                title="Tap to speak"
              >
                {isListening ? <Mic className="w-4 h-4 animate-bounce" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => handleProcess(inputText)}
                disabled={!inputText.trim() || isProcessing}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-40 transition-all"
                title="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {isListening && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                <span>Listening to farmer speech in {SUPPORTED_LANGUAGES.find(l => l.code === selectedLang)?.name}...</span>
              </div>
              <span className="text-[10px] font-mono">ASR Active</span>
            </div>
          )}

          {isProcessing && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-pulse">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>Extracting structured crop, quantity & timeline entities...</span>
            </div>
          )}
        </div>

        {/* Structured Result Display */}
        {parsedResult && (
          <div className="animate-in fade-in zoom-in-95 duration-200">
            {parsedResult.intent === 'register_harvest' && (
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50/40 border border-emerald-300 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Structured Crop Supply Extraction</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200/70 text-emerald-900">
                    Confidence: {(parsedResult.confidence * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">Commodity</span>
                    <span className="font-bold text-slate-900">{parsedResult.product}</span>
                  </div>

                  <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">Expected Quantity</span>
                    <span className="font-black text-emerald-700 text-sm">{parsedResult.expectedQuantityKg} kg</span>
                  </div>

                  <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">Expected Window</span>
                    <span className="font-bold text-slate-900">{parsedResult.expectedDateText}</span>
                  </div>

                  <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">Farmer</span>
                    <span className="font-bold text-slate-900">{parsedResult.farmerName}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <p className="text-[11px] text-slate-600">
                    Registering will link this harvest to Kolar FPO intake and update the supply forecast.
                  </p>
                  <button
                    onClick={handleConfirmSupplyRegistration}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <span>Confirm & Register to FPO</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {parsedResult.intent === 'check_payout' && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-blue-200/80 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-blue-900">
                    <IndianRupee className="w-4 h-4 text-blue-600" />
                    <span>Farmer Digital Payout Query</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Status: {parsedResult.payoutStatus}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="bg-white/90 p-2.5 rounded-xl border border-blue-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">Farmer</span>
                    <span className="font-bold text-slate-900">{parsedResult.farmerName}</span>
                  </div>

                  <div className="bg-white/90 p-2.5 rounded-xl border border-blue-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">Latest Payout</span>
                    <span className="font-black text-emerald-700 text-sm">₹{parsedResult.payoutAmount.toLocaleString()}</span>
                  </div>

                  <div className="bg-white/90 p-2.5 rounded-xl border border-blue-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">Transaction Ref</span>
                    <span className="font-mono text-slate-700 text-[11px] font-bold">{parsedResult.transactionRef}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600">
                  Payment disbursed directly to farmer's UPI VPA within 2 hours of OpenCV quality assaying.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Integration Architecture Footer */}
        <div className="p-3 bg-slate-100/80 rounded-2xl border border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>Production Architecture: Ready for WhatsApp Business Webhook & Twilio IVR</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Bhashini API Compatible</span>
        </div>
      </div>
    </div>
  );
};
