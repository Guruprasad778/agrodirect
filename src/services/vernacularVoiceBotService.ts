/**
 * Vernacular Voice & NLP Assistant Service
 * 
 * Multi-lingual natural language understanding engine for Indian farmers & FPO aggregators.
 * Supports: Kannada (ಕನ್ನಡ), Hindi (हिंदी), Tamil (தமிழ்), English.
 * 
 * Decoupled Architecture Note:
 * This service parses text/voice transcripts into structured supply chain events.
 * To integrate live external speech/messaging:
 * 1. Connect WhatsApp Business Webhook to `parseFarmerMessage(payload.text, payload.language)`
 * 2. Connect Twilio / Exotel IVR audio stream via Bhashini or Google Cloud Speech-to-Text
 */

export type SupportedLanguage = 'en' | 'kn' | 'hi' | 'ta';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🟡🔴' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🌾' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🌐' }
];

export interface VoiceBotHarvestIntent {
  intent: 'register_harvest';
  product: string;
  productId: string;
  expectedQuantityKg: number;
  horizonDays: number;
  expectedDateText: string;
  farmerName: string;
  confidence: number;
}

export interface VoiceBotPayoutIntent {
  intent: 'check_payout';
  payoutAmount: number;
  payoutStatus: 'Paid' | 'Ready for Digital Payout' | 'Pending Grading';
  recentBatchId: string;
  transactionRef: string;
  farmerName: string;
  confidence: number;
}

export interface VoiceBotGeneralIntent {
  intent: 'general_query';
  responseMessage: string;
}

export type VoiceBotParsedResult = 
  | VoiceBotHarvestIntent 
  | VoiceBotPayoutIntent 
  | VoiceBotGeneralIntent;

export const SAMPLE_PROMPTS: Record<SupportedLanguage, { label: string; text: string }[]> = {
  kn: [
    { label: 'ಟೊಮೇಟೊ ಕೊಯ್ಲು ನೋಂದಣಿ', text: 'ಮುಂದಿನ ವಾರ 500 ಕೆಜಿ ಟೊಮೇಟೊ ಕೊಯ್ಲು ನಿರೀಕ್ಷಿಸುತ್ತಿದ್ದೇನೆ.' },
    { label: 'ಪಾವತಿ ಸ್ಥಿತಿ ವಿಚಾರಣೆ', text: 'ನನ್ನ ಡಿಜಿಟಲ್ ಪಾವತಿ ಸ್ಥಿತಿ ಏನು?' },
    { label: 'ಈರುಳ್ಳಿ ಸರಬರಾಜು', text: '5 ದಿನಗಳಲ್ಲಿ 300 ಕೆಜಿ ಈರುಳ್ಳಿ ಸರಬರಾಜು ಮಾಡಲು ಸಿದ್ಧವಿದೆ.' }
  ],
  hi: [
    { label: 'टमाटर फसल पंजीकरण', text: 'अगले हफ्ते 500 किलो टमाटर तैयार हो जाएंगे।' },
    { label: 'भुगतान स्थिति', text: 'मेरा पिछला भुगतान कब जमा होगा?' },
    { label: 'आलू लॉट', text: '4 दिनों में 400 किलो आलू उपलब्ध हैं।' }
  ],
  ta: [
    { label: 'தக்காளி அறுவடை பதிவு', text: 'அடுத்த வாரம் 500 கிலோ தக்காளி அறுவடை எதிர்பார்க்கிறேன்.' },
    { label: 'பட்டுவாடா நிலை', text: 'எனது பணம் செலுத்தப்பட்டதா?' },
    { label: 'வெங்காயம் வழங்கல்', text: '5 நாட்களில் 350 கிலோ வெங்காயம் தயாராகும்.' }
  ],
  en: [
    { label: 'Register 500kg Tomato', text: 'I expect 500 kg tomatoes next week.' },
    { label: 'Check Payout Status', text: 'What is my payout status?' },
    { label: 'Register 350kg Onion', text: 'I have 350 kg onions ready in 5 days.' }
  ]
};

export const vernacularVoiceBotService = {
  /**
   * Process a speech or text utterance and extract structured agricultural supply data
   */
  async processUtterance(
    utterance: string, 
    lang: SupportedLanguage = 'en'
  ): Promise<VoiceBotParsedResult> {
    // Simulated realistic latency for AI Speech/NLP inference
    await new Promise(res => setTimeout(res, 450));

    const lower = utterance.toLowerCase().trim();

    // 1. Detect Payout Inquiries
    if (
      lower.includes('payout') || 
      lower.includes('payment') || 
      lower.includes('status') ||
      lower.includes('ಪಾವತಿ') || 
      lower.includes('ದುಡ್ಡು') ||
      lower.includes('भुगतान') || 
      lower.includes('पैसे') ||
      lower.includes('பணம்') || 
      lower.includes('பட்டுவாடா')
    ) {
      return {
        intent: 'check_payout',
        payoutAmount: 8420,
        payoutStatus: 'Paid',
        recentBatchId: 'HB-1041',
        transactionRef: 'UPI-FARM-99824',
        farmerName: 'Ramesh Kumar',
        confidence: 0.98
      };
    }

    // 2. Extract Harvest Quantity
    const qtyMatch = lower.match(/(\d+)\s*(kg|kilo|ಕೆಜಿ|किलो|கிலோ)?/i);
    const qty = qtyMatch ? parseInt(qtyMatch[1], 10) : 500;

    // 3. Detect Commodity
    let product = 'Tomato (Hybrid Desi)';
    let productId = 'PROD-TOMATO';

    if (lower.includes('onion') || lower.includes('ಈರುಳ್ಳಿ') || lower.includes('प्याज') || lower.includes('வெங்காயம்')) {
      product = 'Nashik Red Onion';
      productId = 'PROD-ONION';
    } else if (lower.includes('potato') || lower.includes('ಆಲೂಗಡ್ಡೆ') || lower.includes('आलू') || lower.includes('உருளைக்கிழங்கு')) {
      product = 'Agra Jyoti Potato';
      productId = 'PROD-POTATO';
    } else if (lower.includes('carrot') || lower.includes('ಕ್ಯಾರೆಟ್') || lower.includes('गाजर') || lower.includes('கேரட்')) {
      product = 'Ooty Premium Red Carrot';
      productId = 'PROD-CARROT';
    } else if (lower.includes('milk') || lower.includes('ಹಾಲು') || lower.includes('दूध') || lower.includes('பால்')) {
      product = 'Fresh Farm Buffalo Milk';
      productId = 'PROD-MILK';
    }

    // 4. Determine Delivery Timeline
    let horizonDays = 5;
    let expectedDateText = 'Next Week (in 5 days)';

    if (lower.includes('3') || lower.includes('೩') || lower.includes('३')) {
      horizonDays = 3;
      expectedDateText = 'in 3 days';
    } else if (lower.includes('4') || lower.includes('೪') || lower.includes('४')) {
      horizonDays = 4;
      expectedDateText = 'in 4 days';
    } else if (lower.includes('7') || lower.includes('೭') || lower.includes('७')) {
      horizonDays = 7;
      expectedDateText = 'Next Week (in 7 days)';
    }

    return {
      intent: 'register_harvest',
      product,
      productId,
      expectedQuantityKg: qty,
      horizonDays,
      expectedDateText,
      farmerName: 'Ramesh Kumar',
      confidence: 0.96
    };
  }
};
