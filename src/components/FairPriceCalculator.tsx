import React, { useState, useEffect } from 'react';
import { CatalogueItem, FairPriceBreakdown } from '../types/catalogue.ts';
import {
  Calculator,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Sparkles,
  FlaskConical,
} from 'lucide-react';

interface FairPriceCalculatorProps {
  initialCraftData?: Partial<CatalogueItem> | null;
  onApplyPrice?: (price: number, breakdown: FairPriceBreakdown) => void;
}

export const FairPriceCalculator: React.FC<FairPriceCalculatorProps> = ({
  initialCraftData,
  onApplyPrice,
}) => {
  const [productName, setProductName] = useState(
    initialCraftData?.product_name || 'Handcrafted Terracotta Clay Diya'
  );
  const [craftCategory, setCraftCategory] = useState(
    initialCraftData?.craft_category || 'Pottery & Ceramics'
  );

  // Exact Hackathon input parameters
  const [materialCost, setMaterialCost] = useState<number>(200);
  const [laborHours, setLaborHours] = useState<number>(3);
  const [hourlyWage, setHourlyWage] = useState<number>(100);
  const [packagingCost, setPackagingCost] = useState<number>(30);
  const [otherExpenses, setOtherExpenses] = useState<number>(20);
  const [platformFeePercent, setPlatformFeePercent] = useState<number>(10);
  const [desiredMarginPercent, setDesiredMarginPercent] = useState<number>(20);

  // Sync if initialCraftData changes
  useEffect(() => {
    if (initialCraftData) {
      if (initialCraftData.product_name) setProductName(initialCraftData.product_name);
      if (initialCraftData.craft_category) {
        setCraftCategory(initialCraftData.craft_category);
        if (initialCraftData.craft_category.includes('Textiles')) {
          setMaterialCost(380);
          setLaborHours(8);
          setHourlyWage(95);
          setPackagingCost(50);
          setOtherExpenses(30);
        } else if (initialCraftData.craft_category.includes('Metal')) {
          setMaterialCost(650);
          setLaborHours(18);
          setHourlyWage(100);
          setPackagingCost(80);
          setOtherExpenses(60);
        } else if (initialCraftData.craft_category.includes('Wood')) {
          setMaterialCost(420);
          setLaborHours(10);
          setHourlyWage(95);
          setPackagingCost(60);
          setOtherExpenses(40);
        }
      }
    }
  }, [initialCraftData]);

  // Hackathon benchmark loader
  const handleLoadBenchmark = () => {
    setProductName('Artisan Hackathon Benchmark Craft');
    setCraftCategory('Traditional Craft');
    setMaterialCost(200);
    setLaborHours(3);
    setHourlyWage(100);
    setPackagingCost(30);
    setOtherExpenses(20);
    setPlatformFeePercent(10);
    setDesiredMarginPercent(20);
  };

  // Validations
  const isValidFeeAndMargin = platformFeePercent + desiredMarginPercent < 100;
  const isInputsValid =
    materialCost >= 0 &&
    laborHours >= 0 &&
    hourlyWage >= 0 &&
    packagingCost >= 0 &&
    otherExpenses >= 0 &&
    platformFeePercent >= 0 &&
    desiredMarginPercent >= 0 &&
    isValidFeeAndMargin;

  // Formula implementation:
  // Total cost = Materials + (Labour hours × Hourly wage) + Packaging + Other expenses
  const laborCost = laborHours * hourlyWage;
  const totalCost = materialCost + laborCost + packagingCost + otherExpenses;

  // Suggested price = Total cost ÷ (1 − Platform fee rate − Profit margin rate)
  const rateDeductions = (platformFeePercent + desiredMarginPercent) / 100;
  const denominator = 1 - rateDeductions;
  const exactSuggestedPrice = denominator > 0 ? totalCost / denominator : totalCost;
  const roundedSuggestedPrice = Math.round(exactSuggestedPrice);

  const platformFeeAmount = Math.round(exactSuggestedPrice * (platformFeePercent / 100));
  const profitMarginAmount = Math.round(exactSuggestedPrice * (desiredMarginPercent / 100));
  const directArtisanEarnings = laborCost + profitMarginAmount;
  const artisanSharePercent =
    roundedSuggestedPrice > 0
      ? Math.round((directArtisanEarnings / roundedSuggestedPrice) * 100)
      : 0;

  // Middleman comparison benchmark
  const middlemanBuyingPrice = Math.round(materialCost + laborCost * 0.35);

  const breakdown: FairPriceBreakdown = {
    material_cost: materialCost,
    labor_hours: laborHours,
    hourly_wage: hourlyWage,
    labor_cost: laborCost,
    packaging_cost: packagingCost,
    other_expenses: otherExpenses,
    total_cost: totalCost,
    platform_fee_percent: platformFeePercent,
    desired_profit_margin_percent: desiredMarginPercent,
    suggested_price: roundedSuggestedPrice,
    // Compatibility fields
    raw_material_cost: materialCost,
    artisan_hours: laborHours,
    hourly_living_wage: hourlyWage,
    total_labor_cost: laborCost,
    overhead_and_tools: otherExpenses,
    fair_profit_margin_percent: desiredMarginPercent,
    fair_profit_amount: profitMarginAmount,
    platform_packaging: packagingCost,
    fair_retail_price: roundedSuggestedPrice,
    middleman_typical_price: middlemanBuyingPrice,
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#123F32] text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#24664D]/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">⚖️</span>
              <span className="text-xs font-semibold bg-[#24664D] text-amber-200 border border-amber-300/30 px-3 py-1 rounded-full uppercase tracking-wider">
                FairPrice AI Engine
              </span>
              <span className="text-xs bg-white/10 text-white/90 px-2.5 py-0.5 rounded-full border border-white/20">
                Transparent Living Wage Model
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif mb-2 text-[#F8F5EF]">
              Transparent Artisan Fair Pricing
            </h2>
            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
              Eliminates exploitative undercutting by calculating true cost recovery and dignified maker margins:
              <br className="hidden sm:inline" />
              <code className="bg-[#24664D]/60 text-amber-200 px-2 py-0.5 rounded text-xs mt-1 inline-block">
                Suggested Price = Total Cost ÷ (1 − Platform Fee% − Profit Margin%)
              </code>
            </p>
          </div>

          <button
            type="button"
            onClick={handleLoadBenchmark}
            className="self-start md:self-center px-4 py-2.5 rounded-xl bg-[#C45D3A] hover:bg-[#a84c2d] text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition cursor-pointer"
          >
            <FlaskConical className="w-4 h-4" />
            <span>Load Test Benchmark (₹786)</span>
          </button>
        </div>
      </div>

      {!isValidFeeAndMargin && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-xl text-red-900 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>
            <strong>Invalid Formula Parameter:</strong> Platform fee percentage ({platformFeePercent}%) + Desired profit margin ({desiredMarginPercent}%) must be less than 100%.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Inputs */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E8E1D7] p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E8E1D7]">
            <div>
              <h3 className="font-bold text-[#242720] text-base">Cost & Labor Input Parameters</h3>
              <p className="text-xs text-[#6F716A]">
                Craft Item: <span className="font-semibold text-[#242720]">{productName}</span> ({craftCategory})
              </p>
            </div>
            {initialCraftData?.product_name && (
              <span className="text-xs bg-[#F8F5EF] text-[#123F32] font-medium px-2.5 py-1 rounded-md border border-[#E8E1D7] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#C45D3A]" /> Linked from Catalogue
              </span>
            )}
          </div>

          {/* Row 1: Materials & Packaging */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242720] mb-1.5">
                Material Cost (₹) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-stone-400 font-semibold">₹</span>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={materialCost}
                  onChange={(e) => setMaterialCost(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#E8E1D7] focus:outline-none focus:ring-2 focus:ring-[#123F32] font-semibold text-[#242720] bg-[#F8F5EF]/60"
                />
              </div>
              <span className="text-[11px] text-[#6F716A] mt-1 block">
                Clay, yarns, natural dyes, brass, wood, waxes.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242720] mb-1.5">
                Packaging Cost (₹) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-stone-400 font-semibold">₹</span>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={packagingCost}
                  onChange={(e) => setPackagingCost(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#E8E1D7] focus:outline-none focus:ring-2 focus:ring-[#123F32] font-semibold text-[#242720] bg-[#F8F5EF]/60"
                />
              </div>
              <span className="text-[11px] text-[#6F716A] mt-1 block">
                Corrugated boxes, protective straw, craft tags.
              </span>
            </div>
          </div>

          {/* Row 2: Labor hours & Wage */}
          <div className="p-4 rounded-xl bg-[#F8F5EF] border border-[#E8E1D7] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#123F32] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#24664D]" />
                <span>Artisan Crafting Labor (Direct To Maker)</span>
              </span>
              <span className="text-xs font-bold text-[#123F32] bg-[#24664D]/15 px-2.5 py-0.5 rounded-full border border-[#24664D]/30">
                Labor Cost: ₹{laborCost.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-[#242720] mb-1">
                  Labour Hours: <span className="font-bold text-[#C45D3A]">{laborHours} hrs</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={laborHours}
                  onChange={(e) => setLaborHours(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#E8E1D7] bg-white text-sm font-semibold mb-1"
                />
                <input
                  type="range"
                  min="0.5"
                  max="40"
                  step="0.5"
                  value={laborHours}
                  onChange={(e) => setLaborHours(Number(e.target.value))}
                  className="w-full accent-[#123F32] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#242720] mb-1">
                  Fair Hourly Wage: <span className="font-bold text-[#123F32]">₹{hourlyWage}/hr</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  step="5"
                  value={hourlyWage}
                  onChange={(e) => setHourlyWage(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#E8E1D7] bg-white text-sm font-semibold mb-1"
                />
                <input
                  type="range"
                  min="50"
                  max="250"
                  step="5"
                  value={hourlyWage}
                  onChange={(e) => setHourlyWage(Number(e.target.value))}
                  className="w-full accent-[#24664D] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Other expenses, Platform Fee %, Desired Margin % */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242720] mb-1.5">
                Other Expenses (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-stone-400 font-semibold">₹</span>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={otherExpenses}
                  onChange={(e) => setOtherExpenses(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#E8E1D7] focus:outline-none focus:ring-2 focus:ring-[#123F32] font-semibold text-[#242720] bg-[#F8F5EF]/60"
                />
              </div>
              <span className="text-[11px] text-[#6F716A] mt-1 block">
                Kiln fuel, studio wear, electricity.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242720] mb-1.5">
                Platform Fee: <span className="text-[#123F32]">{platformFeePercent}%</span>
              </label>
              <input
                type="number"
                min="0"
                max="50"
                step="1"
                value={platformFeePercent}
                onChange={(e) => setPlatformFeePercent(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E1D7] focus:outline-none focus:ring-2 focus:ring-[#123F32] font-semibold text-[#242720] bg-[#F8F5EF]/60"
              />
              <span className="text-[11px] text-[#6F716A] mt-1 block">
                Fairtrade digital infrastructure fee.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242720] mb-1.5">
                Desired Profit Margin: <span className="text-[#C45D3A]">{desiredMarginPercent}%</span>
              </label>
              <input
                type="number"
                min="0"
                max="70"
                step="1"
                value={desiredMarginPercent}
                onChange={(e) => setDesiredMarginPercent(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E1D7] focus:outline-none focus:ring-2 focus:ring-[#123F32] font-semibold text-[#242720] bg-[#F8F5EF]/60"
              />
              <span className="text-[11px] text-[#6F716A] mt-1 block">
                Sustainable savings & family security.
              </span>
            </div>
          </div>
        </div>

        {/* Right Col: Price Breakdown & Explanation Card */}
        <div className="bg-[#F8F5EF] rounded-2xl border border-[#E8E1D7] p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E1D7]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6F716A]">
                Formula Recommendation
              </span>
              <span className="text-[11px] bg-[#24664D] text-white font-bold px-2.5 py-0.5 rounded-full">
                FairPrice Verified
              </span>
            </div>

            {/* Total Cost & Suggested Price */}
            <div className="my-4 text-center">
              <span className="text-xs text-[#6F716A] font-medium block">
                Total Base Cost = ₹{totalCost.toLocaleString('en-IN')}
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#123F32] font-serif my-1">
                ₹{roundedSuggestedPrice.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-[#6F716A] block">
                Exact calculation: ₹{exactSuggestedPrice.toFixed(2)}
              </span>
              <span className="text-xs text-[#24664D] font-bold mt-1 inline-block bg-white px-2.5 py-0.5 rounded-full border border-[#E8E1D7]">
                Direct to Maker: {artisanSharePercent}% (₹{directArtisanEarnings.toLocaleString('en-IN')})
              </span>
            </div>

            {/* Transparent Line Items */}
            <div className="space-y-2 text-xs pt-3 border-t border-[#E8E1D7]">
              <div className="flex justify-between text-[#6F716A]">
                <span>Material Cost</span>
                <span className="font-semibold text-[#242720]">₹{materialCost}</span>
              </div>
              <div className="flex justify-between text-[#6F716A]">
                <span>Labour Cost ({laborHours}h × ₹{hourlyWage}/h)</span>
                <span className="font-semibold text-[#24664D]">₹{laborCost}</span>
              </div>
              <div className="flex justify-between text-[#6F716A]">
                <span>Packaging Cost</span>
                <span className="font-semibold text-[#242720]">₹{packagingCost}</span>
              </div>
              <div className="flex justify-between text-[#6F716A]">
                <span>Other Expenses</span>
                <span className="font-semibold text-[#242720]">₹{otherExpenses}</span>
              </div>
              <div className="flex justify-between text-[#242720] font-bold pt-1 border-t border-[#E8E1D7]/60">
                <span>Total Cost</span>
                <span>₹{totalCost}</span>
              </div>
              <div className="flex justify-between text-[#6F716A]">
                <span>Platform Fee ({platformFeePercent}%)</span>
                <span className="font-semibold text-[#242720]">₹{platformFeeAmount}</span>
              </div>
              <div className="flex justify-between text-[#6F716A]">
                <span>Artisan Profit Margin ({desiredMarginPercent}%)</span>
                <span className="font-semibold text-[#C45D3A]">₹{profitMarginAmount}</span>
              </div>
            </div>

            {/* Explanation Note */}
            <div className="mt-4 p-3 rounded-xl bg-white border border-[#E8E1D7] text-[11px] text-[#6F716A] leading-relaxed">
              <strong className="text-[#242720] block mb-0.5">Mathematical Derivation:</strong>
              Suggested Price = ₹{totalCost} ÷ (1 − {platformFeePercent/100} − {desiredMarginPercent/100}) = ₹{totalCost} ÷ {denominator.toFixed(2)} = ₹{exactSuggestedPrice.toFixed(2)} (approx ₹{roundedSuggestedPrice}).
            </div>

            {/* Middleman comparison */}
            <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-xs">
              <div className="flex items-center gap-1.5 text-red-900 font-bold mb-1">
                <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>Exploitative Middleman Rate (Demo Comparison)</span>
              </div>
              <p className="text-red-700 text-[11px] leading-relaxed">
                Middlemen typically buy this for ~<span className="font-bold underline">₹{middlemanBuyingPrice}</span>, mark it up 400% in city luxury showrooms, denying the maker fair living compensation.
              </p>
            </div>
          </div>

          {onApplyPrice && (
            <button
              type="button"
              disabled={!isInputsValid}
              onClick={() => onApplyPrice(roundedSuggestedPrice, breakdown)}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-[#123F32] hover:bg-[#24664D] text-white transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>Apply ₹{roundedSuggestedPrice} to Product Listing</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
