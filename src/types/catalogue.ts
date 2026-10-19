export interface ConfidenceOrUncertainty {
  confidence_level: 'High' | 'Medium' | 'Low' | string;
  unverified_aspects: string[];
  notes_for_artisan: string;
}

export interface CatalogueAIAnalysis {
  product_name: string;
  craft_category: string;
  visible_materials: string[];
  visible_colors: string[];
  visual_description: string;
  suggested_tags: string[];
  confidence_or_uncertainty: ConfidenceOrUncertainty;
}

export interface CatalogueItem {
  id: string;
  product_name: string;
  craft_category: string;
  artisan_name: string;
  region_origin: string;
  cultural_heritage_notes: string;
  visible_materials: string[];
  visible_colors: string[];
  visual_description: string;
  suggested_tags: string[];
  image_url: string;
  price: number;
  fair_price_breakdown?: FairPriceBreakdown;
  ai_analyzed: boolean;
  confidence_level?: string;
  unverified_aspects?: string[];
  created_at: string;
}

export interface FairPriceBreakdown {
  material_cost: number;
  labor_hours: number;
  hourly_wage: number;
  labor_cost: number;
  packaging_cost: number;
  other_expenses: number;
  total_cost: number;
  platform_fee_percent: number;
  desired_profit_margin_percent: number;
  suggested_price: number;
  // Compatibility fields
  raw_material_cost?: number;
  artisan_hours?: number;
  hourly_living_wage?: number;
  total_labor_cost?: number;
  overhead_and_tools?: number;
  fair_profit_margin_percent?: number;
  fair_profit_amount?: number;
  platform_packaging?: number;
  fair_retail_price?: number;
  middleman_typical_price?: number;
}

export interface BuyerLead {
  id: string;
  company_name: string;
  buyer_type: 'Boutique Retailer' | 'Ethical Exporter' | 'Hospitality & Resort' | 'Corporate Gifting' | 'Design Studio';
  location: string;
  requested_category: string;
  requested_quantity: string;
  match_label: string;
  verified_buyer: boolean;
  notes: string;
  is_demo: boolean;
}

export interface BuyerEnquiry {
  id: string;
  product_id?: string;
  product_name: string;
  buyer_name: string;
  organization?: string;
  email: string;
  phone?: string;
  quantity: number;
  message: string;
  status: 'New' | 'In Progress' | 'Accepted';
  created_at: string;
}

export interface ArtisanStory {
  id: string;
  artisan_name: string;
  craft_name: string;
  location: string;
  materials_techniques: string;
  story_text: string;
  language: string;
  is_ai_refined: boolean;
  created_at: string;
}

export interface DemoOrder {
  id: string;
  order_number: string;
  product_name: string;
  customer_name: string;
  destination: string;
  amount: number;
  status: 'Delivered' | 'In Transit' | 'Processing';
  date: string;
  is_demo: boolean;
}
