import img_poker    from "../assets/images/20_20_poker.webp";
import img_29b      from "../assets/images/29b.webp";
import img_6pp      from "../assets/images/6pp.webp";
import img_aviator  from "../assets/images/Aviator.png";
import img_dt       from "../assets/images/dt_mac88.webp";
import img_dt2      from "../assets/images/dt2.webp";
import img_poker2   from "../assets/images/poker_1_day.webp";
import img_roulette from "../assets/images/roulette_mac88.webp";
import img_sicbo    from "../assets/images/sicbo_mac88.webp";
import img_lobby    from "../assets/images/LOBBY.png";

const imgs = [img_poker, img_29b, img_6pp, img_aviator, img_dt, img_dt2, img_poker2, img_roulette, img_sicbo, img_lobby];
const c = (i) => imgs[i % imgs.length];

const def = { provider:"Demo", subCategory:"General", tags:[], isNew:false, isFeatured:false, isPopular:false, description:"", gameUrl:null };

// ── LOTTERY ──────────────────────────────────────────────────────
export const lotteryGames = [
  { id:1,  name:"Keno",                image:c(0),  category:"Lottery", badge:"HOT",  ...def },
  { id:2,  name:"Bingo 90",            image:c(1),  category:"Lottery", badge:"LIVE", ...def },
  { id:3,  name:"Bingo 75",            image:c(2),  category:"Lottery", badge:"LIVE", ...def },
  { id:4,  name:"Lotto 6/49",          image:c(3),  category:"Lottery", badge:"HOT",  ...def },
  { id:5,  name:"Powerball",           image:c(4),  category:"Lottery", badge:"HOT",  ...def },
  { id:6,  name:"Mega Millions",       image:c(5),  category:"Lottery", badge:"HOT",  ...def },
  { id:7,  name:"Euro Millions",       image:c(6),  category:"Lottery", badge:"NEW",  ...def },
  { id:8,  name:"Scratch Card",        image:c(7),  category:"Lottery", badge:"NEW",  ...def },
  { id:9,  name:"Lucky Numbers",       image:c(8),  category:"Lottery", badge:"LIVE", ...def },
  { id:10, name:"Pick 3",              image:c(9),  category:"Lottery", badge:"LIVE", ...def },
  { id:11, name:"Pick 4",              image:c(0),  category:"Lottery", badge:"HOT",  ...def },
  { id:12, name:"Daily Draw",          image:c(1),  category:"Lottery", badge:"LIVE", ...def },
  { id:13, name:"Rapid Keno",          image:c(2),  category:"Lottery", badge:"HOT",  ...def },
  { id:14, name:"Super Lotto",         image:c(3),  category:"Lottery", badge:"NEW",  ...def },
  { id:15, name:"Thunderball",         image:c(4),  category:"Lottery", badge:"LIVE", ...def },
  { id:16, name:"Set For Life",        image:c(5),  category:"Lottery", badge:"HOT",  ...def },
  { id:17, name:"Cash 5",              image:c(6),  category:"Lottery", badge:"LIVE", ...def },
  { id:18, name:"Win 4",               image:c(7),  category:"Lottery", badge:"NEW",  ...def },
  { id:19, name:"Instant Win",         image:c(8),  category:"Lottery", badge:"HOT",  ...def },
  { id:20, name:"Lucky Stars",         image:c(9),  category:"Lottery", badge:"LIVE", ...def },
  { id:21, name:"Lotto Max",           image:c(0),  category:"Lottery", badge:"HOT",  ...def },
  { id:22, name:"Mega Jackpot",        image:c(1),  category:"Lottery", badge:"NEW",  ...def },
];

