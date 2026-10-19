import React, { useState } from 'react';
import { BuyerLead, CatalogueItem, BuyerEnquiry } from '../types/catalogue.ts';
import {
  Users,
  Building,
  MapPin,
  Tag,
  Package,
  Send,
  CheckCircle2,
  AlertCircle,
  X,
  Filter,
  Sparkles,
  Info,
} from 'lucide-react';

interface BuyerMatchProps {
  buyerLeads: BuyerLead[];
  artisanProducts: CatalogueItem[];
  onSendEnquiry: (enquiry: BuyerEnquiry) => void;
}

export const BuyerMatch: React.FC<BuyerMatchProps> = ({
  buyerLeads,
  artisanProducts,
  onSendEnquiry,
}) => {
  const [selectedBuyer, setSelectedBuyer] = useState<BuyerLead | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>(
    artisanProducts[0]?.id || ''
  );
  const [artisanMessage, setArtisanMessage] = useState<string>('');
  const [offeredQuantity, setOfferedQuantity] = useState<number>(50);
  const [offeredPrice, setOfferedPrice] = useState<number>(
    artisanProducts[0]?.price || 1200
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [proposalSuccess, setProposalSuccess] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const filteredBuyers = buyerLeads.filter((buyer) => {
    if (categoryFilter === 'All') return true;
    return buyer.requested_category.includes(categoryFilter);
  });

  const handleOpenContact = (buyer: BuyerLead) => {
    setSelectedBuyer(buyer);
    // Select product matching category if available
    const matching = artisanProducts.find((p) =>
      p.craft_category.includes(buyer.requested_category)
    );
    if (matching) {
      setSelectedProductId(matching.id);
      setOfferedPrice(matching.price);
    } else if (artisanProducts[0]) {
      setSelectedProductId(artisanProducts[0].id);
      setOfferedPrice(artisanProducts[0].price);
    }
    setArtisanMessage(
      `Respected ${buyer.company_name} procurement team,\n\nWe are a registered traditional artisan collective specializing in ${buyer.requested_category}. We would love to supply your requested quantity of ${buyer.requested_quantity} with guaranteed fair wages and ethical production certifications.`
    );
  };

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBuyer) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const selectedProd = artisanProducts.find((p) => p.id === selectedProductId);
      const newEnquiry: BuyerEnquiry = {
        id: `prop-${Date.now()}`,
        product_id: selectedProductId,
        product_name: selectedProd?.product_name || 'Artisan Craft Catalog',
        buyer_name: selectedBuyer.company_name,
        organization: selectedBuyer.company_name,
        email: 'procurement@' + selectedBuyer.company_name.toLowerCase().replace(/[^a-z]/g, '') + '.com',
        quantity: offeredQuantity,
        message: artisanMessage,
        status: 'In Progress',
        created_at: new Date().toISOString(),
      };

      onSendEnquiry(newEnquiry);
      setIsSubmitting(false);
      setProposalSuccess(
        `Commercial proposal dispatched to ${selectedBuyer.company_name}! Logged in your Artisan Dashboard under Recent Enquiries.`
      );
      setSelectedBuyer(null);
      setTimeout(() => setProposalSuccess(null), 6000);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#123F32] text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#24664D]/40">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🤝</span>
            <span className="text-xs font-semibold bg-[#24664D] text-amber-200 border border-amber-300/30 px-3 py-1 rounded-full uppercase tracking-wider">
              BuyerMatch AI
            </span>
            <span className="text-xs bg-white/10 text-white/90 px-2.5 py-0.5 rounded-full border border-white/20">
              Verified B2B & Bulk Curations
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif mb-2 text-[#F8F5EF]">
            Institutional & Retail Buyer Matching
          </h2>
          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
            Directly connect with ethical boutique retailers, exporters, luxury resorts, and corporate gifting houses actively seeking traditional Indian crafts. Match scores are based on category alignment and verified volume demand.
          </p>
        </div>
      </div>

      {proposalSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-900 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>{proposalSuccess}</span>
          </div>
          <button
            onClick={() => setProposalSuccess(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and stats bar */}
      <div className="bg-white rounded-2xl border border-[#E8E1D7] p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-[#6F716A] shrink-0" />
          {['All', 'Pottery', 'Textiles', 'Metalwork', 'Woodwork'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#123F32] text-white shadow-2xs'
                  : 'bg-[#F8F5EF] text-[#242720] hover:bg-[#E8E1D7]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="text-xs text-[#6F716A] flex items-center gap-2 self-start sm:self-auto">
          <Info className="w-4 h-4 text-[#C45D3A] shrink-0" />
          <span>Demo Data: Institutional buyer profiles verified for hackathon demonstration.</span>
        </div>
      </div>

      {/* Buyer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBuyers.map((buyer) => (
          <div
            key={buyer.id}
            className="bg-white rounded-2xl border border-[#E8E1D7] p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-[#242720] text-lg">
                      {buyer.company_name}
                    </h3>
                  </div>
                  <span className="inline-block text-xs font-semibold text-[#123F32] bg-[#F8F5EF] px-2.5 py-0.5 rounded-md border border-[#E8E1D7] mt-1">
                    {buyer.buyer_type}
                  </span>
                </div>

                <span className="text-[11px] font-bold bg-[#24664D]/15 text-[#123F32] px-2.5 py-1 rounded-full border border-[#24664D]/30 shrink-0">
                  {buyer.match_label}
                </span>
              </div>

              <div className="space-y-2 text-xs text-[#6F716A] mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#C45D3A] shrink-0" />
                  <span>{buyer.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-[#123F32] shrink-0" />
                  <span>Seeking: <strong className="text-[#242720]">{buyer.requested_category}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                  <span>Demand: <strong className="text-[#242720]">{buyer.requested_quantity}</strong></span>
                </div>
              </div>

              <p className="text-xs text-[#242720]/80 bg-[#F8F5EF] p-3 rounded-xl border border-[#E8E1D7] leading-relaxed mb-4">
                "{buyer.notes}"
              </p>
            </div>

            <div className="pt-3 border-t border-[#E8E1D7] flex items-center justify-between">
              <span className="text-[11px] text-[#6F716A]">Verified Buyer Profile (Demo)</span>
              <button
                type="button"
                onClick={() => handleOpenContact(buyer)}
                className="px-4 py-2 rounded-xl bg-[#123F32] hover:bg-[#24664D] text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
              >
                <Send className="w-3.5 h-3.5 text-amber-200" />
                <span>Submit Artisan Pitch</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pitch / Proposal Modal */}
      {selectedBuyer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-xl border border-[#E8E1D7] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E1D7] mb-5">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#242720]">
                  Submit Commercial Proposal to {selectedBuyer.company_name}
                </h3>
                <p className="text-xs text-[#6F716A] mt-0.5">
                  Category requested: {selectedBuyer.requested_category} ({selectedBuyer.location})
                </p>
              </div>
              <button
                onClick={() => setSelectedBuyer(null)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitProposal} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#242720] mb-1.5">
                  Select Product to Pitch
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    setSelectedProductId(e.target.value);
                    const p = artisanProducts.find((item) => item.id === e.target.value);
                    if (p) setOfferedPrice(p.price);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E1D7] text-sm bg-white font-medium"
                >
                  {artisanProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.product_name} — ₹{p.price} ({p.craft_category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#242720] mb-1.5">
                    Offered Quantity (units)
                  </label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={offeredQuantity}
                    onChange={(e) => setOfferedQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E1D7] text-sm font-semibold bg-[#F8F5EF]/60"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#242720] mb-1.5">
                    Unit Bulk Price (₹ INR)
                  </label>
                  <input
                    type="number"
                    min="50"
                    step="10"
                    value={offeredPrice}
                    onChange={(e) => setOfferedPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E1D7] text-sm font-semibold bg-[#F8F5EF]/60"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#242720] mb-1.5">
                  Artisan Proposal & Heritage Guarantee Message
                </label>
                <textarea
                  rows={4}
                  value={artisanMessage}
                  onChange={(e) => setArtisanMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E1D7] text-xs leading-relaxed bg-[#F8F5EF]/40"
                  required
                />
              </div>

              <div className="p-3 bg-[#F8F5EF] rounded-xl border border-[#E8E1D7] text-[11px] text-[#6F716A]">
                <strong>FairTrade Transparency:</strong> Submitting this proposal notifies the buyer with your verified FairPrice breakdown and artisan village attribution.
              </div>

              <div className="pt-3 border-t border-[#E8E1D7] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedBuyer(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#E8E1D7] text-stone-700 hover:bg-[#F8F5EF] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#123F32] hover:bg-[#24664D] text-white font-semibold flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-amber-200" />
                  <span>{isSubmitting ? 'Sending Proposal...' : 'Dispatch Commercial Pitch'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
