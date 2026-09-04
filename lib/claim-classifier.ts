// ============================================================
// GreenLedger — Environmental Claim Relevance Classifier
// Validates whether submitted text represents an authentic
// environmental, material, lifecycle, packaging, or ESG claim
// BEFORE entering the evidence retrieval and verification pipeline.
// ============================================================

export type EnvironmentalClaimCategory =
  | 'recycled_content'
  | 'recyclable'
  | 'biodegradable'
  | 'compostable'
  | 'renewable_material'
  | 'carbon_emissions'
  | 'carbon_neutral'
  | 'net_zero'
  | 'renewable_energy'
  | 'sustainable_material'
  | 'plastic_reduction'
  | 'water_usage'
  | 'energy_efficiency'
  | 'waste_reduction'
  | 'sustainable_packaging'
  | 'ethical_environmental_certification'
  | 'lifecycle_environmental_claim'
  | 'other_environmental_claim'
  | 'not_environmental';

export interface ClaimClassificationResult {
  valid: boolean;
  isEnvironmentalClaim: boolean;
  claimCategory: EnvironmentalClaimCategory;
  reason: string;
  confidence: number;
  errorType?: 'EMPTY_INPUT' | 'TOO_SHORT' | 'NON_ENVIRONMENTAL_CLAIM' | 'CODE_OR_MATH' | 'GREETING';
  message?: string;
  suggestion?: string;
}

// ── Pattern Sets ─────────────────────────────────────────────

// Obvious non-environmental patterns
const GREETINGS = [
  /^hello\b/i,
  /^hi\b/i,
  /^hey\b/i,
  /^greetings\b/i,
  /^good\s*(morning|afternoon|evening|day)\b/i,
  /^howdy\b/i,
  /^what'?s\s*up\b/i,
  /^how\s+are\s+you\b/i,
];

const CODE_AND_MATH = [
  /^[0-9\s\+\-\*\/\=\^\(\)\.\%]+$/, // pure math like "2 + 2" or "4 * 5 = 20"
  /^(console\.log|function|def |class |var |let |const |import |select \*|<html>|<\w+>)/i,
  /[{}<>;]\s*$/,
];

const QUESTIONS_GENERAL = [
  /^what\s+is\s+(ai|artificial intelligence|machine learning|python|the weather|love|life)\b/i,
  /^who\s+is\s+/i,
  /^tell\s+me\s+(a\s+joke|a\s+poem|about|how)\b/i,
  /^write\s+(me\s+)?(a\s+poem|a\s+story|code|an\s+essay)\b/i,
  /^where\s+is\s+/i,
];

// Product praises/complaints that lack environmental criteria
const NON_ENV_PRODUCT_PHRASES = [
  /\b(great|amazing|good|bad|terrible|awesome|nice)\s+(camera|screen|battery|performance|display|sound|audio|lens|processor|speed)\b/i,
  /\b(cheap|expensive|costly|affordable|overpriced|pricey|worth it|waste of money)\b/i,
  /\b(i\s+love|i\s+like|i\s+hate|i\s+want\s+to\s+buy|i\s+bought)\s+this\s+(phone|product|item|device|laptop|car|tv|book)\b/i,
  /\b(fast\s+shipping|poor\s+customer\s+service|arrived\s+broken|five\s+stars|one\s+star)\b/i,
  /\b(cricketer|footballer|actor|singer|celebrity|politician|movie|song)\b/i,
  /\b(is\s+a\s+cricketer|is\s+a\s+footballer|is\s+a\s+player|plays\s+for)\b/i,
  /\bour\s+product\s+is\s+(good|nice|cool|the\s+best|awesome|great)\b/i,
  /\bthis\s+phone\s+has\s+an?\s+(amazing|great|good|bad)\s+camera\b/i,
];

// Environmental Category Keywords & Indicators
interface CategoryRule {
  category: EnvironmentalClaimCategory;
  patterns: RegExp[];
  confidence: number;
}