// ── SPORTSBOOK ───────────────────────────────────────────────────
export const sportsbookGames = [
  { id:1,  name:"Cricket - IPL",       image:c(4),  category:"Sports", badge:"LIVE", ...def },
  { id:2,  name:"Cricket - T20 WC",    image:c(5),  category:"Sports", badge:"LIVE", ...def },
  { id:3,  name:"Football - EPL",      image:c(6),  category:"Sports", badge:"LIVE", ...def },
  { id:4,  name:"Football - La Liga",  image:c(7),  category:"Sports", badge:"LIVE", ...def },
  { id:5,  name:"Football - UCL",      image:c(8),  category:"Sports", badge:"HOT",  ...def },
  { id:6,  name:"Tennis - Wimbledon",  image:c(9),  category:"Sports", badge:"HOT",  ...def },
  { id:7,  name:"Tennis - US Open",    image:c(0),  category:"Sports", badge:"NEW",  ...def },
  { id:8,  name:"Basketball - NBA",    image:c(1),  category:"Sports", badge:"LIVE", ...def },
  { id:9,  name:"Kabaddi - PKL",       image:c(2),  category:"Sports", badge:"LIVE", ...def },
  { id:10, name:"Horse Racing",        image:c(3),  category:"Sports", badge:"HOT",  ...def },
  { id:11, name:"Badminton",           image:c(4),  category:"Sports", badge:"NEW",  ...def },
  { id:12, name:"Boxing",              image:c(5),  category:"Sports", badge:"HOT",  ...def },
  { id:13, name:"Table Tennis",        image:c(6),  category:"Sports", badge:"LIVE", ...def },
  { id:14, name:"Volleyball",          image:c(7),  category:"Sports", badge:"LIVE", ...def },
  { id:15, name:"Rugby",               image:c(8),  category:"Sports", badge:"HOT",  ...def },
  { id:16, name:"Golf",                image:c(9),  category:"Sports", badge:"NEW",  ...def },
  { id:17, name:"MMA / UFC",           image:c(0),  category:"Sports", badge:"HOT",  ...def },
  { id:18, name:"Snooker",             image:c(1),  category:"Sports", badge:"LIVE", ...def },
  { id:19, name:"Baseball - MLB",      image:c(2),  category:"Sports", badge:"HOT",  ...def },
  { id:20, name:"Ice Hockey - NHL",    image:c(3),  category:"Sports", badge:"LIVE", ...def },
  { id:21, name:"E-Sports - CSGO",     image:c(4),  category:"Sports", badge:"HOT",  ...def },
  { id:22, name:"E-Sports - DOTA2",    image:c(5),  category:"Sports", badge:"NEW",  ...def },
];

// ── EXCHANGE ─────────────────────────────────────────────────────
export const exchangeGames = [
  { id:1,  name:"Cricket Match Odds",  image:c(4),  category:"Exchange", badge:"LIVE", ...def },
  { id:2,  name:"Cricket Fancy",       image:c(5),  category:"Exchange", badge:"LIVE", ...def },
  { id:3,  name:"Cricket Bookmaker",   image:c(6),  category:"Exchange", badge:"HOT",  ...def },
  { id:4,  name:"Cricket Session",     image:c(7),  category:"Exchange", badge:"LIVE", ...def },
  { id:5,  name:"Innings Runs",        image:c(8),  category:"Exchange", badge:"HOT",  ...def },
  { id:6,  name:"Player Runs",         image:c(9),  category:"Exchange", badge:"LIVE", ...def },
  { id:7,  name:"Wickets Market",      image:c(0),  category:"Exchange", badge:"NEW",  ...def },
  { id:8,  name:"Toss Winner",         image:c(1),  category:"Exchange", badge:"HOT",  ...def },
  { id:9,  name:"Boundary Count",      image:c(2),  category:"Exchange", badge:"LIVE", ...def },
  { id:10, name:"Man of the Match",    image:c(3),  category:"Exchange", badge:"NEW",  ...def },
  { id:11, name:"Football Match Odds", image:c(4),  category:"Exchange", badge:"LIVE", ...def },
  { id:12, name:"Football Over/Under", image:c(5),  category:"Exchange", badge:"HOT",  ...def },
  { id:13, name:"Correct Score",       image:c(6),  category:"Exchange", badge:"NEW",  ...def },
  { id:14, name:"Both Teams Score",    image:c(7),  category:"Exchange", badge:"HOT",  ...def },
  { id:15, name:"Asian Handicap",      image:c(8),  category:"Exchange", badge:"LIVE", ...def },
  { id:16, name:"Half Time Result",    image:c(9),  category:"Exchange", badge:"HOT",  ...def },
  { id:17, name:"Tennis Match Odds",   image:c(0),  category:"Exchange", badge:"LIVE", ...def },
  { id:18, name:"Horse Race Odds",     image:c(1),  category:"Exchange", badge:"HOT",  ...def },
  { id:19, name:"Series Winner",       image:c(2),  category:"Exchange", badge:"NEW",  ...def },
  { id:20, name:"Top Batsman",         image:c(3),  category:"Exchange", badge:"HOT",  ...def },
  { id:21, name:"Top Bowler",          image:c(4),  category:"Exchange", badge:"LIVE", ...def },
  { id:22, name:"Over/Under Runs",     image:c(5),  category:"Exchange", badge:"HOT",  ...def },
];

