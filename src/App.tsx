import React, { useState, useEffect } from 'react';
import { Navbar, TabType } from './components/Navbar.tsx';
import { HomePage } from './components/HomePage.tsx';
import { Marketplace } from './components/Marketplace.tsx';
import { CatalogueForm } from './components/CatalogueForm.tsx';
import { FairPriceCalculator } from './components/FairPriceCalculator.tsx';
import { BuyerMatch } from './components/BuyerMatch.tsx';
import { StoriesHeritage } from './components/StoriesHeritage.tsx';
import { ArtisanDashboard } from './components/ArtisanDashboard.tsx';
import { ArtisanOrders } from './components/ArtisanOrders.tsx';
import { ImpactView } from './components/ImpactView.tsx';
import { EthicalCharter } from './components/EthicalCharter.tsx';
import {
  CatalogueItem,
  FairPriceBreakdown,
  BuyerEnquiry,
  ArtisanStory,
  BuyerLead,
  DemoOrder,
} from './types/catalogue.ts';
import {
  INITIAL_MARKETPLACE_ITEMS,
  INITIAL_BUYER_ENQUIRIES,
  INITIAL_DEMO_ORDERS,
  INITIAL_ARTISAN_STORIES,
  DEMO_BUYER_LEADS,
} from './data/sampleCrafts.ts';
import { getDefaultImageForCraft } from './utils/craftImages.tsx';
import { Heart, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [marketplaceFilter, setMarketplaceFilter] = useState<string>('All');

  // Persistence: Marketplace products with auto-migration of categories
  const [marketplaceItems, setMarketplaceItems] = useState<CatalogueItem[]>(() => {
    try {
      const saved = localStorage.getItem('kalasetu_marketplace_items');
      if (saved) {
        const parsed: CatalogueItem[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((item) => item.id));
          const missing = INITIAL_MARKETPLACE_ITEMS.filter((init) => !existingIds.has(init.id));
          return [...parsed, ...missing];
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_MARKETPLACE_ITEMS;
  });

  // Persistence: Buyer enquiries
  const [enquiries, setEnquiries] = useState<BuyerEnquiry[]>(() => {
    try {
      const saved = localStorage.getItem('kalasetu_enquiries');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_BUYER_ENQUIRIES;
  });

  // Persistence: Artisan stories
  const [stories, setStories] = useState<ArtisanStory[]>(() => {
    try {
      const saved = localStorage.getItem('kalasetu_stories');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ARTISAN_STORIES;
  });

  // Demo leads & orders
  const [buyerLeads] = useState<BuyerLead[]>(DEMO_BUYER_LEADS);
  const [orders] = useState<DemoOrder[]>(INITIAL_DEMO_ORDERS);

  // Cross-component handoff state
  const [fairPriceCraftData, setFairPriceCraftData] = useState<Partial<CatalogueItem> | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('kalasetu_marketplace_items', JSON.stringify(marketplaceItems));
    } catch {
      // ignore
    }
  }, [marketplaceItems]);

  useEffect(() => {
    try {
      localStorage.setItem('kalasetu_enquiries', JSON.stringify(enquiries));
    } catch {
      // ignore
    }
  }, [enquiries]);

  useEffect(() => {
    try {
      localStorage.setItem('kalasetu_stories', JSON.stringify(stories));
    } catch {
      // ignore
    }
  }, [stories]);

  const handleSaveItem = (item: CatalogueItem) => {
    const verifiedItem: CatalogueItem = {
      ...item,
      image_url:
        item.image_url && item.image_url !== 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80'
          ? item.image_url
          : getDefaultImageForCraft(item.craft_category, item.product_name),
    };
    setMarketplaceItems((prev) => [verifiedItem, ...prev]);
  };

  const handleSendEnquiry = (enquiry: BuyerEnquiry) => {
    setEnquiries((prev) => [enquiry, ...prev]);
  };

  const handleSaveStory = (story: ArtisanStory) => {
    setStories((prev) => [story, ...prev]);
  };

  const handleNavigateToFairPrice = (craftData: Partial<CatalogueItem>) => {
    setFairPriceCraftData(craftData);
    setActiveTab('fairprice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyPriceFromCalculator = (price: number, breakdown: FairPriceBreakdown) => {
    if (fairPriceCraftData?.product_name) {
      const updatedDraft: CatalogueItem = {
        id: `kala-${Date.now()}`,
        product_name: fairPriceCraftData.product_name,
        craft_category: fairPriceCraftData.craft_category || 'Traditional Craft',
        artisan_name: fairPriceCraftData.artisan_name || 'Traditional Artisan Guild',
        region_origin: fairPriceCraftData.region_origin || 'Regional Craft Cluster',
        cultural_heritage_notes: fairPriceCraftData.cultural_heritage_notes || '',
        visible_materials: fairPriceCraftData.visible_materials || [],
        visible_colors: fairPriceCraftData.visible_colors || [],
        visual_description: fairPriceCraftData.visual_description || '',
        suggested_tags: fairPriceCraftData.suggested_tags || ['fairprice', 'handmade'],
        image_url:
          fairPriceCraftData.image_url ||
          getDefaultImageForCraft(fairPriceCraftData.craft_category, fairPriceCraftData.product_name),
        price,
        fair_price_breakdown: breakdown,
        ai_analyzed: true,
        confidence_level: 'High',
        created_at: new Date().toISOString(),
      };
      setMarketplaceItems((prev) => [updatedDraft, ...prev]);
      setActiveTab('marketplace');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveTab('marketplace');
    }
  };

  const handleHomeNavigate = (tab: TabType, filter?: string) => {
    if (filter) {
      setMarketplaceFilter(filter);
    } else {
      setMarketplaceFilter('All');
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5EF] text-[#242720] font-sans antialiased selection:bg-[#C45D3A]/20 selection:text-[#123F32]">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        marketplaceCount={marketplaceItems.length}
        enquiriesCount={enquiries.length}
      />

      {/* Main App Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {activeTab === 'home' && (
          <HomePage products={marketplaceItems} onNavigate={handleHomeNavigate} />
        )}

        {activeTab === 'marketplace' && (
          <Marketplace
            items={marketplaceItems}
            onOpenCatalogueStudio={() => {
              setActiveTab('create_product');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSendEnquiry={handleSendEnquiry}
            initialCategory={marketplaceFilter}
          />
        )}

        {activeTab === 'dashboard' && (
          <ArtisanDashboard
            products={marketplaceItems}
            enquiries={enquiries}
            orders={orders}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'my_products' && (
          <Marketplace
            items={marketplaceItems}
            onOpenCatalogueStudio={() => {
              setActiveTab('create_product');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSendEnquiry={handleSendEnquiry}
            initialCategory="All"
          />
        )}

        {activeTab === 'create_product' && (
          <CatalogueForm
            onSaveItem={handleSaveItem}
            onNavigateToFairPrice={handleNavigateToFairPrice}
          />
        )}

        {activeTab === 'fairprice' && (
          <FairPriceCalculator
            initialCraftData={fairPriceCraftData}
            onApplyPrice={handleApplyPriceFromCalculator}
          />
        )}

        {activeTab === 'buyermatch' && (
          <BuyerMatch
            buyerLeads={buyerLeads}
            artisanProducts={marketplaceItems}
            onSendEnquiry={handleSendEnquiry}
          />
        )}

        {activeTab === 'stories' && (
          <StoriesHeritage stories={stories} onSaveStory={handleSaveStory} />
        )}

        {activeTab === 'artisans' && (
          <StoriesHeritage stories={stories} onSaveStory={handleSaveStory} />
        )}

        {activeTab === 'orders' && <ArtisanOrders orders={orders} />}

        {activeTab === 'analytics' && (
          <ArtisanDashboard
            products={marketplaceItems}
            enquiries={enquiries}
            orders={orders}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'impact' && (
          <ImpactView
            onNavigateToArtisan={() => {
              setActiveTab('create_product');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'charter' && <EthicalCharter />}
      </main>

      {/* Global Footer */}
      <footer className="bg-[#123F32] text-stone-300 border-t border-[#24664D] py-10 px-4 sm:px-6 lg:px-8 mt-16 text-xs">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-white text-lg">
                  Kala<span className="text-[#C45D3A]">Setu</span> AI
                </span>
              </div>
              <p className="text-stone-300 text-xs leading-relaxed">
                Empowering marginalized Indian artisans with ethical AI vision, transparent living wage formulas, and direct global market access.
              </p>
              <span className="text-[11px] text-amber-200 block">
                Tradition to Global Markets
              </span>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
                Marketplace & Public
              </h4>
              <ul className="space-y-2 text-stone-300">
                <li>
                  <button onClick={() => handleHomeNavigate('home')} className="hover:text-white transition">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => handleHomeNavigate('marketplace')} className="hover:text-white transition">
                    Explore Marketplace
                  </button>
                </li>
                <li>
                  <button onClick={() => handleHomeNavigate('artisans')} className="hover:text-white transition">
                    Artisan Stories
                  </button>
                </li>
                <li>
                  <button onClick={() => handleHomeNavigate('impact')} className="hover:text-white transition">
                    Living Wage Impact
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
                Artisan Workspace
              </h4>
              <ul className="space-y-2 text-stone-300">
                <li>
                  <button onClick={() => handleHomeNavigate('dashboard')} className="hover:text-white transition">
                    Artisan Dashboard
                  </button>
                </li>
                <li>
                  <button onClick={() => handleHomeNavigate('create_product')} className="hover:text-white transition">
                    Photo-to-Catalogue Studio
                  </button>
                </li>
                <li>
                  <button onClick={() => handleHomeNavigate('fairprice')} className="hover:text-white transition">
                    FairPrice AI Calculator
                  </button>
                </li>
                <li>
                  <button onClick={() => handleHomeNavigate('buyermatch')} className="hover:text-white transition">
                    BuyerMatch Institutional Leads
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
                Ethical Safeguards
              </h4>
              <ul className="space-y-2 text-stone-300">
                <li>
                  <button onClick={() => handleHomeNavigate('charter')} className="hover:text-white transition">
                    Ethical AI Charter
                  </button>
                </li>
                <li>
                  <span className="text-stone-400">Anti-Hallucination Guardrails</span>
                </li>
                <li>
                  <span className="text-stone-400">Zero-Commission Policy</span>
                </li>
                <li>
                  <span className="text-stone-400">Verified Direct Maker Payouts</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#24664D] flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-400 text-[11px]">
            <div>
              © 2026 KalaSetu AI. Built for the Google AI Hackathon.
            </div>

            <div className="flex items-center gap-1.5 text-stone-300">
              <span>Crafted with</span>
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              <span>for Traditional Indian Craft Communities</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
