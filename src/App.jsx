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
function buildQuiz(category) {
  // pool: unique items with cat tag
  const pool = category === "all"
    ? Object.entries(VOCAB).flatMap(([cat, ws]) => ws.map(w => ({ ...w, cat })))
    : VOCAB[category].map(w => ({ ...w, cat: category }));

  const shuffled = shuffle(pool);
  const selected = shuffled.slice(0, Math.min(20, shuffled.length));
  const fullPool = pool; // for distractors

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

  const navigate = useCallback((p) => {
    setPage(p); setMenuOpen(false);
  }, []);

  const startQuiz = useCallback(() => {
    const qs = buildQuiz(quizCat);
    setQuestions(qs);
    setQIdx(0); setChosen(null); setScore(0); setDone(false);
    setPage("quiz");
  }, [quizCat]);

  const pick = (opt) => {
    if (chosen) return;
    setChosen(opt);
    if (opt.de === questions[qIdx].word.de) setScore(s => s + 1);
  };

  const next = () => {
    if (qIdx + 1 >= questions.length) { setDone(true); }
    else { setQIdx(i => i + 1); setChosen(null); }
  };

  const filtered = (VOCAB[vocabCat] || []).filter(w =>
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
          <button className="theme-toggle-btn" onClick={toggleTheme} title="Mavzuni o'zgartirish">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
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
          </div>

          {/* FLASHCARD MODE */}
          {flash ? (
            <div>
              <div style={{ textAlign: "center", fontSize: 13, color: "#555", marginBottom: 16 }}>
                {flashIdx + 1} / {filtered.length} — kartani bosib ag'dar
              </div>
              <div className="flash-wrap" onClick={() => setFlipped(f => !f)}>
                <div className={`flash-inner ${flipped ? "flipped" : ""}`}>
                  <div className="flash-face flash-front">
                    <div style={{ fontSize: 11, color: "#444", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Nemischa</div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,6vw,38px)", fontWeight: 900 }}>{filtered[flashIdx]?.de}</div>
                    <div style={{ fontSize: 12, color: "#333", marginTop: 12 }}>bosib o'zbek tiliga o'gir →</div>
                  </div>
                  <div className="flash-face flash-back">
                    <div style={{ fontSize: 11, color: "#2ecc71", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>O'zbekcha</div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(22px,5vw,32px)", fontWeight: 700, color: "#2ecc71" }}>{filtered[flashIdx]?.uz}</div>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
                <button className="btn-o"
                  onClick={() => { setFlashIdx(i => Math.max(0, i - 1)); setFlipped(false); }}>‹ Oldingi</button>
                <button className="btn-o act"
                  onClick={() => { setFlashIdx(i => Math.min(filtered.length - 1, i + 1)); setFlipped(false); }}>Keyingi ›</button>
              </div>
            </div>
          ) : (
            <>
              <input className="search-inp" placeholder="Qidirish: nemischa yoki o'zbekcha..."
                value={vocabSearch} onChange={e => setVocabSearch(e.target.value)}
                style={{ marginBottom: 16 }} />
              <div style={{ border: "1px solid #1a1a1a", borderRadius: 16, overflow: "hidden" }}>
                <div style={{
                  background: CAT_META[vocabCat].bg, padding: "10px 18px",
                  display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <span style={{
                    fontSize: 12, color: CAT_META[vocabCat].accent, fontWeight: 600,
                    letterSpacing: 1.2, textTransform: "uppercase"
                  }}>{CAT_META[vocabCat].label}</span>
                  <span style={{ fontSize: 12, color: "#444" }}>{filtered.length} so'z</span>
                </div>
                {filtered.length === 0
                  ? <div style={{ padding: 40, textAlign: "center", color: "#333", fontSize: 14 }}>Hech narsa topilmadi</div>
                  : filtered.map((w, i) => (
                    <div key={i} className="vrow">
                      <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700 }}>{w.de}</span>
                      <span style={{ fontSize: 13, color: "#666", textAlign: "right", marginLeft: 12 }}>{w.uz}</span>
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
            </div>
          </div>

          <div style={{
            background: "#0f0f0f", border: "1px solid #1c1c1c", borderRadius: 16,
            padding: "20px 22px", marginBottom: 28
          }}>
            <div className="quiz-stats">
              {[
                ["So'zlar", quizCat === "all" ? allCount : VOCAB[quizCat]?.length],
                ["Savollar", Math.min(20, quizCat === "all" ? allCount : VOCAB[quizCat]?.length)],
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

          <div style={{ display: "flex", justifyContent: "center" }}>
            <button className="btn-y" onClick={startQuiz} style={{ fontSize: 16, padding: "14px 24px" }}>
              Quizni Boshlash →
            </button>
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
    </div>
  );
}