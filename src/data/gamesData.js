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

// Free embeddable HTML5 games from crazygames / gamedistribution
const ROULETTE   = "https://html5.gamedistribution.com/rvvASMiM/2b5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e/index.html";
const BLACKJACK  = "https://html5.gamedistribution.com/rvvASMiM/blackjack/index.html";
const POKER      = "https://html5.gamedistribution.com/rvvASMiM/poker/index.html";
const SLOTS      = "https://html5.gamedistribution.com/rvvASMiM/slots/index.html";
const BINGO      = "https://html5.gamedistribution.com/rvvASMiM/bingo/index.html";
const KENO       = "https://html5.gamedistribution.com/rvvASMiM/keno/index.html";
const CRICKET    = "https://html5.gamedistribution.com/rvvASMiM/cricket/index.html";
const FOOTBALL   = "https://html5.gamedistribution.com/rvvASMiM/football/index.html";
const BASKETBALL = "https://html5.gamedistribution.com/rvvASMiM/basketball/index.html";
const TENNIS     = "https://html5.gamedistribution.com/rvvASMiM/tennis/index.html";

// ── LOTTERY ──────────────────────────────────────────────────────
export const lotteryGames = [
  { id:1,  name:"Keno",                badge:"HOT",  img:c(0), gameUrl:"https://www.crazygames.com/embed/keno" },
  { id:2,  name:"Bingo 90",            badge:"LIVE", img:c(1), gameUrl:"https://www.crazygames.com/embed/bingo" },
  { id:3,  name:"Bingo 75",            badge:"LIVE", img:c(2), gameUrl:"https://www.crazygames.com/embed/bingo-75" },
  { id:4,  name:"Lotto 6/49",          badge:"HOT",  img:c(3), gameUrl:"https://www.crazygames.com/embed/lotto" },
  { id:5,  name:"Powerball",           badge:"HOT",  img:c(4), gameUrl:"https://www.crazygames.com/embed/powerball" },
  { id:6,  name:"Mega Millions",       badge:"HOT",  img:c(5), gameUrl:"https://www.crazygames.com/embed/mega-millions" },
  { id:7,  name:"Euro Millions",       badge:"NEW",  img:c(6), gameUrl:"https://www.crazygames.com/embed/euromillions" },
  { id:8,  name:"Scratch Card",        badge:"NEW",  img:c(7), gameUrl:"https://www.crazygames.com/embed/scratch-card" },
  { id:9,  name:"Lucky Numbers",       badge:"LIVE", img:c(8), gameUrl:"https://www.crazygames.com/embed/lucky-numbers" },
  { id:10, name:"Pick 3",              badge:"LIVE", img:c(9), gameUrl:"https://www.crazygames.com/embed/pick3" },
  { id:11, name:"Pick 4",              badge:"HOT",  img:c(0), gameUrl:"https://www.crazygames.com/embed/pick4" },
  { id:12, name:"Daily Draw",          badge:"LIVE", img:c(1), gameUrl:"https://www.crazygames.com/embed/daily-draw" },
  { id:13, name:"Rapid Keno",          badge:"HOT",  img:c(2), gameUrl:"https://www.crazygames.com/embed/rapid-keno" },
  { id:14, name:"Super Lotto",         badge:"NEW",  img:c(3), gameUrl:"https://www.crazygames.com/embed/super-lotto" },
  { id:15, name:"Thunderball",         badge:"LIVE", img:c(4), gameUrl:"https://www.crazygames.com/embed/thunderball" },
  { id:16, name:"Set For Life",        badge:"HOT",  img:c(5), gameUrl:"https://www.crazygames.com/embed/set-for-life" },
  { id:17, name:"Cash 5",              badge:"LIVE", img:c(6), gameUrl:"https://www.crazygames.com/embed/cash5" },
  { id:18, name:"Win 4",               badge:"NEW",  img:c(7), gameUrl:"https://www.crazygames.com/embed/win4" },
  { id:19, name:"Instant Win",         badge:"HOT",  img:c(8), gameUrl:"https://www.crazygames.com/embed/instant-win" },
  { id:20, name:"Lucky Stars",         badge:"LIVE", img:c(9), gameUrl:"https://www.crazygames.com/embed/lucky-stars" },
  { id:21, name:"Lotto Max",           badge:"HOT",  img:c(0), gameUrl:"https://www.crazygames.com/embed/lotto-max" },
  { id:22, name:"Mega Jackpot",        badge:"NEW",  img:c(1), gameUrl:"https://www.crazygames.com/embed/mega-jackpot" },
];

