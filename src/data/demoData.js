// GPS Cafe — Unofficial product catalog (Primavera spreadsheet merged).
// All "Primavera / بريمافيرا" wording rebranded to "GPS".
// IDs are unique and sequential per section. Ratings assigned pseudo-deterministic per row.

const ratingFor = (id, base = 4.7, spread = 0.2) => {
  const v = ((id * 9301 + 49297) % 233280) / 233280
  const r = base + (v - 0.5) * spread * 2
  return Math.max(4.5, Math.min(4.9, Math.round(r * 10) / 10))
}

export const demoSections = [
  { id: 1,  slug: 'hot-drinks',    name_ar: 'مشروبات ساخنة',          name_en: 'Hot Drinks',     color: '#d97706', icon: '☕',  position: 1 },
  { id: 2,  slug: 'fresh-juices',  name_ar: 'عصائر فريش',             name_en: 'Fresh Juices',   color: '#84cc16', icon: '🍉', position: 2 },
  { id: 3,  slug: 'cocktails',     name_ar: 'الكوكتيلات',             name_en: 'Cocktails',      color: '#ec4899', icon: '🍹', position: 3 },
  { id: 4,  slug: 'smoothie',      name_ar: 'سموزي',                  name_en: 'Smoothie',       color: '#22c55e', icon: '🥤', position: 4 },
  { id: 5,  slug: 'kiwi-avocado',  name_ar: 'كيوي افوكادو',           name_en: 'Kiwi Avocado',   color: '#10b981', icon: '🥑', position: 5 },
  { id: 6,  slug: 'milk-shakes',   name_ar: 'ميلك شيك',               name_en: 'Milk Shakes',    color: '#f472b6', icon: '🥛', position: 6 },
  { id: 7,  slug: 'frappe',        name_ar: 'الفرابيه',               name_en: 'Frappe',         color: '#a78bfa', icon: '🧋', position: 7 },
  { id: 8,  slug: 'ice-coffee',    name_ar: 'أيس كوفي',               name_en: 'Ice Coffee',     color: '#0ea5e9', icon: '🧊', position: 8 },
  { id: 9,  slug: 'soda-cocktail', name_ar: 'كوكتيل صودا',            name_en: 'Soda Cocktail',  color: '#06b6d4', icon: '🥂', position: 9 },
  { id: 10, slug: 'soft-drinks',   name_ar: 'سوفت درينك',             name_en: 'Soft Drinks',    color: '#94a3b8', icon: '🥤', position: 10 },
  { id: 11, slug: 'ice-cream',     name_ar: 'الآيس كريم',             name_en: 'Ice Cream',      color: '#f87171', icon: '🍦', position: 11 },
  { id: 12, slug: 'desserts',      name_ar: 'الحلويات',               name_en: 'Desserts',       color: '#f59e0b', icon: '🍰', position: 12 },
  { id: 13, slug: 'shisha',        name_ar: 'الشيشة',                 name_en: 'Shisha',         color: '#a855f7', icon: '💨', position: 13 },
]

