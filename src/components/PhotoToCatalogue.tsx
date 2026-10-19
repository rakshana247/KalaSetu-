import React, { useState, useRef, ChangeEvent } from 'react';
import { UploadCloud, Sparkles, AlertTriangle, CheckCircle2, Image as ImageIcon, RefreshCw, Wand2, X } from 'lucide-react';
import { CatalogueAIAnalysis } from '../types/catalogue.ts';
import { SAMPLE_CRAFT_PRESETS } from '../data/sampleCrafts.ts';

interface PhotoToCatalogueProps {
  onAnalysisComplete: (data: CatalogueAIAnalysis, imageUrl: string) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (val: boolean) => void;
}

export const PhotoToCatalogue: React.FC<PhotoToCatalogueProps> = ({
  onAnalysisComplete,
  isAnalyzing,
  setIsAnalyzing,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [lastAnalysis, setLastAnalysis] = useState<CatalogueAIAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('File size exceeds the 10MB limit. Please choose a smaller image.');
        return;
      }
      setSelectedFile(file);

      // Read as Data URL for immediate preview and reliable base64 fallback
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        setFileBase64(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (preset: typeof SAMPLE_CRAFT_PRESETS[0]) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setSelectedFile(null);
    setFileBase64(null);
    setPreviewUrl(preset.imageUrl);
  };

  const handleAnalyze = async () => {
    if (!selectedFile && !previewUrl) {
      setErrorMessage('Please upload or select an artisan product photo first.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setAnalysisStep('Sending photo to KalaSetu secure Gemini vision endpoint...');

    const stepTimer = setTimeout(() => {
      setAnalysisStep('Gemini 3.8 Flash Vision is inspecting motifs, materials, texture, and colors...');
    }, 1500);

    const stepTimer2 = setTimeout(() => {
      setAnalysisStep('Applying cultural integrity guardrails & extracting structured catalogue data...');
    }, 3200);

    try {
      let response: Response;

      // Strategy 1: If file attached, try multipart upload first
      if (selectedFile) {
        try {
          const formData = new FormData();
          formData.append('image', selectedFile);

          response = await fetch('/api/catalogue/analyze-photo', {
            method: 'POST',
            body: formData,
          });
        } catch (fetchErr) {
          console.warn('[KalaSetu AI] Multipart fetch failed, attempting JSON base64 fallback:', fetchErr);
          // Fallback to JSON with base64 data
          if (fileBase64) {
            response = await fetch('/api/catalogue/analyze-photo', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                image: fileBase64,
                mimeType: selectedFile.type || 'image/jpeg',
              }),
            });
          } else {
            throw fetchErr;
          }
        }
      } else if (previewUrl) {
        // Sample Preset or remote URL: pass imageUrl to server directly
        if (previewUrl.startsWith('http')) {
          response = await fetch('/api/catalogue/analyze-photo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl: previewUrl }),
          });
        } else if (previewUrl.startsWith('data:')) {
          response = await fetch('/api/catalogue/analyze-photo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: previewUrl }),
          });
        } else {
          throw new Error('Unsupported image format.');
        }
      } else {
        throw new Error('No valid image data available.');
      }

      const text = await response.text();
      let json: any;

      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(`Server returned non-JSON response (${response.status}): ${text.slice(0, 150)}`);
      }

      if (!response.ok || !json.success) {
        throw new Error(json.error || `Analysis failed with HTTP status ${response.status}`);
      }

      const result: CatalogueAIAnalysis = json.data;
      setLastAnalysis(result);
      setSuccessMessage('AI analysis complete! Review and adjust the details in the form below.');
      onAnalysisComplete(result, previewUrl || '');
    } catch (err: any) {
      console.error('[KalaSetu AI] Analysis error:', err);
      const msg = err?.message || 'An unexpected error occurred during image analysis.';
      setErrorMessage(msg);
    } finally {
      clearTimeout(stepTimer);
      clearTimeout(stepTimer2);
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setFileBase64(null);
    setPreviewUrl(null);
    setErrorMessage(null);
    setSuccessMessage(null);
    setLastAnalysis(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white border border-[#E8E1D7] rounded-2xl p-6 shadow-2xs transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#123F32]/10 text-[#123F32] flex items-center justify-center font-bold text-xl border border-[#123F32]/20">
            📸
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-[#242720] text-lg">AI Photo-to-Catalogue Studio</h3>
              <span className="text-[10px] bg-[#123F32] text-amber-200 font-bold px-2.5 py-0.5 rounded-full">
                Gemini 3.8 Flash Vision
              </span>
            </div>
            <p className="text-xs text-[#6F716A]">
              Upload a snapshot of your craft. Physical materials and visible colors are extracted without inventing false histories.
            </p>
          </div>
        </div>

        {previewUrl && (
          <button
            onClick={handleClear}
            disabled={isAnalyzing}
            className="text-xs text-[#6F716A] hover:text-[#242720] underline self-start sm:self-auto disabled:opacity-50 cursor-pointer"
          >
            Clear image
          </button>
        )}
      </div>

      {/* Preset selection pills */}
      <div className="mb-4">
        <span className="text-[11px] font-bold text-[#6F716A] uppercase tracking-wider block mb-2">
          Or try an authentic artisan sample:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SAMPLE_CRAFT_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isAnalyzing}
              onClick={() => handleSelectPreset(preset)}
              className="flex items-center gap-2 p-2 rounded-xl border border-[#E8E1D7] bg-[#F8F5EF] hover:border-[#123F32] text-left transition-all text-xs group disabled:opacity-50 shadow-2xs cursor-pointer"
            >
              <img
                src={preset.imageUrl}
                alt={preset.name}
                className="w-9 h-9 rounded-lg object-cover border border-[#E8E1D7]"
              />
              <div className="truncate">
                <span className="font-semibold text-[#242720] block truncate group-hover:text-[#123F32]">
                  {preset.name}
                </span>
                <span className="text-[10px] text-[#6F716A] block truncate">{preset.category}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Upload Zone & Action Button */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        <div className="md:col-span-2">
          <label
            className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-5 cursor-pointer transition-all min-h-[170px] ${
              previewUrl
                ? 'border-[#123F32] bg-[#F8F5EF]/30'
                : 'border-[#E8E1D7] bg-[#F8F5EF]/50 hover:border-[#123F32] hover:bg-white'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp, image/heic, image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isAnalyzing}
            />

            {previewUrl ? (
              <div className="flex items-center gap-5 w-full">
                <div className="relative group shrink-0">
                  <img
                    src={previewUrl}
                    alt="Artisan craft preview"
                    className="w-28 h-28 object-cover rounded-xl border border-[#E8E1D7] shadow-sm"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center text-white text-xs font-medium transition">
                    Replace
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#123F32] bg-[#24664D]/10 px-2.5 py-0.5 rounded-full border border-[#24664D]/20 mb-1">
                    <CheckCircle2 className="w-3 h-3 text-[#24664D]" /> Photo Attached
                  </span>
                  <p className="text-sm font-semibold text-[#242720] truncate">
                    {selectedFile ? selectedFile.name : 'Artisan Craft Photo Selected'}
                  </p>
                  <p className="text-xs text-[#6F716A] mt-0.5">
                    Click to choose a different photo or click "Generate Catalogue Draft".
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#123F32]/10 flex items-center justify-center text-[#123F32] mb-2 border border-[#123F32]/20">
                  <UploadCloud className="w-6 h-6 text-[#123F32]" />
                </div>
                <p className="text-sm font-semibold text-[#242720]">
                  Click to select photo or drag & drop image
                </p>
                <p className="text-xs text-[#6F716A] mt-1">
                  Supports JPG, PNG, WEBP, HEIC up to 10MB
                </p>
              </div>
            )}
          </label>
        </div>

        {/* Generate Button Card */}
        <div className="flex flex-col justify-between bg-[#F8F5EF] border border-[#E8E1D7] rounded-xl p-4 shadow-2xs">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#123F32] mb-1">
              <Sparkles className="w-4 h-4 text-[#C45D3A]" />
              <span>Multimodal Vision AI</span>
            </div>
            <p className="text-xs text-[#6F716A] leading-relaxed">
              Analyzes visible materials, craft motifs, and colors. Keeps cultural lineage open for artisan self-attribution.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={(!selectedFile && !previewUrl) || isAnalyzing}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
              (!selectedFile && !previewUrl) || isAnalyzing
                ? 'bg-[#E8E1D7] text-[#6F716A] cursor-not-allowed'
                : 'bg-[#123F32] hover:bg-[#24664D] text-white cursor-pointer'
            }`}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-amber-200" />
                <span>Analyzing Photo...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-amber-200" />
                <span>Generate Catalogue Draft</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Step */}
      {isAnalyzing && (
        <div className="mt-4 p-3.5 bg-[#F8F5EF] border border-[#123F32]/30 rounded-xl flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-[#123F32] border-t-transparent rounded-full animate-spin shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold text-[#123F32] block">Processing with Gemini 3.8 Flash Vision</span>
            <p className="text-xs text-[#6F716A] truncate">{analysisStep}</p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {errorMessage && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800 text-sm">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-red-900 text-sm">Analysis Request Failed</h4>
            <p className="text-xs mt-0.5 text-red-700 leading-relaxed">{errorMessage}</p>
            <button
              onClick={handleAnalyze}
              className="mt-2 text-xs font-semibold text-red-800 hover:text-red-950 underline cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Success Banner */}
      {successMessage && (
        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-start gap-3 text-emerald-900 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-emerald-900 text-sm">Catalogue Generated!</h4>
            <p className="text-xs mt-0.5 text-emerald-700 leading-relaxed">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Cultural Integrity Guardrail Notice */}
      {lastAnalysis && (
        <div className="mt-4 p-4 bg-[#F8F5EF] border border-[#E8E1D7] rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">📢</span>
              <h4 className="font-bold text-[#123F32] text-xs">
                Artisan Verification & Cultural Lineage Check
              </h4>
            </div>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-[#24664D] text-white">
              Visual Confidence: {lastAnalysis.confidence_or_uncertainty.confidence_level}
            </span>
          </div>

          <p className="text-xs text-[#242720] leading-relaxed">
            {lastAnalysis.confidence_or_uncertainty.notes_for_artisan}
          </p>

          {lastAnalysis.confidence_or_uncertainty.unverified_aspects.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-[#6F716A] uppercase tracking-wider block mb-1">
                Aspects left unassumed (Please confirm in form):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {lastAnalysis.confidence_or_uncertainty.unverified_aspects.map((aspect, i) => (
                  <span
                    key={i}
                    className="text-xs bg-white text-[#242720] border border-[#E8E1D7] px-2.5 py-1 rounded-md shadow-2xs font-medium"
                  >
                    ⚠️ {aspect}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