// ── SPORTSBOOK ───────────────────────────────────────────────────
export const sportsbookGames = [
  { id:1,  name:"Cricket - IPL",       badge:"LIVE", img:c(4), gameUrl:"https://www.crazygames.com/embed/cricket-world-cup" },
  { id:2,  name:"Cricket - T20 WC",    badge:"LIVE", img:c(5), gameUrl:"https://www.crazygames.com/embed/cricket-t20" },
  { id:3,  name:"Football - EPL",      badge:"LIVE", img:c(6), gameUrl:"https://www.crazygames.com/embed/football-legends" },
  { id:4,  name:"Football - La Liga",  badge:"LIVE", img:c(7), gameUrl:"https://www.crazygames.com/embed/football-masters" },
  { id:5,  name:"Football - UCL",      badge:"HOT",  img:c(8), gameUrl:"https://www.crazygames.com/embed/penalty-shootout" },
  { id:6,  name:"Tennis - Wimbledon",  badge:"HOT",  img:c(9), gameUrl:"https://www.crazygames.com/embed/tennis-masters" },
  { id:7,  name:"Tennis - US Open",    badge:"NEW",  img:c(0), gameUrl:"https://www.crazygames.com/embed/tennis-open" },
  { id:8,  name:"Basketball - NBA",    badge:"LIVE", img:c(1), gameUrl:"https://www.crazygames.com/embed/basketball-stars" },
  { id:9,  name:"Kabaddi - PKL",       badge:"LIVE", img:c(2), gameUrl:"https://www.crazygames.com/embed/kabaddi" },
  { id:10, name:"Horse Racing",        badge:"HOT",  img:c(3), gameUrl:"https://www.crazygames.com/embed/horse-racing" },
  { id:11, name:"Badminton",           badge:"NEW",  img:c(4), gameUrl:"https://www.crazygames.com/embed/badminton-clash" },
  { id:12, name:"Boxing",              badge:"HOT",  img:c(5), gameUrl:"https://www.crazygames.com/embed/boxing-random" },
  { id:13, name:"Table Tennis",        badge:"LIVE", img:c(6), gameUrl:"https://www.crazygames.com/embed/table-tennis-world-tour" },
  { id:14, name:"Volleyball",          badge:"LIVE", img:c(7), gameUrl:"https://www.crazygames.com/embed/volleyball" },
  { id:15, name:"Rugby",               badge:"HOT",  img:c(8), gameUrl:"https://www.crazygames.com/embed/rugby" },
  { id:16, name:"Golf",                badge:"NEW",  img:c(9), gameUrl:"https://www.crazygames.com/embed/golf-orbit" },
  { id:17, name:"MMA / UFC",           badge:"HOT",  img:c(0), gameUrl:"https://www.crazygames.com/embed/mma-fighting" },
  { id:18, name:"Snooker",             badge:"LIVE", img:c(1), gameUrl:"https://www.crazygames.com/embed/8-ball-billiards-classic" },
  { id:19, name:"Baseball - MLB",      badge:"HOT",  img:c(2), gameUrl:"https://www.crazygames.com/embed/baseball" },
  { id:20, name:"Ice Hockey - NHL",    badge:"LIVE", img:c(3), gameUrl:"https://www.crazygames.com/embed/ice-hockey" },
  { id:21, name:"E-Sports - CSGO",     badge:"HOT",  img:c(4), gameUrl:"https://www.crazygames.com/embed/bullet-force-multiplayer" },
  { id:22, name:"E-Sports - DOTA2",    badge:"NEW",  img:c(5), gameUrl:"https://www.crazygames.com/embed/dota" },
];

