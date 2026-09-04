// ============================================================
// GreenLedger — Multilingual NLP & Relevance Engine
// Supports 8 Languages: en, hi, hinglish, bn, mr, te, ta, kn
// ============================================================

import { SupportedLanguage, SUPPORTED_LANGUAGES } from './locales/registry';
import type { VerificationStatus } from './types';

export interface MultilingualAnalysisResult {
  valid: boolean;
  isEnvironmentalClaim: boolean;
  language: SupportedLanguage;
  detectedConfidence: number;
  originalClaim: string;
  normalizedClaim: string;
  claimType: string;
  attributes: {
    material?: string;
    percentage?: number;
    environmentalAttribute: string;
    scope?: 'packaging' | 'product' | 'manufacturing';
    measurableMetric?: string;
    certificationMentioned?: string;
  };
  status?: VerificationStatus;
  explanation?: string;
  errorType?: 'NON_ENVIRONMENTAL_CLAIM' | 'EMPTY_INPUT' | 'GREETING' | 'CODE_OR_MATH';
  message?: string;
  suggestion?: string;
}

// ── 1. Indic Numerals Normalization ──────────────────────────
// Converts Devanagari (०-९) and Bengali (০-৯) to Arabic (0-9)
export function normalizeIndicNumerals(text: string): string {
  const devanagariDigits: Record<string, string> = {
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
    '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
  };
  const bengaliDigits: Record<string, string> = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
  };

  return text
    .replace(/[०-९]/g, (ch) => devanagariDigits[ch] || ch)
    .replace(/[০-৯]/g, (ch) => bengaliDigits[ch] || ch);
}

// ── 2. Language Detection ───────────────────────────────────
// Accurately identifies en, hi, hinglish, bn, mr, te, ta, kn
export function detectLanguage(
  rawText: string,
  hint?: SupportedLanguage
): { language: SupportedLanguage; confidence: number } {
  const text = rawText.trim();
  if (!text) return { language: hint || 'en', confidence: 0.5 };

  // Script Range Checks
  const hasDevanagari = /\p{Script=Devanagari}/u.test(text);
  const hasBengali = /[\u0980-\u09FF]/.test(text);
  const hasTelugu = /[\u0C00-\u0C7F]/.test(text);
  const hasTamil = /[\u0B80-\u0BFF]/.test(text);
  const hasKannada = /[\u0C80-\u0CFF]/.test(text);

  if (hasBengali) return { language: 'bn', confidence: 0.98 };
  if (hasTelugu) return { language: 'te', confidence: 0.98 };
  if (hasTamil) return { language: 'ta', confidence: 0.98 };
  if (hasKannada) return { language: 'kn', confidence: 0.98 };
  // Devanagari script: differentiate Marathi vs Hindi
  if (hasDevanagari) {
    // The letter ळ (U+0933) and ऴ (U+0934) are exclusively Marathi in Devanagari
    if (/[\u0933\u0934]/.test(text)) {
      return { language: 'mr', confidence: 0.99 };
    }

    const marathiWords = ['मध्ये', 'आहे', 'आहेत', 'पुनर्वापर', 'केलेला', 'केलेली', 'केलेले', 'कागद', 'पॅकेजिंग', 'शाश्वत', 'कमी', 'उत्सर्जन', 'झालेले', 'होते', 'आणि', 'हे', 'हा', 'ही', 'खूप', 'उत्पादन'];
    const hindiWords = ['में', 'है', 'हैं', 'पुनर्नवीनीकरण', 'पुनर्चक्रण', 'कागज', 'पैकेजिंग', 'स्थिरता', 'उत्पाद', 'कम', 'से', 'बनी', 'बना', 'करता', 'करती', 'और', 'यह', 'ये', 'बहुत'];

    let marathiMatches = 0;
    for (const w of marathiWords) {
      if (text.includes(w)) marathiMatches++;
    }

    let hindiMatches = 0;
    for (const w of hindiWords) {
      if (text.includes(w)) hindiMatches++;
    }

    if (marathiMatches > hindiMatches) return { language: 'mr', confidence: 0.95 };
    if (hindiMatches > marathiMatches) return { language: 'hi', confidence: 0.95 };
    if (hint === 'mr' || hint === 'hi') return { language: hint, confidence: 0.85 };
    return { language: 'hi', confidence: 0.8 };
  }

  // Latin alphabet: differentiate Hinglish vs English
  const hinglishPatterns = [
    /\b(kya|yeh|ye|is|iska|iski|iske|ismein|isme|se|bani|bana|bane|hai|hain|ka|ki|ke|ko|mein|me|kitna|kitni|kitne|sirf|accha|acchi|achha|achhi|bahut|bohot|nahi|naahi|bhi|karo|kare|karta|karti|karte|hoga|hogi|hoge|wala|wali|wale|aur|par|ya|toh|hoti|hota|hote|chahiye|raha|rahi|rahe|pe)\b/i,
  ];

  const words = text.toLowerCase().split(/\s+/);
  let hinglishScore = 0;
  for (const word of words) {
    if (hinglishPatterns[0].test(word)) {
      hinglishScore++;
    }
  }

  if (hinglishScore >= 2 || (hinglishScore === 1 && words.length <= 6)) {
    return { language: 'hinglish', confidence: 0.92 };
  }

  if (hint === 'hinglish' && hinglishScore >= 1) {
    return { language: 'hinglish', confidence: 0.9 };
  }

  return { language: 'en', confidence: 0.95 };
}

