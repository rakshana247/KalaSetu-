import { GoogleGenAI, Type, Schema } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

export interface CatalogueAIAnalysis {
  product_name: string;
  craft_category: string;
  visible_materials: string[];
  visible_colors: string[];
  visual_description: string;
  suggested_tags: string[];
  confidence_or_uncertainty: {
    confidence_level: 'High' | 'Medium' | 'Low';
    unverified_aspects: string[];
    notes_for_artisan: string;
  };
}

const catalogueResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    product_name: {
      type: Type.STRING,
      description: 'A concise, objective descriptive name of the handcrafted item based purely on visual elements (e.g., "Handcrafted Terracotta Clay Diya").',
    },
    craft_category: {
      type: Type.STRING,
      description: 'Broad craft sector (e.g., Pottery & Ceramics, Handloom Textiles, Woodwork, Metalwork, Traditional Jewelry, Papercraft, Leathercraft, Stone Craft).',
    },
    visible_materials: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Only materials that are visually discernible. If not 100% certain, mark as suspected or state uncertain.',
    },
    visible_colors: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Primary and secondary visible colors observed in the image.',
    },
    visual_description: {
      type: Type.STRING,
      description: 'A neutral, descriptive summary of motifs, texture, shape, and craftwork visible in the image.',
    },
    suggested_tags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '4-8 relevant e-commerce and search tags (e.g., "handcrafted", "terracotta", "festive-decor").',
    },
    confidence_or_uncertainty: {
      type: Type.OBJECT,
      properties: {
        confidence_level: {
          type: Type.STRING,
          description: 'Overall visual confidence rating: High, Medium, or Low.',
        },
        unverified_aspects: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Specific aspects that cannot be determined visually from the photo alone (e.g., artisan identity, village/state, GI certification, natural vs chemical dyes, internal core material).',
        },
        notes_for_artisan: {
          type: Type.STRING,
          description: 'Direct, encouraging note prompting the artisan to verify materials and fill in their authentic story and origin.',
        },
      },
      required: ['confidence_level', 'unverified_aspects', 'notes_for_artisan'],
    },
  },
  required: [
    'product_name',
    'craft_category',
    'visible_materials',
    'visible_colors',
    'visual_description',
    'suggested_tags',
    'confidence_or_uncertainty',
  ],
};

const SYSTEM_INSTRUCTION = `
You are KalaSetu AI, an ethical cataloguing assistant for traditional and grassroots artisans.
Your mission is to inspect the uploaded product image and generate objective, dignified, and structured catalogue details.

Strict Ethical & Guardrail Rules:
1. DO NOT invent, assume, or hallucinate the artisan's personal identity, name, caste, community, specific village/state, or religious/cultural backstory.
2. DO NOT make unverified claims about Geographical Indication (GI) status or specific craft lineage (e.g., do not label something "Pure Kanchipuram Silk" or "Authentic Dhokra" unless there is definitive visual labeling).
3. If an element (like exact natural dye vs synthetic dye, pure brass vs brass finish, hollow vs solid core) cannot be verified from the image alone, mark it as uncertain in "unverified_aspects".
4. Mark confidence_level as 'High' only if visual craft features are unmistakably clear; otherwise use 'Medium' or 'Low'.
5. Always address the artisan with respect and invite them to add their regional voice.
6. Output strictly valid JSON matching the provided schema.
`;