// ── EXCHANGE ─────────────────────────────────────────────────────
export const exchangeGames = [
  { id:1,  name:"Cricket Match Odds",  badge:"LIVE", img:c(4), gameUrl:"https://www.crazygames.com/embed/cricket-world-cup" },
  { id:2,  name:"Cricket Fancy",       badge:"LIVE", img:c(5), gameUrl:"https://www.crazygames.com/embed/cricket-t20" },
  { id:3,  name:"Cricket Bookmaker",   badge:"HOT",  img:c(6), gameUrl:"https://www.crazygames.com/embed/cricket-world-cup" },
  { id:4,  name:"Cricket Session",     badge:"LIVE", img:c(7), gameUrl:"https://www.crazygames.com/embed/cricket-t20" },
  { id:5,  name:"Innings Runs",        badge:"HOT",  img:c(8), gameUrl:"https://www.crazygames.com/embed/cricket-world-cup" },
  { id:6,  name:"Player Runs",         badge:"LIVE", img:c(9), gameUrl:"https://www.crazygames.com/embed/cricket-t20" },
  { id:7,  name:"Wickets Market",      badge:"NEW",  img:c(0), gameUrl:"https://www.crazygames.com/embed/cricket-world-cup" },
  { id:8,  name:"Toss Winner",         badge:"HOT",  img:c(1), gameUrl:"https://www.crazygames.com/embed/coin-flip" },
  { id:9,  name:"Boundary Count",      badge:"LIVE", img:c(2), gameUrl:"https://www.crazygames.com/embed/cricket-t20" },
  { id:10, name:"Man of the Match",    badge:"NEW",  img:c(3), gameUrl:"https://www.crazygames.com/embed/cricket-world-cup" },
  { id:11, name:"Football Match Odds", badge:"LIVE", img:c(4), gameUrl:"https://www.crazygames.com/embed/football-legends" },
  { id:12, name:"Football Over/Under", badge:"HOT",  img:c(5), gameUrl:"https://www.crazygames.com/embed/penalty-shootout" },
  { id:13, name:"Correct Score",       badge:"NEW",  img:c(6), gameUrl:"https://www.crazygames.com/embed/football-masters" },
  { id:14, name:"Both Teams Score",    badge:"HOT",  img:c(7), gameUrl:"https://www.crazygames.com/embed/football-legends" },
  { id:15, name:"Asian Handicap",      badge:"LIVE", img:c(8), gameUrl:"https://www.crazygames.com/embed/penalty-shootout" },
  { id:16, name:"Half Time Result",    badge:"HOT",  img:c(9), gameUrl:"https://www.crazygames.com/embed/football-masters" },
  { id:17, name:"Tennis Match Odds",   badge:"LIVE", img:c(0), gameUrl:"https://www.crazygames.com/embed/tennis-masters" },
  { id:18, name:"Horse Race Odds",     badge:"HOT",  img:c(1), gameUrl:"https://www.crazygames.com/embed/horse-racing" },
  { id:19, name:"Series Winner",       badge:"NEW",  img:c(2), gameUrl:"https://www.crazygames.com/embed/cricket-world-cup" },
  { id:20, name:"Top Batsman",         badge:"HOT",  img:c(3), gameUrl:"https://www.crazygames.com/embed/cricket-t20" },
  { id:21, name:"Top Bowler",          badge:"LIVE", img:c(4), gameUrl:"https://www.crazygames.com/embed/cricket-world-cup" },
  { id:22, name:"Over/Under Runs",     badge:"HOT",  img:c(5), gameUrl:"https://www.crazygames.com/embed/cricket-t20" },
];

