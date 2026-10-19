import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Square,
  RotateCcw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Volume2,
  Languages,
  Edit3,
  HelpCircle,
  Globe,
} from 'lucide-react';
import { CatalogueAIAnalysis } from '../types/catalogue.ts';
import { getDefaultImageForCraft } from '../utils/craftImages.tsx';

// Browser Web Speech Recognition interface definitions
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VoiceAssistantProps {
  onCatalogueGenerated: (
    analysis: CatalogueAIAnalysis,
    detectedImageUrl: string,
    extra?: {
      heritageNotes?: string;
      translatedText?: string;
      originalTranscript?: string;
      estimatedPrice?: number;
    }
  ) => void;
  isProcessing: boolean;
  setIsProcessing: (val: boolean) => void;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  onCatalogueGenerated,
  isProcessing,
  setIsProcessing,
}) => {
  // Language selection: Tamil ('ta-IN') or Indian English ('en-IN')
  const [selectedLanguage, setSelectedLanguage] = useState<'ta-IN' | 'en-IN'>('ta-IN');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [interimText, setInterimText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [translatedPreview, setTranslatedPreview] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // Initialize SpeechRecognition on mount
  useEffect(() => {
    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = selectedLanguage;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        let finalTranscriptChunk = '';
        let currentInterim = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscriptChunk += item[0].transcript;
          } else {
            currentInterim += item[0].transcript;
          }
        }

        if (finalTranscriptChunk) {
          setTranscript((prev) => (prev ? `${prev} ${finalTranscriptChunk.trim()}` : finalTranscriptChunk.trim()));
        }
        setInterimText(currentInterim);
      };

      recognition.onerror = (event: any) => {
        console.warn('[KalaSetu Voice Assistant] Speech recognition event error:', event.error);
        setIsListening(false);
        setInterimText('');

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setErrorMessage(
            selectedLanguage === 'ta-IN'
              ? 'மைக்ரோஃபோன் அணுகல் மறுக்கப்பட்டது. பிரவுசர் அமைப்புகளில் மைக் அனுமதியை சரிபார்க்கவும் அல்லது கீழே உள்ள பெட்டியில் நேரடியாக தட்டச்சு செய்யவும்.'
              : 'Microphone permission denied. Please allow microphone access in your browser or type your description directly below.'
          );
        } else if (event.error === 'no-speech') {
          setErrorMessage(
            selectedLanguage === 'ta-IN'
              ? 'பேச்சு ஏதும் கண்டறியப்படவில்லை. தயவுசெய்து மைக்ரோஃபோனுக்கு அருகில் பேசவும்.'
              : 'No speech was detected. Please ensure your microphone is working and speak clearly.'
          );
        } else if (event.error === 'network') {
          setErrorMessage(
            selectedLanguage === 'ta-IN'
              ? 'வலைப்பின்னல் பிழை. உங்களது இணைய இணைப்பை சரிபார்க்கவும், அல்லது கீழே நேரடியாக தட்டச்சு செய்யவும்.'
              : 'Network error occurred during speech capture. You can also type your description directly below.'
          );
        } else {
          setErrorMessage(`Speech recognition notice: ${event.error}. You can also type/edit the text directly.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimText('');
      };

      recognitionRef.current = recognition;
    } catch (err: any) {
      console.warn('[KalaSetu Voice Assistant] Failed to initialize Web Speech API:', err);
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, [selectedLanguage]);

  // Update speech language on change
  const handleLanguageChange = (lang: 'ta-IN' | 'en-IN') => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setSelectedLanguage(lang);
    if (recognitionRef.current) {
      recognitionRef.current.lang = lang;
    }
  };

  const handleStartListening = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    if (!speechSupported || !recognitionRef.current) {
      setErrorMessage(
        'Speech recognition is not supported in this browser. Please type or paste your description in the box below.'
      );
      return;
    }

    try {
      recognitionRef.current.lang = selectedLanguage;
      recognitionRef.current.start();
    } catch (err: any) {
      console.warn('[KalaSetu Voice Assistant] Start error:', err);
      // Already running or permission issue
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
  };

  const handleStopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('[KalaSetu Voice Assistant] Stop error:', err);
      }
    }
    setIsListening(false);
    setInterimText('');
  };

  const handleClearTranscript = () => {
    if (isListening) {
      handleStopListening();
    }
    setTranscript('');
    setInterimText('');
    setErrorMessage(null);
    setSuccessMessage(null);
    setTranslatedPreview(null);
  };

  // Sample prompt helper for artisans
  const handleInsertSample = (sample: string) => {
    setTranscript(sample);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleGenerateCatalogue = async () => {
    const finalDescription = transcript.trim();
    if (!finalDescription) {
      setErrorMessage(
        selectedLanguage === 'ta-IN'
          ? 'தயவுசெய்து உங்கள் கைவினைப் பொருளை விவரித்துப் பேசவும் அல்லது தட்டச்சு செய்யவும்.'
          : 'Please speak or enter a description of your craft item first.'
      );
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/catalogue/analyze-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: finalDescription,
          language: selectedLanguage === 'ta-IN' ? 'ta' : 'en',
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || `Voice catalogue extraction failed (${response.status})`);
      }

      const result = json.data;

      // Show translated review preview if Tamil was translated
      if (result.translated_text && selectedLanguage === 'ta-IN') {
        setTranslatedPreview(result.translated_text);
      }

      // Automatically map product to its correct category image!
      const mappedImage = getDefaultImageForCraft(result.craft_category, result.product_name);

      setSuccessMessage(
        selectedLanguage === 'ta-IN'
          ? 'குரல் விவரங்கள் வெற்றிகரமாக பகுப்பாய்வு செய்யப்பட்டு படிவத்தில் சேர்க்கப்பட்டது!'
          : 'Voice description analyzed! Details have been pre-filled in the product form below.'
      );

      // Pass extracted metadata to existing CatalogueForm
      onCatalogueGenerated(result, mappedImage, {
        heritageNotes: result.cultural_heritage_notes || finalDescription,
        translatedText: result.translated_text,
        originalTranscript: result.original_transcript || finalDescription,
        estimatedPrice: result.estimated_price,
      });
    } catch (err: any) {
      console.error('[KalaSetu Voice Assistant] Generation error:', err);
      setErrorMessage(err?.message || 'Failed to generate catalogue from voice description.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E8E1D7] p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header & Language Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E1D7]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#123F32] text-amber-300 flex items-center justify-center shrink-0 shadow-xs">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-[#242720] flex items-center gap-2">
              <span>Multilingual Voice Assistant</span>
              <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold border border-amber-300">
                Tamil &amp; English
              </span>
            </h3>
            <p className="text-xs text-[#6F716A]">
              குரல் மூலம் உங்கள் கைவினைப் பொருளை விவரித்து உடனடியாக பட்டியலை உருவாக்கவும்.
            </p>
          </div>
        </div>

        {/* Language Selection Pills */}
        <div className="flex items-center gap-2 bg-[#F8F5EF] p-1.5 rounded-xl border border-[#E8E1D7] self-start sm:self-auto">
          <Languages className="w-4 h-4 text-[#6F716A] ml-1.5" />
          <button
            type="button"
            onClick={() => handleLanguageChange('ta-IN')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
              selectedLanguage === 'ta-IN'
                ? 'bg-[#123F32] text-white shadow-2xs'
                : 'text-[#242720] hover:bg-[#E8E1D7]'
            }`}
          >
            தமிழ் (Tamil)
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange('en-IN')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
              selectedLanguage === 'en-IN'
                ? 'bg-[#123F32] text-white shadow-2xs'
                : 'text-[#242720] hover:bg-[#E8E1D7]'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Browser Speech Compatibility Notice */}
      {!speechSupported && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
          <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold">Browser Voice Input Notice:</strong>
            <span>
              Your current browser does not natively support continuous speech recognition. You can still type or paste your product description in Tamil or English directly below to generate your complete AI catalogue.
            </span>
          </div>
        </div>
      )}

      {/* Main Recording & Transcript Area */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-[#242720] flex items-center gap-1.5">
            <Edit3 className="w-3.5 h-3.5 text-[#C45D3A]" />
            <span>Spoken or Typed Artisan Description</span>
          </label>

          {/* Live Status Indicator */}
          <div className="flex items-center gap-2">
            {isListening ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-rose-600" />
                <span>{selectedLanguage === 'ta-IN' ? 'கேட்கிறது... (Listening)' : 'Listening...'}</span>
              </span>
            ) : (
              <span className="text-[11px] text-[#6F716A]">
                {transcript ? `${transcript.length} characters` : 'Ready to record'}
              </span>
            )}
          </div>
        </div>

        {/* Editable Transcript Textarea */}
        <div className="relative">
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder={
              selectedLanguage === 'ta-IN'
                ? 'எடுத்துக்காட்டு: "இது கையால் செய்யப்பட்ட மண் பானை. இதை எங்கள் கிராமத்தில் பாரம்பரிய முறையில் தயாரிக்கிறோம்."'
                : 'Example: "This is a hand-carved teakwood jewellery box with brass wire inlay work made by traditional artisans."'
            }
            rows={4}
            className={`w-full p-4 rounded-xl border text-sm font-medium leading-relaxed transition focus:outline-none focus:ring-2 ${
              isListening
                ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-400'
                : 'border-[#E8E1D7] bg-[#F8F5EF]/50 focus:ring-[#123F32]'
            }`}
          />

          {/* Interim text overlay while speaking */}
          {interimText && (
            <div className="text-xs italic text-stone-500 mt-1 pl-1">
              <span>{interimText}...</span>
            </div>
          )}
        </div>
      </div>

      {/* Control Buttons Bar: Start, Stop, Clear, and Sample Input */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          {!isListening ? (
            <button
              type="button"
              onClick={handleStartListening}
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-xl bg-[#C45D3A] hover:bg-[#a84c2d] text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              <Mic className="w-4 h-4" />
              <span>
                {selectedLanguage === 'ta-IN'
                  ? 'பேசி தொடங்கவும் (Speak to Create)'
                  : 'Speak to create your catalogue'}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStopListening}
              className="px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>நிறுத்து (Stop Recording)</span>
            </button>
          )}

          {transcript && (
            <button
              type="button"
              onClick={handleClearTranscript}
              disabled={isProcessing}
              className="px-3 py-2.5 rounded-xl border border-[#E8E1D7] bg-white hover:bg-[#F8F5EF] text-[#242720] text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
              title="Clear transcript"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#6F716A]" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Generate Catalogue Action Button */}
        <button
          type="button"
          onClick={handleGenerateCatalogue}
          disabled={!transcript.trim() || isProcessing}
          className="px-5 py-2.5 rounded-xl bg-[#123F32] hover:bg-[#24664D] text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>
                {selectedLanguage === 'ta-IN'
                  ? 'பகுப்பாய்வு செய்கிறது... (Processing AI)'
                  : 'Analyzing with Gemini AI...'}
              </span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>
                {selectedLanguage === 'ta-IN'
                  ? 'பட்டியலை உருவாக்கவும் (Generate Catalogue)'
                  : 'Generate Catalogue from Voice'}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Helpful Tamil / English One-Click Sample Presets */}
      <div className="pt-2 border-t border-[#E8E1D7]/70">
        <span className="text-[11px] font-bold text-[#6F716A] uppercase tracking-wider block mb-2">
          {selectedLanguage === 'ta-IN'
            ? 'விரைவு சோதனை மாதிரி (Click to test sample voice transcript):'
            : 'Try a sample artisan voice transcript:'}
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              handleInsertSample(
                'இது கையால் செய்யப்பட்ட மண் பானை. இதை எங்கள் கிராமத்தில் பாரம்பரிய முறையில் தயாரிக்கிறோம்.'
              )
            }
            className="px-3 py-1.5 rounded-lg bg-[#F8F5EF] hover:bg-[#E8E1D7] border border-[#E8E1D7] text-xs text-[#242720] font-medium transition cursor-pointer text-left"
          >
            🏺 தமிழ்: மண் பானை (Clay Pot)
          </button>
          <button
            type="button"
            onClick={() =>
              handleInsertSample(
                'இது கைத்தறி முறையில் நெய்யப்பட்ட இயற்கை சாய பருத்தி புடவை. காஞ்சிபுரம் பாரம்பரிய நெசவு.'
              )
            }
            className="px-3 py-1.5 rounded-lg bg-[#F8F5EF] hover:bg-[#E8E1D7] border border-[#E8E1D7] text-xs text-[#242720] font-medium transition cursor-pointer text-left"
          >
            🧵 தமிழ்: கைத்தறி புடவை (Handloom Saree)
          </button>
          <button
            type="button"
            onClick={() =>
              handleInsertSample(
                'This is a hand-carved sheesham wood jewelry box with brass floral inlay work made by our family artisans.'
              )
            }
            className="px-3 py-1.5 rounded-lg bg-[#F8F5EF] hover:bg-[#E8E1D7] border border-[#E8E1D7] text-xs text-[#242720] font-medium transition cursor-pointer text-left"
          >
            🪵 English: Carved Wooden Box
          </button>
          <button
            type="button"
            onClick={() =>
              handleInsertSample(
                'Hand-cast brass Dhokra oil lamp made with lost wax technique preserving our indigenous Bastar tribal art.'
              )
            }
            className="px-3 py-1.5 rounded-lg bg-[#F8F5EF] hover:bg-[#E8E1D7] border border-[#E8E1D7] text-xs text-[#242720] font-medium transition cursor-pointer text-left"
          >
            🪔 English: Dhokra Brass Lamp
          </button>
        </div>
      </div>

      {/* Translated Review Preview Banner */}
      {translatedPreview && (
        <div className="p-4 bg-amber-50/80 border border-amber-300 rounded-xl text-xs text-amber-950 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <Globe className="w-4 h-4 text-amber-700" />
            <span>Buyer-facing English Translation (Original Tamil preserved):</span>
          </div>
          <p className="leading-relaxed font-serif italic text-stone-800">
            "{translatedPreview}"
          </p>
        </div>
      )}

      {/* Notifications */}
      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-300 text-rose-900 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
    </div>
  );
};
