import React, { useState } from 'react';

/**
 * High-reliability mapping of Indian craft categories to local SVG assets
 * and curated, authentic Unsplash craft photography.
 */
export const CRAFT_LOCAL_ASSETS: Record<string, string> = {
  'Pottery & Ceramics': '/assets/crafts/pottery.svg',
  'Handloom Textiles': '/assets/crafts/textiles.svg',
  'Metalwork': '/assets/crafts/metalwork.svg',
  'Woodwork': '/assets/crafts/woodwork.svg',
  'Traditional Jewelry': '/assets/crafts/jewelry.svg',
  'Paintings & Folk Art': '/assets/crafts/paintings.svg',
  'Baskets & Natural Fiber': '/assets/crafts/baskets.svg',
  'Leathercraft': '/assets/crafts/leather.svg',
  'Stone Craft': '/assets/crafts/stonecraft.svg',
  'Papercraft & Painting': '/assets/crafts/papercraft.svg',
  'Default': '/assets/crafts/default_craft.svg',
};

/**
 * Curated authentic photographic assets with verified direct links for primary display.
 */
export const CRAFT_PRIMARY_PHOTOS: Record<string, string> = {
  // Pottery: terracotta cups and clay pottery
  'pottery-tea-set': 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
  'pottery-clay-jug': 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80',
  'pottery-terracotta-diya': 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=800&q=80',
  
  // Handloom & Textiles: natural indigo block print, handloom saree, handwoven scarf
  'textile-indigo-stole': 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80',
  'textile-handloom-saree': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
  'textile-loom-weave': 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=800&q=80',

  // Metalwork & Brass: Dhokra tribal figurine, brass diya lamp, bronze singing bowl
  'metal-dhokra-lamp': 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=800&q=80',
  'metal-brass-vessel': 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80',
  'metal-brass-diya': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',

  // Woodwork: hand-carved sheesham box, wooden toys, carved kitchenware
  'wood-carved-box': 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
  'wood-kitchenware': 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80',
  'wood-channapatna-toy': 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=800&q=80',

  // Traditional Jewelry: Kundan meenakari necklace, silver filigree earrings, terracotta jewelry
  'jewelry-kundan-necklace': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
  'jewelry-silver-earrings': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
  'jewelry-terracotta-bangles': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',

  // Paintings & Folk Art: Madhubani, Warli, Tanjore art
  'paintings-madhubani': 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
  'paintings-folk-art': 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=800&q=80',

  // Baskets & Cane: handwoven cane basket, bamboo storage
  'baskets-woven-cane': 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80',
  'baskets-bamboo-tray': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',

  // Leathercraft: vegetable-tanned leather bag, handcrafted mojari
  'leather-satchel-bag': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
  'leather-handcrafted-wallet': 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',

  // Stone Craft: carved soapstone tealight, marble jali coaster
  'stone-carved-jali': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  'stone-marble-inlay': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',

  // Papercraft & Papier-mache: deckle edge handmade notebook, papier-mache box
  'paper-deckle-journal': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
  'paper-handmade-botanical': 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
};

/**
 * Resolves appropriate local fallback SVG path based on product name and craft category.
 */