// ── SLOTS ────────────────────────────────────────────────────────
export const slotGames = [
  { id:1,  name:"Aviator",             badge:"HOT",  img:c(3), gameUrl:"https://www.crazygames.com/embed/aviator" },
  { id:2,  name:"Book of Ra",          badge:"HOT",  img:c(0), gameUrl:"https://www.crazygames.com/embed/book-of-ra" },
  { id:3,  name:"Starburst",           badge:"HOT",  img:c(1), gameUrl:"https://www.crazygames.com/embed/starburst" },
  { id:4,  name:"Gonzo's Quest",       badge:"NEW",  img:c(2), gameUrl:"https://www.crazygames.com/embed/gonzos-quest" },
  { id:5,  name:"Mega Moolah",         badge:"HOT",  img:c(3), gameUrl:"https://www.crazygames.com/embed/mega-moolah" },
  { id:6,  name:"Wolf Gold",           badge:"LIVE", img:c(4), gameUrl:"https://www.crazygames.com/embed/wolf-gold" },
  { id:7,  name:"Sweet Bonanza",       badge:"HOT",  img:c(5), gameUrl:"https://www.crazygames.com/embed/sweet-bonanza" },
  { id:8,  name:"Gates of Olympus",    badge:"NEW",  img:c(6), gameUrl:"https://www.crazygames.com/embed/gates-of-olympus" },
  { id:9,  name:"Big Bass Bonanza",    badge:"HOT",  img:c(7), gameUrl:"https://www.crazygames.com/embed/big-bass-bonanza" },
  { id:10, name:"Fruit Party",         badge:"LIVE", img:c(8), gameUrl:"https://www.crazygames.com/embed/fruit-party" },
  { id:11, name:"Fire Joker",          badge:"HOT",  img:c(9), gameUrl:"https://www.crazygames.com/embed/fire-joker" },
  { id:12, name:"Reactoonz",           badge:"NEW",  img:c(0), gameUrl:"https://www.crazygames.com/embed/reactoonz" },
  { id:13, name:"Dead or Alive 2",     badge:"HOT",  img:c(1), gameUrl:"https://www.crazygames.com/embed/dead-or-alive-2" },
  { id:14, name:"Immortal Romance",    badge:"LIVE", img:c(2), gameUrl:"https://www.crazygames.com/embed/immortal-romance" },
  { id:15, name:"Thunderstruck II",    badge:"HOT",  img:c(3), gameUrl:"https://www.crazygames.com/embed/thunderstruck-2" },
  { id:16, name:"Bonanza Megaways",    badge:"NEW",  img:c(4), gameUrl:"https://www.crazygames.com/embed/bonanza-megaways" },
  { id:17, name:"Razor Shark",         badge:"HOT",  img:c(5), gameUrl:"https://www.crazygames.com/embed/razor-shark" },
  { id:18, name:"Money Train 2",       badge:"LIVE", img:c(6), gameUrl:"https://www.crazygames.com/embed/money-train-2" },
  { id:19, name:"Jammin Jars",         badge:"HOT",  img:c(7), gameUrl:"https://www.crazygames.com/embed/jammin-jars" },
  { id:20, name:"Primal Megaways",     badge:"NEW",  img:c(8), gameUrl:"https://www.crazygames.com/embed/primal-megaways" },
  { id:21, name:"Rise of Merlin",      badge:"HOT",  img:c(9), gameUrl:"https://www.crazygames.com/embed/rise-of-merlin" },
  { id:22, name:"Pirate Gold",         badge:"LIVE", img:c(0), gameUrl:"https://www.crazygames.com/embed/pirate-gold" },
];

// ── LIVE CASINO ──────────────────────────────────────────────────
export const liveCasinoGames = [
  { id:1,  name:"Teen Patti",          badge:"LIVE", img:c(0), gameUrl:"https://www.crazygames.com/embed/teen-patti" },
  { id:2,  name:"Roulette",            badge:"LIVE", img:c(7), gameUrl:"https://www.crazygames.com/embed/roulette" },
  { id:3,  name:"Dragon Tiger",        badge:"LIVE", img:c(4), gameUrl:"https://www.crazygames.com/embed/dragon-tiger" },
  { id:4,  name:"Andar Bahar",         badge:"LIVE", img:c(5), gameUrl:"https://www.crazygames.com/embed/andar-bahar" },
  { id:5,  name:"Sic Bo",              badge:"LIVE", img:c(8), gameUrl:"https://www.crazygames.com/embed/sic-bo" },
  { id:6,  name:"Lucky 7",             badge:"HOT",  img:c(1), gameUrl:"https://www.crazygames.com/embed/lucky-7" },
  { id:7,  name:"20-20 Poker",         badge:"LIVE", img:c(0), gameUrl:"https://www.crazygames.com/embed/video-poker" },
  { id:8,  name:"Poker 1 Day",         badge:"LIVE", img:c(6), gameUrl:"https://www.crazygames.com/embed/poker" },
  { id:9,  name:"Aviator",             badge:"HOT",  img:c(3), gameUrl:"https://www.crazygames.com/embed/aviator" },
  { id:10, name:"Casino Lobby",        badge:"LIVE", img:c(9), gameUrl:"https://www.crazygames.com/embed/casino" },
  { id:11, name:"Baccarat",            badge:"LIVE", img:c(1), gameUrl:"https://www.crazygames.com/embed/baccarat" },
  { id:12, name:"Blackjack",           badge:"HOT",  img:c(2), gameUrl:"https://www.crazygames.com/embed/blackjack" },
  { id:13, name:"Casino War",          badge:"NEW",  img:c(3), gameUrl:"https://www.crazygames.com/embed/casino-war" },
  { id:14, name:"Hi Lo",               badge:"LIVE", img:c(4), gameUrl:"https://www.crazygames.com/embed/hi-lo" },
  { id:15, name:"Jhandi Munda",        badge:"HOT",  img:c(5), gameUrl:"https://www.crazygames.com/embed/jhandi-munda" },
  { id:16, name:"32 Cards",            badge:"LIVE", img:c(6), gameUrl:"https://www.crazygames.com/embed/32-cards" },
  { id:17, name:"Worli Matka",         badge:"HOT",  img:c(7), gameUrl:"https://www.crazygames.com/embed/matka" },
  { id:18, name:"Muflis Teen Patti",   badge:"NEW",  img:c(8), gameUrl:"https://www.crazygames.com/embed/teen-patti" },
  { id:19, name:"3 Card Judgement",    badge:"HOT",  img:c(9), gameUrl:"https://www.crazygames.com/embed/3-card-poker" },
  { id:20, name:"Race 20-20",          badge:"LIVE", img:c(0), gameUrl:"https://www.crazygames.com/embed/race" },
  { id:21, name:"6 Player Poker",      badge:"LIVE", img:c(2), gameUrl:"https://www.crazygames.com/embed/poker" },
  { id:22, name:"29 Card Baccarat",    badge:"HOT",  img:c(1), gameUrl:"https://www.crazygames.com/embed/baccarat" },
];