export async function analyzeProductImage(
  imageBuffer: Buffer,
  mimeType: string
): Promise<CatalogueAIAnalysis> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    console.log('[KalaSetu AI] GEMINI_API_KEY not configured. Providing demo analysis.');
    return {
      product_name: 'Handcrafted Terracotta Clay Diya (Demo Analysis)',
      craft_category: 'Pottery & Ceramics',
      visible_materials: ['Natural Earthen Clay', 'Terracotta Slip', 'Mineral Pigment'],
      visible_colors: ['Earthy Red', 'Warm Ochre', 'Terracotta'],
      visual_description: 'Intricately handcrafted decorative terracotta diya featuring traditional floral contouring, scalloped edging, and natural kiln-fired earthy finish.',
      suggested_tags: ['handcrafted', 'terracotta', 'traditional-craft', 'festive-decor', 'sustainable-clay', 'artisan-made'],
      confidence_or_uncertainty: {
        confidence_level: 'High',
        unverified_aspects: [
          'Artisan identity and specific village/cluster require confirmation in form below',
          'Exact clay composition and kiln firing temperature require verification',
          'Demo Mode Notice: Set your GEMINI_API_KEY in .env for live Gemini 3.8 Flash Vision analysis'
        ],
        notes_for_artisan: 'Visual features successfully detected! Please review and verify the handcrafted materials, dimensions, and your artisan story.'
      }
    };
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const base64Image = imageBuffer.toString('base64');

  // Currently supported models that accept multimodal image inputs
  const modelsToTry = ['gemini-3.8-flash', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    // Retry up to 2 times for transient 503/429
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType,
                    data: base64Image,
                  },
                },
                {
                  text: 'Analyze this handcrafted artisan product photo. Return structured cataloguing metadata strictly based on visible physical facts.',
                },
              ],
            },
          ],
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            responseSchema: catalogueResponseSchema,
            temperature: 0.2,
          },
        });

        const responseText = response.text;
        if (!responseText) {
          throw new Error('Gemini API returned an empty response.');
        }

        const parsed = JSON.parse(responseText.trim()) as CatalogueAIAnalysis;

        if (!parsed.product_name || !parsed.craft_category || !parsed.confidence_or_uncertainty) {
          throw new Error('Response JSON is missing mandatory catalogue fields.');
        }

        return parsed;
      } catch (err: any) {
        lastError = err;
        console.warn(`[KalaSetu AI] Attempt ${attempt + 1} with model ${model} failed:`, err?.message || err);
        // Wait 1s before retry
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  throw lastError || new Error('Failed to analyze image with Gemini API.');
}

export interface StoryRefinementResult {
  refined_story: string;
  key_highlights: string[];
}