// Items. Naming convention: name ar without the "-" English suffix where one exists
// Items per row: id, section_id, name_ar, name_en, price, rating
const rawItems = [
  // 1 — Hot Drinks (33 items)
  ['شاي بحليب', 'Milk Tea', 34], ['شاي اخضر', 'Green Tea', 25], ['شاي فواكه', 'Fruit Tea', 30],
  ['شاي براد', 'Tea Pot', 50], ['ينسون', 'Anise', 30], ['نعناع', 'Mint', 30],
  ['قرفة بحليب', 'Cinnamon With Milk', 45], ['كوكتيل اعشاب', 'Herbal Mix', 50], ['حمص الشام', 'Hummus El Sham', 45],
  ['مشروب اعشاب بالبرتقال', 'Herbal Orange Drink', 75], ['سحلب ساده', 'Plain Sahlab', 55], ['سحلب مكسرات وفواكه', 'Sahlab With Nuts & Fruits', 85],
  ['ليمون سخن', 'Hot Lemon', 30], ['قرفة', 'Cinnamon', 40], ['اسبرسو', 'Espresso', 45],
  ['اسبرسو دبل', 'Double Espresso', 55], ['كابتشينو', 'Cappuccino', 65], ['سبانيش لاتيه', 'Spanish Latte', 75],
  ['لاتيه', 'Latte', 60], ['ميكاتو سنجل', 'Single Macchiato', 50], ['ميكاتو دبل', 'Double Macchiato', 58],
  ['موكا', 'Mocha', 60], ['أمريكانو كوفي', 'Americano Coffee', 60], ['نسكافيه بلاك', 'Black Nescafe', 45],
  ['نسكافيه بالحليب', 'Nescafe With Milk', 50], ['قهوة تركية', 'Turkish Coffee', 35], ['قهوة سورية', 'Syrian Coffee', 45],
  ['قهوة تركية دبل', 'Double Turkish Coffee', 45], ['هوت لوتس', 'Hot Lotus', 85], ['قهوة فرنساوي', 'French Coffee', 55],
  ['قهوة بندق', 'Hazelnut Coffee', 55], ['زنجبيل', 'Ginger', 40], ['هوت سيدر', 'Hot Cider', 55],
  ['هوت شوكليت', 'Hot Chocolate', 55], ['شاي', 'Tea', 25],

  // 2 — Fresh Juices (17 items)
  ['مانجو', 'Mango', 75], ['فراولة', 'Strawberry', 70], ['برتقال', 'Orange', 75],
  ['برتقال بالجزر', 'Orange With Carrots', 80], ['رمان', 'Pomegranate', 70], ['خوخ', 'Peach', 130],
  ['بطيخ', 'Watermelon', 70], ['موز باللبن', 'Banana With Milk', 70], ['جوافة', 'Guava', 65],
  ['ليمون نعناع', 'Mint Lemon', 65], ['ليمون', 'Lemon', 60], ['اناناس', 'Pineapple', 100],
  ['بلح باللبن', 'Dates With Milk', 80], ['زبادي عسل', 'Yogurt With Honey', 85],
  ['خوخ اناناس', 'Peach & Pineapple', 70], ['تين شوكي', 'Prickly Pear', 65], ['كانتلوب', 'Cantaloupe', 65],

  // 3 — Cocktails (13 items)
  ['تروبيكال', 'Tropical', 85], ['ابل بيتش', 'Apple Beach', 80], ['دوريان', 'Durian', 70],
  ['بابلو كوكتيل', 'Pablo Cocktail', 95], ['توب جينس', 'Top Jeans', 65], ['لبنيتا', 'LaBenita', 70],
  ['ميجا', 'Mega', 65], ['كوكتيل GPS', 'GPS Cocktail', 160], ['بينا كولا', 'Pina Cola', 70],
  ['زبادي فواكه', 'Fruit Yogurt', 90], ['جوافة مينت', 'Guava Mint', 80], ['بانانا بيري', 'Banana Berry', 75],
  ['كوكتيل فلوريدا', 'Florida Cocktail', 70],

  // 4 — Smoothie (10 items)
  ['فراولة سموزي', 'Strawberry Smoothie', 75], ['بطيخ سموزي', 'Watermelon Smoothie', 75], ['مانجو سموزي', 'Mango Smoothie', 80],
  ['خوخ سموزي', 'Peach Smoothie', 135], ['اناناس سموزي', 'Pineapple Smoothie', 110], ['ليمون سموزي', 'Lemon Smoothie', 65],
  ['ليمون نعناع سموزي', 'Mint Lemon Smoothie', 70], ['ميكس بيري سموزي', 'Mix Berry Smoothie', 75],
  ['بلو بيري سموزي', 'Blueberry Smoothie', 75], ['كانتالوب سموزي', 'Cantaloupe Smoothie', 70],

  // 5 — Kiwi Avocado (9 items)
  ['كيوي حليب', 'Milk Kiwi', 110], ['كيوي', 'Kiwi', 105], ['كيوي مانجو', 'Kiwi Mango', 100],
  ['كيوي اناناس', 'Kiwi Pineapple', 100], ['افوكادو', 'Avocado', 100], ['افوكادو ايس كريم', 'Avocado With Ice Cream', 145],
  ['افوكادو مكسرات', 'Avocado With Nuts', 150], ['افوكادو كيوي', 'Avocado Kiwi', 140], ['افوكادو GPS', 'Avocado GPS', 180],

  // 6 — Milk Shakes (12 items)
  ['فانيليا شيك', 'Vanilla Shake', 70], ['شوكليت شيك', 'Chocolate Shake', 75], ['مانجو شيك', 'Mango Shake', 75],
  ['فراولة شيك', 'Strawberry Shake', 75], ['كراميل شيك', 'Caramel Shake', 85], ['بلو بيري شيك', 'Blueberry Shake', 85],
  ['لوتس شيك', 'Lotus Shake', 120], ['نوتيلا شيك', 'Nutella Shake', 90], ['سنيكرز شيك', 'Snickers Shake', 100],
  ['كيت كات شيك', 'Kit Kat Shake', 100], ['اوريو شيك', 'Oreo Shake', 90], ['كوكتيل GPS شيك', 'GPS Milkshake', 120],

  // 7 — Frappe (6 items)
  ['فانيليا فرابيه', 'Vanilla Frappe', 95], ['كراميل فرابيه', 'Caramel Frappe', 100], ['كوفي فرابيه', 'Coffee Frappe', 85],
  ['جوز هند فرابيه', 'Coconut Frappe', 85], ['فرابتشينو', 'Frappuccino', 90], ['موكا فرابيه', 'Mocha Frappe', 90],

  // 8 — Ice Coffee (5 items)
  ['ايس كوفي', 'Ice Coffee', 80], ['ايس لاتيه', 'Ice Latte', 80], ['ايس موكا', 'Ice Mocha', 85],
  ['ايس شوكليت', 'Ice Chocolate', 80], ['ايس تي', 'Iced Tea', 50],

  // 9 — Soda Cocktail (9 items)
  ['صن رايز', 'Sunrise', 80], ['صن شاين', 'Sunshine', 80], ['بلو هاواي', 'Blue Hawaii', 80],
  ['موخيتو بلو بيري', 'Blueberry Mojito', 90], ['موخيتو فراولة', 'Strawberry Mojito', 90],
  ['باور هد', 'Power Head', 120], ['بنك ليدي', 'Lady Bank', 90], ['سيربتو ليمون', 'Spirito Lemon', 90],
  ['جاميكا موهيتو', 'Jamaica Mojito', 90],

  // 10 — Soft Drinks (13 items)
  ['بيبسي', 'Pepsi', 35], ['سفن', '7UP', 35], ['ميرندا', 'Mirinda', 35],
  ['فيروز', 'Fayrouz', 40], ['بريل', 'Birell', 40], ['شويبس', 'Schweppes', 35],
  ['ريدبول', 'Red Bull', 75], ['ريدبول شيري', 'Red Bull Cherry', 80], ['ريدبول موخيتو', 'Red Bull Mojito', 85],
  ['مياه معدنية صغيرة', 'Small Mineral Water', 15], ['ريدبول فلفر', 'Red Bull Flavor', 80], ['في كولا', 'V Cola', 40],
  ['ريدبول كلاسيك', 'Red Bull Classic', 75],

  // 11 — Ice Cream (3 items)
  ['كادجو', 'Kadjo (Scoop)', 50], ['ميامي', 'Miami (2 Scoops)', 75], ['كروسيكال', 'Kruskal (3 Scoops)', 95],

  // 12 — Desserts (18 items)
  ['كريب نوتيلا', 'Nutella Crepe', 100], ['كريب لوتس', 'Lotus Crepe', 100], ['فروت بلتر', 'Fruit Platter', 120],
  ['تشيز كيك', 'Cheesecake', 100], ['سينابون', 'Cinnabon', 75], ['بان كيك', 'Pancake', 100],
  ['تشيز كيك فليفور', 'Cheesecake Flavor', 90], ['مولتن كيك', 'Molten Cake', 85], ['اوريو مادس', 'Oreo Madness', 95],
  ['وافل', 'Waffle', 100], ['برانش براونز', 'Brunch Browns', 80], ['ام علي عسل ومكسرات', 'Om Ali With Nuts & Honey', 80],
  ['ام علي ساده', 'Plain Om Ali', 60], ['شوكليت فادج', 'Chocolate Fudge', 85], ['سلطة فواكه', 'Fruit Salad', 85],
  ['سلطة فواكه مع ايس كريم', 'Fruit Salad With Ice Cream', 105], ['فروت يوجرت', 'Fruit Yogurt', 100],
  ['كريب GPS', 'Crepe GPS', 120],

  // 13 — Shisha (4 items)
  ['شيشة GPS', 'Shisha GPS', 130], ['شيشة فاخر', 'Shisha Fakher', 115], ['شيشة معسل', 'Shisha Moasal', 25], ['لي طبي', 'Medical Hose', 20],
]

// Build items with sequential IDs keyed by section (101, 102, ..., 201, 202, ...)
const sectionSizes = [33, 17, 13, 10, 9, 12, 6, 5, 9, 13, 3, 18, 4]

export const demoItems = (() => {
  const out = []
  let idx = 0
  for (let s = 0; s < demoSections.length; s++) {
    const size = sectionSizes[s]
    for (let i = 0; i < size; i++) {
      const [name_ar, name_en, price] = rawItems[idx]
      const id = s === 0 ? (100 + i + 1) : (s * 100 + i + 1)
      const rating = ratingFor(id, 4.7, 0.35)
      out.push({ id, section_id: demoSections[s].id, name_ar, name_en, price, rating, image: '' })
      idx++
    }
  }
  return out
})()