// ── 3. Non-Environmental Filters (All 8 Languages) ───────────
const NON_ENV_REGEXES = [
  // English
  /\b(camera|screen|display|battery|processor|ram|megapixels|speakers|lens|fast shipping|good sound|loud sound)\b/i,
  /\bthis phone has an? (great|amazing|good|bad) camera\b/i,
  /\b(great|amazing|awesome|nice|terrible|cheap|expensive|costly) (camera|phone|laptop|tv|headphone|shoes)\b/i,
  /^(hello|hi|hey|what is ai|how are you|who is|tell me a joke)\b/i,

  // Hindi
  /यह फोन बहुत (अच्छा|खराब|बढ़िया) है/i,
  /\b(कैमरा|बैटरी|स्क्रीन|डिस्प्ले|प्रोसेसर|सस्ता|महंगा|आवाज|नमस्ते|प्रणाम)\b/i,

  // Hinglish
  /\bye phone (bahut|bohot) (accha|achha|badiya|badhiya|kharab) hai\b/i,
  /\b(camera mast hai|battery life acchi hai|badhiya camera)\b/i,
  /^(kya haal hai|kaise ho|namaste|hello ji)\b/i,

  // Bengali
  /এই ফোনটির ক্যামেরা খুব (ভালো|সুন্দর|খারাপ)/i,
  /এই ফোন (খুব|অনেক) (ভালো|বাজে)/i,
  /\b(ক্যামেরা|ব্যাটারি|স্ক্রিন|ডিসপ্লে|হ্যালো|নমস্কার)\b/i,

  // Marathi
  /हा फोन खूप (चांगला|छान|वाईट) आहे/i,
  /\b(कॅमेरा|बॅटरी|स्क्रीन|डिस्प्ले|किंमत|नमस्कार)\b/i,

  // Telugu
  /ఈ ఫోన్ (కెమెరా|చాలా) (బాగుంది|అద్భుతంగా ఉంది)/i,
  /\b(కెమెరా|బ్యాటరీ|ధర|హలో|నమస్కారం)\b/i,

  // Tamil
  /இந்த போனில் சிறந்த கேமரா உள்ளது/i,
  /இந்த போன் மிகவும் (நல்லது|அருமை)/i,
  /\b(கேமரா|பேட்டரி|விலை|வணக்கம்)\b/i,

  // Kannada
  /ಈ ಫೋನ್ ಅದ್ಭುತ ಕ್ಯಾಮೆರಾ ಹೊಂದಿದೆ/i,
  /ಈ ಫೋನ್ ತುಂಬಾ (ಚೆನ್ನಾಗಿದೆ|ಒಳ್ಳೆಯದು)/i,
  /\b(ಕ್ಯಾಮೆರಾ|ಬ್ಯಾಟರಿ|ಬೆಲೆ|ಹಲೋ|ನಮಸ್ಕಾರ)\b/i,
];