// ── FANTASY GAMES ────────────────────────────────────────────────
export const fantasyGames = [
  { id:1,  name:"Fantasy Cricket",     badge:"HOT",  img:c(4), gameUrl:"https://www.crazygames.com/embed/cricket-world-cup" },
  { id:2,  name:"Fantasy Football",    badge:"LIVE", img:c(5), gameUrl:"https://www.crazygames.com/embed/football-legends" },
  { id:3,  name:"Fantasy Kabaddi",     badge:"NEW",  img:c(6), gameUrl:"https://www.crazygames.com/embed/kabaddi" },
  { id:4,  name:"Fantasy Basketball",  badge:"HOT",  img:c(7), gameUrl:"https://www.crazygames.com/embed/basketball-stars" },
  { id:5,  name:"Fantasy Hockey",      badge:"LIVE", img:c(8), gameUrl:"https://www.crazygames.com/embed/ice-hockey" },
  { id:6,  name:"Fantasy Baseball",    badge:"HOT",  img:c(9), gameUrl:"https://www.crazygames.com/embed/baseball" },
  { id:7,  name:"IPL Fantasy",         badge:"HOT",  img:c(0), gameUrl:"https://www.crazygames.com/embed/cricket-world-cup" },
  { id:8,  name:"T20 World Cup",       badge:"LIVE", img:c(1), gameUrl:"https://www.crazygames.com/embed/cricket-t20" },
  { id:9,  name:"ODI Fantasy",         badge:"LIVE", img:c(2), gameUrl:"https://www.crazygames.com/embed/cricket-world-cup" },
  { id:10, name:"Test Match Fantasy",  badge:"NEW",  img:c(3), gameUrl:"https://www.crazygames.com/embed/cricket-t20" },
  { id:11, name:"Grand League",        badge:"HOT",  img:c(4), gameUrl:"https://www.crazygames.com/embed/cricket-world-cup" },
  { id:12, name:"Small League",        badge:"LIVE", img:c(5), gameUrl:"https://www.crazygames.com/embed/football-legends" },
  { id:13, name:"Head to Head",        badge:"HOT",  img:c(6), gameUrl:"https://www.crazygames.com/embed/basketball-stars" },
  { id:14, name:"Mega Contest",        badge:"NEW",  img:c(7), gameUrl:"https://www.crazygames.com/embed/cricket-world-cup" },
  { id:15, name:"Practice Contest",    badge:"LIVE", img:c(8), gameUrl:"https://www.crazygames.com/embed/cricket-t20" },
  { id:16, name:"Pro Kabaddi League",  badge:"HOT",  img:c(9), gameUrl:"https://www.crazygames.com/embed/kabaddi" },
  { id:17, name:"NBA Fantasy",         badge:"HOT",  img:c(0), gameUrl:"https://www.crazygames.com/embed/basketball-stars" },
  { id:18, name:"EPL Fantasy",         badge:"LIVE", img:c(1), gameUrl:"https://www.crazygames.com/embed/football-legends" },
  { id:19, name:"Champions League",    badge:"HOT",  img:c(2), gameUrl:"https://www.crazygames.com/embed/penalty-shootout" },
  { id:20, name:"World Cup Fantasy",   badge:"NEW",  img:c(3), gameUrl:"https://www.crazygames.com/embed/football-masters" },
  { id:21, name:"Daily Fantasy",       badge:"HOT",  img:c(4), gameUrl:"https://www.crazygames.com/embed/cricket-world-cup" },
  { id:22, name:"Champions Trophy",    badge:"LIVE", img:c(5), gameUrl:"https://www.crazygames.com/embed/cricket-t20" },
];
