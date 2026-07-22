// GPS Cafe — Official product catalog (Primavera spreadsheet merged).
// All "Primavera / بريمافيرا" wording rebranded to "GPS".
// Ratings: between 4.5 and 4.9, deterministic per item id.

const ratingFor = (id, base = 4.7, spread = 0.2) => {
  const v = ((id * 9301 + 49297) % 233280) / 233280
  const r = base + (v - 0.5) * spread * 2
  return Math.max(4.5, Math.min(4.9, Math.round(r * 10) / 10))
}

export const demoSections = [
  { id: 1,  slug: 'hot-drinks',    name_ar: 'مشروبات ساخنة',  name_en: 'Hot Drinks',     color: '#d97706', icon: '☕',  position: 1 },
  { id: 2,  slug: 'fresh-juices',  name_ar: 'عصائر فريش',     name_en: 'Fresh Juices',   color: '#84cc16', icon: '🍉', position: 2 },
  { id: 3,  slug: 'cocktails',     name_ar: 'الكوكتيلات',      name_en: 'Cocktails',      color: '#ec4899', icon: '🍹', position: 3 },
  { id: 4,  slug: 'smoothie',      name_ar: 'سموزي',          name_en: 'Smoothie',       color: '#22c55e', icon: '🥤', position: 4 },
  { id: 5,  slug: 'kiwi-avocado',  name_ar: 'كيوي افوكادو',    name_en: 'Kiwi Avocado',   color: '#10b981', icon: '🥑', position: 5 },
  { id: 6,  slug: 'milk-shakes',  name_ar: 'ميلك شيك',        name_en: 'Milk Shakes',    color: '#f472b6', icon: '🥛', position: 6 },
  { id: 7,  slug: 'frappe',       name_ar: 'الفرابيه',        name_en: 'Frappe',         color: '#a78bfa', icon: '🧋', position: 7 },
  { id: 8,  slug: 'ice-coffee',   name_ar: 'أيس كوفي',        name_en: 'Ice Coffee',     color: '#0ea5e9', icon: '🧊', position: 8 },
  { id: 9,  slug: 'soda-cocktail',name_ar: 'كوكتيل صودا',     name_en: 'Soda Cocktail',  color: '#06b6d4', icon: '🥂', position: 9 },
  { id: 10, slug: 'soft-drinks',  name_ar: 'سوفت درينك',      name_en: 'Soft Drinks',    color: '#94a3b8', icon: '🥤', position: 10 },
  { id: 11, slug: 'ice-cream',    name_ar: 'الآيس كريم',      name_en: 'Ice Cream',      color: '#f87171', icon: '🍦', position: 11 },
  { id: 12, slug: 'desserts',     name_ar: 'الحلويات',        name_en: 'Desserts',       color: '#f59e0b', icon: '🍰', position: 12 },
  { id: 13, slug: 'shisha',       name_ar: 'الشيشة',          name_en: 'Shisha',         color: '#a855f7', icon: '💨', position: 13 },
]