// ── 4. Environmental Indicators (All 8 Languages) ────────────
const ENV_KEYWORDS_MULTILINGUAL = [
  // Recycled Content
  /\b(recycled|post-consumer|pcr)\b/i,
  /पुनर्नवीनीकरण|पुनर्चक्रित|पुनर्चक्रण/,
  /পুনর্ব্যবহৃত|পুনর্ব্যবহারযোগ্য/,
  /पुनर्वापर|पुनर्वापर केलेला|पुनर्वापर केलेली/,
  /రీసైకిల్|పునర్వినియోగించదగిన/,
  /மறுசுழற்சி|மறுசுழற்சி செய்யப்பட்ட/,
  /ಮರುಬಳಕೆ|ಮರುಬಳಕೆ ಮಾಡಿದ/,

  // Recyclable
  /\b(recyclable|curbside recyclable)\b/i,
  /पुनर्चक्रणीय|पुनर्नवीकरणीय/,
  /மறுசுழற்சி செய்யக்கூடிய/,
  /ಮರುಬಳಕೆ ಮಾಡಬಹುದಾದ/,

  // Biodegradable & Compostable
  /\b(biodegradable|compostable)\b/i,
  /जैव निम्नीकरणीय|कंपोस्टेबल/,
  /বায়োডিগ্রেডেবল|কম্পোস্টেবল/,
  /बायोडिग्रेडेबल|कंपोस्टेबल/,
  /బయోడిగ్రేడబుల్|కంపోస్టబుల్/,
  /மக்கும்|உரமாகும்/,
  /ಜೈವಿಕ ವಿಘಟನೀಯ|ಕಾಂಪೋಸ್ಟೆಬಲ್/,

  // Carbon / Climate / Emissions
  /\b(carbon|emissions|footprint|net zero|climate neutral|carbon neutral)\b/i,
  /कार्बन|उत्सर्जन|तटस्थ|पादचिह्न/,
  /কার্বন|নির্গমন/,
  /कार्बन उत्सर्जन|कार्बन फूटप्रिंट/,
  /కార్బన్|ఉద్గారాలు|పాదముద్ర/,
  /கார்பன்|உமிழ்வு/,
  /ಇಂಗಾಲ|ಹೊರಸೂಸುವಿಕೆ|ಹೆಜ್ಜೆಗುರುತು/,

  // Eco-Friendly / Organic / Sustainable Materials
  /\b(eco-friendly|sustainable|organic|fsc|gots|bamboo|renewable)\b/i,
  /पर्यावरण-अनुकूल|सतत|जैविक|बांस|नवीकरणीय/,
  /পরিবেশ বান্ধব|টেকসই|জৈব|বাঁশ/,
  /पर्यावरणपूरक|शाश्वत|सेंद्रिय|बांबू/,
  /పర్యావరణ అనుకూల|స్థిరమైన|సేంద్రీయ|వెదురు/,
  /சுற்றுச்சூழல் நட்பு|நிலையான|இயற்கையான|மூங்கில்/,
  /ಪರಿಸರ ಸ್ನೇಹಿ|ಸುಸ್ಥಿರ|ಸಾವಯವ|ಬಿದಿರು/,
];

// ── 5. Localized Rejection Messages (Per User Spec Part 13) ───
export const LOCALIZED_NON_ENV_MESSAGES: Record<SupportedLanguage, string> = {
  en: 'GreenLedger verifies environmental and sustainability claims only.',
  hi: 'GreenLedger केवल पर्यावरणीय और स्थिरता संबंधी दावों की जाँच करता है।',
  hinglish: 'GreenLedger sirf environmental aur sustainability claims verify karta hai.',
  bn: 'GreenLedger শুধুমাত্র পরিবেশগত এবং টেকসই দাবি যাচাই করে।',
  mr: 'GreenLedger केवळ पर्यावरणीय आणि शाश्वततेच्या दाव्यांची पडताळणी करते.',
  te: 'GreenLedger పర్యావరణ మరియు స్థిరత్వ క్లెయిమ్‌లను మాత్రమే ధృవీకరిస్తుంది.',
  ta: 'GreenLedger சுற்றுச்சூழல் மற்றும் நிலைத்தன்மைக் கோரிக்கைகளை மட்டுமே சரிபார்க்கிறது.',
  kn: 'GreenLedger ಪರಿಸರ ಮತ್ತು ಸುಸ್ಥಿರತೆಯ ಹಕ್ಕುಗಳನ್ನು ಮಾತ್ರ ಪರಿಶೀಲಿಸುತ್ತದೆ.',
};

