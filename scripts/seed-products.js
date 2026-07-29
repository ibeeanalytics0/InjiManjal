require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { supabase } = require('../lib/supabase');

const products = [
  {
    "name": "Honey Figs",
    "slug": "honey-figs",
    "description": "50g | Sun-Dried, Premium Honey",
    "category": "wellness",
    "price": 160,
    "sale_price": 95,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Pure Honey",
    "slug": "pure-honey",
    "description": "250g | Unprocessed, Pure",
    "category": "wellness",
    "price": 520,
    "sale_price": 344,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Fig Powder",
    "slug": "fig-powder",
    "description": "50g | Sweetener, Nutritious",
    "category": "wellness",
    "price": 160,
    "sale_price": 95,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Butterfly Pea Flower",
    "slug": "butterfly-pea-flower",
    "description": "10g | Antioxidant, Vibrant",
    "category": "tea",
    "price": 70,
    "sale_price": 39,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Black Kavuni Rice",
    "slug": "black-kavuni-rice",
    "description": "1 kg | Non-GMO, Chemical-Free",
    "category": "rice",
    "price": 420,
    "sale_price": 245,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Seeraga Samba Rice",
    "slug": "seeraga-samba-rice",
    "description": "1 kg | Native Seed, High Aroma",
    "category": "rice",
    "price": 380,
    "sale_price": 229,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Sivan Samba Ponni Rice",
    "slug": "sivan-samba-ponni-rice",
    "description": "1 kg | Strength, Heritage",
    "category": "rice",
    "price": 280,
    "sale_price": 169,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Lemon Butterfly Pea Tea",
    "slug": "butterfly-pea-tea",
    "description": "15g | Caffeine Free, Colour Changing",
    "category": "tea",
    "price": 140,
    "sale_price": 79,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Tomato Soup",
    "slug": "tomato-soup",
    "description": "50g | No MSG, Natural",
    "category": "soup",
    "price": 90,
    "sale_price": 49,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Mudakathan Soup",
    "slug": "mudakathan-soup",
    "description": "50g | Joint Care, Traditional",
    "category": "soup",
    "price": 100,
    "sale_price": 59,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Drumstick Leaves Soup",
    "slug": "drumstick-leaves-soup",
    "description": "50g | Moringa, Nutritious",
    "category": "soup",
    "price": 90,
    "sale_price": 49,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Mudavattukal Soup",
    "slug": "mudavattukal-soup",
    "description": "50g | Authentic, Herbal",
    "category": "soup",
    "price": 280,
    "sale_price": 179,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Black Kavuni Porridge Mix",
    "slug": "black-kavuni-porridge",
    "description": "200g | Antioxidant, Heritage",
    "category": "soup",
    "price": 320,
    "sale_price": 199,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Black Gram Porridge Mix",
    "slug": "black-gram-porridge",
    "description": "200g | High Protein, Traditional",
    "category": "soup",
    "price": 300,
    "sale_price": 189,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Millet Porridge Mix",
    "slug": "millet-porridge",
    "description": "200g | Gluten Free, Energy",
    "category": "soup",
    "price": 340,
    "sale_price": 209,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Drumstick Leaves Adai Mix",
    "slug": "drumstick-adai-mix",
    "description": "200g | Iron Rich, Traditional",
    "category": "soup",
    "price": 320,
    "sale_price": 199,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Vallarai Powder (Paruppu Podi)",
    "slug": "vallarai-podi",
    "description": "100g | Brain Health, Pure Grind",
    "category": "podi",
    "price": 320,
    "sale_price": 199,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Curry Leaves Powder",
    "slug": "curry-leaf-podi",
    "description": "100g | Iron Rich, Flavour Boost",
    "category": "podi",
    "price": 320,
    "sale_price": 199,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Drumstick Leaves Dal Powder",
    "slug": "drumstick-dal-powder",
    "description": "100g | Moringa, Healthy Podi",
    "category": "podi",
    "price": 320,
    "sale_price": 199,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Rice Vadam",
    "slug": "rice-vadam",
    "description": "100g | Sun-Dried, Native Rice",
    "category": "vadam",
    "price": 90,
    "sale_price": 49,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Onion Vadam",
    "slug": "onion-vadam",
    "description": "50g | Small Batch, No Preservatives",
    "category": "vadam",
    "price": 100,
    "sale_price": 55,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Cluster Beans Vathal",
    "slug": "cluster-beans-vathal",
    "description": "50g | Sun-Dried, Pure",
    "category": "vadam",
    "price": 90,
    "sale_price": 49,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Brinjal Vathal",
    "slug": "brinjal-vathal",
    "description": "50g | Sun-Dried, Authentic",
    "category": "vadam",
    "price": 90,
    "sale_price": 49,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Bittergourd Vathal",
    "slug": "bittergourd-vathal",
    "description": "50g | Diabetic Friendly, Sun-Dried",
    "category": "vadam",
    "price": 90,
    "sale_price": 49,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Potato Vathal",
    "slug": "potato-vathal",
    "description": "50g | Sun-Dried, Crispy",
    "category": "vadam",
    "price": 90,
    "sale_price": 49,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Turkey Berry Vathal",
    "slug": "turkey-berry-vathal",
    "description": "50g | Sundakkai, Medicinal",
    "category": "vadam",
    "price": 100,
    "sale_price": 55,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Sorrel Leaves Thokku",
    "slug": "sorrel-thokku",
    "description": "230g | Pulicaikeeral, Traditional",
    "category": "pickle",
    "price": 360,
    "sale_price": 229,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Lemon Pickle",
    "slug": "lemon-pickle",
    "description": "230g | Tangy, No Preservatives",
    "category": "pickle",
    "price": 340,
    "sale_price": 210,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Mangai Vathal",
    "slug": "mangai-vathal",
    "description": "50g | Raw Mango, Traditional",
    "category": "pickle",
    "price": 90,
    "sale_price": 49,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Garlic Pickle",
    "slug": "garlic-pickle",
    "description": "230g | Bold Flavour, No MSG",
    "category": "pickle",
    "price": 360,
    "sale_price": 229,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Green Gram Soup",
    "slug": "green-gram-soup",
    "description": "50g | Weight Loss, Fibre Rich",
    "category": "soup",
    "price": 160,
    "sale_price": 99,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Seenthal Powder Soup",
    "slug": "seenthal-soup",
    "description": "50g | Diabetes, Immunity",
    "category": "soup",
    "price": 200,
    "sale_price": 120,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Thuthi Leaf Soup",
    "slug": "thuthi-leaf-soup",
    "description": "50g | Wounds, Skin Health",
    "category": "soup",
    "price": 210,
    "sale_price": 126,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Yanai Nerunjil Mul",
    "slug": "yanai-nerunjil",
    "description": "50g | Renal Health, Detox",
    "category": "soup",
    "price": 200,
    "sale_price": 120,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Ragi Cookies",
    "slug": "ragi-cookies",
    "description": "10 pcs | Calcium Rich, Natural",
    "category": "cookies",
    "price": 100,
    "sale_price": 59,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Kambu Cookies",
    "slug": "kambu-cookies",
    "description": "10 pcs | Energy, Natural",
    "category": "cookies",
    "price": 100,
    "sale_price": 59,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Munthiri (Cashew) Cookies",
    "slug": "cashew-cookies",
    "description": "10 pcs | Cashew, Crunchy",
    "category": "cookies",
    "price": 100,
    "sale_price": 59,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Verkadalai (Peanut) Cookies",
    "slug": "peanut-cookies",
    "description": "10 pcs | Peanut, Wholesome",
    "category": "cookies",
    "price": 100,
    "sale_price": 59,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Coconut Cookies",
    "slug": "coconut-cookies",
    "description": "10 pcs | Coconut, Traditional",
    "category": "cookies",
    "price": 100,
    "sale_price": 59,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Pirandai Oil",
    "slug": "pirandai-oil",
    "description": "100ml | Joint Relief, Circulation",
    "category": "oil",
    "price": 260,
    "sale_price": 160,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Green Gram Soap",
    "slug": "green-gram-soap",
    "description": "75g | Cleansing, Pimple Care",
    "category": "soap",
    "price": 250,
    "sale_price": 159,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Guava Podi",
    "slug": "guava-podi",
    "description": "50g | Blood Sugar, Digestive",
    "category": "podi",
    "price": 120,
    "sale_price": 70,
    "stock": 1,
    "is_active": true
  },
  {
    "name": "Coconut Idly Podi",
    "slug": "coconut-idly-podi",
    "description": "50g | Coconut, No Additives",
    "category": "podi",
    "price": 120,
    "sale_price": 72,
    "stock": 1,
    "is_active": true
  }
];

async function main() {
  const { data, error } = await supabase.from('products').upsert(products, { onConflict: 'slug' }).select('id, name, slug, stock, is_active');
  if (error) {
    console.error('Failed to seed products:', error.message);
    process.exit(1);
  }
  console.log('Seeded products:', data.length);
  for (const product of data) console.log(`${product.id}: ${product.name} (${product.slug}) stock=${product.stock} active=${product.is_active}`);
}

main();
