// Mutable games catalog shared between Master and Admin panels
let catalog = [
  { id: 1,  name: "Teen Patti",       category: "Live Casino", subCategory: "Teen Patti",   provider: "Demo",        badge: "LIVE", isNew: false, isFeatured: true,  isPopular: true,  enabled: true,  imageUrl: "" },
  { id: 2,  name: "Roulette",         category: "Live Casino", subCategory: "Roulette",     provider: "Demo",        badge: "LIVE", isNew: false, isFeatured: true,  isPopular: true,  enabled: true,  imageUrl: "" },
  { id: 3,  name: "Dragon Tiger",     category: "Live Casino", subCategory: "Dragon Tiger", provider: "Demo",        badge: "LIVE", isNew: false, isFeatured: true,  isPopular: true,  enabled: true,  imageUrl: "" },
  { id: 4,  name: "Aviator",          category: "Crash",       subCategory: "Crash",        provider: "Spribe",      badge: "HOT",  isNew: false, isFeatured: true,  isPopular: true,  enabled: true,  imageUrl: "" },
  { id: 5,  name: "Book of Ra",       category: "Slot",        subCategory: "Classic",      provider: "Habanero",    badge: "HOT",  isNew: false, isFeatured: true,  isPopular: true,  enabled: true,  imageUrl: "" },
  { id: 6,  name: "Starburst",        category: "Slot",        subCategory: "Video Slots",  provider: "Red Tiger",   badge: "HOT",  isNew: false, isFeatured: true,  isPopular: true,  enabled: true,  imageUrl: "" },
  { id: 7,  name: "Fantasy Cricket",  category: "Fantasy",     subCategory: "Cricket",      provider: "Demo Fantasy",badge: "HOT",  isNew: false, isFeatured: true,  isPopular: true,  enabled: true,  imageUrl: "" },
  { id: 8,  name: "Cricket - IPL",    category: "Sports",      subCategory: "Cricket",      provider: "Demo",        badge: "LIVE", isNew: false, isFeatured: false, isPopular: true,  enabled: true,  imageUrl: "" },
  { id: 9,  name: "Keno",             category: "Lottery",     subCategory: "General",      provider: "Demo",        badge: "HOT",  isNew: false, isFeatured: false, isPopular: true,  enabled: true,  imageUrl: "" },
  { id: 10, name: "Blackjack",        category: "Live Casino", subCategory: "VIP Casino",   provider: "Demo",        badge: "HOT",  isNew: false, isFeatured: false, isPopular: true,  enabled: true,  imageUrl: "" },
  { id: 11, name: "Sweet Bonanza",    category: "Slot",        subCategory: "Video Slots",  provider: "JILI",        badge: "HOT",  isNew: false, isFeatured: true,  isPopular: true,  enabled: true,  imageUrl: "" },
  { id: 12, name: "JetX",             category: "Crash",       subCategory: "Crash",        provider: "Demo",        badge: "HOT",  isNew: false, isFeatured: false, isPopular: true,  enabled: false, imageUrl: "" },
];

let nextId = catalog.length + 1;

export const getGames = () => [...catalog];

export const addGame = (game) => {
  catalog = [...catalog, { ...game, id: nextId++ }];
};

export const updateGame = (id, updates) => {
  catalog = catalog.map(g => g.id === id ? { ...g, ...updates } : g);
};

export const toggleGame = (id) => {
  catalog = catalog.map(g => g.id === id ? { ...g, enabled: !g.enabled } : g);
};

export const deleteGame = (id) => {
  catalog = catalog.filter(g => g.id !== id);
};

export const CATEGORIES = ["Live Casino", "Slot", "Crash", "Sports", "Fantasy", "Lottery", "Exchange"];
export const SUBCATEGORIES = {
  "Live Casino": ["Teen Patti", "Roulette", "Dragon Tiger", "Baccarat", "Blackjack", "Poker", "Andar Bahar", "VIP Casino"],
  "Slot":        ["Classic", "Video Slots", "Megaways", "Jackpot"],
  "Crash":       ["Crash"],
  "Sports":      ["Cricket", "Football", "Tennis", "Basketball", "Kabaddi"],
  "Fantasy":     ["Cricket", "Football", "Basketball", "Grand League"],
  "Lottery":     ["General"],
  "Exchange":    ["Cricket", "Football", "Tennis"],
};
export const PROVIDERS = ["Demo", "Spribe", "JILI", "Habanero", "Red Tiger", "1X2 Gaming", "Hacksaw", "Kalamba", "Evoplay", "Demo Fantasy", "Demo Slots"];
export const BADGES = ["LIVE", "HOT", "NEW"];
