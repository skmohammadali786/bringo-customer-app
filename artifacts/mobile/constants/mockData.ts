export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  eta: string;
  description: string;
  unit: string;
  emoji: string;
  isTrending?: boolean;
  isRecommended?: boolean;
};

export type OrderStatus =
  | "received"
  | "assigned"
  | "sourcing"
  | "picked"
  | "delivery"
  | "delivered"
  | "cancelled";

export type Order = {
  id: string;
  status: OrderStatus;
  items: string[];
  itemCount: number;
  total: number;
  eta: string;
  agentName: string;
  agentRating: number;
  address: string;
  createdAt: string;
  deliveredAt?: string;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "order" | "offer" | "wallet" | "system";
  isRead: boolean;
};

export type WalletTransaction = {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: string;
};

export type Offer = {
  id: string;
  title: string;
  subtitle: string;
  code: string;
  discount: string;
  color: string;
  expiresAt: string;
};

export const CATEGORIES: Category[] = [
  { id: "1", name: "Groceries", icon: "shopping-bag", color: "#34C759", count: "2000+" },
  { id: "2", name: "Pharmacy", icon: "activity", color: "#FF4D4F", count: "500+" },
  { id: "3", name: "Electronics", icon: "zap", color: "#4A90E2", count: "300+" },
  { id: "4", name: "Personal Care", icon: "smile", color: "#FF9A3D", count: "400+" },
  { id: "5", name: "Home & Kitchen", icon: "home", color: "#8B4513", count: "600+" },
  { id: "6", name: "Bakery", icon: "coffee", color: "#FF6B6B", count: "150+" },
  { id: "7", name: "Sports", icon: "trending-up", color: "#111111", count: "200+" },
  { id: "8", name: "Pet Supplies", icon: "feather", color: "#9B59B6", count: "180+" },
  { id: "9", name: "Stationery", icon: "edit-2", color: "#3498DB", count: "250+" },
  { id: "10", name: "Beverages", icon: "droplet", color: "#1ABC9C", count: "300+" },
];

