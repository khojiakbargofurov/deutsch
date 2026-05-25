import { useState, useCallback, useEffect } from "react";

/* ─────────────── DATA ─────────────── */
const TIPS = [
  {
    number: "01", icon: "💬", title: "Xatolardan qo'rqma",
    short: "Xato qilish — o'rganishning bir qismi. Gapira boshlash eng muhimi!",
    detail: "Har bir so'zni mukammal talaffuz qilishga harakat qilma. Asosiysi — gapirish! 'Ich gehen morgen in der Markt' desang ham — tushuniladi. Vaqt o'tishi bilan o'z-o'zidan to'g'rilanadi."
  },
  {
    number: "02", icon: "📚", title: "Mustahkam asos yasat",
    short: "Asosiy so'zlar va grammatikani o'rgan — der/die/das, fe'llar, olmoshlar.",
    detail: "Barcha tartibsiz fe'llarni yod olishning hojati yo'q. Muhim narsalar: artiklar, olmoshlar, hozirgi zamon fe'llari, modal fe'llar va oddiy gap qurilishi."
  },
  {
    number: "03", icon: "🎧", title: "Tinglash va taqlid qil",
    short: "Podcast, video, qo'shiq tinglash — so'ng eshitganingni takrorla.",
    detail: "Gapni to'xtatib, baland ovozda takrorla. Ritm, urg'u va talaffuzni taqlid qil. Musiqa o'rganishga o'xshaydi — ko'p eshitsang, grammatikani bilmasdan ham aytib bera olasan."
  },
  {
    number: "04", icon: "🗣️", title: "Baland ovozda mashq qil",
    short: "Uyda yolg'iz bo'lsang ham — nemischa gapir! O'zingga gapir.",
    detail: "Ko'rayotganing, qilayotganing haqida nemischa gapir. O'zingni yozib ol va tinglang — qayerda qiynalayotganingni tezda payqaysan."
  },
  {
    number: "05", icon: "📱", title: "Nemischani kundalik hayotga kirit",
    short: "Telefon tilini nemischaga o'zgar, nemis video/musiqa ko'r.",
    detail: "Ertalab — nemischa YouTube. Yo'lda — podcast. Kechqurun — bolalar kitobini o'qi. Xarid ro'yxatini nemischa yoz. Nemischa 'fan' emas, hayotning bir qismi bo'lsin!"
  },
];

