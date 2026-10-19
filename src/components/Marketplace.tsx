import React, { useState } from 'react';
import { CatalogueItem, BuyerEnquiry } from '../types/catalogue.ts';
import { CraftImage } from '../utils/craftImages.tsx';
import {
  Search,
  Filter,
  MapPin,
  Sparkles,
  ShieldCheck,
  Tag,
  X,
  ShoppingBag,
  MessageSquare,
  ArrowUpDown,
  Send,
  CheckCircle2,
  Check,
} from 'lucide-react';

interface MarketplaceProps {
  items: CatalogueItem[];
  onOpenCatalogueStudio: () => void;
  onSendEnquiry: (enquiry: BuyerEnquiry) => void;
  initialCategory?: string;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  items,
  onOpenCatalogueStudio,
  onSendEnquiry,
  initialCategory = 'All',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc'>('featured');
  const [selectedItem, setSelectedItem] = useState<CatalogueItem | null>(null);

  // Enquiry modal state
  const [enquiryItem, setEnquiryItem] = useState<CatalogueItem | null>(null);
  const [buyerName, setBuyerName] = useState('');
  const [buyerOrg, setBuyerOrg] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [enquiryQuantity, setEnquiryQuantity] = useState<number>(1);
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [enquirySuccess, setEnquirySuccess] = useState<string | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);

  const categories = [
    'All',
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

  // Filtering
  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.craft_category.includes(selectedCategory);
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      item.product_name.toLowerCase().includes(query) ||
      item.artisan_name.toLowerCase().includes(query) ||
      item.region_origin.toLowerCase().includes(query) ||
      item.visible_materials.some((m) => m.toLowerCase().includes(query)) ||
      item.suggested_tags.some((t) => t.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  // Sorting
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    return 0; // featured/default
  });

  const handleOpenEnquiryModal = (item: CatalogueItem) => {
    setEnquiryItem(item);
    setEnquiryQuantity(1);
    setEnquiryMessage(
      `Hello! I am interested in ordering "${item.product_name}". Please let me know lead times and availability for delivery.`
    );
  };

  const handleSendEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryItem || !buyerName || !buyerEmail) return;

    const newEnquiry: BuyerEnquiry = {
      id: `enq-${Date.now()}`,
      product_id: enquiryItem.id,
      product_name: enquiryItem.product_name,
      buyer_name: buyerName,
      organization: buyerOrg,
      email: buyerEmail,
      phone: buyerPhone,
      quantity: enquiryQuantity,
      message: enquiryMessage,
      status: 'New',
      created_at: new Date().toISOString(),
    };

    onSendEnquiry(newEnquiry);
    setEnquirySuccess(
      `Your enquiry for "${enquiryItem.product_name}" has been recorded! Transmitted to artisan ${enquiryItem.artisan_name} and logged in the Artisan Dashboard.`
    );
    setEnquiryItem(null);
    setSelectedItem(null);
    setTimeout(() => setEnquirySuccess(null), 6000);
  };

  const handleSimulatePurchase = (item: CatalogueItem) => {
    setPurchaseSuccess(
      `Order placed for "${item.product_name}"! ₹${item.price.toLocaleString('en-IN')} reserved for direct disbursement to ${item.artisan_name}.`
    );
    setSelectedItem(null);
    setTimeout(() => setPurchaseSuccess(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-[#123F32] text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-sm border border-[#24664D]/40">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#24664D] border border-amber-300/30 text-amber-200 text-xs font-semibold mb-3">
            <span>✨</span>
            <span>Direct Artisan Marketplace</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F8F5EF] mb-2">
            Authentic Handcrafted Treasures
          </h2>
          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
            Every item in this marketplace is catalogued with objective visual fidelity and verified with ethical living wages. 100% of fair artisan margins reach the creators without middleman cuts.
          </p>
        </div>
      </div>

      {/* Notifications */}
      {enquirySuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-900 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>{enquirySuccess}</span>
          </div>
          <button onClick={() => setEnquirySuccess(null)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {purchaseSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-900 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>{purchaseSuccess}</span>
          </div>
          <button onClick={() => setPurchaseSuccess(null)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search, Filter & Sort Controls */}
      <div className="bg-white rounded-2xl border border-[#E8E1D7] p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by craft, material, artisan, or region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E8E1D7] focus:outline-none focus:ring-2 focus:ring-[#123F32] text-sm bg-[#F8F5EF]/60 font-medium"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 text-xs text-[#6F716A]">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-[#E8E1D7] bg-white text-xs font-medium text-[#242720]"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            <button
              onClick={onOpenCatalogueStudio}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#C45D3A] hover:bg-[#a84c2d] text-white transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>+ Create Product</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-[#6F716A] shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#123F32] text-white shadow-2xs'
                  : 'bg-[#F8F5EF] text-[#242720] hover:bg-[#E8E1D7]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {sortedItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-[#E8E1D7] p-12 text-center">
          <p className="text-sm font-semibold text-[#242720]">No craft items found matching your filter.</p>
          <p className="text-xs text-[#6F716A] mt-1">Try resetting search keywords or categories.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-4 px-4 py-2 rounded-lg bg-[#F8F5EF] hover:bg-[#E8E1D7] text-[#242720] text-xs font-semibold cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#E8E1D7] shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Image */}
                <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                  <CraftImage
                    src={item.image_url}
                    craftCategory={item.craft_category}
                    productName={item.product_name}
                    alt={item.product_name}
                    className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                    {item.ai_analyzed && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#123F32]/90 backdrop-blur-xs text-amber-200 px-2 py-0.5 rounded-full border border-amber-300/30">
                        <Sparkles className="w-2.5 h-2.5 text-amber-300" /> AI Catalogued
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#24664D]/90 backdrop-blur-xs text-white px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-2.5 h-2.5" /> FairPrice
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-xs text-[#242720] px-2.5 py-0.5 rounded text-[11px] font-bold shadow-2xs">
                    {item.craft_category}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5">
                  <h3 className="font-serif font-bold text-[#242720] text-base leading-snug group-hover:text-[#123F32] transition mb-1">
                    {item.product_name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-[#6F716A] mb-3">
                    <MapPin className="w-3.5 h-3.5 text-[#C45D3A] shrink-0" />
                    <span className="truncate">
                      By <strong className="text-[#242720]">{item.artisan_name}</strong> • {item.region_origin}
                    </span>
                  </div>

                  <p className="text-xs text-[#6F716A] line-clamp-2 leading-relaxed mb-3">
                    {item.visual_description || item.cultural_heritage_notes}
                  </p>

                  {/* Materials */}
                  {item.visible_materials.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.visible_materials.slice(0, 3).map((mat, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-[#F8F5EF] text-[#242720] px-2 py-0.5 rounded border border-[#E8E1D7]"
                        >
                          {mat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 pb-5 pt-2 border-t border-[#E8E1D7] flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#6F716A] font-bold block">
                    Fair Retail Price
                  </span>
                  <span className="text-lg font-bold text-[#123F32] font-serif">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEnquiryModal(item)}
                    className="p-2 rounded-lg border border-[#E8E1D7] text-[#123F32] hover:bg-[#F8F5EF] transition cursor-pointer"
                    title="Send Buyer Enquiry"
                  >
                    <MessageSquare className="w-4 h-4 text-[#C45D3A]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    className="px-3 py-1.5 rounded-lg bg-[#123F32] hover:bg-[#24664D] text-white text-xs font-semibold transition cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-[#E8E1D7]">
            <div className="relative">
              <CraftImage
                src={selectedItem.image_url}
                craftCategory={selectedItem.craft_category}
                productName={selectedItem.product_name}
                alt={selectedItem.product_name}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-3 bg-[#123F32]/90 backdrop-blur-xs text-white px-3 py-1 rounded-full text-xs font-semibold">
                {selectedItem.craft_category}
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#242720]">
                  {selectedItem.product_name}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-[#6F716A] mt-1">
                  <MapPin className="w-4 h-4 text-[#C45D3A]" />
                  <span>
                    Artisan: <strong className="text-[#242720]">{selectedItem.artisan_name}</strong> ({selectedItem.region_origin})
                  </span>
                </div>
              </div>

              {selectedItem.cultural_heritage_notes && (
                <div className="p-3.5 bg-[#F8F5EF] rounded-xl border border-[#E8E1D7] text-xs text-[#242720]">
                  <strong className="block font-semibold mb-1 text-[#123F32]">
                    Heritage & Oral History:
                  </strong>
                  <p className="leading-relaxed font-serif">{selectedItem.cultural_heritage_notes}</p>
                </div>
              )}

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#242720] block mb-1">
                  Craft Details & Motifs
                </span>
                <p className="text-xs sm:text-sm text-[#6F716A] leading-relaxed">
                  {selectedItem.visual_description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-bold text-[#242720] uppercase tracking-wider block mb-1">
                    Materials:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedItem.visible_materials.map((m, i) => (
                      <span key={i} className="bg-[#F8F5EF] text-[#242720] px-2 py-0.5 rounded border border-[#E8E1D7]">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-bold text-[#242720] uppercase tracking-wider block mb-1">
                    Palette:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedItem.visible_colors.map((c, i) => (
                      <span key={i} className="bg-[#F8F5EF] text-[#242720] px-2 py-0.5 rounded border border-[#E8E1D7]">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="pt-4 border-t border-[#E8E1D7] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-[#6F716A] font-medium block">Fair Retail Price</span>
                  <span className="text-2xl font-bold font-serif text-[#123F32]">
                    ₹{selectedItem.price.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleOpenEnquiryModal(selectedItem)}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-[#123F32] text-[#123F32] hover:bg-[#F8F5EF] font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-[#C45D3A]" />
                    <span>Send Buyer Enquiry</span>
                  </button>

                  <button
                    onClick={() => handleSimulatePurchase(selectedItem)}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#123F32] hover:bg-[#24664D] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Direct Order</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Buyer Enquiry Modal */}
      {enquiryItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-xl border border-[#E8E1D7] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E1D7] mb-5">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#242720]">Send Enquiry to Artisan</h3>
                <p className="text-xs text-[#6F716A] mt-0.5">
                  Product: <strong className="text-[#242720]">{enquiryItem.product_name}</strong> (₹{enquiryItem.price})
                </p>
              </div>
              <button
                onClick={() => setEnquiryItem(null)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendEnquirySubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#242720] mb-1.5">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="e.g., Ananya Deshmukh"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E1D7] text-sm bg-[#F8F5EF]/60 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#242720] mb-1.5">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={buyerOrg}
                    onChange={(e) => setBuyerOrg(e.target.value)}
                    placeholder="e.g., Vistara Boutique"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E1D7] text-sm bg-[#F8F5EF]/60 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#242720] mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="ananya@vistara.in"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E1D7] text-sm bg-[#F8F5EF]/60 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#242720] mb-1.5">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="+91 98200 12345"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E1D7] text-sm bg-[#F8F5EF]/60 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#242720] mb-1.5">
                  Requested Quantity (Units)
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={enquiryQuantity}
                  onChange={(e) => setEnquiryQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E1D7] text-sm font-semibold bg-[#F8F5EF]/60"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#242720] mb-1.5">
                  Message / Customization Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={enquiryMessage}
                  onChange={(e) => setEnquiryMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E1D7] text-xs leading-relaxed bg-[#F8F5EF]/40"
                />
              </div>

              <div className="p-3 bg-[#F8F5EF] rounded-xl border border-[#E8E1D7] text-[11px] text-[#6F716A]">
                This enquiry will be logged into the artisan's personal workspace. KalaSetu ensures zero commission cuts on artisan wholesale orders.
              </div>

              <div className="pt-3 border-t border-[#E8E1D7] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEnquiryItem(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#E8E1D7] text-stone-700 hover:bg-[#F8F5EF] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#123F32] hover:bg-[#24664D] text-white font-semibold flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <Send className="w-4 h-4 text-amber-200" />
                  <span>Transmit Enquiry</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
