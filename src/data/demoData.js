export const demoSections = [
  { id: 1, slug: 'hot-drinks',  name_ar: 'مشروبات ساخنة',  name_en: 'Hot Drinks',  color: '#c0843e', icon: '☕', position: 1 },
  { id: 2, slug: 'cold-drinks', name_ar: 'مشروبات باردة',  name_en: 'Cold Drinks', color: '#3b82f6', icon: '🧊', position: 2 },
  { id: 3, slug: 'smoothies',   name_ar: 'سموزي',          name_en: 'Smoothies',   color: '#22c55e', icon: '🥤', position: 3 },
  { id: 4, slug: 'milkshakes',  name_ar: 'ميلك شيك',       name_en: 'Milkshakes',   color: '#ec4899', icon: '🥛', position: 4 },
  { id: 5, slug: 'juices',      name_ar: 'عصائر طبيعية',   name_en: 'Fresh Juice', color: '#84cc16', icon: '🍉', position: 5 },
  { id: 6, slug: 'desserts',    name_ar: 'حلويات',         name_en: 'Desserts',    color: '#f59e0b', icon: '🍰', position: 6 },
  { id: 7, slug: 'shisha',      name_ar: 'شيشة',           name_en: 'Shisha',      color: '#a855f7', icon: '💨', position: 7 },
  { id: 8, slug: 'snacks',      name_ar: 'سناكس',          name_en: 'Snacks',      color: '#ef4444', icon: '🍟', position: 8 },
]