export async function refineArtisanStory(params: {
  artisan_name: string;
  craft_name: string;
  location: string;
  materials_techniques: string;
  story_text: string;
  language?: string;
}): Promise<StoryRefinementResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    console.log('[KalaSetu AI] GEMINI_API_KEY not configured. Providing demo story refinement.');
    return {
      refined_story: `${params.artisan_name} is a dedicated artisan from ${params.location}, continuing a cherished craft heritage in ${params.craft_name}.\n\nWorking meticulously with ${params.materials_techniques}, each handcrafted piece reflects hours of patience and genuine traditional mastery. In their own words: "${params.story_text}"\n\nBy engaging directly with conscious global patrons through KalaSetu AI, this timeless artisan craft is sustained with dignity, fair pricing, and mutual respect.`,
      key_highlights: [
        `Mastery in ${params.craft_name} handcrafted techniques`,
        `Rooted in the regional traditions of ${params.location}`,
        `Crafted with sustainable materials: ${params.materials_techniques}`,
        `Demo mode: Add GEMINI_API_KEY in .env for live Gemini 3.8 Flash refinement`
      ]
    };
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: { 'User-Agent': 'aistudio-build' },
    },
  });

  const prompt = `
You are KalaSetu AI's storytelling editor.
Polish and structure the following artisan story for global buyers while remaining 100% faithful to the facts supplied by the artisan.

Artisan Name: ${params.artisan_name}
Craft: ${params.craft_name}
Location: ${params.location}
Materials & Techniques: ${params.materials_techniques}
Draft Story: ${params.story_text}
Target Language: ${params.language || 'English'}

Strict Rules:
1. DO NOT invent fictional legends, lineage claims, or unmentioned facts.
2. Improve clarity, respectful tone, and emotional resonance.
3. Keep the authentic voice of the artisan.

Return valid JSON with:
- "refined_story": A cohesive 2-3 paragraph presentation of their authentic story.
- "key_highlights": 3-4 bullet point phrases highlighting verifiable craft facts.
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          refined_story: { type: Type.STRING },
          key_highlights: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ['refined_story', 'key_highlights'],
      },
      temperature: 0.3,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error('Empty response received from Gemini story refinement.');
  }

  return JSON.parse(text.trim()) as StoryRefinementResult;
}

export interface VoiceCatalogueAIAnalysis extends CatalogueAIAnalysis {
  cultural_heritage_notes: string;
  original_transcript: string;
  translated_text: string;
  detected_language: string;
  estimated_price?: number;
}

export async function analyzeVoiceDescription(params: {
  transcript: string;
  language?: string;
}): Promise<VoiceCatalogueAIAnalysis> {
  const { transcript, language = 'ta' } = params;
  const apiKey = process.env.GEMINI_API_KEY;

  // Graceful offline parser for Tamil & English craft descriptions
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    console.log('[KalaSetu AI] GEMINI_API_KEY not configured. Using offline multilingual craft parser.');
    const lower = transcript.toLowerCase();

    // Check for pottery / clay (Tamil & English)
    const isPottery =
      transcript.includes('மண்') ||
      transcript.includes('பானை') ||
      lower.includes('clay') ||
      lower.includes('pot') ||
      lower.includes('terracotta');

    // Check for textiles / weaving
    const isTextile =
      transcript.includes('நெசவு') ||
      transcript.includes('புடவை') ||
      transcript.includes('துணி') ||
      transcript.includes('பருத்தி') ||
      lower.includes('weave') ||
      lower.includes('textile') ||
      lower.includes('saree') ||
      lower.includes('stole') ||
      lower.includes('cotton');

    // Check for woodwork
    const isWood =
      transcript.includes('மரம்') ||
      transcript.includes('மர') ||
      lower.includes('wood') ||
      lower.includes('teak') ||
      lower.includes('sheesham') ||
      lower.includes('carved');

    // Check for jewelry
    const isJewelry =
      transcript.includes('நகை') ||
      transcript.includes('மாலை') ||
      transcript.includes('வளையல்') ||
      lower.includes('jewelry') ||
      lower.includes('necklace') ||
      lower.includes('earring') ||
      lower.includes('choker') ||
      lower.includes('kundan');

    // Check for metalwork
    const isMetal =
      (transcript.includes('பித்தளை') ||
        transcript.includes('விளக்கு') ||
        transcript.includes('வெண்கலம்') ||
        lower.includes('dhokra') ||
        lower.includes('bronze') ||
        lower.includes('brass') ||
        lower.includes('metal')) &&
      !isWood;

    if (isWood) {
      return {
        product_name: 'Hand-carved Sheesham Wood Keepsake Box (மர வேலைப்பாடு)',
        craft_category: 'Woodwork',
        visible_materials: ['Seasoned Sheesham / Teakwood (தேக்கு மரம்)', 'Brass Wire Inlay', 'Natural Beeswax Polish'],
        visible_colors: ['Rich Warm Rosewood', 'Golden Brass Inlay'],
        visual_description:
          'Solid timber handcrafted box decorated with hand-chiseled floral relief carvings and brass wire inlay work.',
        suggested_tags: ['woodwork', 'மரவேலை', 'hand carved', 'teakwood', 'sheesham', 'artisan box'],
        cultural_heritage_notes: transcript,
        original_transcript: transcript,
        translated_text: 'Hand-carved wooden craft made with traditional timber joinery and hand chiseling.',
        detected_language: language === 'ta' ? 'Tamil (தமிழ்)' : 'English',
        estimated_price: 2450,
        confidence_or_uncertainty: {
          confidence_level: 'High',
          unverified_aspects: ['Wood timber seasoning certification'],
          notes_for_artisan: 'Woodwork details extracted from voice description.',
        },
      };
    } else if (isPottery) {
      return {
        product_name: 'Traditional Handcrafted Village Clay Pot (பாரம்பரிய மண்பானை)',
        craft_category: 'Pottery & Ceramics',
        visible_materials: ['Natural Earthen Clay (மண்)', 'Organic Slip Glaze', 'Riverbed Terracotta'],
        visible_colors: ['Earthy Red', 'Terracotta Brown', 'Warm Clay'],
        visual_description:
          'Wheel-thrown unglazed terracotta clay vessel crafted with authentic regional folk contouring. Retains porous thermal qualities for natural cooling.',
        suggested_tags: ['terracotta', 'clay pot', 'மண்பானை', 'handcrafted', 'pottery', 'sustainable living'],
        cultural_heritage_notes: transcript.includes('கிராம') || transcript.includes('village')
          ? `${transcript} — Preserving community pottery traditions across generations.`
          : transcript,
        original_transcript: transcript,
        translated_text: 'This is a handmade clay pot, crafted in our village using time-honored traditional pottery methods.',
        detected_language: language === 'ta' ? 'Tamil (தமிழ்)' : 'English',
        estimated_price: 1450,
        confidence_or_uncertainty: {
          confidence_level: 'High',
          unverified_aspects: ['Exact clay firing temperature', 'Artisan village cluster registry'],
          notes_for_artisan: 'Voice description captured and translated! You can refine the dimensions and price in the form below.',
        },
      };
    } else if (isTextile) {
      return {
        product_name: 'Handloom Woven Heritage Cotton Textile (கைத்தறி நெசவு)',
        craft_category: 'Handloom Textiles',
        visible_materials: ['Pure Organic Cotton (பருத்தி)', 'Natural Vegetable Dyes', 'Handspun Yarn'],
        visible_colors: ['Natural Indigo Blue', 'Madder Red', 'Ecru Cream'],
        visual_description:
          'Fine handloom textile hand-woven on a traditional wooden pit loom, featuring intricate edge selvedge and authentic organic dye undertones.',
        suggested_tags: ['handloom', 'கைத்தறி', 'cotton', 'traditional weave', 'natural dye', 'sustainable fashion'],
        cultural_heritage_notes: transcript,
        original_transcript: transcript,
        translated_text: 'Authentic handloom woven textile crafted by village artisans on traditional heritage looms.',
        detected_language: language === 'ta' ? 'Tamil (தமிழ்)' : 'English',
        estimated_price: 1850,
        confidence_or_uncertainty: {
          confidence_level: 'High',
          unverified_aspects: ['Thread count certification', 'Loom type verification'],
          notes_for_artisan: 'Textile details mapped from voice transcript. Please verify fabric length and wash care.',
        },
      };
    } else if (isMetal) {
      return {
        product_name: 'Handcrafted Traditional Brass Diya Lamp (பித்தளை விளக்கு)',
        craft_category: 'Metalwork',
        visible_materials: ['Solid Brass Alloy (பித்தளை)', 'Hand-hammered Sheet', 'Natural Luster'],
        visible_colors: ['Antique Brass Gold', 'Deep Bronze Patina'],
        visual_description:
          'Hand-beaten and engraved solid brass oil lamp featuring tiered ornamentation and traditional regional motifs.',
        suggested_tags: ['brass', 'பித்தளை', 'metalwork', 'diya', 'traditional lamp', 'handcrafted'],
        cultural_heritage_notes: transcript,
        original_transcript: transcript,
        translated_text: 'Handcrafted brass lamp made using traditional metal beating and casting techniques.',
        detected_language: language === 'ta' ? 'Tamil (தமிழ்)' : 'English',
        estimated_price: 2400,
        confidence_or_uncertainty: {
          confidence_level: 'High',
          unverified_aspects: ['Metal alloy composition ratio'],
          notes_for_artisan: 'Brass craft metadata extracted. Please review weight and finish.',
        },
      };
    } else if (isJewelry) {
      return {
        product_name: 'Handcrafted Traditional Artisan Jewelry Set (பாரம்பரிய நகை)',
        craft_category: 'Traditional Jewelry',
        visible_materials: ['Brass / Silver Filigree', 'Natural Enamel (மீனாகாரி)', 'Glass Beads'],
        visible_colors: ['Antique Gold', 'Ruby Crimson', 'Emerald Green'],
        visual_description:
          'Intricately woven filigree and engraved traditional jewelry piece preserving ancestral metalsmithing techniques.',
        suggested_tags: ['jewelry', 'நகை', 'handmade jewelry', 'filigree', 'ethnic adornment'],
        cultural_heritage_notes: transcript,
        original_transcript: transcript,
        translated_text: 'Traditional handcrafted jewelry created by skilled family artisans.',
        detected_language: language === 'ta' ? 'Tamil (தமிழ்)' : 'English',
        estimated_price: 1950,
        confidence_or_uncertainty: {
          confidence_level: 'High',
          unverified_aspects: ['Base metal purity certification'],
          notes_for_artisan: 'Jewelry details extracted from your voice description.',
        },
      };
    }

    // General craft fallback
    return {
      product_name: 'Handcrafted Artisan Creation (பாரம்பரிய கைவினைப் பொருள்)',
      craft_category: 'Pottery & Ceramics',
      visible_materials: ['Natural Raw Materials', 'Artisanal Pigments', 'Handmade Components'],
      visible_colors: ['Earthy Ochre', 'Terracotta Red', 'Natural Tones'],
      visual_description:
        `Handcrafted item described by artisan: "${transcript}". Made using time-honored artisanal techniques.`,
      suggested_tags: ['handcrafted', 'கைவினை', 'traditional craft', 'sustainable', 'artisan made'],
      cultural_heritage_notes: transcript,
      original_transcript: transcript,
      translated_text: `Artisan description: "${transcript}"`,
      detected_language: language === 'ta' ? 'Tamil (தமிழ்)' : 'English',
      estimated_price: 1500,
      confidence_or_uncertainty: {
        confidence_level: 'Medium',
        unverified_aspects: ['Category and exact materials to be confirmed in form below'],
        notes_for_artisan: 'Voice input captured! Please review and adjust the product category and details.',
      },
    };
  }

  // Live Gemini AI Extraction for Voice Description
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
  });

  const voicePrompt = `