// ── SLOTS ────────────────────────────────────────────────────────
export const slotGames = [
  { id:1,  name:"Aviator",             image:c(3),  category:"Slot", subCategory:"Classic",     provider:"Demo Slots",  badge:"HOT",  tags:["classic"],   isNew:false, isFeatured:true,  isPopular:true,  description:"", gameUrl:null },
  { id:2,  name:"Book of Ra",          image:c(0),  category:"Slot", subCategory:"Classic",     provider:"Habanero",   badge:"HOT",  tags:["classic"],   isNew:false, isFeatured:true,  isPopular:true,  description:"", gameUrl:null },
  { id:3,  name:"Starburst",           image:c(1),  category:"Slot", subCategory:"Video Slots", provider:"Red Tiger",  badge:"HOT",  tags:["video"],     isNew:false, isFeatured:true,  isPopular:true,  description:"", gameUrl:null },
  { id:4,  name:"Gonzo's Quest",       image:c(2),  category:"Slot", subCategory:"Video Slots", provider:"Evoplay",    badge:"NEW",  tags:["video"],     isNew:true,  isFeatured:false, isPopular:true,  description:"", gameUrl:null },
  { id:5,  name:"Mega Moolah",         image:c(3),  category:"Slot", subCategory:"Jackpot",     provider:"Demo Slots", badge:"HOT",  tags:["jackpot"],   isNew:false, isFeatured:true,  isPopular:true,  description:"", gameUrl:null },
  { id:6,  name:"Wolf Gold",           image:c(4),  category:"Slot", subCategory:"Video Slots", provider:"JILI",       badge:"LIVE", tags:["video"],     isNew:false, isFeatured:false, isPopular:true,  description:"", gameUrl:null },
  { id:7,  name:"Sweet Bonanza",       image:c(5),  category:"Slot", subCategory:"Video Slots", provider:"JILI",       badge:"HOT",  tags:["video"],     isNew:false, isFeatured:true,  isPopular:true,  description:"", gameUrl:null },
  { id:8,  name:"Gates of Olympus",    image:c(6),  category:"Slot", subCategory:"Video Slots", provider:"Kalamba",    badge:"NEW",  tags:["video"],     isNew:true,  isFeatured:false, isPopular:false, description:"", gameUrl:null },
  { id:9,  name:"Big Bass Bonanza",    image:c(7),  category:"Slot", subCategory:"Video Slots", provider:"Hacksaw",    badge:"HOT",  tags:["video"],     isNew:false, isFeatured:false, isPopular:true,  description:"", gameUrl:null },
  { id:10, name:"Fruit Party",         image:c(8),  category:"Slot", subCategory:"Classic",     provider:"Amigo",      badge:"LIVE", tags:["classic"],   isNew:false, isFeatured:false, isPopular:false, description:"", gameUrl:null },
  { id:11, name:"Fire Joker",          image:c(9),  category:"Slot", subCategory:"Classic",     provider:"Amigo",      badge:"HOT",  tags:["classic"],   isNew:false, isFeatured:false, isPopular:true,  description:"", gameUrl:null },
  { id:12, name:"Reactoonz",           image:c(0),  category:"Slot", subCategory:"Video Slots", provider:"1X2 Gaming", badge:"NEW",  tags:["video"],     isNew:true,  isFeatured:false, isPopular:false, description:"", gameUrl:null },
  { id:13, name:"Dead or Alive 2",     image:c(1),  category:"Slot", subCategory:"Video Slots", provider:"BB Games",   badge:"HOT",  tags:["video"],     isNew:false, isFeatured:false, isPopular:true,  description:"", gameUrl:null },
  { id:14, name:"Immortal Romance",    image:c(2),  category:"Slot", subCategory:"Video Slots", provider:"Boongo",     badge:"LIVE", tags:["video"],     isNew:false, isFeatured:false, isPopular:false, description:"", gameUrl:null },
  { id:15, name:"Thunderstruck II",    image:c(3),  category:"Slot", subCategory:"Video Slots", provider:"Turbo Games",badge:"HOT",  tags:["video"],     isNew:false, isFeatured:false, isPopular:true,  description:"", gameUrl:null },
  { id:16, name:"Bonanza Megaways",    image:c(4),  category:"Slot", subCategory:"Megaways",    provider:"Red Tiger",  badge:"NEW",  tags:["megaways"],  isNew:true,  isFeatured:true,  isPopular:false, description:"", gameUrl:null },
  { id:17, name:"Razor Shark",         image:c(5),  category:"Slot", subCategory:"Video Slots", provider:"Hacksaw",    badge:"HOT",  tags:["video"],     isNew:false, isFeatured:false, isPopular:true,  description:"", gameUrl:null },
  { id:18, name:"Money Train 2",       image:c(6),  category:"Slot", subCategory:"Megaways",    provider:"Kalamba",    badge:"LIVE", tags:["megaways"],  isNew:false, isFeatured:false, isPopular:false, description:"", gameUrl:null },
  { id:19, name:"Jammin Jars",         image:c(7),  category:"Slot", subCategory:"Video Slots", provider:"Lady Luck",  badge:"HOT",  tags:["video"],     isNew:false, isFeatured:false, isPopular:true,  description:"", gameUrl:null },
  { id:20, name:"Primal Megaways",     image:c(8),  category:"Slot", subCategory:"Megaways",    provider:"1X2 Gaming", badge:"NEW",  tags:["megaways"],  isNew:true,  isFeatured:false, isPopular:false, description:"", gameUrl:null },
  { id:21, name:"Rise of Merlin",      image:c(9),  category:"Slot", subCategory:"Jackpot",     provider:"Lady Luck",  badge:"HOT",  tags:["jackpot"],   isNew:false, isFeatured:false, isPopular:true,  description:"", gameUrl:null },
  { id:22, name:"Pirate Gold",         image:c(0),  category:"Slot", subCategory:"Jackpot",     provider:"BB Games",   badge:"LIVE", tags:["jackpot"],   isNew:false, isFeatured:false, isPopular:false, description:"", gameUrl:null },
];