const VOCAB = {
  Verben: [
    { de: "sein", uz: "bo'lmoq" }, { de: "haben", uz: "ega bo'lmoq" }, { de: "werden", uz: "bo'lmoq (kelajak)" },
    { de: "können", uz: "qila olmoq" }, { de: "müssen", uz: "kerak bo'lmoq" }, { de: "wollen", uz: "xohlamoq" },
    { de: "dürfen", uz: "ruxsat bo'lmoq" }, { de: "machen", uz: "qilmoq" }, { de: "sagen", uz: "aytmoq" },
    { de: "gehen", uz: "bormoq / yurmoq" }, { de: "kommen", uz: "kelmoq" }, { de: "geben", uz: "bermoq" },
    { de: "sehen", uz: "ko'rmoq" }, { de: "stehen", uz: "turmoq" }, { de: "finden", uz: "topmoq" },
    { de: "bleiben", uz: "qolmoq" }, { de: "liegen", uz: "yotmoq" }, { de: "nehmen", uz: "olmoq" },
    { de: "wissen", uz: "bilmoq" }, { de: "leben", uz: "yashmoq" }, { de: "bringen", uz: "olib kelmoq" },
    { de: "essen", uz: "yemoq" }, { de: "trinken", uz: "ichmoq" }, { de: "sprechen", uz: "gapirmoq" },
    { de: "schreiben", uz: "yozmoq" }, { de: "lesen", uz: "o'qimoq" }, { de: "fahren", uz: "haydamoq / bormoq" },
    { de: "kaufen", uz: "sotib olmoq" }, { de: "helfen", uz: "yordam bermoq" }, { de: "lernen", uz: "o'rganmoq" },
    { de: "fragen", uz: "so'ramoq" }, { de: "antworten", uz: "javob bermoq" }, { de: "spielen", uz: "o'ynamoq" },
    { de: "arbeiten", uz: "ishlashmoq" }, { de: "denken", uz: "o'ylamoq" }, { de: "glauben", uz: "ishonmoq" },
    { de: "brauchen", uz: "kerak bo'lmoq" }, { de: "suchen", uz: "qidirmoq" }, { de: "zeigen", uz: "ko'rsatmoq" },
    { de: "versuchen", uz: "urinmoq" }, { de: "tragen", uz: "ko'tarmoq / kiymoq" }, { de: "halten", uz: "ushlamoq" },
    { de: "öffnen", uz: "ochmoq" }, { de: "schließen", uz: "yopmoq" }, { de: "beginnen", uz: "boshlamoq" },
    { de: "enden", uz: "tugamoq" }, { de: "laufen", uz: "yugurmoq" }, { de: "sitzen", uz: "o'tirmoq" },
    { de: "schlafen", uz: "uxlamoq" }, { de: "wohnen", uz: "yashmoq (turmoq)" }, { de: "heißen", uz: "atalmoq / ismim" },
    { de: "bekommen", uz: "olmoq / qabul qilmoq" }, { de: "verlieren", uz: "yo'qotmoq" }, { de: "gewinnen", uz: "yutmoq" },
    { de: "fühlen", uz: "his qilmoq" }, { de: "treffen", uz: "uchrashmoq" }, { de: "kennen", uz: "tanish bo'lmoq" },
    { de: "hören", uz: "eshitmoq" }, { de: "erklären", uz: "tushuntirmoq" }, { de: "feiern", uz: "nishonlamoq" },
    { de: "vergessen", uz: "unutmoq" }, { de: "erinnern", uz: "eslamoq" }, { de: "bedeuten", uz: "anglatmoq" },
    { de: "zahlen", uz: "to'lamoq" }, { de: "schicken", uz: "yubormoq" }, { de: "bestellen", uz: "buyurtma bermoq" },
    { de: "kochen", uz: "pishirmoq" }, { de: "backen", uz: "non/tort pishirmoq" }, { de: "tanzen", uz: "raqsga tushmoq" },
    { de: "malen", uz: "rasm chizmoq" }, { de: "reparieren", uz: "ta'mirlashmoq" }, { de: "wechseln", uz: "almashtirmoq" },
  ],
  Nomen: [
    { de: "der Mensch", uz: "inson" }, { de: "die Frau", uz: "ayol" }, { de: "der Mann", uz: "erkak" },
    { de: "das Kind", uz: "bola" }, { de: "das Haus", uz: "uy" }, { de: "die Wohnung", uz: "kvartira" },
    { de: "das Zimmer", uz: "xona" }, { de: "die Tür", uz: "eshik" }, { de: "das Fenster", uz: "deraza" },
    { de: "der Tisch", uz: "stol" }, { de: "der Stuhl", uz: "stul" }, { de: "das Bett", uz: "karavot" },
    { de: "das Sofa", uz: "divan" }, { de: "der Schrank", uz: "shkaf" }, { de: "die Küche", uz: "oshxona" },
    { de: "das Bad", uz: "hammom" }, { de: "der Garten", uz: "bog'" }, { de: "die Straße", uz: "ko'cha" },
    { de: "der Weg", uz: "yo'l" }, { de: "die Stadt", uz: "shahar" }, { de: "das Dorf", uz: "qishloq" },
    { de: "das Auto", uz: "mashina" }, { de: "der Bus", uz: "avtobus" }, { de: "der Zug", uz: "poyezd" },
    { de: "das Fahrrad", uz: "velosiped" }, { de: "das Essen", uz: "ovqat" }, { de: "das Brot", uz: "non" },
    { de: "das Wasser", uz: "suv" }, { de: "der Kaffee", uz: "qahva" }, { de: "der Tee", uz: "choy" },
    { de: "das Fleisch", uz: "go'sht" }, { de: "das Gemüse", uz: "sabzavot" }, { de: "das Obst", uz: "meva" },
    { de: "der Apfel", uz: "olma" }, { de: "die Banane", uz: "banan" }, { de: "die Kartoffel", uz: "kartoshka" },
    { de: "der Reis", uz: "guruch" }, { de: "die Nudeln", uz: "makaron" }, { de: "die Milch", uz: "sut" },
    { de: "der Käse", uz: "pishloq" }, { de: "das Ei", uz: "tuxum" }, { de: "die Arbeit", uz: "ish" },
    { de: "die Schule", uz: "maktab" }, { de: "die Universität", uz: "universitet" }, { de: "der Lehrer", uz: "o'qituvchi" },
    { de: "der Schüler", uz: "o'quvchi" }, { de: "die Sprache", uz: "til" }, { de: "das Wort", uz: "so'z" },
    { de: "der Satz", uz: "gap / jumla" }, { de: "das Buch", uz: "kitob" }, { de: "die Zeitung", uz: "gazeta" },
    { de: "der Brief", uz: "xat" }, { de: "der Computer", uz: "kompyuter" }, { de: "das Telefon", uz: "telefon" },
    { de: "die Zeit", uz: "vaqt" }, { de: "der Tag", uz: "kun" }, { de: "die Nacht", uz: "tun" },
    { de: "der Morgen", uz: "ertalab" }, { de: "der Abend", uz: "kechqurun" }, { de: "der Nachmittag", uz: "tushdan keyin" },
    { de: "das Geld", uz: "pul" }, { de: "der Preis", uz: "narx" }, { de: "die Hilfe", uz: "yordam" },
    { de: "das Problem", uz: "muammo" }, { de: "der Fehler", uz: "xato" }, { de: "der Name", uz: "ism" },
    { de: "der Geburtstag", uz: "tug'ilgan kun" }, { de: "der Freund", uz: "do'st (erkak)" }, { de: "die Freundin", uz: "do'st (ayol)" },
    { de: "die Familie", uz: "oila" }, { de: "der Vater", uz: "ota" }, { de: "die Mutter", uz: "ona" },
    { de: "der Bruder", uz: "aka / uka" }, { de: "die Schwester", uz: "opa / singil" }, { de: "der Sohn", uz: "o'g'il" },
    { de: "die Tochter", uz: "qiz (farzand)" }, { de: "der Hund", uz: "it" }, { de: "die Katze", uz: "mushuk" },
    { de: "das Wetter", uz: "ob-havo" }, { de: "die Sonne", uz: "quyosh" }, { de: "der Regen", uz: "yomg'ir" },
    { de: "der Schnee", uz: "qor" }, { de: "der Wind", uz: "shamol" }, { de: "der Baum", uz: "daraxt" },
    { de: "die Blume", uz: "gul" }, { de: "der Berg", uz: "tog'" }, { de: "der See", uz: "ko'l" },
    { de: "der Fluss", uz: "daryo" }, { de: "das Land", uz: "mamlakat" }, { de: "die Musik", uz: "musiqa" },
    { de: "das Lied", uz: "qo'shiq" }, { de: "der Film", uz: "film" }, { de: "das Jahr", uz: "yil" },
    { de: "der Monat", uz: "oy" }, { de: "die Woche", uz: "hafta" }, { de: "die Minute", uz: "daqiqa" },
  ],
  Adjektive: [
    { de: "gut", uz: "yaxshi" }, { de: "schlecht", uz: "yomon" }, { de: "groß", uz: "katta" },
    { de: "klein", uz: "kichik" }, { de: "lang", uz: "uzun" }, { de: "kurz", uz: "qisqa" },
    { de: "schön", uz: "chiroyli" }, { de: "hässlich", uz: "xunuk" }, { de: "neu", uz: "yangi" },
    { de: "alt", uz: "eski / keksa" }, { de: "kalt", uz: "sovuq" }, { de: "warm", uz: "iliq" },
    { de: "heiß", uz: "issiq" }, { de: "teuer", uz: "qimmat" }, { de: "billig", uz: "arzon" },
    { de: "schnell", uz: "tez" }, { de: "langsam", uz: "sekin" }, { de: "leicht", uz: "oson / yengil" },
    { de: "schwer", uz: "og'ir / qiyin" }, { de: "laut", uz: "baland (ovoz)" }, { de: "leise", uz: "past (ovoz)" },
    { de: "hell", uz: "yorqin" }, { de: "dunkel", uz: "qorong'i" }, { de: "richtig", uz: "to'g'ri" },
    { de: "falsch", uz: "noto'g'ri" }, { de: "voll", uz: "to'la" }, { de: "leer", uz: "bo'sh" },
    { de: "nah", uz: "yaqin" }, { de: "fern", uz: "uzoq" }, { de: "jung", uz: "yosh" },
    { de: "modern", uz: "zamonaviy" }, { de: "dick", uz: "yo'g'on / semiz" }, { de: "dünn", uz: "ingichka / ozg'in" },
    { de: "breit", uz: "keng" }, { de: "eng", uz: "tor" }, { de: "tief", uz: "chuqur" },
    { de: "hoch", uz: "baland" }, { de: "sauber", uz: "toza" }, { de: "schmutzig", uz: "iflos" },
    { de: "süß", uz: "shirin" }, { de: "sauer", uz: "nordon" }, { de: "bitter", uz: "achchiq" },
    { de: "frisch", uz: "yangi / fresh" }, { de: "nass", uz: "ho'l" }, { de: "trocken", uz: "quruq" },
    { de: "rund", uz: "yumaloq" }, { de: "eckig", uz: "burchakli" }, { de: "lecker", uz: "mazali" },
    { de: "bekannt", uz: "mashhur / tanish" }, { de: "bequem", uz: "qulay" }, { de: "freundlich", uz: "do'stona" },
    { de: "froh", uz: "xursand" }, { de: "traurig", uz: "g'amgin" }, { de: "wichtig", uz: "muhim" },
    { de: "einfach", uz: "oddiy / oson" }, { de: "schwierig", uz: "qiyin" }, { de: "müde", uz: "charchagan" },
    { de: "wach", uz: "uyg'oq" }, { de: "nett", uz: "yoqimli" }, { de: "böse", uz: "yomon / g'azablangan" },
    { de: "interessant", uz: "qiziqarli" }, { de: "langweilig", uz: "zerikarli" }, { de: "spannend", uz: "hayajonli" },
    { de: "möglich", uz: "mumkin" }, { de: "unmöglich", uz: "mumkin emas" }, { de: "gesund", uz: "sog'lom" },
    { de: "krank", uz: "kasal" }, { de: "reich", uz: "boy" }, { de: "arm", uz: "kambag'al" },
    { de: "klar", uz: "aniq" }, { de: "lustig", uz: "kulgili" }, { de: "ernst", uz: "jiddiy" },
    { de: "vorsichtig", uz: "ehtiyotkor" }, { de: "gefährlich", uz: "xavfli" }, { de: "sicher", uz: "xavfsiz" },
    { de: "stark", uz: "kuchli" }, { de: "schwach", uz: "kuchsiz" }, { de: "kühl", uz: "salqin" },
    { de: "glatt", uz: "silliq" }, { de: "direkt", uz: "to'g'ridan-to'g'ri" }, { de: "pünktlich", uz: "o'z vaqtida" },
    { de: "spät", uz: "kech" }, { de: "früh", uz: "erta" }, { de: "schmal", uz: "tor" },
    { de: "clever", uz: "aqlli" }, { de: "dumm", uz: "ahmoq" }, { de: "fest", uz: "qattiq" },
    { de: "weich", uz: "yumshoq" }, { de: "scharf", uz: "o'tkir" }, { de: "normal", uz: "oddiy / normal" },
  ],
  Adverbien: [
    { de: "jetzt", uz: "hozir" }, { de: "hier", uz: "bu yerda" }, { de: "dort", uz: "u yerda" },
    { de: "heute", uz: "bugun" }, { de: "morgen", uz: "ertaga" }, { de: "gestern", uz: "kecha" },
    { de: "immer", uz: "doimo" }, { de: "nie", uz: "hech qachon" }, { de: "oft", uz: "ko'pincha" },
    { de: "selten", uz: "kamdan-kam" }, { de: "manchmal", uz: "ba'zan" }, { de: "vielleicht", uz: "ehtimol" },
    { de: "leider", uz: "afsuski" }, { de: "gern", uz: "mamnuniyat bilan" }, { de: "sehr", uz: "juda" },
    { de: "auch", uz: "ham" }, { de: "schon", uz: "allaqachon" }, { de: "noch", uz: "hali" },
    { de: "dann", uz: "keyin" }, { de: "danach", uz: "undan keyin" }, { de: "davor", uz: "undan oldin" },
    { de: "vorher", uz: "oldin" }, { de: "nachher", uz: "keyin (shu narsadan keyin)" },
    { de: "oben", uz: "yuqorida" }, { de: "unten", uz: "pastda" }, { de: "drinnen", uz: "ichkarida" },
    { de: "draußen", uz: "tashqarida" }, { de: "überall", uz: "hamma joyda" }, { de: "nirgendwo", uz: "hech qayerda" },
    { de: "fast", uz: "deyarli" }, { de: "ungefähr", uz: "taxminan" }, { de: "deshalb", uz: "shuning uchun" },
    { de: "trotzdem", uz: "shunga qaramay" }, { de: "wirklich", uz: "haqiqatan" }, { de: "übrigens", uz: "aytgancha" },
    { de: "sowieso", uz: "baribir" }, { de: "bald", uz: "tez orada" }, { de: "später", uz: "keyinroq" },
    { de: "sofort", uz: "darhol" }, { de: "gleich", uz: "hoziroq" }, { de: "wieder", uz: "yana" },
    { de: "damals", uz: "o'sha paytda" }, { de: "anfangs", uz: "dastlab" }, { de: "bisher", uz: "hozirgacha" },
    { de: "einmal", uz: "bir marta" }, { de: "zweimal", uz: "ikki marta" }, { de: "jedenfalls", uz: "har holda" },
    { de: "immerhin", uz: "baribir / hech bo'lmasa" }, { de: "beinahe", uz: "deyarli" },
    { de: "völlig", uz: "to'liq / butunlay" }, { de: "natürlich", uz: "albatta" }, { de: "bestimmt", uz: "aniq / albatta" },
    { de: "endlich", uz: "nihoyat" }, { de: "zumindest", uz: "kamida" }, { de: "mindestens", uz: "kamida (miqdor)" },
    { de: "höchstens", uz: "ko'pi bilan" }, { de: "keineswegs", uz: "hech qachon emas" },
    { de: "notfalls", uz: "zarur bo'lsa" }, { de: "ansonsten", uz: "aks holda" }, { de: "weiterhin", uz: "bundan keyin ham" },
  ],
};

