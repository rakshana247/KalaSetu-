import React from 'react';
import { CatalogueItem } from '../types/catalogue.ts';
import {
  Sparkles,
  ShieldCheck,
  Calculator,
  ShoppingBag,
  ArrowRight,
  Camera,
  Layers,
  HeartHandshake,
  CheckCircle2,
  Users,
  Feather,
  TrendingUp,
  Compass,
  Globe2,
  Award,
} from 'lucide-react';
import { CraftImage } from '../utils/craftImages.tsx';

interface HomePageProps {
  products: CatalogueItem[];
  onNavigate: (tab: any, filter?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ products, onNavigate }) => {
  const collections = [
    {
      title: 'Pottery & Ceramics',
      subtitle: 'Wheel-thrown clay, terracotta, and terracotta ware',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
      category: 'Pottery & Ceramics',
    },
    {
      title: 'Handloom Textiles',
      subtitle: 'Natural indigo, Dabu, and traditional weaving',
      image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80',
      category: 'Handloom Textiles',
    },
    {
      title: 'Metalwork & Dhokra',
      subtitle: 'Ancient lost-wax casting and hand-beaten brass',
      image: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=600&q=80',
      category: 'Metalwork',
    },
    {
      title: 'Woodwork & Carvings',
      subtitle: 'Chiseled teak, sheesham, and natural grain home accents',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
      category: 'Woodwork',
    },
    {
      title: 'Traditional Art & Heritage',
      subtitle: 'Tribal paintings, folk motifs, and natural mineral pigments',
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
      category: 'Paintings & Folk Art',
    },
    {
      title: 'Bags & Handcrafted Accessories',
      subtitle: 'Hand-stitched jute, organic cotton, and vegetable-tanned accents',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
      category: 'Leathercraft',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="pt-2 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#123F32]/10 border border-[#123F32]/20 text-[#123F32] text-xs font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#C45D3A] animate-pulse" />
              <span>Tradition to Global Markets</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-[#242720] tracking-tight leading-[1.15]">
              Empowering Artisans <br className="hidden sm:inline" />
              <span className="text-[#123F32]">with Ethical AI</span>
            </h1>

            <p className="text-base sm:text-lg text-[#6F716A] leading-relaxed max-w-xl font-normal">
              KalaSetu AI transforms a single product photograph into a verified e-commerce catalogue, transparently computes fair living wages, and connects grassroots creators directly with conscious global buyers.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => onNavigate('create_product')}
                className="px-6 py-3.5 rounded-xl bg-[#123F32] hover:bg-[#24664D] text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Get Started as an Artisan</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('marketplace')}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-[#F8F5EF] text-[#242720] font-semibold text-sm transition-all border border-[#E8E1D7] flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <ShoppingBag className="w-4 h-4 text-[#C45D3A]" />
                <span>Explore Marketplace</span>
              </button>
            </div>

            <div className="pt-4 border-t border-[#E8E1D7]/80 flex flex-wrap items-center gap-6 text-xs text-[#6F716A]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#24664D]" />
                <span>No Middleman Undercutting</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#24664D]" />
                <span>Multimodal Gemini 3.8 Vision</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#24664D]" />
                <span>100% Direct Artisan Payouts</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Craft Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Card */}
              <div className="rounded-3xl overflow-hidden border border-[#E8E1D7] bg-white shadow-xl">
                <CraftImage
                  src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=900&q=80"
                  craftCategory="Pottery & Ceramics"
                  productName="Authentic Traditional Indian Terracotta Craft"
                  alt="Authentic traditional Indian craft potter"
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <div className="p-5 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#C45D3A]">
                      Molela, Rajasthan
                    </span>
                    <span className="text-xs font-bold text-[#123F32] bg-[#F8F5EF] px-2.5 py-0.5 rounded-full border border-[#E8E1D7]">
                      FairPrice ₹1,850
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-[#242720] text-base">
                    Terracotta Floral Tea Set by Rameshwar Prajapati
                  </h3>
                  <p className="text-xs text-[#6F716A]">
                    Catalogued instantly using KalaSetu Multimodal AI with living-wage protection.
                  </p>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-[#123F32] text-white p-4 rounded-2xl shadow-lg border border-[#24664D] hidden sm:flex items-center gap-3 max-w-xs">
                <div className="w-10 h-10 rounded-xl bg-[#24664D] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-amber-200" />
                </div>
                <div className="text-xs">
                  <span className="font-bold block text-white">Guaranteed Fair Compensation</span>
                  <span className="text-stone-300 text-[11px]">Direct to grassroots master makers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Benchmark Strip (Clearly labeled demo figures) */}
      <section className="bg-white rounded-2xl border border-[#E8E1D7] p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center justify-between pb-4 border-b border-[#E8E1D7] mb-6 gap-2">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#242720]">Platform Demonstration Benchmark</h3>
            <p className="text-xs text-[#6F716A]">Simulated metrics for hackathon evaluation</p>
          </div>
          <span className="text-[11px] font-semibold bg-[#F8F5EF] text-[#6F716A] px-2.5 py-1 rounded-md border border-[#E8E1D7]">
            Illustrative Demo Data
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#123F32] font-serif">450+</div>
            <span className="text-xs font-medium text-[#6F716A] mt-1 block">Artisans Onboarded (Demo)</span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#123F32] font-serif">100%</div>
            <span className="text-xs font-medium text-[#6F716A] mt-1 block">Ethical Living Wage Target</span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#123F32] font-serif">14+</div>
            <span className="text-xs font-medium text-[#6F716A] mt-1 block">Indigenous Craft Clusters</span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#123F32] font-serif">&lt; 30s</div>
            <span className="text-xs font-medium text-[#6F716A] mt-1 block">AI Photo-to-Catalogue Time</span>
          </div>
        </div>
      </section>

      {/* How KalaSetu AI Works */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C45D3A]">
            Empowerment Pipeline
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#242720]">
            How KalaSetu AI Bridges Tradition to Markets
          </h2>
          <p className="text-xs sm:text-sm text-[#6F716A]">
            Designed for first-time digital users with no complicated e-commerce jargon.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-[#E8E1D7] p-6 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F8F5EF] text-[#123F32] flex items-center justify-center font-bold text-sm border border-[#E8E1D7]">
              1
            </div>
            <h3 className="font-serif font-bold text-[#242720] text-base">Upload Photo</h3>
            <p className="text-xs text-[#6F716A] leading-relaxed">
              Snap a simple picture on any smartphone or choose a sample craft. No professional studio setup required.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8E1D7] p-6 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F8F5EF] text-[#C45D3A] flex items-center justify-center font-bold text-sm border border-[#E8E1D7]">
              2
            </div>
            <h3 className="font-serif font-bold text-[#242720] text-base">Gemini Vision AI</h3>
            <p className="text-xs text-[#6F716A] leading-relaxed">
              Extracts visible craft category, materials, color harmony, and tags without hallucinating false origins.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8E1D7] p-6 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F8F5EF] text-[#123F32] flex items-center justify-center font-bold text-sm border border-[#E8E1D7]">
              3
            </div>
            <h3 className="font-serif font-bold text-[#242720] text-base">FairPrice Engine</h3>
            <p className="text-xs text-[#6F716A] leading-relaxed">
              Derives recommended retail pricing using actual labor hours, living wages, and fair maker margins.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8E1D7] p-6 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F8F5EF] text-[#24664D] flex items-center justify-center font-bold text-sm border border-[#E8E1D7]">
              4
            </div>
            <h3 className="font-serif font-bold text-[#242720] text-base">Connect to Buyers</h3>
            <p className="text-xs text-[#6F716A] leading-relaxed">
              Publishes to the live marketplace and matches directly with boutique retailers and ethical export houses.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Craft Collections */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C45D3A]">
              Curated Shelves
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#242720]">
              Featured Craft Collections
            </h2>
          </div>
          <button
            onClick={() => onNavigate('marketplace')}
            className="text-xs font-bold text-[#123F32] hover:text-[#24664D] flex items-center gap-1 cursor-pointer"
          >
            <span>Browse Full Marketplace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((col, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate('marketplace', col.category)}
              className="bg-white rounded-2xl border border-[#E8E1D7] overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
                <CraftImage
                  src={col.image}
                  craftCategory={col.category}
                  productName={col.title}
                  alt={col.title}
                  className="w-full h-full object-cover group-hover:scale-104 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="font-serif font-bold text-base">{col.title}</h3>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between text-xs text-[#6F716A]">
                <span>{col.subtitle}</span>
                <span className="font-bold text-[#123F32] group-hover:translate-x-1 transition-transform">
                  Explore →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Actual Live Featured Products */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C45D3A]">
              Live Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#242720]">
              Recently Published Artisan Works
            </h2>
          </div>
          <button
            onClick={() => onNavigate('marketplace')}
            className="text-xs font-bold text-[#123F32] hover:underline cursor-pointer"
          >
            View all {products.length} items
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 3).map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate('marketplace')}
              className="bg-white rounded-2xl border border-[#E8E1D7] overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="aspect-4/3 overflow-hidden bg-stone-100 relative">
                <CraftImage
                  src={item.image_url}
                  craftCategory={item.craft_category}
                  productName={item.product_name}
                  alt={item.product_name}
                  className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                />
                <div className="absolute top-2.5 right-2.5 bg-white/95 px-2.5 py-0.5 rounded-full text-xs font-bold text-[#123F32] shadow-2xs">
                  ₹{item.price.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C45D3A]">
                  {item.craft_category}
                </span>
                <h4 className="font-serif font-bold text-sm text-[#242720] truncate">
                  {item.product_name}
                </h4>
                <p className="text-xs text-[#6F716A]">
                  By {item.artisan_name} • {item.region_origin}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