export const demoItems = [
  // hot-drinks
  { id: 101, section_id: 1, name_ar: 'شاي', name_en: 'Tea', price: 18, rating: 4.6, image: '', suggest_id: 601 },
  { id: 102, section_id: 1, name_ar: 'شاي بالحليب', name_en: 'Milk Tea', price: 24, rating: 4.7, image: '', suggest_id: 604 },
  { id: 103, section_id: 1, name_ar: 'قهوة عربي', name_en: 'Turkish Coffee', price: 28, rating: 4.8, image: '' },
  { id: 104, section_id: 1, name_ar: 'إسبريسو', name_en: 'Espresso', price: 30, rating: 4.7, image: '' },
  { id: 105, section_id: 1, name_ar: 'كابتشينو', name_en: 'Cappuccino', price: 40, rating: 4.9, image: '', suggest_id: 601 },
  { id: 106, section_id: 1, name_ar: 'لاتيه', name_en: 'Latte', price: 42, rating: 4.8, image: '' },
  { id: 107, section_id: 1, name_ar: 'هوت شوكليت', name_en: 'Hot Chocolate', price: 36, rating: 4.7, image: '', suggest_id: 603 },

  // cold-drinks
  { id: 201, section_id: 2, name_ar: 'آيس كابتشينو', name_en: 'Iced Cappuccino', price: 44, rating: 4.9, image: '', suggest_id: 604 },
  { id: 202, section_id: 2, name_ar: 'آيس لاتيه', name_en: 'Iced Latte', price: 42, rating: 4.8, image: '' },
  { id: 203, section_id: 2, name_ar: 'آيس أمريكانو', name_en: 'Iced Americano', price: 36, rating: 4.7, image: '' },
  { id: 204, section_id: 2, name_ar: 'آيس هوت شوكليت', name_en: 'Iced Chocolate', price: 40, rating: 4.7, image: '', suggest_id: 602 },
  { id: 205, section_id: 2, name_ar: 'موهيتو', name_en: 'Virgin Mojito', price: 48, rating: 4.9, image: '', suggest_id: 301 },

  // smoothies
  { id: 301, section_id: 3, name_ar: 'سموزي فراولة', name_en: 'Strawberry Smoothie', price: 50, rating: 4.9, image: '' },
  { id: 302, section_id: 3, name_ar: 'سموزي مانجو', name_en: 'Mango Smoothie', price: 50, rating: 4.8, image: '' },
  { id: 303, section_id: 3, name_ar: 'سموزي موز', name_en: 'Banana Smoothie', price: 48, rating: 4.7, image: '', suggest_id: 401 },
  { id: 304, section_id: 3, name_ar: 'سموزي مكس', name_en: 'Mixed Smoothie', price: 55, rating: 4.9, image: '' },

  // milkshakes
  { id: 401, section_id: 4, name_ar: 'ميلك شيك شوكليت', name_en: 'Chocolate Milkshake', price: 55, rating: 4.9, image: '', suggest_id: 603 },
  { id: 402, section_id: 4, name_ar: 'ميلك شيك فانيليا', name_en: 'Vanilla Milkshake', price: 55, rating: 4.8, image: '' },
  { id: 403, section_id: 4, name_ar: 'ميلك شيك أوريو', name_en: 'Oreo Milkshake', price: 62, rating: 5.0, image: '', suggest_id: 603 },
  { id: 404, section_id: 4, name_ar: 'ميلك شيك فراولة', name_en: 'Strawberry Milkshake', price: 55, rating: 4.8, image: '' },

  // juices
  { id: 501, section_id: 5, name_ar: 'عصير برتقال', name_en: 'Orange Juice', price: 35, rating: 4.8, image: '' },
  { id: 502, section_id: 5, name_ar: 'عصير ليمون بالنعناع', name_en: 'Lemon Mint', price: 30, rating: 4.9, image: '', suggest_id: 205 },
  { id: 503, section_id: 5, name_ar: 'عصير أناناس', name_en: 'Pineapple Juice', price: 40, rating: 4.7, image: '' },
  { id: 504, section_id: 5, name_ar: 'عصير بطيخ', name_en: 'Watermelon Juice', price: 38, rating: 4.7, image: '' },

  // desserts
  { id: 601, section_id: 6, name_ar: 'تشيز كيك', name_en: 'Cheesecake', price: 70, rating: 4.9, image: '', suggest_id: 403 },
  { id: 602, section_id: 6, name_ar: 'براوني', name_en: 'Brownie', price: 65, rating: 4.8, image: '' },
  { id: 603, section_id: 6, name_ar: 'كوكيز', name_en: 'Cookies', price: 45, rating: 4.6, image: '' },
  { id: 604, section_id: 6, name_ar: 'كنافة', name_en: 'Kunafa', price: 60, rating: 4.9, image: '', suggest_id: 102 },
  { id: 605, section_id: 6, name_ar: 'كريب', name_en: 'Crepe', price: 58, rating: 4.7, image: '' },

  // shisha
  { id: 701, section_id: 7, name_ar: 'شيشة معسل سوليم', name_en: "Mu'assel Sole", price: 90, rating: 4.8, image: '' },
  { id: 702, section_id: 7, name_ar: 'شيشة معسل ديون', name_en: "Two Apples Mu'assel", price: 90, rating: 4.7, image: '', suggest_id: 701 },
  { id: 703, section_id: 7, name_ar: 'شيشة معسل ليمون نعناع', name_en: "Lemon Mint Mu'assel", price: 95, rating: 4.9, image: '' },
  { id: 704, section_id: 7, name_ar: 'شيشة فاخرة', name_en: 'Premium Shisha', price: 120, rating: 5.0, image: '', suggest_id: 603 },

  // snacks
  { id: 801, section_id: 8, name_ar: 'بطاطس مقلية', name_en: 'French Fries', price: 40, rating: 4.7, image: '' },
  { id: 802, section_id: 8, name_ar: 'ناجتس دجاج', name_en: 'Chicken Nuggets', price: 55, rating: 4.6, image: '', suggest_id: 801 },
  { id: 803, section_id: 8, name_ar: 'بصل محمّر', name_en: 'Onion Rings', price: 45, rating: 4.7, image: '' },
  { id: 804, section_id: 8, name_ar: 'جبنة مقلية', name_en: 'Fried Mozzarella', price: 60, rating: 4.8, image: '' },
]
