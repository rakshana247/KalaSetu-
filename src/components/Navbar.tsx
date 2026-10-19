import React, { useState } from 'react';
import {
  Store,
  Sparkles,
  LayoutDashboard,
  PlusCircle,
  Calculator,
  Users,
  BookOpen,
  ShoppingBag,
  ShieldCheck,
  Feather,
  Menu,
  X,
  ArrowRight,
  TrendingUp,
  Package,
} from 'lucide-react';

export type TabType =
  | 'home'
  | 'marketplace'
  | 'artisans'
  | 'impact'
  | 'charter'
  | 'dashboard'
  | 'my_products'
  | 'create_product'
  | 'fairprice'
  | 'buyermatch'
  | 'stories'
  | 'orders'
  | 'analytics';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  marketplaceCount: number;
  enquiriesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  marketplaceCount,
  enquiriesCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Group tabs into public and artisan workspace
  const isArtisanView = [
    'dashboard',
    'my_products',
    'create_product',
    'fairprice',
    'buyermatch',
    'stories',
    'orders',
    'analytics',
  ].includes(activeTab);

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F8F5EF]/95 backdrop-blur-md border-b border-[#E8E1D7]">
      {/* Top Banner for Persona Switcher & Hackathon Judges */}
      <div className="bg-[#123F32] text-white px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-medium text-amber-100 hidden sm:inline">
              KalaSetu AI Prototype • Hackathon Demo Mode
            </span>
            <span className="font-medium text-amber-100 sm:hidden">
              Hackathon Demo
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleTabClick(isArtisanView ? 'home' : 'dashboard')}
              className="text-[11px] font-bold px-3 py-0.5 rounded-full bg-[#24664D] hover:bg-[#1a4a38] text-amber-200 border border-amber-300/30 flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>Switch to {isArtisanView ? 'Public Marketplace' : 'Artisan Portal'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo with Lotus / Craft Emblem */}
          <div
            onClick={() => handleTabClick('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-[#123F32] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              {/* Lotus / Craft Emblem */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-amber-200"
              >
                <path d="M12 3c-1.5 3-4 5.5-7 7 3.5 1.5 6 3 7 8 1-5 3.5-6.5 7-8-3-1.5-5.5-4-7-7z" />
                <path d="M12 10c-1 2.5-3 4-5 5 2.5 1 4 2 5 5 1-3 2.5-4 5-5-2-1-4-2.5-5-5z" opacity="0.6" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-extrabold text-[#242720] font-serif tracking-tight">
                  Kala<span className="text-[#C45D3A]">Setu</span>
                </span>
                <span className="text-[10px] font-bold bg-[#123F32]/10 text-[#123F32] border border-[#123F32]/20 px-1.5 py-0.2 rounded uppercase">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-[#6F716A] font-medium tracking-tight">
                Tradition to Global Markets
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {!isArtisanView ? (
              // Public Navigation
              <>
                <button
                  onClick={() => handleTabClick('home')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeTab === 'home'
                      ? 'bg-[#123F32] text-white'
                      : 'text-[#242720] hover:bg-[#E8E1D7]/50'
                  }`}
                >
                  Home
                </button>

                <button
                  onClick={() => handleTabClick('marketplace')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'marketplace'
                      ? 'bg-[#123F32] text-white'
                      : 'text-[#242720] hover:bg-[#E8E1D7]/50'
                  }`}
                >
                  <Store className="w-3.5 h-3.5 text-[#C45D3A]" />
                  <span>Marketplace</span>
                  <span className="text-[10px] bg-[#E8E1D7] text-[#242720] px-1.5 py-0.2 rounded-full font-bold">
                    {marketplaceCount}
                  </span>
                </button>

                <button
                  onClick={() => handleTabClick('artisans')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeTab === 'artisans'
                      ? 'bg-[#123F32] text-white'
                      : 'text-[#242720] hover:bg-[#E8E1D7]/50'
                  }`}
                >
                  Artisans & Heritage
                </button>

                <button
                  onClick={() => handleTabClick('impact')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeTab === 'impact'
                      ? 'bg-[#123F32] text-white'
                      : 'text-[#242720] hover:bg-[#E8E1D7]/50'
                  }`}
                >
                  Our Impact
                </button>

                <button
                  onClick={() => handleTabClick('charter')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeTab === 'charter'
                      ? 'bg-[#123F32] text-white'
                      : 'text-[#242720] hover:bg-[#E8E1D7]/50'
                  }`}
                >
                  About & Charter
                </button>

                <button
                  onClick={() => handleTabClick('dashboard')}
                  className="ml-3 px-4 py-2 rounded-xl text-xs font-semibold bg-[#123F32] text-white hover:bg-[#24664D] transition cursor-pointer shadow-2xs flex items-center gap-1.5"
                >
                  <span>Artisan Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-200" />
                </button>
              </>
            ) : (
              // Artisan Workspace Navigation
              <>
                <button
                  onClick={() => handleTabClick('dashboard')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'dashboard'
                      ? 'bg-[#123F32] text-white'
                      : 'text-[#242720] hover:bg-[#E8E1D7]/50'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => handleTabClick('create_product')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'create_product'
                      ? 'bg-[#123F32] text-white'
                      : 'text-[#242720] hover:bg-[#E8E1D7]/50'
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5 text-[#C45D3A]" />
                  <span>Create Product</span>
                </button>

                <button
                  onClick={() => handleTabClick('fairprice')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'fairprice'
                      ? 'bg-[#123F32] text-white'
                      : 'text-[#242720] hover:bg-[#E8E1D7]/50'
                  }`}
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>FairPrice AI</span>
                </button>

                <button
                  onClick={() => handleTabClick('buyermatch')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'buyermatch'
                      ? 'bg-[#123F32] text-white'
                      : 'text-[#242720] hover:bg-[#E8E1D7]/50'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>BuyerMatch</span>
                </button>

                <button
                  onClick={() => handleTabClick('stories')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'stories'
                      ? 'bg-[#123F32] text-white'
                      : 'text-[#242720] hover:bg-[#E8E1D7]/50'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Stories & Heritage</span>
                </button>

                <button
                  onClick={() => handleTabClick('orders')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'orders'
                      ? 'bg-[#123F32] text-white'
                      : 'text-[#242720] hover:bg-[#E8E1D7]/50'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Orders (Demo)</span>
                </button>

                <button
                  onClick={() => handleTabClick('marketplace')}
                  className="ml-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-[#E8E1D7] text-[#242720] hover:bg-[#F8F5EF] transition cursor-pointer"
                >
                  View Marketplace
                </button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-[#E8E1D7] bg-white text-[#242720] cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E8E1D7] px-4 py-5 space-y-4 shadow-lg">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F716A] px-2 block mb-1">
              Public Views
            </span>
            <button
              onClick={() => handleTabClick('home')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-[#242720] hover:bg-[#F8F5EF]"
            >
              Home
            </button>
            <button
              onClick={() => handleTabClick('marketplace')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-[#242720] hover:bg-[#F8F5EF] flex justify-between items-center"
            >
              <span>Marketplace</span>
              <span className="text-xs bg-[#E8E1D7] px-2 py-0.5 rounded-full">{marketplaceCount}</span>
            </button>
            <button
              onClick={() => handleTabClick('artisans')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-[#242720] hover:bg-[#F8F5EF]"
            >
              Artisans & Heritage
            </button>
            <button
              onClick={() => handleTabClick('impact')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-[#242720] hover:bg-[#F8F5EF]"
            >
              Our Impact
            </button>
            <button
              onClick={() => handleTabClick('charter')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-[#242720] hover:bg-[#F8F5EF]"
            >
              About & Charter
            </button>
          </div>

          <div className="pt-3 border-t border-[#E8E1D7] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C45D3A] px-2 block mb-1">
              Artisan Workspace
            </span>
            <button
              onClick={() => handleTabClick('dashboard')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-[#123F32] hover:bg-[#F8F5EF]"
            >
              Dashboard
            </button>
            <button
              onClick={() => handleTabClick('create_product')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-[#123F32] hover:bg-[#F8F5EF]"
            >
              Create Product (AI Studio)
            </button>
            <button
              onClick={() => handleTabClick('fairprice')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-[#123F32] hover:bg-[#F8F5EF]"
            >
              FairPrice AI Calculator
            </button>
            <button
              onClick={() => handleTabClick('buyermatch')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-[#123F32] hover:bg-[#F8F5EF]"
            >
              BuyerMatch Leads
            </button>
            <button
              onClick={() => handleTabClick('stories')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-[#123F32] hover:bg-[#F8F5EF]"
            >
              Stories & Heritage
            </button>
            <button
              onClick={() => handleTabClick('orders')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-[#123F32] hover:bg-[#F8F5EF]"
            >
              Orders (Demo)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
