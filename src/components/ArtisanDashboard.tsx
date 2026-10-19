import React from 'react';
import { CatalogueItem, BuyerEnquiry, DemoOrder } from '../types/catalogue.ts';
import { CraftImage } from '../utils/craftImages.tsx';
import {
  Package,
  MessageSquare,
  ShoppingBag,
  TrendingUp,
  PlusCircle,
  Calculator,
  Store,
  Users,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Info,
} from 'lucide-react';

interface ArtisanDashboardProps {
  products: CatalogueItem[];
  enquiries: BuyerEnquiry[];
  orders: DemoOrder[];
  onNavigate: (tab: any) => void;
}

export const ArtisanDashboard: React.FC<ArtisanDashboardProps> = ({
  products,
  enquiries,
  orders,
  onNavigate,
}) => {
  // Aggregate real and demo metrics
  const totalProducts = products.length;
  const totalEnquiries = enquiries.length;
  const demoOrdersCount = orders.length;
  const demoGrossVolume = orders.reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[#123F32] text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#24664D]/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🪷</span>
              <span className="text-xs font-semibold bg-[#24664D] text-amber-200 border border-amber-300/30 px-3 py-1 rounded-full uppercase tracking-wider">
                Artisan Command Center
              </span>
              <span className="text-xs bg-white/10 text-white/90 px-2.5 py-0.5 rounded-full border border-white/20">
                FairTrade Verified
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif mb-2 text-[#F8F5EF]">
              Welcome back, Master Craftsperson
            </h2>
            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed max-w-2xl">
              Manage your AI-generated product catalogue, track buyer enquiries, compute transparent fair pricing, and connect directly with institutional buyers.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap sm:flex-nowrap gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('create_product')}
              className="px-4 py-2.5 rounded-xl bg-[#C45D3A] hover:bg-[#a84c2d] text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Product</span>
            </button>
            <button
              onClick={() => onNavigate('fairprice')}
              className="px-4 py-2.5 rounded-xl bg-[#24664D] hover:bg-[#1a4a38] text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-sm border border-white/15"
            >
              <Calculator className="w-4 h-4 text-amber-200" />
              <span>FairPrice AI</span>
            </button>
            <button
              onClick={() => onNavigate('marketplace')}
              className="px-4 py-2.5 rounded-xl bg-white text-[#123F32] hover:bg-stone-100 text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-sm"
            >
              <Store className="w-4 h-4" />
              <span>Marketplace</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl border border-[#E8E1D7] p-5 shadow-2xs">
          <div className="flex items-center justify-between text-[#6F716A] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Catalogue</span>
            <Package className="w-4 h-4 text-[#123F32]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#242720] font-serif">
            {totalProducts}
          </div>
          <span className="text-[11px] text-[#24664D] font-semibold mt-1 block">
            ✓ 100% Verified in Local State
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E1D7] p-5 shadow-2xs">
          <div className="flex items-center justify-between text-[#6F716A] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Buyer Enquiries</span>
            <MessageSquare className="w-4 h-4 text-[#C45D3A]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#242720] font-serif">
            {totalEnquiries}
          </div>
          <span className="text-[11px] text-[#C45D3A] font-semibold mt-1 block">
            {enquiries.filter(e => e.status === 'New').length} pending response
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E1D7] p-5 shadow-2xs">
          <div className="flex items-center justify-between text-[#6F716A] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Dispatched Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#123F32]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#242720] font-serif">
            {demoOrdersCount}
          </div>
          <span className="text-[10px] text-[#6F716A] mt-1 block">
            Demo records for evaluation
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E1D7] p-5 shadow-2xs">
          <div className="flex items-center justify-between text-[#6F716A] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Cumulative Volume</span>
            <TrendingUp className="w-4 h-4 text-[#24664D]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#123F32] font-serif">
            ₹{demoGrossVolume.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-[#6F716A] mt-1 block">
            Demo retail benchmark
          </span>
        </div>
      </div>

      {/* Main Grid: Recent Products & Recent Buyer Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Catalogue Items */}
        <div className="bg-white rounded-2xl border border-[#E8E1D7] p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E1D7] mb-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#242720]">My Live Catalogue Items</h3>
                <p className="text-xs text-[#6F716A]">Published to the public marketplace</p>
              </div>
              <button
                onClick={() => onNavigate('my_products')}
                className="text-xs text-[#123F32] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {products.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-4 p-3 rounded-xl border border-[#E8E1D7] hover:border-[#123F32]/40 bg-[#F8F5EF]/40 transition"
                >
                  <CraftImage
                    src={p.image_url}
                    craftCategory={p.craft_category}
                    productName={p.product_name}
                    alt={p.product_name}
                    className="w-14 h-14 object-cover rounded-lg border border-[#E8E1D7]"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-[#242720] text-sm truncate">
                      {p.product_name}
                    </h4>
                    <p className="text-xs text-[#6F716A] truncate">
                      {p.craft_category} • {p.region_origin}
                    </p>
                    <span className="text-xs font-bold text-[#123F32] mt-0.5 block">
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {p.ai_analyzed && (
                    <span className="text-[10px] font-bold bg-[#F8F5EF] text-[#123F32] border border-[#E8E1D7] px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                      <Sparkles className="w-2.5 h-2.5 text-[#C45D3A]" /> AI
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#E8E1D7]">
            <button
              onClick={() => onNavigate('create_product')}
              className="w-full py-2.5 rounded-xl border border-dashed border-[#123F32] text-[#123F32] hover:bg-[#F8F5EF] text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#C45D3A]" />
              <span>Create New Product via Photo-to-Catalogue AI</span>
            </button>
          </div>
        </div>

        {/* Recent Buyer Enquiries */}
        <div className="bg-white rounded-2xl border border-[#E8E1D7] p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E1D7] mb-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#242720]">Direct Buyer Enquiries</h3>
                <p className="text-xs text-[#6F716A]">Wholesale and individual buyers seeking items</p>
              </div>
              <button
                onClick={() => onNavigate('buyermatch')}
                className="text-xs text-[#123F32] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>BuyerMatch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {enquiries.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#6F716A]">
                No buyer enquiries logged yet. Enquiries from the Marketplace will appear here.
              </div>
            ) : (
              <div className="space-y-3">
                {enquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="p-3.5 rounded-xl border border-[#E8E1D7] bg-[#F8F5EF]/60 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-[#242720] text-xs">
                          {enq.buyer_name}{' '}
                          {enq.organization && (
                            <span className="font-normal text-[#6F716A]">({enq.organization})</span>
                          )}
                        </h4>
                        <span className="text-[11px] text-[#123F32] font-semibold block">
                          Product: {enq.product_name} • Qty: {enq.quantity} units
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          enq.status === 'New'
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </div>

                    <p className="text-xs text-[#242720] bg-white p-2.5 rounded-lg border border-[#E8E1D7] leading-relaxed">
                      "{enq.message}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-[#6F716A] pt-1">
                      <span>Email: <strong className="text-[#242720]">{enq.email}</strong></span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(enq.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-[#E8E1D7] flex items-center justify-between text-xs text-[#6F716A]">
            <span>Enquiries are saved locally and synced across workspace views.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