const CAT_META = {
  Verben: { label: "Fe'llar", accent: "#e63946", bg: "rgba(230, 57, 70, 0.08)" },
  Nomen: { label: "Otlar", accent: "#f4d03f", bg: "rgba(244, 208, 63, 0.08)" },
  Adjektive: { label: "Sifatlar", accent: "#2ecc71", bg: "rgba(46, 204, 113, 0.08)" },
  Adverbien: { label: "Ravishlar", accent: "#3498db", bg: "rgba(52, 152, 219, 0.08)" },
};

/* ─────────────── HELPERS ─────────────── */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build 20 unique questions — each word used AT MOST once
function buildQuiz(category, favorites = []) {
  const pool = category === "all"
    ? Object.entries(VOCAB).flatMap(([cat, ws]) => ws.map(w => ({ ...w, cat })))
    : category === "favorites"
      ? Object.entries(VOCAB).flatMap(([cat, ws]) => ws.map(w => ({ ...w, cat }))).filter(w => favorites.includes(w.de))
      : VOCAB[category].map(w => ({ ...w, cat: category }));

  const shuffled = shuffle(pool);
  const selected = shuffled.slice(0, Math.min(20, shuffled.length));
  const fullPool = Object.entries(VOCAB).flatMap(([cat, ws]) => ws.map(w => ({ ...w, cat })));

  return selected.map(word => {
    const distractors = shuffle(fullPool.filter(w => w.de !== word.de)).slice(0, 3);
    const options = shuffle([word, ...distractors]);
    return { word, options };
  });
}

/* ─────────────── STYLES ─────────────── */
const S = {
  page: {
    background: "var(--bg)", minHeight: "100vh", color: "var(--color)",
    fontFamily: "'DM Sans', sans-serif"
  },
  nav: {
    position: "sticky", top: 0, zIndex: 100, background: "var(--nav-bg)",
    backdropFilter: "blur(10px)", borderBottom: "1px solid var(--border-color)",
    padding: "0 16px", display: "flex", alignItems: "center",
    justifyContent: "space-between", height: 56
  },
  navLogo: { display: "flex", alignItems: "center", gap: 10, flexShrink: 0 },
  navFlag: {
    width: 28, height: 28, borderRadius: 7,
    background: "linear-gradient(135deg,#000 33%,#e63946 33% 66%,#f4d03f 66%)"
  },
  navTitle: {
    fontFamily: "'Playfair Display',serif", fontWeight: 700,
    fontSize: 17, color: "var(--color)", whiteSpace: "nowrap"
  },
  inner: { maxWidth: 720, margin: "0 auto", padding: "40px 16px 80px" },
};

/* ─────────────── NAV ITEMS ─────────────── */
const NAV_ITEMS = [
  { id: "home", label: "Bosh sahifa" },
  { id: "tips", label: "Maslahatlar" },
  { id: "vocab", label: "Lug'at" },
  { id: "quizSetup", label: "Quiz" },
  { id: "matchSetup", label: "So'z Top" },
  { id: "stats", label: "Natijalar" },
  { id: "spellingSetup", label: "Yozish" },
];