export const PRODUCTS: Product[] = [
  // ── Groceries ──────────────────────────────────────────────────────────────
  {
    id: "p1",
    name: "Organic Whole Milk",
    category: "Groceries",
    price: 68,
    originalPrice: 80,
    eta: "15 min",
    emoji: "🥛",
    description:
      "Our farm-fresh organic whole milk comes directly from free-range cows that graze on pesticide-free pastures. Rich in calcium, Vitamin D, and natural proteins, this creamy full-fat milk is perfect for your morning coffee, cereal, or cooking. With no added hormones or antibiotics, every sip is as pure as nature intended. Sourced from certified organic farms within 50 km of your city.",
    unit: "500ml",
    isTrending: true,
    isRecommended: true,
  },
  {
    id: "p2",
    name: "Almond Butter",
    category: "Groceries",
    price: 349,
    eta: "22 min",
    emoji: "🥜",
    description:
      "Made from 100% dry-roasted almonds with absolutely no added sugar, palm oil, or preservatives. Our almond butter is stone-ground for a smooth, rich texture that spreads beautifully on toast, blends into smoothies, or works as a healthy dip for fruits and veggies. Packed with heart-healthy monounsaturated fats, vitamin E, and plant-based protein — the perfect nutritious snack for the whole family.",
    unit: "200g",
    isRecommended: true,
  },
  {
    id: "p3",
    name: "Brown Eggs",
    category: "Groceries",
    price: 95,
    originalPrice: 110,
    eta: "18 min",
    emoji: "🥚",
    description:
      "Farm-fresh free-range brown eggs from hens raised on natural grain feed without any growth hormones or antibiotics. Each egg is individually inspected and graded for freshness. Higher in Omega-3 fatty acids compared to conventional eggs, our brown eggs have richer yolks, firmer whites, and a noticeably better taste. Ideal for boiling, frying, baking, and omelettes. Delivered same day from local farms.",
    unit: "6 pieces",
    isTrending: true,
  },
  {
    id: "p4",
    name: "Basmati Rice",
    category: "Groceries",
    price: 189,
    originalPrice: 220,
    eta: "25 min",
    emoji: "🍚",
    description:
      "Premium aged basmati rice sourced from the foothills of the Himalayas, known for its distinctively long grains, nutty aroma, and fluffy texture when cooked. Aged for 12 months to reduce stickiness and enhance flavour, this basmati is perfect for biryanis, pulao, and everyday meals. Naturally gluten-free and low in fat, it cooks evenly and absorbs spices beautifully. A staple that your family will love.",
    unit: "1kg",
    isRecommended: true,
  },
  {
    id: "p5",
    name: "Extra Virgin Olive Oil",
    category: "Groceries",
    price: 499,
    originalPrice: 649,
    eta: "30 min",
    emoji: "🫒",
    description:
      "Cold-pressed from hand-picked Mediterranean olives at peak ripeness, our extra virgin olive oil retains all its natural polyphenols, antioxidants, and heart-healthy oleic acid. With an acidity level below 0.5%, it qualifies as superior grade EVOO. Its rich golden-green colour, fruity aroma, and peppery finish make it ideal for dressings, dips, light sautéing, and drizzling over bruschetta or pasta. A kitchen essential for health-conscious cooks.",
    unit: "500ml",
  },
  {
    id: "p6",
    name: "Greek Yoghurt",
    category: "Groceries",
    price: 129,
    eta: "20 min",
    emoji: "🥣",
    description:
      "Thick, creamy, and protein-rich Greek yoghurt made by straining regular yoghurt to remove excess whey — resulting in a denser texture with twice the protein of regular yoghurt. Contains live active cultures that support gut health and digestion. Naturally low in sugar and lactose, it's a versatile ingredient for breakfast bowls, smoothies, marinades, and dips. Made fresh daily from whole milk with no artificial thickeners or stabilisers.",
    unit: "200g",
    isTrending: true,
    isRecommended: true,
  },

  // ── Pharmacy ───────────────────────────────────────────────────────────────
  {
    id: "p7",
    name: "Paracetamol 500mg",
    category: "Pharmacy",
    price: 28,
    eta: "20 min",
    emoji: "💊",
    description:
      "A trusted over-the-counter analgesic and antipyretic used for fast, effective relief of mild to moderate pain including headaches, toothaches, muscle aches, menstrual cramps, backaches, and cold or flu symptoms. Each tablet contains 500mg of paracetamol, which works by blocking pain signals in the brain and lowering elevated body temperature. Safe for adults and children above 12 years when taken as directed. Consult a doctor if symptoms persist beyond 3 days.",
    unit: "10 tablets",
    isTrending: true,
  },
  {
    id: "p8",
    name: "Vitamin C 1000mg",
    category: "Pharmacy",
    price: 299,
    originalPrice: 349,
    eta: "25 min",
    emoji: "🍋",
    description:
      "High-potency effervescent Vitamin C tablets that dissolve quickly in water, delivering 1000mg of ascorbic acid per serving for powerful immune system support. Vitamin C is a critical antioxidant that protects cells from free radical damage, supports collagen synthesis for healthy skin, and enhances iron absorption from plant-based foods. Each tablet also contains zinc and rose hip extract for additional antioxidant benefits. Simply drop one tablet in a glass of water and enjoy a refreshing orange-flavoured drink daily.",
    unit: "60 tablets",
    isTrending: true,
    isRecommended: true,
  },
  {
    id: "p9",
    name: "Band-Aid Assorted",
    category: "Pharmacy",
    price: 89,
    eta: "18 min",
    emoji: "🩹",
    description:
      "An assorted pack of flexible fabric adhesive bandages in multiple sizes — perfect for covering minor cuts, scrapes, blisters, and abrasions. Each bandage features a non-stick sterile pad that protects wounds from dirt and bacteria while allowing the skin to breathe. The skin-tone beige colour blends naturally, and the flexible fabric conforms to fingers, knuckles, and knees without peeling off during daily activities. Includes 20 bandages across small, medium, and large sizes.",
    unit: "20 pieces",
  },
  {
    id: "p10",
    name: "Antacid Tablets",
    category: "Pharmacy",
    price: 55,
    eta: "15 min",
    emoji: "🫧",
    description:
      "Fast-acting chewable antacid tablets that provide quick relief from acidity, heartburn, indigestion, and stomach bloating. Each mint-flavoured tablet neutralises excess stomach acid within minutes, bringing immediate comfort without needing water. Contains a combination of calcium carbonate and magnesium hydroxide for balanced, longer-lasting acid relief without constipation or diarrhoea. Safe for adults and suitable for use during pregnancy when taken as directed. Carry them in your pocket or bag for on-the-go relief.",
    unit: "24 tablets",
    isRecommended: true,
  },
  {
    id: "p11",
    name: "Cough Syrup",
    category: "Pharmacy",
    price: 125,
    originalPrice: 140,
    eta: "22 min",
    emoji: "🍯",
    description:
      "A dual-action cough syrup that provides relief from both dry, irritating coughs and productive wet coughs with mucus. The formulation combines a cough suppressant to calm the cough reflex with an expectorant to thin and loosen phlegm for easier clearance. Honey-lemon flavoured for pleasant taste, and sugar-free for diabetic patients. Works within 20–30 minutes of first dose. Suitable for adults and children above 6 years. Do not exceed the recommended dosage; consult your pharmacist for personalised advice.",
    unit: "100ml",
  },

  // ── Electronics ────────────────────────────────────────────────────────────
  {
    id: "p12",
    name: "USB-C Fast Charger",
    category: "Electronics",
    price: 599,
    originalPrice: 799,
    eta: "35 min",
    emoji: "⚡",
    description:
      "A compact yet powerful 65W GaN (Gallium Nitride) USB-C fast charger that charges your smartphone from 0 to 50% in under 30 minutes. Compatible with USB Power Delivery (PD) and Qualcomm Quick Charge standards, making it universally compatible with iPhones, Android smartphones, tablets, and laptops. The GaN technology runs cooler and more efficiently than traditional silicon chargers, meaning no overheating and a longer lifespan. Includes a 1.5m braided USB-C cable. Travel-friendly compact design with foldable plug.",
    unit: "1 piece",
    isTrending: true,
    isRecommended: true,
  },
  {
    id: "p13",
    name: "Wireless Earbuds",
    category: "Electronics",
    price: 1299,
    originalPrice: 1999,
    eta: "40 min",
    emoji: "🎧",
    description:
      "True wireless earbuds with active noise cancellation (ANC) that let you enjoy music, podcasts, and calls without distractions. Each earbud delivers immersive 9mm dynamic driver audio with deep bass, crisp mids, and clear highs. The charging case provides up to 24 hours of combined playback — 6 hours per charge in the earbuds plus 3 extra charges from the case. IPX5 water-resistant for workouts and light rain. One-tap touch controls for play, pause, skip, and calls. Works seamlessly with iOS and Android via Bluetooth 5.3.",
    unit: "1 pair",
    isRecommended: true,
  },
  {
    id: "p14",
    name: "Power Bank 20000mAh",
    category: "Electronics",
    price: 1499,
    originalPrice: 1999,
    eta: "45 min",
    emoji: "🔋",
    description:
      "A high-capacity 20000mAh power bank with dual USB-A ports and one USB-C port, capable of charging three devices simultaneously. Supports 22.5W fast charging output via USB-C, so your phone can go from empty to 50% in about 30 minutes. The built-in LED display shows the exact remaining battery percentage so you always know how many charges are left. Its slim aluminium body is scratch-resistant and dissipates heat efficiently. Includes airline-safe certification — carry it in your hand luggage with confidence.",
    unit: "1 piece",
    isTrending: true,
  },
  {
    id: "p15",
    name: "LED Smart Bulb",
    category: "Electronics",
    price: 349,
    originalPrice: 499,
    eta: "30 min",
    emoji: "💡",
    description:
      "A Wi-Fi enabled smart LED bulb with 16 million colour options and adjustable white tone from warm 2700K to cool daylight 6500K. Control it via smartphone app, Google Home, or Amazon Alexa — set schedules, create ambience scenes, or sync it with your music. At 9W it delivers 800 lumens of bright, efficient light while consuming 85% less energy than traditional incandescent bulbs. Has an estimated lifespan of 25,000 hours — that is over 22 years of daily use. Standard E27 base fits most lamps and ceiling fittings.",
    unit: "1 piece",
  },

  // ── Personal Care ─────────────────────────────────────────────────────────
  {
    id: "p16",
    name: "Hand Sanitizer",
    category: "Personal Care",
    price: 89,
    eta: "15 min",
    emoji: "🧴",
    description:
      "A hospital-grade, WHO-recommended formula hand sanitizer with 70% isopropyl alcohol that kills 99.9% of germs, bacteria, and most viruses in just 15 seconds — without the need for water. Enriched with aloe vera gel and glycerine, it leaves your hands feeling soft and moisturised rather than dry and cracked with repeated use. The non-sticky formula absorbs quickly and leaves no white residue. Compact 500ml pump bottle is perfect for home, office, and travel. Dermatologically tested and suitable for frequent use.",
    unit: "500ml",
    isTrending: true,
  },
  {
    id: "p17",
    name: "Daily Face Moisturiser",
    category: "Personal Care",
    price: 299,
    originalPrice: 399,
    eta: "28 min",
    emoji: "✨",
    description:
      "A lightweight, non-greasy daily moisturiser formulated with hyaluronic acid, niacinamide, and vitamin B5 to deeply hydrate the skin and strengthen the moisture barrier. Suitable for all skin types including oily and acne-prone skin. The fast-absorbing gel-cream texture leaves your skin smooth, plump, and radiant without any white cast. SPF 30 protection guards against UVA and UVB rays for daily sun defence. Dermatologically tested, fragrance-free, paraben-free, and non-comedogenic — proven not to clog pores.",
    unit: "50ml",
    isRecommended: true,
  },
  {
    id: "p18",
    name: "Anti-Dandruff Shampoo",
    category: "Personal Care",
    price: 199,
    eta: "25 min",
    emoji: "🚿",
    description:
      "A clinically proven anti-dandruff shampoo with 1% ketoconazole that targets the root cause of dandruff — the Malassezia fungus on the scalp. Provides visible relief from flaking, itching, and irritation from the very first wash. The pH-balanced formula is gentle enough for daily use and enriched with panthenol and biotin to nourish hair follicles and add natural shine. Suitable for all hair types. Regular use twice a week helps prevent dandruff recurrence and keeps your scalp healthy and balanced throughout the year.",
    unit: "200ml",
  },
  {
    id: "p19",
    name: "Sunscreen SPF 50+",
    category: "Personal Care",
    price: 349,
    originalPrice: 449,
    eta: "30 min",
    emoji: "☀️",
    description:
      "A broad-spectrum SPF 50+ PA++++ sunscreen that protects against both UVA rays (responsible for skin ageing and tanning) and UVB rays (responsible for sunburn and skin damage). The feather-light, invisible matte finish makes it the perfect base under makeup or for daily use on its own. Contains zinc oxide, titanium dioxide, and niacinamide to soothe inflammation and even skin tone. Water-resistant for up to 80 minutes — suitable for outdoor activities and sports. Dermatologically tested and suitable for sensitive and acne-prone skin.",
    unit: "50ml",
    isTrending: true,
    isRecommended: true,
  },

  // ── Home & Kitchen ─────────────────────────────────────────────────────────
  {
    id: "p20",
    name: "Dish Soap Concentrate",
    category: "Home & Kitchen",
    price: 119,
    originalPrice: 149,
    eta: "20 min",
    emoji: "🧺",
    description:
      "A powerful plant-derived concentrated dish soap that cuts through grease, oil, and stubborn food residue effortlessly with just a few drops. The triple-action formula removes 99.9% of bacteria and leaves dishes sparkling clean with a streak-free finish. Gentle on skin with added aloe vera and vitamin E to prevent dryness even with extended dishwashing sessions. Free from phosphates, sulphates, and artificial dyes — biodegradable and safe for your family and the environment. One 500ml bottle provides up to 60 days of daily use for an average family of four.",
    unit: "500ml",
  },
  {
    id: "p21",
    name: "Paper Towel Roll",
    category: "Home & Kitchen",
    price: 149,
    eta: "22 min",
    emoji: "🧻",
    description:
      "Super-absorbent, thick, 3-ply paper towels made from responsibly sourced virgin pulp for superior strength and absorption. Each sheet is 28cm × 22cm and can hold up to 5× its weight in liquid — ideal for wiping up spills, cleaning countertops, and dusting surfaces. The embossed texture provides extra scrubbing power without tearing or leaving behind lint or fibre residue. Pack of 2 rolls with 120 perforated sheets per roll. FSC-certified for sustainable forestry. A kitchen and bathroom essential for quick, hygienic clean-ups.",
    unit: "2 rolls",
    isRecommended: true,
  },
  {
    id: "p22",
    name: "Air Freshener Spray",
    category: "Home & Kitchen",
    price: 179,
    eta: "18 min",
    emoji: "🌸",
    description:
      "A long-lasting room freshener spray that neutralises tough odours rather than just masking them. The proprietary OdourBlock technology binds to odour molecules and eliminates them on contact — leaving behind a clean, fresh fragrance that lingers for up to 4 hours per spray. Available in French Lavender, Ocean Breeze, and Fresh Cotton scents. Each 300ml can delivers up to 400 sprays. Safe for use in kitchens, bathrooms, living rooms, cars, and wardrobes. Non-flammable and CFC-free.",
    unit: "300ml",
  },
  {
    id: "p23",
    name: "Steel Storage Containers",
    category: "Home & Kitchen",
    price: 399,
    originalPrice: 549,
    eta: "35 min",
    emoji: "🥘",
    description:
      "A set of 3 premium stainless steel storage containers with air-tight snap-lock lids in 500ml, 1L, and 1.5L sizes — perfect for storing dal, rice, spices, snacks, and leftovers. Made from food-grade 304 stainless steel that is rust-proof, odour-proof, and free from BPA, lead, and harmful plastics. The leak-proof silicone-sealed lids keep food fresh for longer and prevent spills in the fridge or when carrying lunch. Dishwasher safe for easy cleaning. Stackable design saves cabinet space. A healthy, eco-friendly alternative to plastic containers.",
    unit: "Set of 3",
    isTrending: true,
    isRecommended: true,
  },

  // ── Bakery ─────────────────────────────────────────────────────────────────
  {
    id: "p24",
    name: "Whole Wheat Bread",
    category: "Bakery",
    price: 45,
    eta: "18 min",
    emoji: "🍞",
    description:
      "Freshly baked every morning using 100% whole wheat flour with no maida (refined white flour), artificial preservatives, or high-fructose corn syrup. Each loaf is soft yet dense with a satisfying, slightly nutty flavour that pairs perfectly with butter, peanut butter, jam, or avocado. Rich in dietary fibre, B vitamins, and minerals like magnesium and iron, our whole wheat bread supports healthy digestion and sustained energy levels. Delivered within 4 hours of baking for maximum freshness. 400g loaf with 20 slices.",
    unit: "400g",
    isRecommended: true,
  },
  {
    id: "p25",
    name: "Butter Croissants",
    category: "Bakery",
    price: 89,
    eta: "25 min",
    emoji: "🥐",
    description:
      "Authentic French-style butter croissants made using a traditional lamination technique with 27 layers of flaky, golden pastry. Handcrafted daily using 100% pure creamery butter for a rich, buttery flavour and melt-in-the-mouth texture. Each croissant is lightly golden on the outside, and airy and soft on the inside — perfect for breakfast with a cup of coffee, or as a light evening snack. No preservatives, no artificial flavours. Pack of 4 freshly baked croissants, delivered at their crispiest best.",
    unit: "4 pieces",
    isTrending: true,
    isRecommended: true,
  },
  {
    id: "p26",
    name: "Chocolate Muffins",
    category: "Bakery",
    price: 119,
    originalPrice: 149,
    eta: "20 min",
    emoji: "🧁",
    description:
      "Indulgently moist double-chocolate muffins made with premium Belgian dark chocolate and studded with semi-sweet chocolate chips throughout. Each muffin has a soft, dome-shaped top and a rich, fudgy interior that chocolate lovers will adore. Baked fresh in small batches daily using free-range eggs, pure vanilla extract, and real cocoa powder — no artificial flavours or colours. Great as a breakfast treat, mid-day snack, or a quick dessert. Pack of 4 generously sized muffins, each weighing approximately 120g.",
    unit: "4 pieces",
  },
  {
    id: "p27",
    name: "Sourdough Loaf",
    category: "Bakery",
    price: 149,
    eta: "30 min",
    emoji: "🥖",
    description:
      "A traditional slow-fermented sourdough loaf made with our 5-year-old live starter culture and organic stone-ground wheat flour. The 18-hour cold fermentation process creates the signature tangy flavour, open crumb structure, and thick chewy crust that sourdough is beloved for. Naturally leavened without commercial yeast, sourdough is more digestible and has a lower glycaemic index than regular bread. Excellent toasted with butter and sea salt, or used for sandwiches and avocado toast. Each loaf weighs approximately 700g.",
    unit: "700g",
    isRecommended: true,
  },

  // ── Sports ─────────────────────────────────────────────────────────────────
  {
    id: "p28",
    name: "Yoga Mat",
    category: "Sports",
    price: 799,
    originalPrice: 1099,
    eta: "40 min",
    emoji: "🧘",
    description:
      "A premium extra-thick 6mm non-slip yoga mat made from eco-friendly natural tree rubber with a microfibre top layer that grips firmly even when sweaty. The dual-layer construction provides superior cushioning for joints during asanas, planks, and floor exercises while maintaining stability for balancing poses. Alignment lines are printed on the surface to help you maintain proper posture. Includes a carrying strap for easy transport to the gym or studio. Dimensions: 183cm × 61cm. Anti-bacterial, odour-resistant, and easy to wipe clean.",
    unit: "1 piece",
    isTrending: true,
    isRecommended: true,
  },
  {
    id: "p29",
    name: "Whey Protein Bar",
    category: "Sports",
    price: 99,
    originalPrice: 129,
    eta: "20 min",
    emoji: "🍫",
    description:
      "A high-performance protein bar with 20g of whey protein and only 5g of sugar per bar — perfect for post-workout recovery, a pre-workout energy boost, or a satisfying mid-day snack. Made with real almond pieces, dark chocolate coating, and natural flavours, it tastes like a chocolate brownie without the guilt. No artificial sweeteners, preservatives, or maltodextrin. Gluten-free and suitable for vegetarians. Available in Chocolate Fudge, Peanut Butter, and Cookies & Cream flavours. Great for meeting your daily protein goals on the go.",
    unit: "1 bar (60g)",
    isRecommended: true,
  },
  {
    id: "p30",
    name: "Resistance Bands Set",
    category: "Sports",
    price: 449,
    originalPrice: 599,
    eta: "35 min",
    emoji: "💪",
    description:
      "A complete set of 5 colour-coded fabric resistance bands ranging from light (5–10 lbs) to extra heavy (45–55 lbs) resistance, suitable for all fitness levels — beginner to advanced. The non-slip fabric design stays in place during leg presses, glute bridges, squats, and upper body exercises unlike latex bands that roll up and snap. Use them for warm-ups, strength training, physiotherapy, and stretching routines. Each band is made from premium elastic cotton blend that is durable, skin-friendly, and odour-resistant. Comes with a mesh carry bag.",
    unit: "Set of 5",
  },

  // ── Pet Supplies ────────────────────────────────────────────────────────────
  {
    id: "p31",
    name: "Premium Dog Food",
    category: "Pet Supplies",
    price: 549,
    originalPrice: 699,
    eta: "35 min",
    emoji: "🐕",
    description:
      "Nutritionally complete dry dog food formulated by veterinary nutritionists with real chicken as the first ingredient, providing a high-protein, balanced diet for adult dogs. Free from artificial colours, flavours, and preservatives — only natural ingredients your dog will love. Contains added omega-3 fatty acids from fish oil for a shiny coat and healthy skin, plus probiotics for optimal digestive health. Fortified with glucosamine and chondroitin to support joint health in active dogs. Suitable for all breeds. 2kg pack provides approximately 14–20 days of feeding depending on dog size.",
    unit: "2kg",
    isRecommended: true,
  },
  {
    id: "p32",
    name: "Cat Litter (Clumping)",
    category: "Pet Supplies",
    price: 399,
    eta: "30 min",
    emoji: "🐱",
    description:
      "Premium bentonite clumping cat litter with activated charcoal for superior odour absorption and long-lasting freshness. Forms tight, solid clumps on contact with moisture, making scooping easy and hygienic while leaving the remaining litter clean and dry. 99.9% dust-free formula is gentle on your cat's sensitive paws and your family's respiratory system. Lasts up to 30 days for a single cat with daily scooping and a 5cm litter depth. Unscented to be safe for cats with fragrance sensitivities. 5kg pack for extended use.",
    unit: "5kg",
  },
  {
    id: "p33",
    name: "Pet Grooming Kit",
    category: "Pet Supplies",
    price: 299,
    originalPrice: 399,
    eta: "40 min",
    emoji: "🐾",
    description:
      "A comprehensive 7-piece pet grooming kit that includes a double-sided stainless steel comb, a slicker brush for detangling and removing loose hair, nail clippers with safety guard, a grooming scissor, and a finger toothbrush. Suitable for both dogs and cats of all coat types — short, medium, and long-haired breeds. Regular grooming with this kit reduces shedding by up to 90%, prevents matting, and keeps your pet's skin healthy and coat lustrous. The ergonomic handles provide a comfortable, non-slip grip. Makes a great gift for new pet owners.",
    unit: "7-piece set",
    isTrending: true,
  },

  // ── Stationery ─────────────────────────────────────────────────────────────
  {
    id: "p34",
    name: "Gel Pen Set",
    category: "Stationery",
    price: 149,
    originalPrice: 199,
    eta: "25 min",
    emoji: "✏️",
    description:
      "A set of 10 premium smooth-writing 0.5mm gel pens in a vibrant assortment of colours — perfect for note-taking, journalling, studying, bullet journalling, and creative projects. The low-viscosity gel ink flows effortlessly without skipping, blotching, or smudging, and dries quickly to prevent smearing even for left-handed writers. Each pen is ergonomically designed with a soft rubber grip for comfortable extended writing sessions. The bold pigments show up beautifully on all paper types and are fade-resistant for long-lasting notes and artwork.",
    unit: "Set of 10",
    isRecommended: true,
  },
  {
    id: "p35",
    name: "Sticky Notes Multipack",
    category: "Stationery",
    price: 99,
    eta: "20 min",
    emoji: "📝",
    description:
      "A vibrant multipack of 400 sticky notes across 5 neon colours — pink, yellow, orange, green, and blue — in the classic 76mm × 76mm format. The strong, repositionable adhesive sticks firmly to most surfaces including monitors, notebooks, whiteboards, and glass, but peels off cleanly without leaving residue. Perfect for reminders, to-do lists, brainstorming, and colour-coded organisation at home, school, or the office. Each colour pad contains 80 sheets of bright, eye-catching paper that is easy to write on with any pen or marker.",
    unit: "400 sheets",
  },
  {
    id: "p36",
    name: "A4 Printing Paper",
    category: "Stationery",
    price: 249,
    eta: "30 min",
    emoji: "📄",
    description:
      "High-quality 80 GSM A4 printing paper that is optimised for both inkjet and laser printers, delivering crisp, sharp text and vibrant photo prints without bleed-through or curl. The smooth, ultra-white surface (brightness index 102%) ensures excellent contrast and colour reproduction for professional-looking documents, presentations, and photos. Acid-free and archival quality — prints stored in normal conditions will not yellow or fade for over 100 years. Available in a convenient ream of 500 sheets. Sustainably sourced from FSC-certified forests.",
    unit: "500 sheets",
    isTrending: true,
  },

  // ── Beverages ──────────────────────────────────────────────────────────────
  {
    id: "p37",
    name: "Cold Pressed Orange Juice",
    category: "Beverages",
    price: 149,
    originalPrice: 179,
    eta: "20 min",
    emoji: "🍊",
    description:
      "Freshly cold-pressed orange juice extracted from hand-picked Nagpur oranges at peak sweetness — no heat pasteurisation, no added water, no sugar, no preservatives. Cold pressing retains 100% of natural vitamins, enzymes, and antioxidants that are typically destroyed by heat in conventional juicing. Each 350ml bottle is packed with over 4 whole oranges, delivering a full day's Vitamin C requirement plus potassium and folate. Best consumed chilled within 3 days of pressing. Available daily with same-morning pressing and afternoon delivery.",
    unit: "350ml",
    isRecommended: true,
  },
  {
    id: "p38",
    name: "Organic Green Tea",
    category: "Beverages",
    price: 299,
    originalPrice: 349,
    eta: "25 min",
    emoji: "🍵",
    description:
      "Premium single-origin organic green tea from Darjeeling, hand-picked at high altitude during the first flush — the most delicate and prized harvest of the year. The unoxidised leaves are packed with EGCG catechins, L-theanine, and polyphenols that boost metabolism, improve focus without caffeine jitters, and provide powerful antioxidant protection. Brew at 75–80°C for 2 minutes for a perfectly balanced, smooth cup with floral notes and a gentle sweet finish. Certified organic, no pesticides, no artificial flavours. Contains 25 individually wrapped pyramid tea bags.",
    unit: "25 bags",
    isTrending: true,
    isRecommended: true,
  },
  {
    id: "p39",
    name: "Coconut Water",
    category: "Beverages",
    price: 89,
    eta: "18 min",
    emoji: "🥥",
    description:
      "Pure, natural coconut water from young green coconuts — sourced directly from South Indian farms and packaged within hours of extraction to preserve its delicate flavour and nutritional profile. Naturally rich in electrolytes including potassium, magnesium, sodium, and phosphorus, it is the ultimate natural sports drink for rehydration after exercise, travel, or illness. Contains only 45 calories per 330ml serving with natural sugars for a quick energy boost. No added sugar, artificial flavours, or preservatives. Keeps you hydrated, refreshed, and energised all day long.",
    unit: "330ml",
  },
  {
    id: "p40",
    name: "Cold Coffee Bottle",
    category: "Beverages",
    price: 129,
    originalPrice: 149,
    eta: "20 min",
    emoji: "☕",
    description:
      "A ready-to-drink chilled cold coffee made from speciality grade Arabica beans slow-brewed for 18 hours using the cold brew process. Cold brewing extracts the natural sweetness and chocolatey notes of the coffee while keeping bitterness and acidity to a minimum — resulting in a smooth, rich, full-flavoured coffee that requires no hot water or equipment. Each 300ml bottle contains 150mg of natural caffeine — the equivalent of one espresso shot — for a sustained energy boost without the crash. Lightly sweetened with cane sugar and mixed with fresh whole milk. Keep refrigerated.",
    unit: "300ml",
    isRecommended: true,
  },
];