const ENVIRONMENTAL_CATEGORY_RULES: CategoryRule[] = [
  {
    category: 'recycled_content',
    patterns: [
      /\b(\d+%\s*)?recycled\s+(plastic|paper|content|material|aluminum|aluminium|cardboard|fibre|fiber|steel|glass|ocean\s*plastic|post-consumer|pcr)\b/i,
      /\bmade\s+(with|from)\s+(\d+%\s*)?recycled\b/i,
      /\bpost-consumer\s+recycled\b/i,
      /\bcontains\s+(\d+%\s*)?recycled\b/i,
    ],
    confidence: 0.95,
  },
  {
    category: 'recyclable',
    patterns: [
      /\b100%\s*recyclable\b/i,
      /\b(fully|widely|curbside|infinitely|easily)\s*recyclable\b/i,
      /\brecyclable\s+(packaging|bottle|box|mailer|can|container|paper|material)\b/i,
      /\bdesign(ed)?\s+for\s+recycl(ing|ability)\b/i,
    ],
    confidence: 0.95,
  },
  {
    category: 'biodegradable',
    patterns: [
      /\b(100%\s*)?biodegradable\b/i,
      /\bbiodegrades\s+in\b/i,
      /\bnaturally\s+biodegradable\b/i,
      /\bmarine\s+biodegradable\b/i,
    ],
    confidence: 0.95,
  },
  {
    category: 'compostable',
    patterns: [
      /\b(100%\s*)?compostable\b/i,
      /\b(home|industrial|commercially)\s+compostable\b/i,
      /\ben\s*13432\b/i,
      /\bastm\s*d6400\b/i,
    ],
    confidence: 0.95,
  },
  {
    category: 'carbon_neutral',
    patterns: [
      /\bcarbon\s*neutral(ity)?\b/i,
      /\bclimate\s*neutral(ity)?\b/i,
      /\bcarbon\s*negative\b/i,
      /\bclimate\s*positive\b/i,
      /\bnet\s*zero\s*(emissions|carbon|energy)?\b/i,
      /\bpas\s*2060\b/i,
    ],
    confidence: 0.95,
  },
  {
    category: 'carbon_emissions',
    patterns: [
      /\b(\d+%\s*)?(lower|reduced|less|zero)\s+carbon(\s+emissions|\s+footprint)?\b/i,
      /\b(co2|ghg|greenhouse\s*gas)\s+(emissions|reduction|footprint)\b/i,
      /\bscope\s*[123]\s+emissions\b/i,
      /\bcarbon\s*(reduction|saving|intensity|offset)\b/i,
    ],
    confidence: 0.9,
  },
  {
    category: 'renewable_energy',
    patterns: [
      /\b(100%\s*)?renewable\s+(energy|electricity|power)\b/i,
      /\bpowered\s+by\s+(solar|wind|clean\s+energy|renewables)\b/i,
      /\bmanufactured\s+(using|with)\s+(\d+%\s*)?renewable\b/i,
      /\bgreen\s+power\b/i,
    ],
    confidence: 0.92,
  },
  {
    category: 'sustainable_packaging',
    patterns: [
      /\b(eco-friendly|sustainable|zero-waste|green)\s+packaging\b/i,
      /\bplastic-free\s+(packaging|shipping|mailer|bottle)\b/i,
      /\bminimal(ist)?\s+packaging\b/i,
      /\brefillable\s+(bottle|pouch|container|packaging)\b/i,
    ],
    confidence: 0.9,
  },
  {
    category: 'plastic_reduction',
    patterns: [
      /\bplastic\s*free\b/i,
      /\b(\d+%\s*)?less\s+plastic\b/i,
      /\bzero\s+single-use\s+plastic\b/i,
      /\bocean-bound\s+plastic\b/i,
    ],
    confidence: 0.9,
  },
  {
    category: 'ethical_environmental_certification',
    patterns: [
      /\b(fsc|fsc-certified|pefc|grs|global\s+recycled\s+standard)\b/i,
      /\b(eu\s+ecolabel|nordic\s+swan|blue\s+angel)\b/i,
      /\b(gots|global\s+organic\s+textile|cradle\s+to\s+cradle|c2c)\b/i,
      /\b(iso\s*14021|iso\s*14040|iso\s*14044|iso\s*14067)\b/i,
      /\benergy\s*star\b/i,
      /\brainforest\s*alliance\b/i,
      /\bcarbon\s*trust\b/i,
    ],
    confidence: 0.95,
  },
  {
    category: 'water_usage',
    patterns: [
      /\b(\d+%\s*)?(water\s+saving|less\s+water|water\s+reduction|water\s+neutral)\b/i,
      /\bwater\s+footprint\b/i,
      /\bclosed-loop\s+water\b/i,
    ],
    confidence: 0.88,
  },
  {
    category: 'energy_efficiency',
    patterns: [
      /\benergy\s+efficient\b/i,
      /\b(\d+%\s*)?less\s+energy\b/i,
      /\blow\s+power\s+consumption\b/i,
      /\benergy\s+conservation\b/i,
    ],
    confidence: 0.88,
  },
  {
    category: 'waste_reduction',
    patterns: [
      /\bzero\s+waste\s*(to\s+landfill)?\b/i,
      /\bcircular\s+(economy|design|model)\b/i,
      /\bclosed\s+loop\b/i,
      /\bupcycled\b/i,
    ],
    confidence: 0.88,
  },
  {
    category: 'sustainable_material',
    patterns: [
      /\b(organic\s+cotton|organic\s+wool|organic\s+linen)\b/i,
      /\bsustainably\s+(sourced|harvested|farmed|produced)\b/i,
      /\bresponsibly\s+(sourced|forestry|managed)\b/i,
      /\bplant-based\s+(material|plastic|fiber|leather)\b/i,
      /\bbio-based\s+(material|polymer|carbon)\b/i,
      /\brenewable\s+(materials?|resource)\b/i,
    ],
    confidence: 0.9,
  },
  {
    category: 'other_environmental_claim',
    patterns: [
      /\b100%\s*(eco-friendly|eco\s*friendly|sustainable|green|planet\s*friendly)\b/i,
      /\b(eco-friendly|eco\s*friendly|planet\s*friendly|environmentally\s*friendly)\b/i,
      /\b(sustainable\s+product|sustainability\s+commitment|environmental\s+impact)\b/i,
      /\bnon-toxic\s+to\s+(aquatic|marine|environment)\b/i,
    ],
    confidence: 0.82,
  },
];