// Each item explicitly maps to its section_id — no array-slicing tricks.
// id scheme: sectionIndex×100 + sequential (e.g. 601 = section 6 item #1)
export const demoItems = [
  // === 1) مشروبات ساخنة — Hot Drinks (34 items) ===
  { id: 101, section_id: 1, name_ar: 'شاي بحليب', name_en: 'Milk Tea', price: 34 },
  { id: 102, section_id: 1, name_ar: 'شاي اخضر', name_en: 'Green Tea', price: 25 },
  { id: 103, section_id: 1, name_ar: 'شاي فواكه', name_en: 'Fruit Tea', price: 30 },
  { id: 104, section_id: 1, name_ar: 'شاي براد', name_en: 'Tea Pot', price: 50 },
  { id: 105, section_id: 1, name_ar: 'ينسون', name_en: 'Anise', price: 30 },
  { id: 106, section_id: 1, name_ar: 'نعناع', name_en: 'Mint', price: 30 },
  { id: 107, section_id: 1, name_ar: 'قرفة بحليب', name_en: 'Cinnamon With Milk', price: 45 },
  { id: 108, section_id: 1, name_ar: 'كوكتيل اعشاب', name_en: 'Herbal Mix', price: 50 },
  { id: 109, section_id: 1, name_ar: 'حمص الشام', name_en: 'Hummus El Sham', price: 45 },
  { id: 110, section_id: 1, name_ar: 'مشروب اعشاب بالبرتقال', name_en: 'Herbal Orange Drink', price: 75 },
  { id: 111, section_id: 1, name_ar: 'سحلب ساده', name_en: 'Plain Sahlab', price: 55 },
  { id: 112, section_id: 1, name_ar: 'سحلب مكسرات وفواكه', name_en: 'Sahlab With Nuts & Fruits', price: 85 },
  { id: 113, section_id: 1, name_ar: 'ليمون سخن', name_en: 'Hot Lemon', price: 30 },
  { id: 114, section_id: 1, name_ar: 'قرفة', name_en: 'Cinnamon', price: 40 },
  { id: 115, section_id: 1, name_ar: 'اسبرسو', name_en: 'Espresso', price: 45 },
  { id: 116, section_id: 1, name_ar: 'اسبرسو دبل', name_en: 'Double Espresso', price: 55 },
  { id: 117, section_id: 1, name_ar: 'كابتشينو', name_en: 'Cappuccino', price: 65 },
  { id: 118, section_id: 1, name_ar: 'سبانيش لاتيه', name_en: 'Spanish Latte', price: 75 },
  { id: 119, section_id: 1, name_ar: 'لاتيه', name_en: 'Latte', price: 60 },
  { id: 120, section_id: 1, name_ar: 'ميكاتو سنجل', name_en: 'Single Macchiato', price: 50 },
  { id: 121, section_id: 1, name_ar: 'ميكاتو دبل', name_en: 'Double Macchiato', price: 58 },
  { id: 122, section_id: 1, name_ar: 'موكا', name_en: 'Mocha', price: 60 },
  { id: 123, section_id: 1, name_ar: 'أمريكانو كوفي', name_en: 'Americano Coffee', price: 60 },
  { id: 124, section_id: 1, name_ar: 'نسكافيه بلاك', name_en: 'Black Nescafe', price: 45 },
  { id: 125, section_id: 1, name_ar: 'نسكافيه بالحليب', name_en: 'Nescafe With Milk', price: 50 },
  { id: 126, section_id: 1, name_ar: 'قهوة تركية', name_en: 'Turkish Coffee', price: 35 },
  { id: 127, section_id: 1, name_ar: 'قهوة سورية', name_en: 'Syrian Coffee', price: 45 },
  { id: 128, section_id: 1, name_ar: 'قهوة تركية دبل', name_en: 'Double Turkish Coffee', price: 45 },
  { id: 129, section_id: 1, name_ar: 'هوت لوتس', name_en: 'Hot Lotus', price: 85 },
  { id: 130, section_id: 1, name_ar: 'قهوة فرنساوي', name_en: 'French Coffee', price: 55 },
  { id: 131, section_id: 1, name_ar: 'قهوة بندق', name_en: 'Hazelnut Coffee', price: 55 },
  { id: 132, section_id: 1, name_ar: 'زنجبيل', name_en: 'Ginger', price: 40 },
  { id: 133, section_id: 1, name_ar: 'هوت سيدر', name_en: 'Hot Cider', price: 55 },
  { id: 134, section_id: 1, name_ar: 'هوت شوكليت', name_en: 'Hot Chocolate', price: 55 },
  { id: 135, section_id: 1, name_ar: 'شاي', name_en: 'Tea', price: 25 },

  // === 2) عصائر فريش — Fresh Juices (18 items) ===
  { id: 201, section_id: 2, name_ar: 'مانجو', name_en: 'Mango', price: 75 },
  { id: 202, section_id: 2, name_ar: 'فراولة', name_en: 'Strawberry', price: 70 },
  { id: 203, section_id: 2, name_ar: 'برتقال', name_en: 'Orange', price: 75 },
  { id: 204, section_id: 2, name_ar: 'برتقال بالجزر', name_en: 'Orange With Carrots', price: 80 },
  { id: 205, section_id: 2, name_ar: 'رمان', name_en: 'Pomegranate', price: 70 },
  { id: 206, section_id: 2, name_ar: 'خوخ', name_en: 'Peach', price: 130 },
  { id: 207, section_id: 2, name_ar: 'بطيخ', name_en: 'Watermelon', price: 70 },
  { id: 208, section_id: 2, name_ar: 'موز باللبن', name_en: 'Banana With Milk', price: 70 },
  { id: 209, section_id: 2, name_ar: 'جوافة', name_en: 'Guava', price: 65 },
  { id: 210, section_id: 2, name_ar: 'ليمون نعناع', name_en: 'Mint Lemon', price: 65 },
  { id: 211, section_id: 2, name_ar: 'ليمون', name_en: 'Lemon', price: 60 },
  { id: 212, section_id: 2, name_ar: 'اناناس', name_en: 'Pineapple', price: 100 },
  { id: 213, section_id: 2, name_ar: 'بلح باللبن', name_en: 'Dates With Milk', price: 80 },
  { id: 214, section_id: 2, name_ar: 'زبادي عسل', name_en: 'Yogurt With Honey', price: 85 },
  { id: 215, section_id: 2, name_ar: 'خوخ اناناس', name_en: 'Peach & Pineapple', price: 70 },
  { id: 216, section_id: 2, name_ar: 'تين شوكي', name_en: 'Prickly Pear', price: 65 },
  { id: 217, section_id: 2, name_ar: 'كانتلوب', name_en: 'Cantaloupe', price: 65 },
  { id: 218, section_id: 2, name_ar: 'كيوي', name_en: 'Kiwi', price: 65 },

  // === 3) الكوكتيلات — Cocktails (13 items) ===
  { id: 301, section_id: 3, name_ar: 'تروبيكال', name_en: 'Tropical', price: 85 },
  { id: 302, section_id: 3, name_ar: 'ابل بيتش', name_en: 'Apple Beach', price: 80 },
  { id: 303, section_id: 3, name_ar: 'دوريان', name_en: 'Durian', price: 70 },
  { id: 304, section_id: 3, name_ar: 'بابلو كوكتيل', name_en: 'Pablo Cocktail', price: 95 },
  { id: 305, section_id: 3, name_ar: 'توب جينس', name_en: 'Top Jeans', price: 65 },
  { id: 306, section_id: 3, name_ar: 'لبنيتا', name_en: 'LaBenita', price: 70 },
  { id: 307, section_id: 3, name_ar: 'ميجا', name_en: 'Mega', price: 65 },
  { id: 308, section_id: 3, name_ar: 'كوكتيل GPS', name_en: 'GPS Cocktail', price: 160 },
  { id: 309, section_id: 3, name_ar: 'بينا كولا', name_en: 'Pina Cola', price: 70 },
  { id: 310, section_id: 3, name_ar: 'زبادي فواكه', name_en: 'Fruit Yogurt', price: 90 },
  { id: 311, section_id: 3, name_ar: 'جوافة مينت', name_en: 'Guava Mint', price: 80 },
  { id: 312, section_id: 3, name_ar: 'بانانا بيري', name_en: 'Banana Berry', price: 75 },
  { id: 313, section_id: 3, name_ar: 'كوكتيل فلوريدا', name_en: 'Florida Cocktail', price: 70 },

  // === 4) سموزي — Smoothie (10 items) ===
  { id: 401, section_id: 4, name_ar: 'سموزي فراولة', name_en: 'Strawberry Smoothie', price: 75 },
  { id: 402, section_id: 4, name_ar: 'سموزي بطيخ', name_en: 'Watermelon Smoothie', price: 75 },
  { id: 403, section_id: 4, name_ar: 'سموزي مانجو', name_en: 'Mango Smoothie', price: 80 },
  { id: 404, section_id: 4, name_ar: 'سموزي خوخ', name_en: 'Peach Smoothie', price: 135 },
  { id: 405, section_id: 4, name_ar: 'سموزي اناناس', name_en: 'Pineapple Smoothie', price: 110 },
  { id: 406, section_id: 4, name_ar: 'سموزي ليمون', name_en: 'Lemon Smoothie', price: 65 },
  { id: 407, section_id: 4, name_ar: 'سموزي ليمون نعناع', name_en: 'Mint Lemon Smoothie', price: 70 },
  { id: 408, section_id: 4, name_ar: 'سموزي ميكس بيري', name_en: 'Mix Berry Smoothie', price: 75 },
  { id: 409, section_id: 4, name_ar: 'سموزي بلو بيري', name_en: 'Blueberry Smoothie', price: 75 },
  { id: 410, section_id: 4, name_ar: 'سموزي كانتالوب', name_en: 'Cantaloupe Smoothie', price: 70 },

  // === 5) كيوي افوكادو — Kiwi Avocado (9 items) ===
  { id: 501, section_id: 5, name_ar: 'كيوي حليب', name_en: 'Milk Kiwi', price: 110 },
  { id: 502, section_id: 5, name_ar: 'كيوي', name_en: 'Kiwi', price: 105 },
  { id: 503, section_id: 5, name_ar: 'كيوي مانجو', name_en: 'Kiwi Mango', price: 100 },
  { id: 504, section_id: 5, name_ar: 'كيوي اناناس', name_en: 'Kiwi Pineapple', price: 100 },
  { id: 505, section_id: 5, name_ar: 'افوكادو', name_en: 'Avocado', price: 100 },
  { id: 506, section_id: 5, name_ar: 'افوكادو ايس كريم', name_en: 'Avocado With Ice Cream', price: 145 },
  { id: 507, section_id: 5, name_ar: 'افوكادو مكسرات', name_en: 'Avocado With Nuts', price: 150 },
  { id: 508, section_id: 5, name_ar: 'افوكادو كيوي', name_en: 'Avocado Kiwi', price: 140 },
  { id: 509, section_id: 5, name_ar: 'افوكادو GPS', name_en: 'Avocado GPS', price: 180 },

  // === 6) ميلك شيك — Milk Shakes (12 items) ===
  { id: 601, section_id: 6, name_ar: 'فانيليا شيك', name_en: 'Vanilla Shake', price: 70 },
  { id: 602, section_id: 6, name_ar: 'شوكليت شيك', name_en: 'Chocolate Shake', price: 75 },
  { id: 603, section_id: 6, name_ar: 'مانجو شيك', name_en: 'Mango Shake', price: 75 },
  { id: 604, section_id: 6, name_ar: 'فراولة شيك', name_en: 'Strawberry Shake', price: 75 },
  { id: 605, section_id: 6, name_ar: 'كراميل شيك', name_en: 'Caramel Shake', price: 85 },
  { id: 606, section_id: 6, name_ar: 'بلو بيري شيك', name_en: 'Blueberry Shake', price: 85 },
  { id: 607, section_id: 6, name_ar: 'لوتس شيك', name_en: 'Lotus Shake', price: 120 },
  { id: 608, section_id: 6, name_ar: 'نوتيلا شيك', name_en: 'Nutella Shake', price: 90 },
  { id: 609, section_id: 6, name_ar: 'سنيكرز شيك', name_en: 'Snickers Shake', price: 100 },
  { id: 610, section_id: 6, name_ar: 'كيت كات شيك', name_en: 'Kit Kat Shake', price: 100 },
  { id: 611, section_id: 6, name_ar: 'اوريو شيك', name_en: 'Oreo Shake', price: 90 },
  { id: 612, section_id: 6, name_ar: 'كوكتيل GPS شيك', name_en: 'GPS Milkshake', price: 120 },

  // === 7) الفرابيه — Frappe (6 items) ===
  { id: 701, section_id: 7, name_ar: 'فانيليا فرابيه', name_en: 'Vanilla Frappe', price: 95 },
  { id: 702, section_id: 7, name_ar: 'كراميل فرابيه', name_en: 'Caramel Frappe', price: 100 },
  { id: 703, section_id: 7, name_ar: 'كوفي فرابيه', name_en: 'Coffee Frappe', price: 85 },
  { id: 704, section_id: 7, name_ar: 'جوز هند فرابيه', name_en: 'Coconut Frappe', price: 85 },
  { id: 705, section_id: 7, name_ar: 'فرابتشينو', name_en: 'Frappuccino', price: 90 },
  { id: 706, section_id: 7, name_ar: 'موكا فرابيه', name_en: 'Mocha Frappe', price: 90 },

  // === 8) أيس كوفي — Ice Coffee (5 items) ===
  { id: 801, section_id: 8, name_ar: 'ايس كوفي', name_en: 'Ice Coffee', price: 80 },
  { id: 802, section_id: 8, name_ar: 'ايس لاتيه', name_en: 'Ice Latte', price: 80 },
  { id: 803, section_id: 8, name_ar: 'ايس موكا', name_en: 'Ice Mocha', price: 85 },
  { id: 804, section_id: 8, name_ar: 'ايس شوكليت', name_en: 'Ice Chocolate', price: 80 },
  { id: 805, section_id: 8, name_ar: 'ايس تي', name_en: 'Iced Tea', price: 50 },

  // === 9) كوكتيل صودا — Soda Cocktail (9 items) ===
  { id: 901, section_id: 9, name_ar: 'صن رايز', name_en: 'Sunrise', price: 80 },
  { id: 902, section_id: 9, name_ar: 'صن شاين', name_en: 'Sunshine', price: 80 },
  { id: 903, section_id: 9, name_ar: 'بلو هاواي', name_en: 'Blue Hawaii', price: 80 },
  { id: 904, section_id: 9, name_ar: 'موخيتو بلو بيري', name_en: 'Blueberry Mojito', price: 90 },
  { id: 905, section_id: 9, name_ar: 'موخيتو فراولة', name_en: 'Strawberry Mojito', price: 90 },
  { id: 906, section_id: 9, name_ar: 'باور هد', name_en: 'Power Head', price: 120 },
  { id: 907, section_id: 9, name_ar: 'بنك ليدي', name_en: 'Lady Bank', price: 90 },
  { id: 908, section_id: 9, name_ar: 'سيربتو ليمون', name_en: 'Spirito Lemon', price: 90 },
  { id: 909, section_id: 9, name_ar: 'جاميكا موهيتو', name_en: 'Jamaica Mojito', price: 90 },

  // === 10) سوفت درينك — Soft Drinks (13 items) ===
  { id: 1001, section_id: 10, name_ar: 'بيبسي', name_en: 'Pepsi', price: 35 },
  { id: 1002, section_id: 10, name_ar: 'سفن', name_en: '7UP', price: 35 },
  { id: 1003, section_id: 10, name_ar: 'ميرندا', name_en: 'Mirinda', price: 35 },
  { id: 1004, section_id: 10, name_ar: 'فيروز', name_en: 'Fayrouz', price: 40 },
  { id: 1005, section_id: 10, name_ar: 'بريل', name_en: 'Birell', price: 40 },
  { id: 1006, section_id: 10, name_ar: 'شويبس', name_en: 'Schweppes', price: 35 },
  { id: 1007, section_id: 10, name_ar: 'ريدبول', name_en: 'Red Bull', price: 75 },
  { id: 1008, section_id: 10, name_ar: 'ريدبول شيري', name_en: 'Red Bull Cherry', price: 80 },
  { id: 1009, section_id: 10, name_ar: 'ريدبول موخيتو', name_en: 'Red Bull Mojito', price: 85 },
  { id: 1010, section_id: 10, name_ar: 'مياه معدنية صغيرة', name_en: 'Small Mineral Water', price: 15 },
  { id: 1011, section_id: 10, name_ar: 'ريدبول فلفر', name_en: 'Red Bull Flavor', price: 80 },
  { id: 1012, section_id: 10, name_ar: 'في كولا', name_en: 'V Cola', price: 40 },
  { id: 1013, section_id: 10, name_ar: 'ريدبول كلاسيك', name_en: 'Red Bull Classic', price: 75 },

  // === 11) آيس كريم — Ice Cream (3 items) ===
  { id: 1101, section_id: 11, name_ar: 'كادجو (بولة)', name_en: 'Kadjo (Scoop)', price: 50 },
  { id: 1102, section_id: 11, name_ar: 'ميامي (2 بولة)', name_en: 'Miami (2 Scoops)', price: 75 },
  { id: 1103, section_id: 11, name_ar: 'كروسيكال (3 بولة)', name_en: 'Kruskal (3 Scoops)', price: 95 },

  // === 12) الحلويات — Desserts (18 items) ===
  { id: 1201, section_id: 12, name_ar: 'كريب نوتيلا', name_en: 'Nutella Crepe', price: 100 },
  { id: 1202, section_id: 12, name_ar: 'كريب لوتس', name_en: 'Lotus Crepe', price: 100 },
  { id: 1203, section_id: 12, name_ar: 'فروت بلتر', name_en: 'Fruit Platter', price: 120 },
  { id: 1204, section_id: 12, name_ar: 'تشيز كيك', name_en: 'Cheesecake', price: 100 },
  { id: 1205, section_id: 12, name_ar: 'سينابون', name_en: 'Cinnabon', price: 75 },
  { id: 1206, section_id: 12, name_ar: 'بان كيك', name_en: 'Pancake', price: 100 },
  { id: 1207, section_id: 12, name_ar: 'تشيز كيك فليفور', name_en: 'Cheesecake Flavor', price: 90 },
  { id: 1208, section_id: 12, name_ar: 'مولتن كيك', name_en: 'Molten Cake', price: 85 },
  { id: 1209, section_id: 12, name_ar: 'اوريو مادس', name_en: 'Oreo Madness', price: 95 },
  { id: 1210, section_id: 12, name_ar: 'وافل', name_en: 'Waffle', price: 100 },
  { id: 1211, section_id: 12, name_ar: 'برانش براونز', name_en: 'Brunch Browns', price: 80 },
  { id: 1212, section_id: 12, name_ar: 'ام علي عسل ومكسرات', name_en: 'Om Ali With Nuts & Honey', price: 80 },
  { id: 1213, section_id: 12, name_ar: 'ام علي ساده', name_en: 'Plain Om Ali', price: 60 },
  { id: 1214, section_id: 12, name_ar: 'شوكليت فادج', name_en: 'Chocolate Fudge', price: 85 },
  { id: 1215, section_id: 12, name_ar: 'سلطة فواكه', name_en: 'Fruit Salad', price: 85 },
  { id: 1216, section_id: 12, name_ar: 'سلطة فواكه مع ايس كريم', name_en: 'Fruit Salad With Ice Cream', price: 105 },
  { id: 1217, section_id: 12, name_ar: 'فروت يوجرت', name_en: 'Fruit Yogurt', price: 100 },
  { id: 1218, section_id: 12, name_ar: 'كريب GPS', name_en: 'Crepe GPS', price: 120 },

  // === 13) الشيشة — Shisha (4 items) ===
  { id: 1301, section_id: 13, name_ar: 'شيشة GPS', name_en: 'Shisha GPS', price: 130 },
  { id: 1302, section_id: 13, name_ar: 'شيشة فاخر', name_en: 'Shisha Fakher', price: 115 },
  { id: 1303, section_id: 13, name_ar: 'شيشة معسل', name_en: 'Shisha Moasal', price: 25 },
  { id: 1304, section_id: 13, name_ar: 'لي طبي', name_en: 'Medical Hose', price: 20 },
].map(item => ({
  ...item,
  rating: ratingFor(item.id, 4.7, 0.35),
  image: '',
}))