export const ACTIVE_ORDERS: Order[] = [
  {
    id: "ORD9A2F",
    status: "delivery",
    items: ["Organic Whole Milk x2", "Whole Wheat Bread x1"],
    itemCount: 3,
    total: 181,
    eta: "8 min",
    agentName: "Rahul K.",
    agentRating: 4.9,
    address: "Flat 4B, Sunrise Apartments, Koramangala",
    createdAt: "2:30 PM",
  },
];

export const PAST_ORDERS: Order[] = [
  {
    id: "ORD7B1C",
    status: "delivered",
    items: ["Vitamin C 1000mg x1", "Paracetamol 500mg x2"],
    itemCount: 3,
    total: 355,
    eta: "25 min",
    agentName: "Priya M.",
    agentRating: 5.0,
    address: "Flat 4B, Sunrise Apartments, Koramangala",
    createdAt: "Yesterday",
    deliveredAt: "6:15 PM",
  },
  {
    id: "ORD6C3D",
    status: "delivered",
    items: ["USB-C Fast Charger x1", "Wireless Earbuds x1"],
    itemCount: 2,
    total: 1898,
    eta: "45 min",
    agentName: "Amit S.",
    agentRating: 4.7,
    address: "Flat 4B, Sunrise Apartments, Koramangala",
    createdAt: "2 days ago",
    deliveredAt: "3:40 PM",
  },
  {
    id: "ORD5D4E",
    status: "delivered",
    items: ["Almond Butter x2", "Organic Whole Milk x1"],
    itemCount: 3,
    total: 766,
    eta: "20 min",
    agentName: "Sneha P.",
    agentRating: 4.8,
    address: "Flat 4B, Sunrise Apartments, Koramangala",
    createdAt: "4 days ago",
    deliveredAt: "11:20 AM",
  },
];

