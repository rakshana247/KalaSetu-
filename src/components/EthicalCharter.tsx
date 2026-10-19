import React from 'react';
import { ShieldCheck, Sparkles, Check, AlertTriangle, HeartHandshake, Eye, BookOpen } from 'lucide-react';

export const EthicalCharter: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-[#123F32] rounded-2xl p-6 sm:p-8 text-white border border-[#24664D]/40">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#24664D] border border-amber-300/30 text-amber-200 text-xs font-semibold mb-3">
          <ShieldCheck className="w-4 h-4" />
          <span>Cultural & Algorithmic Guardrails</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F8F5EF] mb-3">
          The KalaSetu Ethical AI Charter
        </h2>
        <p className="text-xs sm:text-sm text-stone-200 leading-relaxed max-w-2xl">
          Traditional craft heritage is not generic training data—it embodies centuries of indigenous knowledge, sacred rituals, and human livelihoods. Here is how KalaSetu AI uses Gemini Vision responsibly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#E8E1D7] p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-[#123F32] font-bold text-base">
            <Check className="w-5 h-5 text-[#24664D]" />
            <h3 className="font-serif">What Our AI Does Do</h3>
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-[#6F716A]">
            <li className="flex items-start gap-2.5">
              <span className="text-[#24664D] font-bold">✓</span>
              <span><strong>Objective Physical Analysis:</strong> Inspects visual surfaces, visible glaze, weave patterns, and discernible raw materials.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#24664D] font-bold">✓</span>
              <span><strong>Color Harmony Extraction:</strong> Identifies visible palettes and tones to create searchable product listings.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#24664D] font-bold">✓</span>
              <span><strong>Broad Craft Sector Identification:</strong> Helps classify pottery, handloom, metalwork, or woodcraft into appropriate marketplace shelves.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#24664D] font-bold">✓</span>
              <span><strong>Uncertainty Highlighting:</strong> Clearly flags all physical elements that cannot be 100% verified from a two-dimensional photograph.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E1D7] p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-[#C45D3A] font-bold text-base">
            <AlertTriangle className="w-5 h-5 text-[#C45D3A]" />
            <h3 className="font-serif">What Our AI Strictly Never Does</h3>
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-[#6F716A]">
            <li className="flex items-start gap-2.5">
              <span className="text-red-600 font-bold">✗</span>
              <span><strong>Never Hallucinates Artisan Identity:</strong> Never invents an artisan's name, caste, tribe, or fake biography.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-red-600 font-bold">✗</span>
              <span><strong>Never Assumes Geographical Origins:</strong> Will never label an item as "Kashmiri Pashmina" or "Bastar Dhokra" unless visually labeled or confirmed by the artisan.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-red-600 font-bold">✗</span>
              <span><strong>Never Fabricates Folklore Narratives:</strong> Leaves sacred rituals, mythological motifs, and cultural heritage to the artisan's personal voice.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-red-600 font-bold">✗</span>
              <span><strong>Never Overrides the Maker:</strong> Every single field drafted by AI remains 100% editable by the artisan.</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="p-6 bg-[#F8F5EF] border border-[#E8E1D7] rounded-2xl flex flex-col sm:flex-row items-center gap-5">
        <div className="w-12 h-12 rounded-xl bg-[#123F32]/10 flex items-center justify-center text-[#123F32] shrink-0 border border-[#123F32]/20">
          <HeartHandshake className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-[#242720] text-sm mb-1 font-serif">
            Bridging Heritage & Modern Commerce Responsibly
          </h4>
          <p className="text-xs text-[#6F716A] leading-relaxed">
            By pairing AI computer vision with the FairPrice Calculator, KalaSetu ensures that technology serves the maker, not the middleman.
          </p>
        </div>
      </div>
    </div>
  );
};