/**
 * Validates and classifies whether user text is an authentic environmental claim.
 */
export function classifyEnvironmentalClaim(rawText: string): ClaimClassificationResult {
  const text = (rawText || '').trim();

  // STEP 1: Basic Input Validation
  if (!text) {
    return {
      valid: false,
      isEnvironmentalClaim: false,
      claimCategory: 'not_environmental',
      reason: 'Claim input cannot be empty.',
      confidence: 1.0,
      errorType: 'EMPTY_INPUT',
      message: 'Please enter a product environmental or sustainability statement.',
    };
  }

  if (text.length < 4) {
    return {
      valid: false,
      isEnvironmentalClaim: false,
      claimCategory: 'not_environmental',
      reason: 'Input is too short to constitute an environmental statement.',
      confidence: 1.0,
      errorType: 'TOO_SHORT',
      message: 'Input statement is too short to evaluate. Please provide the full environmental claim.',
      suggestion: 'Try a claim like "100% Recyclable Packaging" or "Made with 70% recycled plastic".',
    };
  }

  // Check greetings
  for (const pattern of GREETINGS) {
    if (pattern.test(text)) {
      return {
        valid: false,
        isEnvironmentalClaim: false,
        claimCategory: 'not_environmental',
        reason: 'Greeting detected without environmental statement.',
        confidence: 0.99,
        errorType: 'GREETING',
        message: 'GreenLedger verifies environmental and sustainability claims only.',
        suggestion: 'Try a claim about recycled content, recyclability, carbon emissions, renewable materials, or sustainable packaging.',
      };
    }
  }

  // Check math or code
  for (const pattern of CODE_AND_MATH) {
    if (pattern.test(text)) {
      return {
        valid: false,
        isEnvironmentalClaim: false,
        claimCategory: 'not_environmental',
        reason: 'Input contains mathematical expressions or computer code.',
        confidence: 0.99,
        errorType: 'CODE_OR_MATH',
        message: 'Mathematical formulas or code cannot be verified as product environmental claims.',
        suggestion: 'Enter product sustainability text from packaging, ads, or corporate reports.',
      };
    }
  }

  // Check general questions / assistant prompts
  for (const pattern of QUESTIONS_GENERAL) {
    if (pattern.test(text)) {
      return {
        valid: false,
        isEnvironmentalClaim: false,
        claimCategory: 'not_environmental',
        reason: 'General question or command detected rather than a product sustainability claim.',
        confidence: 0.98,
        errorType: 'NON_ENVIRONMENTAL_CLAIM',
        message: 'GreenLedger verifies environmental and sustainability claims only.',
        suggestion: 'Try a claim about recycled content, recyclability, carbon emissions, renewable materials, sustainable packaging, certifications, or similar environmental attributes.',
      };
    }
  }

  // Check non-environmental product talk (e.g. camera, speed, price, cricket)
  let nonEnvMatch = false;
  for (const pattern of NON_ENV_PRODUCT_PHRASES) {
    if (pattern.test(text)) {
      nonEnvMatch = true;
      break;
    }
  }

  // STEP 2: Match against environmental criteria categories
  for (const rule of ENVIRONMENTAL_CATEGORY_RULES) {
    for (const pattern of rule.patterns) {
      if (pattern.test(text)) {
        return {
          valid: true,
          isEnvironmentalClaim: true,
          claimCategory: rule.category,
          reason: `Matched environmental criteria in category: ${rule.category.replace(/_/g, ' ')}.`,
          confidence: rule.confidence,
        };
      }
    }
  }

  // If non-environmental product phrase was explicitly detected OR no environmental keywords matched:
  return {
    valid: false,
    isEnvironmentalClaim: false,
    claimCategory: 'not_environmental',
    reason: nonEnvMatch
      ? 'Input refers to general product features, pricing, or opinions rather than environmental sustainability.'
      : 'No recognizable environmental or sustainability claim criteria identified in the text.',
    confidence: 0.95,
    errorType: 'NON_ENVIRONMENTAL_CLAIM',
    message: 'GreenLedger verifies environmental and sustainability claims only.',
    suggestion: 'Try a claim about recycled content, recyclability, carbon emissions, renewable materials, sustainable packaging, certifications, or similar environmental attributes.',
  };
}
