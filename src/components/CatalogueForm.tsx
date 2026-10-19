import React, { useState } from 'react';
import { CatalogueAIAnalysis, CatalogueItem } from '../types/catalogue.ts';
import { PhotoToCatalogue } from './PhotoToCatalogue.tsx';
import { VoiceAssistant } from './VoiceAssistant.tsx';
import { CraftImage, getDefaultImageForCraft } from '../utils/craftImages.tsx';
import {
  Save,
  Calculator,
  Tag,
  Palette,
  Layers,
  Sparkles,
  MapPin,
  User,
  Info,
  Check,
  Eye,
  ArrowRight,
  ShieldCheck,
  Mic,
  Camera,
  Languages,
} from 'lucide-react';

interface CatalogueFormProps {
  onSaveItem: (item: CatalogueItem) => void;
  onNavigateToFairPrice: (item: Partial<CatalogueItem>) => void;
}

const CRAFT_CATEGORIES = [
  'Pottery & Ceramics',
  'Handloom Textiles',
  'Metalwork',
  'Woodwork',
  'Traditional Jewelry',
  'Paintings & Folk Art',
  'Baskets & Natural Fiber',
  'Leathercraft',
  'Stone Craft',
  'Papercraft & Painting',
];

export const CatalogueForm: React.FC<CatalogueFormProps> = ({
  onSaveItem,
  onNavigateToFairPrice,
}) => {
  const [creationMode, setCreationMode] = useState<'voice' | 'photo'>('voice');
  const [formData, setFormData] = useState({
    product_name: '',
    craft_category: 'Pottery & Ceramics',
    artisan_name: '',
    region_origin: '',
    cultural_heritage_notes: '',
    visible_materials: '',
    visible_colors: '',
    visual_description: '',
    suggested_tags: '',
    price: 1200,
  });

  const [productImageUrl, setProductImageUrl] = useState<string>(
    '/assets/crafts/pottery.svg'
  );
  const [aiAnalyzed, setAiAnalyzed] = useState<boolean>(false);
  const [confidenceLevel, setConfidenceLevel] = useState<string>('');
  const [unverifiedAspects, setUnverifiedAspects] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isVoiceProcessing, setIsVoiceProcessing] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleCategoryChange = (newCat: string) => {
    setFormData((prev) => ({ ...prev, craft_category: newCat }));
    setProductImageUrl(getDefaultImageForCraft(newCat, formData.product_name));
  };

  const handleAIComplete = (analysis: CatalogueAIAnalysis, imageUrl: string) => {
    if (imageUrl) {
      setProductImageUrl(imageUrl);
    } else {
      setProductImageUrl(getDefaultImageForCraft(analysis.craft_category, analysis.product_name));
    }

    setFormData((prev) => ({
      ...prev,
      product_name: analysis.product_name || prev.product_name,
      craft_category: analysis.craft_category || prev.craft_category,
      visible_materials: Array.isArray(analysis.visible_materials)
        ? analysis.visible_materials.join(', ')
        : '',
      visible_colors: Array.isArray(analysis.visible_colors)
        ? analysis.visible_colors.join(', ')
        : '',
      visual_description: analysis.visual_description || prev.visual_description,
      suggested_tags: Array.isArray(analysis.suggested_tags)
        ? analysis.suggested_tags.join(', ')
        : '',
    }));

    setAiAnalyzed(true);
    setConfidenceLevel(analysis.confidence_or_uncertainty?.confidence_level || 'High');
    setUnverifiedAspects(analysis.confidence_or_uncertainty?.unverified_aspects || []);
  };

  const handleVoiceComplete = (
    analysis: CatalogueAIAnalysis,
    detectedImageUrl: string,
    extra?: {
      heritageNotes?: string;
      translatedText?: string;
      originalTranscript?: string;
      estimatedPrice?: number;
    }
  ) => {
    if (detectedImageUrl) {
      setProductImageUrl(detectedImageUrl);
    } else {
      setProductImageUrl(getDefaultImageForCraft(analysis.craft_category, analysis.product_name));
    }

    setFormData((prev) => ({
      ...prev,
      product_name: analysis.product_name || prev.product_name,
      craft_category: analysis.craft_category || prev.craft_category,
      visible_materials: Array.isArray(analysis.visible_materials)
        ? analysis.visible_materials.join(', ')
        : '',
      visible_colors: Array.isArray(analysis.visible_colors)
        ? analysis.visible_colors.join(', ')
        : '',
      visual_description: analysis.visual_description || prev.visual_description,
      cultural_heritage_notes: extra?.heritageNotes || prev.cultural_heritage_notes,
      suggested_tags: Array.isArray(analysis.suggested_tags)
        ? analysis.suggested_tags.join(', ')
        : '',
      price: extra?.estimatedPrice || prev.price,
    }));

    setAiAnalyzed(true);
    setConfidenceLevel(analysis.confidence_or_uncertainty?.confidence_level || 'High');
    setUnverifiedAspects(analysis.confidence_or_uncertainty?.unverified_aspects || []);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.product_name) return;

    const newItem: CatalogueItem = {
      id: `kala-${Date.now()}`,
      product_name: formData.product_name,
      craft_category: formData.craft_category,
      artisan_name: formData.artisan_name || 'Independent Traditional Artisan',
      region_origin: formData.region_origin || 'Local Craft Cluster',
      cultural_heritage_notes: formData.cultural_heritage_notes,
      visible_materials: formData.visible_materials
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      visible_colors: formData.visible_colors
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      visual_description: formData.visual_description,
      suggested_tags: formData.suggested_tags
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      image_url: productImageUrl,
      price: Number(formData.price) || 1200,
      ai_analyzed: aiAnalyzed,
      confidence_level: confidenceLevel,
      unverified_aspects: unverifiedAspects,
      created_at: new Date().toISOString(),
    };

    onSaveItem(newItem);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 5000);
  };

  const handleCalculateFairPrice = () => {
    onNavigateToFairPrice({
      product_name: formData.product_name || 'Artisan Craft Item',
      craft_category: formData.craft_category,
      visible_materials: formData.visible_materials
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      image_url: productImageUrl,
    });
  };

  return (
    <div className="space-y-8">
      {/* 4-Step Progress Indicator */}
      <div className="bg-white rounded-2xl border border-[#E8E1D7] p-5 shadow-2xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#123F32] text-white flex items-center justify-center font-bold text-xs shrink-0">
              1
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F716A] block">Step 1</span>
              <span className="text-xs font-bold text-[#242720]">Photo & Upload</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                aiAnalyzed
                  ? 'bg-[#123F32] text-white'
                  : 'bg-[#F8F5EF] text-[#6F716A] border border-[#E8E1D7]'
              }`}
            >
              2
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F716A] block">Step 2</span>
              <span className="text-xs font-bold text-[#242720]">Gemini Vision AI</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F8F5EF] text-[#6F716A] border border-[#E8E1D7] flex items-center justify-center font-bold text-xs shrink-0">
              3
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F716A] block">Step 3</span>
              <span className="text-xs font-bold text-[#242720]">Review & FairPrice</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F8F5EF] text-[#6F716A] border border-[#E8E1D7] flex items-center justify-center font-bold text-xs shrink-0">
              4
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F716A] block">Step 4</span>
              <span className="text-xs font-bold text-[#242720]">Save to Marketplace</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Creation Mode Switcher: Multilingual Voice Assistant vs Photo Scanner */}
      <div className="bg-[#123F32] rounded-2xl p-4 sm:p-5 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm border border-[#24664D]/50">
        <div>
          <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block mb-1">
            Choose Your AI Catalogue Generator
          </span>
          <h3 className="font-serif font-bold text-lg text-[#F8F5EF] flex items-center gap-2">
            {creationMode === 'voice' ? (
              <>
                <Mic className="w-5 h-5 text-amber-300" />
                <span>Multilingual Voice Assistant (தமிழ் &amp; English)</span>
              </>
            ) : (
              <>
                <Camera className="w-5 h-5 text-amber-300" />
                <span>Photo-to-Catalogue (Gemini Vision AI)</span>
              </>
            )}
          </h3>
          <p className="text-xs text-stone-200 mt-0.5">
            {creationMode === 'voice'
              ? 'Speak or describe your product in Tamil or English to generate your verified catalogue instantly.'
              : 'Upload or capture a photo of your craft to extract objective materials, colors, and motifs.'}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#24664D] p-1.5 rounded-xl border border-amber-300/30 shrink-0">
          <button
            type="button"
            onClick={() => setCreationMode('voice')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
              creationMode === 'voice'
                ? 'bg-amber-300 text-[#123F32] shadow-sm'
                : 'text-stone-200 hover:text-white'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>குரல் வழிகாட்டி (Voice)</span>
          </button>

          <button
            type="button"
            onClick={() => setCreationMode('photo')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
              creationMode === 'photo'
                ? 'bg-amber-300 text-[#123F32] shadow-sm'
                : 'text-stone-200 hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>புகைப்படம் (Photo)</span>
          </button>
        </div>
      </div>

      {/* Render selected creator: Voice Assistant or Photo Scanner */}
      {creationMode === 'voice' ? (
        <VoiceAssistant
          onCatalogueGenerated={handleVoiceComplete}
          isProcessing={isVoiceProcessing}
          setIsProcessing={setIsVoiceProcessing}
        />
      ) : (
        <PhotoToCatalogue
          onAnalysisComplete={handleAIComplete}
          isAnalyzing={isAnalyzing}
          setIsAnalyzing={setIsAnalyzing}
        />
      )}

      {/* Two-Column Layout: Left Form & Right Live Preview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Editable Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E8E1D7] p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-[#E8E1D7] gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#242720]">
                Product Specification Form
              </h2>
              <p className="text-xs text-[#6F716A] mt-0.5">
                Review and refine AI-drafted details before publishing.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCalculateFairPrice}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#F8F5EF] text-[#123F32] hover:bg-[#E8E1D7] border border-[#E8E1D7] transition cursor-pointer self-start sm:self-auto"
            >
              <Calculator className="w-4 h-4 text-[#C45D3A]" />
              <span>Verify FairPrice</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            {/* Title & Category */}
            <div>
              <label className="block font-bold uppercase tracking-wider text-[#242720] mb-1.5">
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.product_name}
                onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                placeholder="e.g., Handcrafted Terracotta Clay Water Carafe"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E1D7] text-sm font-semibold text-[#242720] bg-[#F8F5EF]/60 focus:outline-none focus:ring-2 focus:ring-[#123F32]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#242720] mb-1.5">
                  Craft Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.craft_category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E1D7] text-sm bg-white font-medium"
                >
                  {CRAFT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#242720] mb-1.5">
                  Selling Price (₹ INR) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-sm text-[#6F716A] font-bold">₹</span>
                  <input
                    type="number"
                    min="50"
                    step="10"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#E8E1D7] text-sm font-bold text-[#123F32] bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Artisan Identity & Origin (Protected from AI hallucination) */}
            <div className="p-4 rounded-xl bg-[#F8F5EF] border border-[#E8E1D7] space-y-3">
              <span className="font-bold text-[#123F32] flex items-center gap-1.5 text-xs">
                <MapPin className="w-4 h-4 text-[#C45D3A]" />
                <span>Artisan Lineage & Origin (Artisan Self-Attribution)</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#242720] mb-1">
                    Artisan or SHG Name
                  </label>
                  <input
                    type="text"
                    value={formData.artisan_name}
                    onChange={(e) => setFormData({ ...formData, artisan_name: e.target.value })}
                    placeholder="e.g., Rameshwar Prajapati"
                    className="w-full px-3 py-2 rounded-lg border border-[#E8E1D7] text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#242720] mb-1">
                    Village & State
                  </label>
                  <input
                    type="text"
                    value={formData.region_origin}
                    onChange={(e) => setFormData({ ...formData, region_origin: e.target.value })}
                    placeholder="e.g., Molela, Rajasthan"
                    className="w-full px-3 py-2 rounded-lg border border-[#E8E1D7] text-xs bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#242720] mb-1">
                  Generational Heritage & Techniques
                </label>
                <textarea
                  rows={2}
                  value={formData.cultural_heritage_notes}
                  onChange={(e) => setFormData({ ...formData, cultural_heritage_notes: e.target.value })}
                  placeholder="e.g., Four generations of Molela clay potters fired in open pit kilns..."
                  className="w-full px-3 py-2 rounded-lg border border-[#E8E1D7] text-xs bg-white"
                />
              </div>
            </div>

            {/* Visible Materials & Colors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#242720] mb-1.5">
                  Visible Materials (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.visible_materials}
                  onChange={(e) => setFormData({ ...formData, visible_materials: e.target.value })}
                  placeholder="e.g., Terracotta clay, Natural slip"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E1D7] text-xs bg-white"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#242720] mb-1.5">
                  Visible Colors (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.visible_colors}
                  onChange={(e) => setFormData({ ...formData, visible_colors: e.target.value })}
                  placeholder="e.g., Earthy Red, Ochre, Tan"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E1D7] text-xs bg-white"
                />
              </div>
            </div>

            {/* Visual Description */}
            <div>
              <label className="block font-bold uppercase tracking-wider text-[#242720] mb-1.5">
                Visual Craft Description
              </label>
              <textarea
                rows={3}
                value={formData.visual_description}
                onChange={(e) => setFormData({ ...formData, visual_description: e.target.value })}
                placeholder="Describe motifs, surface carvings, texture, and silhouette..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E1D7] text-xs leading-relaxed bg-white"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block font-bold uppercase tracking-wider text-[#242720] mb-1.5">
                Suggested Search Tags
              </label>
              <input
                type="text"
                value={formData.suggested_tags}
                onChange={(e) => setFormData({ ...formData, suggested_tags: e.target.value })}
                placeholder="e.g., terracotta, handmade pottery, eco-friendly"
                className="w-full px-3 py-2 rounded-xl border border-[#E8E1D7] text-xs bg-white mb-2"
              />
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#E8E1D7] flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleCalculateFairPrice}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#123F32] text-[#123F32] hover:bg-[#F8F5EF] font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Calculator className="w-4 h-4 text-[#C45D3A]" />
                <span>Verify Living Wage (FairPrice)</span>
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#123F32] hover:bg-[#24664D] text-white font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4 text-amber-300" />
                <span>Publish to Marketplace</span>
              </button>
            </div>

            {saveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Product successfully saved and published to the live Marketplace!</span>
              </div>
            )}
          </form>
        </div>

        {/* Right Column: Live Sticky Preview Card */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6F716A] flex items-center gap-1">
              <Eye className="w-4 h-4 text-[#123F32]" />
              <span>Live Marketplace Preview</span>
            </span>
            <span className="text-[10px] bg-[#24664D] text-white px-2 py-0.5 rounded-full font-bold">
              Buyer View
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8E1D7] overflow-hidden shadow-md">
            <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
              <CraftImage
                src={productImageUrl}
                craftCategory={formData.craft_category}
                productName={formData.product_name}
                alt={formData.product_name || 'Product Preview'}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                {aiAnalyzed && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#123F32]/90 backdrop-blur-xs text-amber-200 px-2.5 py-0.5 rounded-full">
                    <Sparkles className="w-2.5 h-2.5 text-amber-300" /> AI Catalogued
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#24664D]/90 backdrop-blur-xs text-white px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-2.5 h-2.5" /> FairPrice
                </span>
              </div>
              <div className="absolute bottom-2.5 right-2.5 bg-white/95 px-2.5 py-0.5 rounded text-[11px] font-bold text-[#242720] shadow-2xs">
                {formData.craft_category}
              </div>
            </div>

            <div className="p-5 space-y-3">
              <div>
                <h3 className="font-serif font-bold text-[#242720] text-base leading-snug">
                  {formData.product_name || 'Draft Product Title'}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-[#6F716A] mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C45D3A] shrink-0" />
                  <span>
                    By <strong className="text-[#242720]">{formData.artisan_name || 'Artisan Guild'}</strong> • {formData.region_origin || 'Local Craft Cluster'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#6F716A] line-clamp-3 leading-relaxed">
                {formData.visual_description || 'Visual craft description will be drafted here...'}
              </p>

              {formData.visible_materials && (
                <div className="flex flex-wrap gap-1">
                  {formData.visible_materials.split(',').map((mat, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-[#F8F5EF] text-[#242720] px-2 py-0.5 rounded border border-[#E8E1D7]"
                    >
                      {mat.trim()}
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-3 border-t border-[#E8E1D7] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#6F716A] font-bold block">
                    Listing Price
                  </span>
                  <span className="text-xl font-bold font-serif text-[#123F32]">
                    ₹{Number(formData.price || 0).toLocaleString('en-IN')}
                  </span>
                </div>

                <span className="text-[11px] text-[#24664D] font-bold bg-[#F8F5EF] px-2.5 py-1 rounded-lg border border-[#E8E1D7]">
                  Ready to Publish
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