export const LOCALIZED_VERDICT_LABELS: Record<SupportedLanguage, Record<VerificationStatus, string>> = {
  en: {
    VERIFIED: 'Verified',
    INSUFFICIENT_EVIDENCE: 'Insufficient Evidence',
    POTENTIAL_GREENWASHING: 'Potential Greenwashing',
  },
  hi: {
    VERIFIED: 'सत्यापित',
    INSUFFICIENT_EVIDENCE: 'अपर्याप्त प्रमाण',
    POTENTIAL_GREENWASHING: 'संभावित ग्रीनवॉशिंग',
  },
  hinglish: {
    VERIFIED: 'Verified',
    INSUFFICIENT_EVIDENCE: 'Sufficient evidence nahi mila',
    POTENTIAL_GREENWASHING: 'Potential Greenwashing',
  },
  bn: {
    VERIFIED: 'যাচাইকৃত',
    INSUFFICIENT_EVIDENCE: 'পর্যাপ্ত প্রমাণ নেই',
    POTENTIAL_GREENWASHING: 'সম্ভাব্য গ্রিনওয়াশিং',
  },
  mr: {
    VERIFIED: 'सत्यापित',
    INSUFFICIENT_EVIDENCE: 'पुरेसा पुरावा उपलब्ध नाही',
    POTENTIAL_GREENWASHING: 'संभाव्य ग्रीनवॉशिंग',
  },
  te: {
    VERIFIED: 'ధృవీకరించబడింది',
    INSUFFICIENT_EVIDENCE: 'తగిన ఆధారాలు లేవు',
    POTENTIAL_GREENWASHING: 'సంభావ్య గ్రీన్వాషింగ్',
  },
  ta: {
    VERIFIED: 'சரிபார்க்கப்பட்டது',
    INSUFFICIENT_EVIDENCE: 'போதுமான ஆதாரம் இல்லை',
    POTENTIAL_GREENWASHING: 'சாத்தியமான கிரீன்வாஷிங்',
  },
  kn: {
    VERIFIED: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
    INSUFFICIENT_EVIDENCE: 'ಸಾಕಷ್ಟು ಪುರಾವೆಗಳಿಲ್ಲ',
    POTENTIAL_GREENWASHING: 'ಸಂಭಾವ್ಯ ಗ್ರೀನ್ವಾಷಿಂಗ್',
  },
};