// ── LIVE CASINO ──────────────────────────────────────────────────
export const liveCasinoGames = [
  { id:1,  name:"Teen Patti",          image:c(0),  category:"Live Casino", subCategory:"Teen Patti",   provider:"Demo", badge:"LIVE", tags:[], isNew:false, isFeatured:true,  isPopular:true,  description:"", gameUrl:null },
  { id:2,  name:"Roulette",            image:c(7),  category:"Live Casino", subCategory:"Roulette",     provider:"Demo", badge:"LIVE", tags:[], isNew:false, isFeatured:true,  isPopular:true,  description:"", gameUrl:null },
  { id:3,  name:"Dragon Tiger",        image:c(4),  category:"Live Casino", subCategory:"Dragon Tiger", provider:"Demo", badge:"LIVE", tags:[], isNew:false, isFeatured:true,  isPopular:true,  description:"", gameUrl:null },
  { id:4,  name:"Andar Bahar",         image:c(5),  category:"Live Casino", subCategory:"Andar Bahar",  provider:"Demo", badge:"LIVE", tags:[], isNew:false, isFeatured:false, isPopular:true,  description:"", gameUrl:null },
  { id:5,  name:"Sic Bo",              image:c(8),  category:"Live Casino", subCategory:"Virtual Casino",provider:"Demo", badge:"LIVE", tags:[], isNew:false, isFeatured:false, isPopular:false, description:"", gameUrl:null },
  { id:6,  name:"Lucky 7",             image:c(1),  category:"Live Casino", subCategory:"Lucky 7",      provider:"Demo", badge:"HOT",  tags:[], isNew:false, isFeatured:false, isPopular:true,  description:"", gameUrl:null },
  { id:7,  name:"20-20 Poker",         image:c(0),  category:"Live Casino", subCategory:"Poker",        provider:"Demo", badge:"LIVE", tags:[], isNew:false, isFeatured:true,  isPopular:true,  description:"", gameUrl:null },
  { id:8,  name:"Poker 1 Day",         image:c(6),  category:"Live Casino", subCategory:"Poker",        provider:"Demo", badge:"LIVE", tags:[], isNew:false, isFeatured:false, isPopular:false, description:"", gameUrl:null },
  { id:9,  name:"Aviator",             image:c(3),  category:"Live Casino", subCategory:"Virtual Casino",provider:"Demo", badge:"HOT",  tags:[], isNew:false, isFeatured:false, isPopular:true,  description:"", gameUrl:null },
  { id:10, name:"Casino Lobby",        image:c(9),  category:"Live Casino", subCategory:"VIP Casino",   provider:"Demo", badge:"LIVE", tags:[], isNew:false, isFeatured:false, isPopular:false, description:"", gameUrl:null },
  { id:11, name:"Baccarat",            image:c(1),  category:"Live Casino", subCategory:"Baccarat",     provider:"Demo", badge:"LIVE", tags:[], isNew:false, isFeatured:true,  isPopular:true,  description:"", gameUrl:null },
  { id:12, name:"Blackjack",           image:c(2),  category:"Live Casino", subCategory:"VIP Casino",   provider:"Demo", badge:"HOT",  tags:[], isNew:false, isFeatured:false, isPopular:true,  description:"", gameUrl:null },
  { id:13, name:"Casino War",          image:c(3),  category:"Live Casino", subCategory:"Casino War",   provider:"Demo", badge:"NEW",  tags:[], isNew:true,  isFeatured:false, isPopular:false, description:"", gameUrl:null },
  { id:14, name:"Hi Lo",               image:c(4),  category:"Live Casino", subCategory:"Virtual Casino",provider:"Demo", badge:"LIVE", tags:[], isNew:false, isFeatured:false, isPopular:false, description:"", gameUrl:null },
  { id:15, name:"Jhandi Munda",        image:c(5),  category:"Live Casino", subCategory:"Bollywood",    provider:"Demo", badge:"HOT",  tags:[], isNew:false, isFeatured:false, isPopular:true,  description:"", gameUrl:null },
  { id:16, name:"32 Cards",            image:c(6),  category:"Live Casino", subCategory:"32 Cards",     provider:"Demo", badge:"LIVE", tags:[], isNew:false, isFeatured:false, isPopular:false, description:"", gameUrl:null },
  { id:17, name:"Worli Matka",         image:c(7),  category:"Live Casino", subCategory:"Bollywood",    provider:"Demo", badge:"HOT",  tags:[], isNew:false, isFeatured:false, isPopular:true,  description:"", gameUrl:null },
  { id:18, name:"Muflis Teen Patti",   image:c(8),  category:"Live Casino", subCategory:"Teen Patti",   provider:"Demo", badge:"NEW",  tags:[], isNew:true,  isFeatured:false, isPopular:false, description:"", gameUrl:null },
  { id:19, name:"3 Card Judgement",    image:c(9),  category:"Live Casino", subCategory:"3 Card",       provider:"Demo", badge:"HOT",  tags:[], isNew:false, isFeatured:false, isPopular:true,  description:"", gameUrl:null },
  { id:20, name:"Race 20-20",          image:c(0),  category:"Live Casino", subCategory:"Teen Patti",   provider:"Demo", badge:"LIVE", tags:[], isNew:false, isFeatured:false, isPopular:false, description:"", gameUrl:null },
  { id:21, name:"6 Player Poker",      image:c(2),  category:"Live Casino", subCategory:"Poker",        provider:"Demo", badge:"LIVE", tags:[], isNew:false, isFeatured:false, isPopular:false, description:"", gameUrl:null },
  { id:22, name:"29 Card Baccarat",    image:c(1),  category:"Live Casino", subCategory:"Baccarat",     provider:"Demo", badge:"HOT",  tags:[], isNew:false, isFeatured:false, isPopular:true,  description:"", gameUrl:null },
];