export const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "Order on the way!",
    message: "Rahul K. is heading to you with your order. ETA: 8 minutes.",
    time: "2 min ago",
    type: "order",
    isRead: false,
  },
  {
    id: "n2",
    title: "Limited time offer",
    message: "Get 20% off on your next Pharmacy order. Use code HEALTH20.",
    time: "1 hour ago",
    type: "offer",
    isRead: false,
  },
  {
    id: "n3",
    title: "Order delivered",
    message: "Your order ORD7B1C was delivered successfully. Rate your experience.",
    time: "Yesterday",
    type: "order",
    isRead: true,
  },
  {
    id: "n4",
    title: "Cashback credited",
    message: "₹50 cashback added to your wallet for order ORD7B1C.",
    time: "Yesterday",
    type: "wallet",
    isRead: true,
  },
  {
    id: "n5",
    title: "Weekend special",
    message: "Free delivery on orders above ₹199 this weekend.",
    time: "2 days ago",
    type: "offer",
    isRead: true,
  },
];

export const WALLET_TRANSACTIONS: WalletTransaction[] = [
  { id: "t1", type: "debit", amount: 181, description: "Order ORD9A2F", date: "Today" },
  { id: "t2", type: "credit", amount: 50, description: "Cashback - ORD7B1C", date: "Yesterday" },
  { id: "t3", type: "debit", amount: 355, description: "Order ORD7B1C", date: "Yesterday" },
  { id: "t4", type: "credit", amount: 500, description: "Added via UPI", date: "3 days ago" },
  { id: "t5", type: "debit", amount: 1898, description: "Order ORD6C3D", date: "2 days ago" },
  { id: "t6", type: "credit", amount: 200, description: "Referral bonus", date: "1 week ago" },
  { id: "t7", type: "credit", amount: 1000, description: "Added via UPI", date: "1 week ago" },
];

export const OFFERS: Offer[] = [
  {
    id: "o1",
    title: "First order",
    subtitle: "50% off up to ₹100",
    code: "FIRST50",
    discount: "50% OFF",
    color: "#FF9A3D",
    expiresAt: "Dec 31",
  },
  {
    id: "o2",
    title: "Groceries special",
    subtitle: "Free delivery on groceries",
    code: "FREEGROC",
    discount: "FREE DELIVERY",
    color: "#34C759",
    expiresAt: "Dec 25",
  },
  {
    id: "o3",
    title: "Health & pharma",
    subtitle: "20% off medicines",
    code: "HEALTH20",
    discount: "20% OFF",
    color: "#4A90E2",
    expiresAt: "Dec 20",
  },
];

export const ORDER_STATUS_STEPS = [
  { key: "received", label: "Order Received", icon: "check-circle" },
  { key: "assigned", label: "Agent Assigned", icon: "user" },
  { key: "sourcing", label: "Sourcing Product", icon: "search" },
  { key: "picked", label: "Pickup Complete", icon: "package" },
  { key: "delivery", label: "Out for Delivery", icon: "navigation" },
  { key: "delivered", label: "Delivered", icon: "check-circle" },
];