export const LOCALIZED_VERDICT_EXPLANATIONS: Record<SupportedLanguage, Record<VerificationStatus, string>> = {
  en: {
    VERIFIED: 'Available reliable evidence sufficiently supports this claim.',
    INSUFFICIENT_EVIDENCE: 'There is not enough reliable public evidence to confidently verify this claim.',
    POTENTIAL_GREENWASHING: 'Contradictions, vague language, or lack of independent certifications indicate potential greenwashing.',
  },
  hi: {
    VERIFIED: 'उपलब्ध विश्वसनीय प्रमाण इस दावे का पर्याप्त समर्थन करते हैं।',
    INSUFFICIENT_EVIDENCE: 'इस दावे को विश्वासपूर्वक सत्यापित करने के लिए पर्याप्त विश्वसनीय सार्वजनिक प्रमाण उपलब्ध नहीं हैं।',
    POTENTIAL_GREENWASHING: 'विरोधाभास, अस्पष्ट भाषा, या स्वतंत्र प्रमाणन की कमी संभावित ग्रीनवॉशिंग का संकेत देती है।',
  },
  hinglish: {
    VERIFIED: 'Available reliable evidence is claim ko sufficiently support karta hai.',
    INSUFFICIENT_EVIDENCE: 'Is claim ko confidently verify karne ke liye sufficient reliable public evidence available nahi hai.',
    POTENTIAL_GREENWASHING: 'Contradictions, vague language, ya independent certifications ki kami potential greenwashing indicate karti hai.',
  },
  bn: {
    VERIFIED: 'উপলব্ধ নির্ভরযোগ্য প্রমাণ এই দাবিকে পর্যাপ্তভাবে সমর্থন করে।',
    INSUFFICIENT_EVIDENCE: 'এই দাবিটি আত্মবিশ্বাসের সাথে যাচাই করার মতো পর্যাপ্ত নির্ভরযোগ্য সর্বজনীন প্রমাণ নেই।',
    POTENTIAL_GREENWASHING: 'স্ববিরোধিতা, অস্পষ্ট ভাষা, বা স্বাধীন শংসাপত্রের অভাব সম্ভাব্য গ্রিনওয়াশিং নির্দেশ করে।',
  },
  mr: {
    VERIFIED: 'उपलब्ध विश्वसनीय पुरावे या दाव्याचे पुरेसे समर्थन करतात.',
    INSUFFICIENT_EVIDENCE: 'या दाव्याची आत्मविश्वासाने पडताळणी करण्यासाठी पुरेसा विश्वासार्ह सार्वजनिक पुरावा उपलब्ध नाही.',
    POTENTIAL_GREENWASHING: 'विसंगती, अस्पष्ट भाषा, किंवा स्वतंत्र प्रमाणपत्रांचा अभाव संभाव्य ग्रीनवॉशिंग दर्शवतो.',
  },
  te: {
    VERIFIED: 'అందుబాటులో ఉన్న విశ్వసనీయ ఆధారాలు ఈ దావాకు తగినంత మద్దతు ఇస్తున్నాయి.',
    INSUFFICIENT_EVIDENCE: 'ఈ దావాను నమ్మకంగా ధృవీకరించడానికి తగినంత విశ్వసనీయమైన పబ్లిక్ ఆధారాలు లేవు.',
    POTENTIAL_GREENWASHING: 'వైరుధ్యాలు, అస్పష్టమైన భాష లేదా స్వతంత్ర ధృవీకరణల లేకపోవడం సంభావ్య గ్రీన్వాషింగ్‌ను సూచిస్తాయి.',
  },
  ta: {
    VERIFIED: 'கிடைக்கக்கூடிய நம்பகமான சான்றுகள் இந்தக் கோரிக்கையை போதுமான அளவு ஆதரிக்கின்றன.',
    INSUFFICIENT_EVIDENCE: 'இந்தக் கோரிக்கையை நம்பிக்கையுடன் சரிபார்க்க போதுமான நம்பகமான பொது சான்றுகள் இல்லை.',
    POTENTIAL_GREENWASHING: 'முரண்பாடுகள், தெளிவற்ற மொழி அல்லது சுயாதீன சான்றிதழ்களின் பற்றாக்குறை சாத்தியமான கிரீன்வாஷிங்கைக் குறிக்கின்றன.',
  },
  kn: {
    VERIFIED: 'ಲಭ್ಯವಿರುವ ವಿಶ್ವಾಸಾರ್ಹ ಪುರಾವೆಗಳು ಈ ಹಕ್ಕನ್ನು ಸಮರ್ಪಕವಾಗಿ ಬೆಂಬಲಿಸುತ್ತವೆ.',
    INSUFFICIENT_EVIDENCE: 'ಈ ಹಕ್ಕನ್ನು ವಿಶ್ವಾಸದಿಂದ ಪರಿಶೀಲಿಸಲು ಸಾಕಷ್ಟು ವಿಶ್ವಾಸಾರ್ಹ ಸಾರ್ವಜನಿಕ ಪುರಾವೆಗಳಿಲ್ಲ.',
    POTENTIAL_GREENWASHING: 'ವಿರೋಧಾಭಾಸಗಳು, ಅಸ್ಪಷ್ಟ ಭಾಷೆ ಅಥವಾ ಸ್ವತಂತ್ರ ಪ್ರಮಾಣೀಕರಣಗಳ ಕೊರತೆಯು ಸಂಭಾವ್ಯ ಗ್ರೀನ್‌ವಾಶಿಂಗ್ ಅನ್ನು ಸೂಚಿಸುತ್ತದೆ.',
  },
};