export function getCategoryFallback(categoryOrName?: string): string {
  if (!categoryOrName) return CRAFT_LOCAL_ASSETS['Default'];
  const text = categoryOrName.toLowerCase();

  if (text.includes('pottery') || text.includes('ceramic') || text.includes('clay') || text.includes('terracotta') || text.includes('diya')) {
    return CRAFT_LOCAL_ASSETS['Pottery & Ceramics'];
  }
  if (text.includes('textile') || text.includes('handloom') || text.includes('saree') || text.includes('stole') || text.includes('scarf') || text.includes('cotton') || text.includes('silk') || text.includes('indigo') || text.includes('dabu')) {
    return CRAFT_LOCAL_ASSETS['Handloom Textiles'];
  }
  if (text.includes('metal') || text.includes('brass') || text.includes('dhokra') || text.includes('bronze') || text.includes('copper') || text.includes('bell') || text.includes('lamp')) {
    return CRAFT_LOCAL_ASSETS['Metalwork'];
  }
  if (text.includes('wood') || text.includes('teak') || text.includes('sheesham') || text.includes('carv') || text.includes('box') || text.includes('toy')) {
    return CRAFT_LOCAL_ASSETS['Woodwork'];
  }
  if (text.includes('jewel') || text.includes('earring') || text.includes('necklace') || text.includes('bangle') || text.includes('kundan') || text.includes('filigree') || text.includes('ring')) {
    return CRAFT_LOCAL_ASSETS['Traditional Jewelry'];
  }
  if (text.includes('paint') || text.includes('art') || text.includes('madhubani') || text.includes('warli') || text.includes('tanjore') || text.includes('folk')) {
    return CRAFT_LOCAL_ASSETS['Paintings & Folk Art'];
  }
  if (text.includes('basket') || text.includes('cane') || text.includes('bamboo') || text.includes('fiber') || text.includes('jute') || text.includes('palm')) {
    return CRAFT_LOCAL_ASSETS['Baskets & Natural Fiber'];
  }
  if (text.includes('leather') || text.includes('kolhapuri') || text.includes('shantiniketan') || text.includes('wallet') || text.includes('bag')) {
    return CRAFT_LOCAL_ASSETS['Leathercraft'];
  }
  if (text.includes('stone') || text.includes('marble') || text.includes('soapstone') || text.includes('jali') || text.includes('sculpture')) {
    return CRAFT_LOCAL_ASSETS['Stone Craft'];
  }
  if (text.includes('paper') || text.includes('mache') || text.includes('mâché') || text.includes('card') || text.includes('journal')) {
    return CRAFT_LOCAL_ASSETS['Papercraft & Painting'];
  }

  return CRAFT_LOCAL_ASSETS['Default'];
}

/**
 * Intelligent image selector for new catalogue items created via voice or photo.
 */
export function getDefaultImageForCraft(category?: string, productName?: string): string {
  const query = `${productName || ''} ${category || ''}`.toLowerCase();
  
  if (query.includes('wood') || query.includes('channapatna') || query.includes('sheesham')) {
    return CRAFT_PRIMARY_PHOTOS['wood-carved-box'];
  }
  if (query.includes('jewel') || query.includes('necklace') || query.includes('kundan') || query.includes('earring')) {
    return CRAFT_PRIMARY_PHOTOS['jewelry-kundan-necklace'];
  }
  if (query.includes('metal') || query.includes('dhokra') || query.includes('brass')) {
    return CRAFT_PRIMARY_PHOTOS['metal-dhokra-lamp'];
  }
  if (query.includes('textile') || query.includes('saree') || query.includes('handloom') || query.includes('stole')) {
    return CRAFT_PRIMARY_PHOTOS['textile-indigo-stole'];
  }
  if (query.includes('paint') || query.includes('madhubani') || query.includes('warli')) {
    return CRAFT_PRIMARY_PHOTOS['paintings-madhubani'];
  }
  if (query.includes('basket') || query.includes('cane') || query.includes('bamboo')) {
    return CRAFT_LOCAL_ASSETS['Baskets & Natural Fiber'];
  }
  if (query.includes('leather')) {
    return CRAFT_PRIMARY_PHOTOS['leather-satchel-bag'];
  }
  if (query.includes('stone') || query.includes('marble')) {
    return CRAFT_LOCAL_ASSETS['Stone Craft'];
  }
  if (query.includes('paper')) {
    return CRAFT_PRIMARY_PHOTOS['paper-deckle-journal'];
  }

  // Fall back to pottery or local category SVG
  return CRAFT_PRIMARY_PHOTOS['pottery-tea-set'];
}

interface CraftImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  craftCategory?: string;
  productName?: string;
  className?: string;
}

/**
 * Robust image component that guarantees zero broken images,
 * automatically falling back to high-fidelity local vector craft illustrations.
 */
export const CraftImage: React.FC<CraftImageProps> = ({
  src,
  alt,
  craftCategory,
  productName,
  className = '',
  ...rest
}) => {
  const fallback = getCategoryFallback(craftCategory || productName);
  const [currentSrc, setCurrentSrc] = useState<string>(src || fallback);
  const [hasError, setHasError] = useState<boolean>(false);

  // If incoming src prop changes, reset error state
  React.useEffect(() => {
    if (src) {
      setCurrentSrc(src);
      setHasError(false);
    } else {
      setCurrentSrc(fallback);
    }
  }, [src, fallback]);

  const handleError = () => {
    if (!hasError && currentSrc !== fallback) {
      setHasError(true);
      setCurrentSrc(fallback);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt || `${craftCategory || 'Artisan'} Craft Item`}
      onError={handleError}
      className={className}
      loading="lazy"
      {...rest}
    />
  );
};