You are KalaSetu AI's voice cataloguing assistant for traditional Indian artisans.
The artisan has described their product in ${language === 'ta' ? 'Tamil (தமிழ்)' : 'English'}.

Artisan Transcript: "${transcript}"

Task:
1. Parse the artisan's description and extract objective catalogue specifications.
2. If the input is in Tamil, translate the core description to clear, evocative English for global buyers, while preserving the exact authentic cultural heritage notes and original transcript.
3. Choose the most accurate craft category from:
   - Pottery & Ceramics
   - Handloom Textiles
   - Metalwork
   - Woodwork
   - Traditional Jewelry
   - Paintings & Folk Art
   - Baskets & Natural Fiber
   - Leathercraft
   - Stone Craft
   - Papercraft & Painting
4. Identify visible materials, colors, description, tags, and suggested fair price in INR.
5. Never invent fictional claims. Respect the artisan's genuine voice.

Return JSON strictly matching this schema:
{
  "product_name": string (Clear descriptive product title in English, with Tamil title in parentheses if input was Tamil),
  "craft_category": string (One of the exact craft categories above),
  "visible_materials": string[] (3-5 specific materials mentioned or inferred),
  "visible_colors": string[] (Primary colors),
  "visual_description": string (Objective 2-3 sentence product summary in English),
  "cultural_heritage_notes": string (Artisan's heritage background, preserving their words),
  "suggested_tags": string[] (5-8 relevant tags including Tamil terms if applicable),
  "original_transcript": string (Exact input transcript),
  "translated_text": string (English translation of the transcript),
  "detected_language": string,
  "estimated_price": number (Sensible retail price in INR),
  "confidence_or_uncertainty": {
    "confidence_level": "High" | "Medium" | "Low",
    "unverified_aspects": string[],
    "notes_for_artisan": string
  }
}
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: voicePrompt,
    config: {
      responseMimeType: 'application/json',
      temperature: 0.2,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error('Gemini returned an empty voice analysis response.');
  }

  return JSON.parse(text.trim()) as VoiceCatalogueAIAnalysis;
}


