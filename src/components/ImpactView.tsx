import React from 'react';
import { ShieldCheck, HeartHandshake, Users, Award, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';

interface ImpactViewProps {
  onNavigateToArtisan: () => void;
}

export const ImpactView: React.FC<ImpactViewProps> = ({ onNavigateToArtisan }) => {
  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-[#123F32] text-white rounded-2xl p-6 sm:p-10 shadow-sm border border-[#24664D]/40 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#24664D] border border-amber-300/30 text-amber-200 text-xs font-semibold mb-3">
          <ShieldCheck className="w-4 h-4" />
          <span>Ethical Artisan Empowerment</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#F8F5EF] mb-3">
          Our Impact: Restoring Dignity to Grassroots Craft
        </h2>
        <p className="text-xs sm:text-sm text-stone-200 leading-relaxed max-w-2xl">
          For generations, middlemen have pocketed up to 75% of Indian handicraft retail markups. KalaSetu AI uses computer vision and automated fair pricing to bridge artisans directly to institutional and conscious buyers.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-[#E8E1D7] p-6 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#F8F5EF] flex items-center justify-center text-[#123F32] font-bold text-lg border border-[#E8E1D7]">
            ⚖️
          </div>
          <h3 className="font-serif font-bold text-[#242720] text-lg">Living Wage Guarantee</h3>
          <p className="text-xs text-[#6F716A] leading-relaxed">
            Every product's price is rooted in real labor hours and regional living wage standards, preventing price exploitation by city wholesalers.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E1D7] p-6 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#F8F5EF] flex items-center justify-center text-[#C45D3A] font-bold text-lg border border-[#E8E1D7]">
            📸
          </div>
          <h3 className="font-serif font-bold text-[#242720] text-lg">Digital Independence</h3>
          <p className="text-xs text-[#6F716A] leading-relaxed">
            Eliminates high studio catalogue agency fees. A 5-second phone photograph generates ready-to-sell global listings.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E1D7] p-6 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#F8F5EF] flex items-center justify-center text-[#24664D] font-bold text-lg border border-[#E8E1D7]">
            🪷
          </div>
          <h3 className="font-serif font-bold text-[#242720] text-lg">Cultural Integrity</h3>
          <p className="text-xs text-[#6F716A] leading-relaxed">
            Our AI never invents false lineage, caste origins, or unverified GI claims. Artisans maintain 100% control over their oral heritage.
          </p>
        </div>
      </div>

      {/* Demonstration Target Metrics */}
      <div className="bg-white rounded-2xl border border-[#E8E1D7] p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8E1D7] gap-2">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#242720]">Hackathon Impact Benchmarks</h3>
            <p className="text-xs text-[#6F716A]">Target projections for craft cluster expansion across India</p>
          </div>
          <span className="text-[11px] font-semibold bg-[#F8F5EF] text-[#6F716A] px-2.5 py-1 rounded-md border border-[#E8E1D7]">
            Illustrative Targets
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="p-4 rounded-xl bg-[#F8F5EF]">
            <div className="text-3xl font-extrabold text-[#123F32] font-serif">+350%</div>
            <span className="text-xs font-semibold text-[#242720] mt-1 block">Artisan Margin Increase</span>
            <p className="text-[11px] text-[#6F716A] mt-0.5">Compared to traditional rural middlemen purchases</p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8F5EF]">
            <div className="text-3xl font-extrabold text-[#123F32] font-serif">12,000+</div>
            <span className="text-xs font-semibold text-[#242720] mt-1 block">Artisan Families in Pipeline</span>
            <p className="text-[11px] text-[#6F716A] mt-0.5">Across Rajasthan, Bastar, Bengal & Tamil Nadu</p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8F5EF]">
            <div className="text-3xl font-extrabold text-[#123F32] font-serif">0%</div>
            <span className="text-xs font-semibold text-[#242720] mt-1 block">Middleman Commission</span>
            <p className="text-[11px] text-[#6F716A] mt-0.5">Direct institutional and buyer connectivity</p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 bg-[#123F32] text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-serif font-bold text-xl text-[#F8F5EF] mb-1">
            Are you a traditional artisan or guild representative?
          </h3>
          <p className="text-xs text-stone-200">
            Create your first free AI-assisted product catalogue in under two minutes.
          </p>
        </div>
        <button
          onClick={onNavigateToArtisan}
          className="px-6 py-3 rounded-xl bg-[#C45D3A] hover:bg-[#a84c2d] text-white text-xs font-semibold shrink-0 shadow-sm transition cursor-pointer flex items-center gap-2"
        >
          <span>Open Artisan Studio</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