/* ═══════════════════════════════════════
   ROOT COMPONENT
═══════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  // Theme state
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });

  useEffect(() => {
    document.body.classList.remove("dark-theme", "light-theme");
    document.body.classList.add(`${theme}-theme`);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(t => {
      const next = t === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      return next;
    });
  }, []);

  const [playingWord, setPlayingWord] = useState(null);

  const playAudio = useCallback((word) => {
    if (!word) return;
    setPlayingWord(word);
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(word)}&tl=de&client=tw-ob`;
    const audio = new Audio(ttsUrl);
    audio.addEventListener("ended", () => setPlayingWord(null));
    audio.addEventListener("error", () => setPlayingWord(null));
    audio.play().catch(() => setPlayingWord(null));
  }, []);

  // quiz state
  const [quizCat, setQuizCat] = useState("all");
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [chosen, setChosen] = useState(null); // chosen option
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  // tips
  const [tipOpen, setTipOpen] = useState(null);

  // vocab
  const [vocabCat, setVocabCat] = useState("Verben");
  const [vocabSearch, setVocabSearch] = useState("");
  const [flash, setFlash] = useState(false);
  const [flashIdx, setFlashIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // Favorites states
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((deWord) => {
    setFavorites(prev => {
      if (prev.includes(deWord)) return prev.filter(w => w !== deWord);
      return [...prev, deWord];
    });
  }, []);

  // Statistics states
  const [quizHistory, setQuizHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("quizHistory");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [learntWords, setLearntWords] = useState(() => {
    try {
      const saved = localStorage.getItem("learntWords");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [fastestMatch, setFastestMatch] = useState(() => {
    try {
      const saved = localStorage.getItem("fastestMatch");
      return saved ? parseInt(saved, 10) || 999999 : 999999;
    } catch {
      return 999999;
    }
  });

  useEffect(() => {
    localStorage.setItem("quizHistory", JSON.stringify(quizHistory));
  }, [quizHistory]);

  useEffect(() => {
    localStorage.setItem("learntWords", JSON.stringify(learntWords));
  }, [learntWords]);

  useEffect(() => {
    localStorage.setItem("fastestMatch", fastestMatch.toString());
  }, [fastestMatch]);

  // Matching game states
  const [matchCat, setMatchCat] = useState("all");
  const [matchCards, setMatchCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [wrongCardId, setWrongCardId] = useState(null);
  const [matchedIds, setMatchedIds] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [matchStartTime, setMatchStartTime] = useState(0);
  const [matchElapsedTime, setMatchElapsedTime] = useState(0);
  const [matchDone, setMatchDone] = useState(false);

  // Spelling practice states
  const [spellingCat, setSpellingCat] = useState("all");
  const [spellingQuestions, setSpellingQuestions] = useState([]);
  const [spellingIdx, setSpellingIdx] = useState(0);
  const [spellingInput, setSpellingInput] = useState("");
  const [spellingIsWrong, setSpellingIsWrong] = useState(false);
  const [spellingCorrectWord, setSpellingCorrectWord] = useState(false);
  const [spellingAttempts, setSpellingAttempts] = useState(0);
  const [spellingStartTime, setSpellingStartTime] = useState(0);
  const [spellingElapsedTime, setSpellingElapsedTime] = useState(0);
  const [spellingDone, setSpellingDone] = useState(false);

  const navigate = useCallback((p) => {
    setPage(p); setMenuOpen(false);
  }, []);

  // timer effect for matching game
  useEffect(() => {
    let timer;
    if (page === "match" && !matchDone) {
      timer = setInterval(() => {
        setMatchElapsedTime(Math.floor((Date.now() - matchStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [page, matchDone, matchStartTime]);

  // timer effect for spelling game
  useEffect(() => {
    let timer;
    if (page === "spelling" && !spellingDone) {
      timer = setInterval(() => {
        setSpellingElapsedTime(Math.floor((Date.now() - spellingStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [page, spellingDone, spellingStartTime]);

  const startMatchingGame = useCallback(() => {
    const pool = matchCat === "all"
      ? Object.entries(VOCAB).flatMap(([cat, ws]) => ws.map(w => ({ ...w, cat })))
      : matchCat === "favorites"
        ? Object.entries(VOCAB).flatMap(([cat, ws]) => ws.map(w => ({ ...w, cat }))).filter(w => favorites.includes(w.de))
        : VOCAB[matchCat].map(w => ({ ...w, cat: matchCat }));

    const shuffled = shuffle(pool).slice(0, 5);
    
    const cards = [];
    shuffled.forEach((w, i) => {
      cards.push({
        id: `de_${i}`,
        text: w.de,
        matchWord: w.de,
        type: "de"
      });
      cards.push({
        id: `uz_${i}`,
        text: w.uz,
        matchWord: w.de,
        type: "uz"
      });
    });

    setMatchCards(shuffle(cards));
    setSelectedCard(null);
    setWrongCardId(null);
    setMatchedIds([]);
    setAttempts(0);
    setMatchStartTime(Date.now());
    setMatchElapsedTime(0);
    setMatchDone(false);
    setPage("match");
  }, [matchCat, favorites]);

  const handleCardClick = (card) => {
    if (matchedIds.includes(card.id) || wrongCardId) return;

    if (!selectedCard) {
      setSelectedCard(card);
      return;
    }

    if (selectedCard.id === card.id) {
      setSelectedCard(null);
      return;
    }

    if (selectedCard.type !== card.type && selectedCard.matchWord === card.matchWord) {
      const newMatched = [...matchedIds, selectedCard.id, card.id];
      setMatchedIds(newMatched);
      setSelectedCard(null);

      if (newMatched.length === 10) {
        setMatchDone(true);
        const seconds = Math.floor((Date.now() - matchStartTime) / 1000);
        setFastestMatch(prev => Math.min(prev, seconds));
      }
    } else {
      setWrongCardId(card.id);
      setSelectedCard(null);
      setAttempts(a => a + 1);

      setTimeout(() => {
        setWrongCardId(null);
      }, 400);
    }
  };

  const startSpellingGame = useCallback(() => {
    const pool = spellingCat === "all"
      ? Object.entries(VOCAB).flatMap(([cat, ws]) => ws.map(w => ({ ...w, cat })))
      : spellingCat === "favorites"
        ? Object.entries(VOCAB).flatMap(([cat, ws]) => ws.map(w => ({ ...w, cat }))).filter(w => favorites.includes(w.de))
        : VOCAB[spellingCat].map(w => ({ ...w, cat: spellingCat }));

    const shuffled = shuffle(pool).slice(0, 10);
    setSpellingQuestions(shuffled);
    setSpellingIdx(0);
    setSpellingInput("");
    setSpellingIsWrong(false);
    setSpellingCorrectWord(false);
    setSpellingAttempts(0);
    setSpellingStartTime(Date.now());
    setSpellingElapsedTime(0);
    setSpellingDone(false);
    setPage("spelling");
  }, [spellingCat, favorites]);

  const handleSpellingChange = (e) => {
    const val = e.target.value;
    setSpellingInput(val);
    setSpellingIsWrong(false);

    const correct = spellingQuestions[spellingIdx]?.de || "";
    if (val.trim().toLowerCase() === correct.toLowerCase()) {
      setSpellingCorrectWord(true);
      setTimeout(() => {
        if (spellingIdx + 1 >= spellingQuestions.length) {
          setSpellingDone(true);
        } else {
          setSpellingIdx(i => i + 1);
          setSpellingInput("");
          setSpellingCorrectWord(false);
        }
      }, 800);
    } else if (val.length > 0 && !correct.toLowerCase().startsWith(val.toLowerCase())) {
      setSpellingIsWrong(true);
      setSpellingAttempts(a => a + 1);
    }
  };

  const handleUmlautClick = (char) => {
    const val = spellingInput + char;
    setSpellingInput(val);
    setSpellingIsWrong(false);

    const correct = spellingQuestions[spellingIdx]?.de || "";
    if (val.trim().toLowerCase() === correct.toLowerCase()) {
      setSpellingCorrectWord(true);
      setTimeout(() => {
        if (spellingIdx + 1 >= spellingQuestions.length) {
          setSpellingDone(true);
        } else {
          setSpellingIdx(i => i + 1);
          setSpellingInput("");
          setSpellingCorrectWord(false);
        }
      }, 800);
    } else if (!correct.toLowerCase().startsWith(val.toLowerCase())) {
      setSpellingIsWrong(true);
      setSpellingAttempts(a => a + 1);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const startQuiz = useCallback(() => {
    const qs = buildQuiz(quizCat, favorites);
    setQuestions(qs);
    setQIdx(0); setChosen(null); setScore(0); setDone(false);
    setPage("quiz");
  }, [quizCat, favorites]);

  const pick = (opt) => {
    if (chosen) return;
    setChosen(opt);
    if (opt.de === questions[qIdx].word.de) setScore(s => s + 1);
  };

  const next = () => {
    if (qIdx + 1 >= questions.length) {
      setDone(true);
      const finalScore = score + (chosen?.de === questions[qIdx].word.de ? 1 : 0);
      setQuizHistory(prev => [...prev, { score: finalScore, total: questions.length, date: new Date().toLocaleDateString("uz-UZ") }].slice(-8));
    }
    else { setQIdx(i => i + 1); setChosen(null); }
  };

  const filtered = (vocabCat === "favorites"
    ? Object.entries(VOCAB).flatMap(([cat, ws]) => ws.map(w => ({ ...w, cat }))).filter(w => favorites.includes(w.de))
    : VOCAB[vocabCat] || []
  ).filter(w =>
    w.de.toLowerCase().includes(vocabSearch.toLowerCase()) ||
    w.uz.toLowerCase().includes(vocabSearch.toLowerCase())
  );

  const allCount = Object.values(VOCAB).reduce((s, a) => s + a.length, 0);

  return (
    <div style={S.page}>

      {/* ── NAV ── */}
      <nav style={S.nav}>
        <div style={S.navLogo} onClick={() => navigate("home")} role="button">
          <div style={S.navFlag} />
          <span style={S.navTitle}>Deutsch Hub</span>
        </div>

        {/* Desktop links */}
        <div className="desktop-nav">
          {NAV_ITEMS.map(n => (
            <button key={n.id} className={`nb nl ${page === n.id || (n.id === "quizSetup" && page === "quiz") ? "act" : ""}`}
              onClick={() => navigate(n.id)}>{n.label}</button>
          ))}
        </div>

        {/* Mobile menu utilities */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button className="theme-toggle-btn mobile-toggle" onClick={toggleTheme} title="Mavzuni o'zgartirish">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {/* Mobile hamburger */}
          <button className="nb mobile-menu-btn ham" onClick={() => setMenuOpen(m => !m)}>
            <span style={menuOpen ? { transform: "rotate(45deg) translate(5px,5px)" } : {}} />
            <span style={menuOpen ? { opacity: 0 } : {}} />
            <span style={menuOpen ? { transform: "rotate(-45deg) translate(5px,-5px)" } : {}} />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="mob-menu">
          {NAV_ITEMS.map(n => (
            <button key={n.id}
              className={`nb mob-nl ${page === n.id || (n.id === "quizSetup" && page === "quiz") ? "act" : ""}`}
              onClick={() => navigate(n.id)}>{n.label}</button>
          ))}
        </div>
      )}

      {/* ══════════ HOME ══════════ */}
      {page === "home" && (
        <div style={{ ...S.inner }} className="inner-pad">
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{
              display: "inline-block", background: "var(--card-bg)", border: "1px solid var(--border-color)",
              borderRadius: 30, padding: "5px 16px", marginBottom: 22
            }}>
              <span style={{ fontSize: 11, color: "#f4d03f", letterSpacing: 2, textTransform: "uppercase" }}>
                Nemis tili o'rganish platformasi
              </span>
            </div>
            <h1 style={{
              fontFamily: "'Playfair Display',serif", fontWeight: 900,
              fontSize: "clamp(34px,8vw,60px)", lineHeight: 1.1, marginBottom: 18
            }}>
              Fließend<br /><span style={{ color: "#f4d03f" }}>Deutsch</span> sprechen
            </h1>
            <p style={{ fontSize: 15, color: "var(--text-light)", lineHeight: 1.7, maxWidth: 440, margin: "0 auto" }}>
              {allCount}+ so'z, 5 ta muhim maslahat va takrorlashsiz interaktiv quiz — o'zbek tilida nemis tilini o'rgan!
            </p>
          </div>

          <div className="grid-3" style={{ marginBottom: 40 }}>
            {[
              { emoji: "📖", title: "5 ta Maslahat", sub: "Ravon gaplashish uchun yo'riqnoma", go: "tips" },
              { emoji: "📚", title: "Lug'at", sub: `${allCount}+ so'z, 4 kategoriya`, go: "vocab" },
              { emoji: "🧠", title: "Quiz", sub: "Takrorlashsiz 20 ta savol", go: "quizSetup" },
            ].map(item => (
              <div key={item.go} className="home-tile" onClick={() => navigate(item.go)}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>{item.emoji}</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, fontWeight: 700, marginBottom: 6 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{item.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 18, padding: "24px 20px" }}>
            <div style={{ fontSize: 11, color: "#f4d03f", letterSpacing: 2, textTransform: "uppercase", marginBottom: 18 }}>Qisqa xulosa</div>
            {TIPS.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 14, marginBottom: 14, alignItems: "flex-start" }}>
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 900, color: "var(--border-color)", minWidth: 30 }}>{t.number}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{t.icon} {t.title}</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{t.short}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Telegram Bot Promo Card */}
          <div className="tg-promo-card">
            <div className="tg-promo-icon-wrap">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m22 2-7 20-4-9-9-4Z"></path>
                <path d="M22 2 11 13"></path>
              </svg>
            </div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 900, marginBottom: 8 }}>
              Telegram Botimizni Sinab Ko'ring! 🤖
            </h3>
            <p style={{ fontSize: 14, color: "var(--text-light)", lineHeight: 1.6 }}>
              Nemis tilini yo'l-yo'lakay va yanada qiziqarliroq o'rganing. Botimiz orqali har kuni Toshkent vaqti bilan 09:00 da avtomatik yangi so'zlarni oling, interaktiv testlar yeching va guruhlarda tezkor inline qidiruvdan foydalaning!
            </p>
            
            <div className="tg-features-grid">
              <div className="tg-feature-item">
                <span className="tg-feature-emoji">📅</span>
                <div className="tg-feature-title">Kunlik Yangi So'z</div>
                <div className="tg-feature-desc">Har kuni 09:00 da o'zbekcha gap namunalari bilan so'zlar.</div>
              </div>
              <div className="tg-feature-item">
                <span className="tg-feature-emoji">🏆</span>
                <div className="tg-feature-title">Top O'quvchilar</div>
                <div className="tg-feature-desc">Testlarni yechib, eng yaxshi 10 o'quvchi ro'yxatidan joy oling.</div>
              </div>
              <div className="tg-feature-item">
                <span className="tg-feature-emoji">🔍</span>
                <div className="tg-feature-title">Inline Qidiruv</div>
                <div className="tg-feature-desc">Guruhlarda shunchaki @deutch_blitz_bot yozib so'z qidiring.</div>
              </div>
            </div>
            
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <a href="https://t.me/deutch_blitz_bot" target="_blank" rel="noopener noreferrer" className="btn-tg">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m22 2-7 20-4-9-9-4Z"></path>
                  <path d="M22 2 11 13"></path>
                </svg>
                Telegram-da Ochish
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ TIPS ══════════ */}
      {page === "tips" && (
        <div style={S.inner} className="inner-pad">
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,6vw,36px)", fontWeight: 900, marginBottom: 6 }}>
            5 ta Muhim <span style={{ color: "#f4d03f" }}>Maslahat</span>
          </h2>
          <p style={{ fontSize: 13, color: "#555", marginBottom: 32 }}>Nemischa ravon gaplashish uchun asosiy yo'riqnoma</p>

          {TIPS.map((t, i) => (
            <div key={i} className="tip-card" onClick={() => setTipOpen(tipOpen === i ? null : i)}>
              <div style={{ padding: "18px 20px", display: "flex", gap: 16, alignItems: "center" }}>
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 900, color: "#1c1c1c", minWidth: 38 }}>{t.number}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3 }}>{t.icon} {t.title}</div>
                  <div style={{ fontSize: 13, color: "#555", lineHeight: 1.5 }}>{t.short}</div>
                </div>
                <span style={{
                  color: "#333", fontSize: 22, flexShrink: 0,
                  transition: "transform .25s", transform: tipOpen === i ? "rotate(90deg)" : "none"
                }}>›</span>
              </div>
              {tipOpen === i && (
                <div className="tip-detail">
                  {t.detail}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ══════════ VOCAB ══════════ */}
      {page === "vocab" && (
        <div style={S.inner} className="inner-pad">
          <div className="vocab-hdr">
            <div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(24px,5vw,34px)", fontWeight: 900, marginBottom: 4 }}>
                Lug'at <span style={{ color: "#f4d03f" }}>Bazasi</span>
              </h2>
              <p style={{ fontSize: 12, color: "#555" }}>{allCount} so'z • Nemischa → O'zbekcha</p>
            </div>
            <button className="btn-o"
              onClick={() => { setFlash(f => !f); setFlashIdx(0); setFlipped(false); }}>
              {flash ? "📋 Ro'yxat" : "🃏 Flashcard"}
            </button>
          </div>

          {/* Category chips */}
          <div className="chips-row">
            {Object.entries(CAT_META).map(([cat, m]) => (
              <button key={cat}
                className={`chip ${vocabCat === cat ? "chip-act" : ""}`}
                style={vocabCat === cat ? { background: m.accent, borderColor: m.accent, color: "#0d0d0d", fontWeight: 600 } : {}}
                onClick={() => { setVocabCat(cat); setFlashIdx(0); setFlipped(false); setVocabSearch(""); }}>
                {m.label} <span style={{ opacity: .6 }}>({VOCAB[cat].length})</span>
              </button>
            ))}
            <button 
              className={`chip ${vocabCat === "favorites" ? "chip-act" : ""}`}
              style={vocabCat === "favorites" ? { background: "#f1c40f", borderColor: "#f1c40f", color: "#0d0d0d", fontWeight: 600 } : {}}
              onClick={() => { setVocabCat("favorites"); setFlashIdx(0); setFlipped(false); setVocabSearch(""); }}
            >
              🌟 Tanlanganlar <span style={{ opacity: .6 }}>({favorites.length})</span>
            </button>
          </div>

          {/* FLASHCARD MODE */}
          {flash ? (
            filtered.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 18 }}>
                Fleshkarta o'ynash uchun kamida 1 ta so'zni tanlanganlar ⭐ ro'yxatiga qo'shing!
              </div>
            ) : (
              <div>
                <div style={{ textAlign: "center", fontSize: 13, color: "#555", marginBottom: 16 }}>
                  {flashIdx + 1} / {filtered.length} — kartani bosib ag'dar
                </div>
                <div className="flash-wrap" onClick={() => setFlipped(f => !f)}>
                  <div className={`flash-inner ${flipped ? "flipped" : ""}`}>
                    <div className="flash-face flash-front">
                      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", marginBottom: 10, padding: "0 10px" }}>
                        <span style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: 1.5, textTransform: "uppercase" }}>Nemischa</span>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <button 
                            className={`speaker-btn ${playingWord === filtered[flashIdx]?.de ? "playing" : ""}`}
                            onClick={(e) => { e.stopPropagation(); playAudio(filtered[flashIdx]?.de); }}
                            title="Talaffuzni eshitish"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                            </svg>
                          </button>
                          
                          <button 
                            className={`fav-btn ${favorites.includes(filtered[flashIdx]?.de) ? "active" : ""}`}
                            onClick={(e) => { e.stopPropagation(); toggleFavorite(filtered[flashIdx]?.de); }}
                            title={favorites.includes(filtered[flashIdx]?.de) ? "Tanlanganlardan o'chirish" : "Tanlanganlarga qo'shish"}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill={favorites.includes(filtered[flashIdx]?.de) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,6vw,38px)", fontWeight: 900, margin: "16px 0" }}>{filtered[flashIdx]?.de}</div>
                      <div style={{ fontSize: 12, color: "var(--text-light)", marginTop: 12 }}>bosib o'zbek tiliga o'gir →</div>
                    </div>
                    <div className="flash-face flash-back">
                      <div style={{ fontSize: 11, color: "#2ecc71", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>O'zbekcha</div>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(22px,5vw,32px)", fontWeight: 700, color: "#2ecc71" }}>{filtered[flashIdx]?.uz}</div>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20, flexWrap: "wrap", width: "100%" }}>
                  <button className="btn-o" style={{ flex: 1, minWidth: 100, textAlign: "center" }}
                    onClick={() => { setFlashIdx(i => Math.max(0, i - 1)); setFlipped(false); }}>‹ Oldingi</button>
                  <button className="btn-o"
                    onClick={() => {
                      const deWord = filtered[flashIdx]?.de;
                      if (deWord && !learntWords.includes(deWord)) {
                        setLearntWords(prev => [...prev, deWord]);
                      }
                      if (flashIdx + 1 < filtered.length) {
                        setFlashIdx(i => i + 1);
                        setFlipped(false);
                      }
                    }}
                    style={{ background: "#2ecc71", color: "white", borderColor: "#2ecc71", flex: 2, minWidth: 160, textAlign: "center", fontWeight: "600" }}
                  >
                    ✅ Yodladim & Keyingi
                  </button>
                  <button className="btn-o" style={{ flex: 1, minWidth: 100, textAlign: "center" }}
                    onClick={() => { if (flashIdx + 1 < filtered.length) { setFlashIdx(i => i + 1); setFlipped(false); } }}>Keyingi ›</button>
                </div>
              </div>
            )
          ) : (
            <>
              <input className="search-inp" placeholder="Qidirish: nemischa yoki o'zbekcha..."
                value={vocabSearch} onChange={e => setVocabSearch(e.target.value)}
                style={{ marginBottom: 16 }} />
              <div style={{ border: "1px solid var(--border-color)", borderRadius: 16, overflow: "hidden" }}>
                <div style={{
                  background: vocabCat === "favorites" ? "rgba(241, 196, 15, 0.08)" : (CAT_META[vocabCat]?.bg || "rgba(255,255,255,0.02)"),
                  padding: "10px 18px",
                  display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <span style={{
                    fontSize: 12, 
                    color: vocabCat === "favorites" ? "#f1c40f" : (CAT_META[vocabCat]?.accent || "var(--color)"), 
                    fontWeight: 600,
                    letterSpacing: 1.2, textTransform: "uppercase"
                  }}>
                    {vocabCat === "favorites" ? "🌟 Tanlanganlar" : (CAT_META[vocabCat]?.label || "")}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{filtered.length} so'z</span>
                </div>
                {filtered.length === 0
                  ? <div style={{ padding: 40, textAlign: "center", color: "var(--text-light)", fontSize: 14 }}>
                      {vocabCat === "favorites" 
                        ? "Tanlangan so'zlar hali mavjud emas. So'zlar yonidagi yulduzchani ⭐ bosib saqlang!" 
                        : "Hech narsa topilmadi"}
                    </div>
                  : filtered.map((w, i) => (
                    <div key={i} className="vrow" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button 
                          className={`speaker-btn ${playingWord === w.de ? "playing" : ""}`}
                          onClick={() => playAudio(w.de)}
                          title="Talaffuzni eshitish"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                          </svg>
                        </button>
                        
                        <button 
                          className={`fav-btn ${favorites.includes(w.de) ? "active" : ""}`}
                          onClick={() => toggleFavorite(w.de)}
                          title={favorites.includes(w.de) ? "Tanlanganlardan o'chirish" : "Tanlanganlarga qo'shish"}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill={favorites.includes(w.de) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                          </svg>
                        </button>
                        
                        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, marginLeft: 4 }}>{w.de}</span>
                      </div>
                      <span style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "right", marginLeft: 12 }}>{w.uz}</span>
                    </div>
                  ))
                }
              </div>
            </>
          )}
        </div>
      )}

      {/* ══════════ QUIZ SETUP ══════════ */}
      {page === "quizSetup" && (
        <div style={{ ...S.inner, maxWidth: 520 }} className="inner-pad">
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(24px,6vw,36px)", fontWeight: 900, marginBottom: 6 }}>
            Quiz <span style={{ color: "#f4d03f" }}>Sozlamalari</span>
          </h2>
          <p style={{ fontSize: 13, color: "#555", marginBottom: 32 }}>20 ta takrorlanmaydigan savol • To'g'ri javobni tanlang</p>

          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, color: "#f4d03f", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>Kategoriya tanlang</div>
            <div className="chips-row">
              <button className={`chip ${quizCat === "all" ? "chip-act" : ""}`}
                style={quizCat === "all" ? { background: "#f4d03f", borderColor: "#f4d03f", color: "#0d0d0d", fontWeight: 600 } : {}}
                onClick={() => setQuizCat("all")}>🌐 Hammasi ({allCount})</button>
              {Object.entries(CAT_META).map(([cat, m]) => (
                <button key={cat}
                  className={`chip ${quizCat === cat ? "chip-act" : ""}`}
                  style={quizCat === cat ? { background: m.accent, borderColor: m.accent, color: "#0d0d0d", fontWeight: 600 } : {}}
                  onClick={() => setQuizCat(cat)}>{m.label} ({VOCAB[cat].length})</button>
              ))}
              <button 
                className={`chip ${quizCat === "favorites" ? "chip-act" : ""}`}
                style={quizCat === "favorites" ? { background: "#f1c40f", borderColor: "#f1c40f", color: "#0d0d0d", fontWeight: 600 } : {}}
                onClick={() => setQuizCat("favorites")}
              >
                🌟 Tanlanganlar ({favorites.length})
              </button>
            </div>
          </div>

          <div style={{
            background: "#0f0f0f", border: "1px solid #1c1c1c", borderRadius: 16,
            padding: "20px 22px", marginBottom: 28
          }}>
            <div className="quiz-stats">
              {[
                ["So'zlar", quizCat === "all" ? allCount : quizCat === "favorites" ? favorites.length : VOCAB[quizCat]?.length],
                ["Savollar", Math.min(20, quizCat === "all" ? allCount : quizCat === "favorites" ? favorites.length : VOCAB[quizCat]?.length)],
                ["Variantlar", 4],
                ["Takror", "Yo'q ✓"],
              ].map(([l, v]) => (
                <div key={l}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 900, color: "#f4d03f" }}>{v}</div>
                  <div style={{ fontSize: 12, color: "#444" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%" }}>
            {quizCat === "favorites" && favorites.length < 4 ? (
              <div style={{ color: "#e63946", fontSize: 13, textAlign: "center", width: "100%", padding: "10px", border: "1px solid rgba(230, 57, 70, 0.2)", borderRadius: 10, background: "rgba(230, 57, 70, 0.04)" }}>
                ⚠️ Quiz boshlash uchun kamida 4 ta so'zni tanlanganlar ⭐ ro'yxatiga qo'shishingiz kerak!
              </div>
            ) : (
              <button className="btn-y" onClick={startQuiz} style={{ fontSize: 16, padding: "14px 24px" }}>
                Quizni Boshlash →
              </button>
            )}
          </div>
        </div>
      )}

      {/* ══════════ QUIZ ══════════ */}
      {page === "quiz" && !done && questions.length > 0 && (() => {
        const q = questions[qIdx];
        return (
          <div style={{ ...S.inner, maxWidth: 580 }} className="inner-pad">
            {/* Header row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: "#555" }}>{qIdx + 1} / {questions.length}</span>
              <span style={{ fontSize: 13, color: "#f4d03f", fontWeight: 600 }}>✓ {score} to'g'ri</span>
            </div>
            {/* Progress */}
            <div className="prog-bar">
              <div className="prog-fill" style={{ width: `${(qIdx / questions.length) * 100}%` }} />
            </div>

            {/* Question card */}
            <div style={{
              background: "#0f0f0f", border: "1px solid #1c1c1c", borderRadius: 20,
              padding: "clamp(24px,5vw,38px) clamp(18px,5vw,32px)", textAlign: "center", marginBottom: 22
            }}>
              <div style={{ fontSize: 11, color: "#444", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>
                Nemischa so'z — O'zbekcha ma'nosi nima?
              </div>
              <div style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "clamp(28px,7vw,44px)", fontWeight: 900, lineHeight: 1.2
              }}>
                {q.word.de}
              </div>
              <div style={{ marginTop: 14, display: "inline-block", background: "#161616", borderRadius: 20, padding: "4px 14px" }}>
                <span style={{ fontSize: 11, color: CAT_META[q.word.cat]?.accent || "#f4d03f", letterSpacing: 1 }}>
                  {CAT_META[q.word.cat]?.label}
                </span>
              </div>
            </div>

            {/* Options */}
            {q.options.map((opt, i) => {
              const isCorrect = opt.de === q.word.de;
              const isSelected = chosen?.de === opt.de;
              let cls = "qopt";
              if (chosen) cls += isCorrect ? " correct" : isSelected ? " wrong" : "";
              return (
                <button key={i} className={cls} onClick={() => pick(opt)} disabled={!!chosen}>
                  <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
                  <span>{opt.uz}</span>
                  {chosen && isCorrect && <span style={{ marginLeft: "auto", color: "#2ecc71" }}>✓</span>}
                  {chosen && isSelected && !isCorrect && <span style={{ marginLeft: "auto", color: "#e63946" }}>✗</span>}
                </button>
              );
            })}

            {/* Feedback */}
            {chosen && (
              <div style={{ marginTop: 16, textAlign: "center" }}>
                <div style={{
                  fontSize: 14, marginBottom: 16,
                  color: chosen.de === q.word.de ? "#2ecc71" : "#e63946"
                }}>
                  {chosen.de === q.word.de
                    ? "🎉 To'g'ri!"
                    : `❌ Noto'g'ri. To'g'ri javob: "${q.word.uz}"`}
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button className="btn-y" style={{ maxWidth: 200 }} onClick={next}>
                    {qIdx + 1 >= questions.length ? "Natijani Ko'r" : "Keyingi →"}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ══════════ QUIZ DONE ══════════ */}
      {page === "quiz" && done && (
        <div style={{ ...S.inner, maxWidth: 480, textAlign: "center" }} className="inner-pad">
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,6vw,38px)", fontWeight: 900, marginBottom: 32 }}>
            Quiz <span style={{ color: "#f4d03f" }}>Yakunlandi!</span>
          </h2>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
            <div className="score-ring" style={{
              borderColor: score >= questions.length * .8 ? "#2ecc71" : score >= questions.length * .5 ? "#f4d03f" : "#e63946",
              background: score >= questions.length * .8 ? "#0d1c10" : score >= questions.length * .5 ? "#1c1a0d" : "#1c0d0d",
            }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 40, fontWeight: 900, lineHeight: 1 }}>{score}</div>
              <div style={{ fontSize: 12, color: "#555" }}>/ {questions.length}</div>
            </div>
          </div>

          <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>
            {score >= questions.length * .85 ? "🏆 Ajoyib! Siz nemischa super!" :
              score >= questions.length * .65 ? "👍 Yaxshi natija! Davom et!" :
                score >= questions.length * .4 ? "📚 Yaxshi boshlanish! Ko'proq mashq qil." :
                  "💪 Taslim bo'lma! Yana bir marta urin."}
          </div>
          <div style={{ fontSize: 13, color: "#555", marginBottom: 36 }}>
            To'g'ri: {score} ta &nbsp;•&nbsp; Noto'g'ri: {questions.length - score} ta
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
            <button className="btn-y" onClick={startQuiz}>🔁 Qayta Boshlash</button>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              <button className="btn-o" onClick={() => navigate("quizSetup")}>⚙️ Sozlamalar</button>
              <button className="btn-o" onClick={() => navigate("vocab")}>📚 Lug'at</button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ MATCH SETUP ══════════ */}
      {page === "matchSetup" && (
        <div style={{ ...S.inner, maxWidth: 520 }} className="inner-pad">
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(24px,6vw,36px)", fontWeight: 900, marginBottom: 6 }}>
            "So'z Top" <span style={{ color: "#f4d03f" }}>O'yini</span>
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-light)", marginBottom: 32 }}>
            5 ta nemischa va 5 ta o'zbekcha so'zni juftlab topadigan premium interaktiv o'yin.
          </p>

          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, color: "#f4d03f", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>Kategoriya tanlang</div>
            <div className="chips-row">
              <button className={`chip ${matchCat === "all" ? "chip-act" : ""}`}
                style={matchCat === "all" ? { background: "#f4d03f", borderColor: "#f4d03f", color: "#0d0d0d", fontWeight: 600 } : {}}
                onClick={() => setMatchCat("all")}>🌐 Hammasi</button>
              {Object.entries(CAT_META).map(([cat, m]) => (
                <button key={cat}
                  className={`chip ${matchCat === cat ? "chip-act" : ""}`}
                  style={matchCat === cat ? { background: m.accent, borderColor: m.accent, color: "#0d0d0d", fontWeight: 600 } : {}}
                  onClick={() => setMatchCat(cat)}>{m.label}</button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
            <button className="btn-y" onClick={startMatchingGame} style={{ fontSize: 16, padding: "14px 24px" }}>
              🎮 O'yinni Boshlash →
            </button>
          </div>
        </div>
      )}

      {/* ══════════ MATCH GAME ══════════ */}
      {page === "match" && (
        <div style={{ ...S.inner, maxWidth: 580 }} className="inner-pad">
          {!matchDone ? (
            <>
              {/* Header stats */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    ⏱️ Vaqt: <strong style={{ color: "var(--color)" }}>{formatTime(matchElapsedTime)}</strong>
                  </span>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    ❌ Xatolar: <strong style={{ color: "var(--color)" }}>{attempts}</strong>
                  </span>
                </div>
                <button className="btn-o" onClick={() => setPage("matchSetup")} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12 }}>
                  ⏹️ Chiqish
                </button>
              </div>

              {/* Progress bar */}
              <div className="prog-bar" style={{ marginBottom: 22 }}>
                <div className="prog-fill" style={{ width: `${(matchedIds.length / 10) * 100}%`, background: "linear-gradient(90deg, #0088cc, #2ecc71)" }} />
              </div>

              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <span style={{ fontSize: 13, color: "var(--text-light)" }}>So'z va uning tarjimasini ketma-ket tanlang:</span>
              </div>

              {/* Cards Grid */}
              <div className="match-grid">
                {matchCards.map((card) => {
                  const isSelected = selectedCard?.id === card.id;
                  const isMatched = matchedIds.includes(card.id);
                  const isWrong = wrongCardId === card.id || (wrongCardId && isSelected);
                  
                  let cls = "match-card";
                  if (isMatched) cls += " matched";
                  else if (isSelected) cls += " selected";
                  else if (isWrong) cls += " incorrect";

                  return (
                    <div 
                      key={card.id} 
                      className={cls}
                      onClick={() => handleCardClick(card)}
                    >
                      {card.text}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* Victory Screen */
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,6vw,38px)", fontWeight: 900, marginBottom: 12 }}>
                Ajoyib, G'alaba! 🎉
              </h2>
              <p style={{ fontSize: 14, color: "var(--text-light)", marginBottom: 32 }}>
                Barcha so'zlarni muvaffaqiyatli juftlab topdingiz!
              </p>

              <div style={{ display: "flex", justifyContent: "center", marginBottom: 36 }}>
                <div className="score-ring" style={{
                  borderColor: attempts === 0 ? "#2ecc71" : attempts <= 2 ? "#f4d03f" : "#e63946",
                  background: attempts === 0 ? "#0d1c10" : attempts <= 2 ? "#1c1a0d" : "#1c0d0d",
                  width: 140,
                  height: 140
                }}>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>Sarflangan vaqt</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 900, color: "var(--color)" }}>
                    {formatTime(matchElapsedTime)}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>{attempts} ta xato</div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
                <button className="btn-y" onClick={startMatchingGame}>🔁 Qayta o'ynash</button>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn-o" onClick={() => setPage("matchSetup")}>⚙️ Kategoriya</button>
                  <button className="btn-o" onClick={() => setPage("home")}>🏠 Bosh sahifa</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════ STATS DASHBOARD ══════════ */}
      {page === "stats" && (
        <div style={{ ...S.inner }} className="inner-pad">
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,6vw,38px)", fontWeight: 900, marginBottom: 8 }}>
              Natijalar <span style={{ color: "#f4d03f" }}>Tahlili</span>
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-light)", lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>
              Shaxsiy o'zlashtirish ko'rsatkichlari, testlar tarixi va erishilgan yutuqlar.
            </p>
          </div>

          {/* Stats Cards Row */}
          <div className="grid-3" style={{ marginBottom: 32, gap: 12 }}>
            <div className="home-tile" style={{ padding: "16px 12px", cursor: "default", transform: "none" }}>
              <div style={{ fontSize: 26, marginBottom: 6 }}>🌟</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 900, color: "#f4d03f" }}>
                {favorites.length}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Tanlangan so'zlar</div>
            </div>
            
            <div className="home-tile" style={{ padding: "16px 12px", cursor: "default", transform: "none" }}>
              <div style={{ fontSize: 26, marginBottom: 6 }}>✅</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 900, color: "#2ecc71" }}>
                {learntWords.length}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Yodlangan so'zlar</div>
            </div>

            <div className="home-tile" style={{ padding: "16px 12px", cursor: "default", transform: "none" }}>
              <div style={{ fontSize: 26, marginBottom: 6 }}>🧠</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 900, color: "#0088cc" }}>
                {quizHistory.length}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>O'ynalgan Quizlar</div>
            </div>
          </div>

          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 18, padding: "24px 20px", marginBottom: 32 }}>
            <div style={{ fontSize: 11, color: "#f4d03f", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600 }}>So'nggi 8 ta test grafigi</div>
            {quizHistory.length === 0 ? (
              <div style={{ padding: "40px 0", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
                Hozircha natijalar mavjud emas. Quiz bo'limida o'zingizni sinab ko'ring!
              </div>
            ) : (
              <div>
                <div className="chart-container">
                  {quizHistory.map((h, i) => {
                    const percentage = (h.score / h.total) * 100;
                    return (
                      <div key={i} className="chart-column">
                        <div className="chart-bar" style={{ height: `${Math.max(8, percentage)}%` }}>
                          <span className="chart-tooltip">{h.score}/{h.total} ({Math.round(percentage)}%)</span>
                        </div>
                        <span className="chart-label">{h.date || `Test ${i + 1}`}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ textAlign: "center", fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>
                  💡 Ustunlar ustiga bosib yoki sichqonchani olib borib aniq natijani ko'rishingiz mumkin.
                </div>
              </div>
            )}
          </div>

          {/* Achievements Section */}
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 18, padding: "24px 20px" }}>
            <div style={{ fontSize: 11, color: "#f4d03f", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>Erishilgan Yutuqlar</div>
            <div className="badges-grid">
              {[
                {
                  id: "champion",
                  icon: "🏆",
                  title: "Nemischa Chempion",
                  desc: "Quizda kamida 18 ta to'g'ri javob toping",
                  unlocked: quizHistory.some(h => h.score >= 18)
                },
                {
                  id: "fast",
                  icon: "⚡",
                  title: "Tezkor O'quvchi",
                  desc: "So'z topish o'yinini 40 soniyadan tezroq yakunlang",
                  unlocked: fastestMatch <= 40
                },
                {
                  id: "patient",
                  icon: "📚",
                  title: "Sabrli Talaba",
                  desc: "Kamida 5 marotaba Quiz o'ynang",
                  unlocked: quizHistory.length >= 5
                },
                {
                  id: "collector",
                  icon: "⭐",
                  title: "So'z Jamg'aruvchi",
                  desc: "Tanlanganlar ro'yxatiga 10 tadan ortiq so'z qo'shing",
                  unlocked: favorites.length >= 10
                }
              ].map(b => (
                <div key={b.id} className={`badge-card ${b.unlocked ? "unlocked" : "locked"}`}>
                  <div className="badge-icon">{b.icon}</div>
                  <div className="badge-title">{b.title}</div>
                  <div className="badge-desc">{b.desc}</div>
                  <div style={{ fontSize: 10, marginTop: 8, color: b.unlocked ? "#f4d03f" : "var(--text-muted)", fontWeight: 600 }}>
                    {b.unlocked ? "✓ Bajarildi" : "🔒 Qulflangan"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════ SPELLING SETUP ══════════ */}
      {page === "spellingSetup" && (
        <div style={{ ...S.inner, maxWidth: 520 }} className="inner-pad">
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(24px,6vw,36px)", fontWeight: 900, marginBottom: 6 }}>
            Yozish <span style={{ color: "#f4d03f" }}>Mashqi</span>
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-light)", marginBottom: 32 }}>
            Harfma-harf to'g'ri yozish orqali so'zlarni xotirada mustahkam saqlang.
          </p>

          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, color: "#f4d03f", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>Kategoriya tanlang</div>
            <div className="chips-row">
              <button className={`chip ${spellingCat === "all" ? "chip-act" : ""}`}
                style={spellingCat === "all" ? { background: "#f4d03f", borderColor: "#f4d03f", color: "#0d0d0d", fontWeight: 600 } : {}}
                onClick={() => setSpellingCat("all")}>🌐 Hammasi ({allCount})</button>
              {Object.entries(CAT_META).map(([cat, m]) => (
                <button key={cat}
                  className={`chip ${spellingCat === cat ? "chip-act" : ""}`}
                  style={spellingCat === cat ? { background: m.accent, borderColor: m.accent, color: "#0d0d0d", fontWeight: 600 } : {}}
                  onClick={() => setSpellingCat(cat)}>{m.label} ({VOCAB[cat].length})</button>
              ))}
              <button 
                className={`chip ${spellingCat === "favorites" ? "chip-act" : ""}`}
                style={spellingCat === "favorites" ? { background: "#f1c40f", borderColor: "#f1c40f", color: "#0d0d0d", fontWeight: 600 } : {}}
                onClick={() => setSpellingCat("favorites")}
              >
                🌟 Tanlanganlar ({favorites.length})
              </button>
            </div>
          </div>

          <div style={{
            background: "#0f0f0f", border: "1px solid #1c1c1c", borderRadius: 16,
            padding: "20px 22px", marginBottom: 28
          }}>
            <div className="quiz-stats">
              {[
                ["Turi", spellingCat === "all" ? "Barchasi" : spellingCat === "favorites" ? "Tanlanganlar" : CAT_META[spellingCat]?.label],
                ["Savollar", Math.min(10, spellingCat === "all" ? allCount : spellingCat === "favorites" ? favorites.length : VOCAB[spellingCat]?.length)],
                ["Klaviatura", "Maxsus Umlaut"],
                ["Tekshiruv", "Real-vaqtda"],
              ].map(([l, v]) => (
                <div key={l}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 900, color: "#f4d03f" }}>{v}</div>
                  <div style={{ fontSize: 12, color: "#444" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%" }}>
            {spellingCat === "favorites" && favorites.length < 1 ? (
              <div style={{ color: "#e63946", fontSize: 13, textAlign: "center", width: "100%", padding: "10px", border: "1px solid rgba(230, 57, 70, 0.2)", borderRadius: 10, background: "rgba(230, 57, 70, 0.04)" }}>
                ⚠️ Yozish mashqini boshlash uchun kamida 1 ta so'zni tanlanganlar ⭐ ro'yxatiga qo'shishingiz kerak!
              </div>
            ) : (
              <button className="btn-y" onClick={startSpellingGame} style={{ fontSize: 16, padding: "14px 24px" }}>
                ✍️ Mashqni Boshlash →
              </button>
            )}
          </div>
        </div>
      )}

      {/* ══════════ SPELLING GAME ══════════ */}
      {page === "spelling" && (
        <div style={{ ...S.inner, maxWidth: 580 }} className="inner-pad">
          {!spellingDone ? (
            <>
              {/* Header stats */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    ⏱️ Vaqt: <strong style={{ color: "var(--color)" }}>{formatTime(spellingElapsedTime)}</strong>
                  </span>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    ❌ Xatolar: <strong style={{ color: "var(--color)" }}>{spellingAttempts}</strong>
                  </span>
                </div>
                <button className="btn-o" onClick={() => setPage("spellingSetup")} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12 }}>
                  ⏹️ Chiqish
                </button>
              </div>

              {/* Progress bar */}
              <div className="prog-bar" style={{ marginBottom: 22 }}>
                <div className="prog-fill" style={{ width: `${(spellingIdx / spellingQuestions.length) * 100}%`, background: "linear-gradient(90deg, #f4d03f, #2ecc71)" }} />
              </div>

              <div style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>
                Savol: {spellingIdx + 1} / {spellingQuestions.length}
              </div>

              {/* Question Card */}
              <div style={{
                background: "#0f0f0f", border: "1px solid #1c1c1c", borderRadius: 20,
                padding: "30px 20px", textAlign: "center", marginBottom: 22
              }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>
                  Quyidagi so'zning nemischa tarjimasini yozing:
                </div>
                <div style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "clamp(26px,6vw,38px)", fontWeight: 900, lineHeight: 1.2, marginBottom: 16
                }}>
                  {spellingQuestions[spellingIdx]?.uz}
                </div>
                
                {/* Audio helper */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button 
                    className={`btn-o ${playingWord === spellingQuestions[spellingIdx]?.de ? "playing" : ""}`}
                    onClick={() => playAudio(spellingQuestions[spellingIdx]?.de)}
                    style={{ padding: "8px 16px", borderRadius: 20, fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                    Talaffuzini eshitish
                  </button>
                </div>
              </div>

              {/* Input Wrap */}
              <div className="spelling-inp-wrap">
                <input 
                  className={`spelling-inp ${spellingCorrectWord ? "correct" : spellingIsWrong ? "incorrect" : ""}`}
                  placeholder="Nemischa tarjimasini yozing..."
                  value={spellingInput}
                  onChange={handleSpellingChange}
                  autoFocus
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
              </div>

              {/* Virtual Keyboard */}
              <div className="umlaut-keyboard">
                {["ä", "ö", "ü", "ß", "Ä", "Ö", "Ü"].map((char) => (
                  <button 
                    key={char} 
                    className="umlaut-btn" 
                    onClick={() => handleUmlautClick(char)}
                  >
                    {char}
                  </button>
                ))}
              </div>

              {/* Feedback messages */}
              <div style={{ textAlign: "center", marginTop: 10, minHeight: 24 }}>
                {spellingCorrectWord && <span style={{ color: "#2ecc71", fontSize: 14, fontWeight: 600 }}>🎉 Barakalla! To'g'ri.</span>}
                {spellingIsWrong && <span style={{ color: "#e63946", fontSize: 13 }}>⚠️ Imlo xatosi bor, diqqat qiling!</span>}
              </div>
            </>
          ) : (
            /* Victory Screen */
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,6vw,38px)", fontWeight: 900, marginBottom: 12 }}>
                Mashq Tugadi! ✍️🎉
              </h2>
              <p style={{ fontSize: 14, color: "var(--text-light)", marginBottom: 32 }}>
                Barcha so'zlarni muvaffaqiyatli harfma-harf yozib tugatdingiz!
              </p>

              <div style={{ display: "flex", justifyContent: "center", marginBottom: 36 }}>
                <div className="score-ring" style={{
                  borderColor: spellingAttempts === 0 ? "#2ecc71" : spellingAttempts <= 3 ? "#f4d03f" : "#e63946",
                  background: spellingAttempts === 0 ? "#0d1c10" : spellingAttempts <= 3 ? "#1c1a0d" : "#1c0d0d",
                  width: 150,
                  height: 150
                }}>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>Ketgan vaqt</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 900, color: "var(--color)" }}>
                    {formatTime(spellingElapsedTime)}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>{spellingAttempts} ta xato urinish</div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
                <button className="btn-y" onClick={startSpellingGame}>🔁 Qayta o'ynash</button>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn-o" onClick={() => setPage("spellingSetup")}>⚙️ Kategoriya</button>
                  <button className="btn-o" onClick={() => setPage("home")}>🏠 Bosh sahifa</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}