// ── CRASH GAMES ─────────────────────────────────────────────────
export const crashGames = [
  { id:1,  name:"Aviator",            image:c(3),  category:"Crash", subCategory:"Crash", provider:"Demo", badge:"HOT",  tags:["crash","popular"], isNew:false, isFeatured:true,  isPopular:true,  description:"", gameUrl:null },
  { id:2,  name:"JetX",               image:c(4),  category:"Crash", subCategory:"Crash", provider:"Demo", badge:"HOT",  tags:["crash"],          isNew:false, isFeatured:false, isPopular:true,  description:"", gameUrl:null },
  { id:3,  name:"Crash Evolution",    image:c(5),  category:"Crash", subCategory:"Crash", provider:"Demo", badge:"NEW",  tags:["crash"],          isNew:true,  isFeatured:false, isPopular:false, description:"", gameUrl:null },
  { id:4,  name:"Crash Single",       image:c(6),  category:"Crash", subCategory:"Crash", provider:"Demo", badge:"LIVE", tags:["crash"],          isNew:false, isFeatured:false, isPopular:false, description:"", gameUrl:null },
  { id:5,  name:"GoRush",             image:c(7),  category:"Crash", subCategory:"Crash", provider:"Demo", badge:"HOT",  tags:["crash"],          isNew:false, isFeatured:false, isPopular:true,  description:"", gameUrl:null },
  { id:6,  name:"Limbo",              image:c(8),  category:"Crash", subCategory:"Crash", provider:"Demo", badge:"HOT",  tags:["crash"],          isNew:false, isFeatured:false, isPopular:true,  description:"", gameUrl:null },
  { id:7,  name:"Aero",               image:c(9),  category:"Crash", subCategory:"Crash", provider:"Demo", badge:"NEW",  tags:["crash"],          isNew:true,  isFeatured:false, isPopular:false, description:"", gameUrl:null },
  { id:8,  name:"Balloon",            image:c(0),  category:"Crash", subCategory:"Crash", provider:"Demo", badge:"LIVE", tags:["crash"],          isNew:false, isFeatured:false, isPopular:false, description:"", gameUrl:null },
  { id:9,  name:"Cricket X",          image:c(4),  category:"Crash", subCategory:"Crash", provider:"Demo", badge:"HOT",  tags:["crash","cricket"],isNew:false, isFeatured:true,  isPopular:true,  description:"", gameUrl:null },
  { id:10, name:"Football X",         image:c(5),  category:"Crash", subCategory:"Crash", provider:"Demo", badge:"HOT",  tags:["crash","football"],isNew:false,isFeatured:true,  isPopular:true,  description:"", gameUrl:null },
  { id:11, name:"Other Crash Demo",   image:c(1),  category:"Crash", subCategory:"Crash", provider:"Demo", badge:"NEW",  tags:["crash"],          isNew:true,  isFeatured:false, isPopular:false, description:"", gameUrl:null },
];