// ── 6. Full Multilingual Analysis Pipeline ────────────────────
export function analyzeMultilingualClaim(
  rawClaim: string,
  languageHint?: SupportedLanguage
): MultilingualAnalysisResult {
  const originalClaim = (rawClaim || '').trim();

  // 1. Detect language
  const { language, confidence: detectedConfidence } = detectLanguage(originalClaim, languageHint);

  if (!originalClaim || originalClaim.length < 3) {
    return {
      valid: false,
      isEnvironmentalClaim: false,
      language,
      detectedConfidence,
      originalClaim,
      normalizedClaim: originalClaim,
      claimType: 'not_environmental',
      attributes: { environmentalAttribute: 'not_environmental' },
      errorType: 'EMPTY_INPUT',
      message: 'Please enter a valid claim text.',
    };
  }

  // 2. Check explicitly non-environmental phrases (camera, battery, greetings, cricket, etc.)
  for (const regex of NON_ENV_REGEXES) {
    if (regex.test(originalClaim)) {
      return {
        valid: false,
        isEnvironmentalClaim: false,
        language,
        detectedConfidence,
        originalClaim,
        normalizedClaim: originalClaim,
        claimType: 'not_environmental',
        attributes: { environmentalAttribute: 'not_environmental' },
        errorType: 'NON_ENVIRONMENTAL_CLAIM',
        message: LOCALIZED_NON_ENV_MESSAGES[language] || LOCALIZED_NON_ENV_MESSAGES.en,
        suggestion:
          language === 'hi'
            ? 'पुनर्नवीनीकरण सामग्री, कार्बन उत्सर्जन या पर्यावरण प्रमाणपत्रों से संबंधित दावा दर्ज करें।'
            : language === 'hinglish'
            ? 'Recycled content, carbon emissions ya eco-certifications se related claim enter karein.'
            : 'Try a claim about recycled content, recyclability, carbon emissions, renewable materials, or certifications.',
      };
    }
  }

  // 3. Normalize numerals (Indic -> Arabic: e.g. ८०% or ৮০% -> 80%)
  const numeralNormalized = normalizeIndicNumerals(originalClaim);

  // 4. Match environmental criteria
  let isEnv = false;
  for (const regex of ENV_KEYWORDS_MULTILINGUAL) {
    if (regex.test(numeralNormalized)) {
      isEnv = true;
      break;
    }
  }

  if (!isEnv) {
    return {
      valid: false,
      isEnvironmentalClaim: false,
      language,
      detectedConfidence,
      originalClaim,
      normalizedClaim: originalClaim,
      claimType: 'not_environmental',
      attributes: { environmentalAttribute: 'not_environmental' },
      errorType: 'NON_ENVIRONMENTAL_CLAIM',
      message: LOCALIZED_NON_ENV_MESSAGES[language] || LOCALIZED_NON_ENV_MESSAGES.en,
      suggestion: 'Try entering an environmental sustainability claim from packaging or corporate reports.',
    };
  }

  // 5. Extract structured dimensions (material, percentage, scope, attribute)
  // Percentage
  let percentage: number | undefined;
  const pctMatch = numeralNormalized.match(/(\d{1,3})\s*%/);
  if (pctMatch) {
    const parsed = parseInt(pctMatch[1], 10);
    if (parsed >= 0 && parsed <= 100) {
      percentage = parsed;
    }
  }

  // Material
  let material: string | undefined;
  if (/paper|কাগজ|कागद|कागज|காகிதம்|కాగితం|ಕಾಗದ|cardboard|carton/i.test(numeralNormalized)) {
    material = 'paper';
  } else if (/plastic|প্লাস্টিক|प्लास्टिक|பிளாஸ்டிக்|ప్లాస్టిక్|ಪ್ಲಾಸ್ಟಿಕ್/i.test(numeralNormalized)) {
    material = 'plastic';
  } else if (/cotton|সুতি|कापूस|कपास|பருத்தி|పత్తి|ಹತ್ತಿ/i.test(numeralNormalized)) {
    material = 'cotton';
  } else if (/bamboo|বাঁশ|बांबू|बांस|மூங்கில்|వెదురు|ಬಿದಿರು/i.test(numeralNormalized)) {
    material = 'bamboo';
  } else if (/aluminum|aluminium|एल्युमिनियम|அலுமಿನியம்/i.test(numeralNormalized)) {
    material = 'aluminum';
  } else if (/glass|कांच|কাচ|గాజు|ಗಾಜು/i.test(numeralNormalized)) {
    material = 'glass';
  }

  // Scope
  let scope: 'packaging' | 'product' | 'manufacturing' = 'product';
  if (/packaging|mailer|box|bottle|bag|पैकेजिंग|প্যাকেজিং|पॅकेजिंग|ప్యాకేజింగ్|பேக்கேஜிங்|ಪ್ಯಾಕೇಜಿಂಗ್/i.test(numeralNormalized)) {
    scope = 'packaging';
  }

  // Attribute & Claim Type
  let claimType = 'other_environmental_claim';
  let environmentalAttribute = 'sustainability';

  if (/recycled|पुनर्नवीनीकरण|पुनर्चक्रित|पुनर्वापर|পুনর্ব্যবহৃত|రీసైకిల్|மறுசுழற்சி|ಮರುಬಳಕೆ/i.test(numeralNormalized)) {
    claimType = 'recycled_content';
    environmentalAttribute = 'recycled content';
  } else if (/recyclable|पुनर्चक्रणीय|पुनर्वापरयोग्य|পুনর্ব্যবহারযোগ্য|పునర్వినియోగించదగిన|மறுசுழற்சி செய்யக்கூடிய|ಮರುಬಳಕೆ ಮಾಡಬಹುದಾದ/i.test(numeralNormalized)) {
    claimType = 'recyclable';
    environmentalAttribute = 'recyclability';
  } else if (/biodegradable|जैव निम्नीकरणीय|बायोडिग्रेडेबल|বায়োডিগ্রেডেবল|బయోడిగ్రేడబుల్|மக்கும்|ಜೈವಿಕ ವಿಘಟನೀಯ/i.test(numeralNormalized)) {
    claimType = 'biodegradable';
    environmentalAttribute = 'biodegradability';
  } else if (/compostable|कंपोस्टेबल|কম্পোস্টেবল|కంపోస్టబుల్|உரமாகும்|ಕಾಂಪೋಸ್ಟೆಬಲ್/i.test(numeralNormalized)) {
    claimType = 'compostable';
    environmentalAttribute = 'compostability';
  } else if (/carbon|emissions|footprint|कार्बन|কার্বন|ఉద్గಾರాలు|உமிழ்வு|ಹೊರಸೂಸುವಿಕೆ/i.test(numeralNormalized)) {
    claimType = 'carbon_emissions';
    environmentalAttribute = 'carbon footprint';
  }

  // Measurable metric
  const measurableMetric = percentage !== undefined ? `${percentage}% ${environmentalAttribute}` : undefined;

  // 6. Build canonical English normalized claim preserving exact semantics
  let normalizedClaim = originalClaim;
  if (language !== 'en') {
    if (claimType === 'recycled_content') {
      const scopeWord = scope === 'packaging' ? 'Product packaging' : 'Product';
      const pctWord = percentage !== undefined ? `${percentage}% ` : '';
      const matWord = material ? `${material}` : 'recycled material';
      normalizedClaim = `${scopeWord} contains ${pctWord}recycled ${matWord}.`.replace(/\s+/g, ' ').trim();
    } else if (claimType === 'carbon_emissions') {
      const pctWord = percentage !== undefined ? `${percentage}% lower ` : '';
      normalizedClaim = `${pctWord}carbon footprint emissions.`;
    } else if (claimType === 'biodegradable') {
      normalizedClaim = `100% biodegradable ${scope}.`;
    } else if (claimType === 'compostable') {
      normalizedClaim = `100% compostable ${scope}.`;
    } else if (claimType === 'recyclable') {
      normalizedClaim = `100% recyclable ${scope}.`;
    }
  }

  return {
    valid: true,
    isEnvironmentalClaim: true,
    language,
    detectedConfidence,
    originalClaim,
    normalizedClaim,
    claimType,
    attributes: {
      material,
      percentage,
      environmentalAttribute,
      scope,
      measurableMetric,
    },
  };
}