// ── FANTASY GAMES ────────────────────────────────────────────────
export const fantasyGames = [
  { id:1,  name:"Fantasy Cricket",     image:c(4),  category:"Fantasy", subCategory:"Cricket",      provider:"Demo Fantasy", badge:"HOT",  tags:["cricket"],          isNew:false, isFeatured:true,  isPopular:true,  description:"", gameUrl:null },
  { id:2,  name:"Fantasy Football",    image:c(5),  category:"Fantasy", subCategory:"Football",     provider:"Demo Fantasy", badge:"LIVE", tags:["football"],         isNew:false, isFeatured:true,  isPopular:true,  description:"", gameUrl:null },
  { id:3,  name:"Fantasy Kabaddi",     image:c(6),  category:"Fantasy", subCategory:"Kabaddi",      provider:"SmartSoft",    badge:"NEW",  tags:["kabaddi"],          isNew:true,  isFeatured:false, isPopular:false, description:"", gameUrl:null },
  { id:4,  name:"Fantasy Basketball",  image:c(7),  category:"Fantasy", subCategory:"Basketball",   provider:"SmartSoft",    badge:"HOT",  tags:["basketball"],       isNew:false, isFeatured:false, isPopular:true,  description:"", gameUrl:null },
  { id:5,  name:"Fantasy Hockey",      image:c(8),  category:"Fantasy", subCategory:"Grand League", provider:"PopOK",        badge:"LIVE", tags:["hockey"],           isNew:false, isFeatured:false, isPopular:false, description:"", gameUrl:null },
  { id:6,  name:"Fantasy Baseball",    image:c(9),  category:"Fantasy", subCategory:"Grand League", provider:"PopOK",        badge:"HOT",  tags:["baseball"],         isNew:false, isFeatured:false, isPopular:false, description:"", gameUrl:null },
  { id:7,  name:"IPL Fantasy",         image:c(0),  category:"Fantasy", subCategory:"Cricket",      provider:"Pascal",       badge:"HOT",  tags:["cricket","ipl"],   isNew:false, isFeatured:true,  isPopular:true,  description:"", gameUrl:null },
  { id:8,  name:"T20 World Cup",       image:c(1),  category:"Fantasy", subCategory:"Cricket",      provider:"Pascal",       badge:"LIVE", tags:["cricket","t20"],   isNew:false, isFeatured:false, isPopular:true,  description:"", gameUrl:null },
  { id:9,  name:"ODI Fantasy",         image:c(2),  category:"Fantasy", subCategory:"Cricket",      provider:"Spribe",       badge:"LIVE", tags:["cricket","odi"],   isNew:false, isFeatured:false, isPopular:false, description:"", gameUrl:null },
  { id:10, name:"Test Match Fantasy",  image:c(3),  category:"Fantasy", subCategory:"Cricket",      provider:"Spribe",       badge:"NEW",  tags:["cricket","test"],  isNew:true,  isFeatured:false, isPopular:false, description:"", gameUrl:null },
  { id:11, name:"Grand League",        image:c(4),  category:"Fantasy", subCategory:"Grand League", provider:"Darwin",       badge:"HOT",  tags:["grand"],            isNew:false, isFeatured:true,  isPopular:true,  description:"", gameUrl:null },
  { id:12, name:"Small League",        image:c(5),  category:"Fantasy", subCategory:"Grand League", provider:"Darwin",       badge:"LIVE", tags:["league"],           isNew:false, isFeatured:false, isPopular:false, description:"", gameUrl:null },
  { id:13, name:"Head to Head",        image:c(6),  category:"Fantasy", subCategory:"Grand League", provider:"Gemini",       badge:"HOT",  tags:["h2h"],              isNew:false, isFeatured:false, isPopular:true,  description:"", gameUrl:null },
  { id:14, name:"Mega Contest",        image:c(7),  category:"Fantasy", subCategory:"Grand League", provider:"Gemini",       badge:"NEW",  tags:["contest"],          isNew:true,  isFeatured:false, isPopular:false, description:"", gameUrl:null },
  { id:15, name:"Practice Contest",    image:c(8),  category:"Fantasy", subCategory:"Cricket",      provider:"Studio21",     badge:"LIVE", tags:["practice"],         isNew:false, isFeatured:false, isPopular:false, description:"", gameUrl:null },
  { id:16, name:"Pro Kabaddi League",  image:c(9),  category:"Fantasy", subCategory:"Kabaddi",      provider:"Studio21",     badge:"HOT",  tags:["kabaddi","pkl"],   isNew:false, isFeatured:false, isPopular:true,  description:"", gameUrl:null },
  { id:17, name:"NBA Fantasy",         image:c(0),  category:"Fantasy", subCategory:"Basketball",   provider:"BEON",         badge:"HOT",  tags:["basketball","nba"],isNew:false, isFeatured:true,  isPopular:true,  description:"", gameUrl:null },
  { id:18, name:"EPL Fantasy",         image:c(1),  category:"Fantasy", subCategory:"Football",     provider:"BEON",         badge:"LIVE", tags:["football","epl"],  isNew:false, isFeatured:false, isPopular:true,  description:"", gameUrl:null },
  { id:19, name:"Champions League",    image:c(2),  category:"Fantasy", subCategory:"Football",     provider:"KingMidas",    badge:"HOT",  tags:["football","ucl"],  isNew:false, isFeatured:true,  isPopular:true,  description:"", gameUrl:null },
  { id:20, name:"World Cup Fantasy",   image:c(3),  category:"Fantasy", subCategory:"Football",     provider:"KingMidas",    badge:"NEW",  tags:["football","wc"],   isNew:true,  isFeatured:false, isPopular:false, description:"", gameUrl:null },
  { id:21, name:"Daily Fantasy",       image:c(4),  category:"Fantasy", subCategory:"Cricket",      provider:"Demo Fantasy", badge:"HOT",  tags:["daily"],            isNew:false, isFeatured:false, isPopular:true,  description:"", gameUrl:null },
  { id:22, name:"Champions Trophy",    image:c(5),  category:"Fantasy", subCategory:"Cricket",      provider:"Demo Fantasy", badge:"LIVE", tags:["cricket","ct"],    isNew:false, isFeatured:false, isPopular:false, description:"", gameUrl:null },
];
