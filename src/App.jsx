import React, { useState, useCallback, useEffect } from "react";

// Data & Helpers
import { VOCAB, CAT_META } from "./data/vocabData";
import { shuffle, buildQuiz, speakWord, initSpeech } from "./utils/helpers";
import { ACHIEVEMENTS } from "./data/achievementsData";

// Components
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Tips from "./components/Tips";
import VocabList from "./components/VocabList";
import QuizGame from "./components/QuizGame";
import MatchingGame from "./components/MatchingGame";
import SpellingGame from "./components/SpellingGame";
import StatsDashboard from "./components/StatsDashboard";
import LeagueBoard from "./components/LeagueBoard";
import Shop from "./components/Shop";
import Flashcard from "./components/Flashcard";
import Grammar from "./components/Grammar";
import Achievements from "./components/Achievements";
import ConfettiEffect from "./components/ConfettiEffect";

export default function App() {
  const [page, setPage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const [onboarded, setOnboarded] = useState(() => {
    try {
      const saved = localStorage.getItem("onboarded");
      return saved === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem("onboarded", onboarded.toString());
  }, [onboarded]);

  // Toast Notification States
  const [toasts, setToasts] = useState([]);
  const showToast = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  // Gamified States
  const [xp, setXp] = useState(() => {
    try {
      const saved = localStorage.getItem("xp");
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const [gems, setGems] = useState(() => {
    try {
      const saved = localStorage.getItem("gems");
      return saved ? parseInt(saved, 10) || 150 : 150;
    } catch {
      return 150;
    }
  });

  const [hearts, setHearts] = useState(() => {
    try {
      const saved = localStorage.getItem("hearts");
      return saved !== null ? parseInt(saved, 10) : 5;
    } catch {
      return 5;
    }
  });

  const [streak, setStreak] = useState(() => {
    try {
      const saved = localStorage.getItem("streak");
      return saved ? parseInt(saved, 10) || 1 : 1;
    } catch {
      return 1;
    }
  });

  const [league, setLeague] = useState(() => {
    try {
      const saved = localStorage.getItem("league");
      return saved || "Bronza";
    } catch {
      return "Bronza";
    }
  });

  const [completedLevels, setCompletedLevels] = useState(() => {
    try {
      const saved = localStorage.getItem("completedLevels");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeLevel, setActiveLevel] = useState(null);

  // Gems Shop States
  const [streakShields, setStreakShields] = useState(() => {
    try {
      const saved = localStorage.getItem("streakShields");
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const [vipUnlocked, setVipUnlocked] = useState(() => {
    try {
      const saved = localStorage.getItem("vipUnlocked");
      return saved === "true";
    } catch {
      return false;
    }
  });

  const [goldCrownTheme, setGoldCrownTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("goldCrownTheme");
      return saved === "true";
    } catch {
      return false;
    }
  });

  // Body gold theme trigger
  useEffect(() => {
    if (goldCrownTheme) {
      document.body.classList.add("gold-crown-theme");
    } else {
      document.body.classList.remove("gold-crown-theme");
    }
  }, [goldCrownTheme]);

  // Daily Streak check with Streak Shield protection
  useEffect(() => {
    try {
      const todayStr = new Date().toDateString();
      const lastActive = localStorage.getItem("lastActiveDate");
      if (lastActive) {
        const lastDate = new Date(lastActive);
        const todayDate = new Date(todayStr);
        const diffTime = Math.abs(todayDate - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          setStreak(s => {
            const ns = s + 1;
            localStorage.setItem("streak", ns.toString());
            return ns;
          });
        } else if (diffDays > 1) {
          const savedShields = parseInt(localStorage.getItem("streakShields") || "0", 10);
          if (savedShields > 0) {
            const nextShields = savedShields - 1;
            setStreakShields(nextShields);
            localStorage.setItem("streakShields", nextShields.toString());
            showToast("Kunlik faollik streak-ingiz yo'qolishidan himoyalandi! 🛡️ Streak Shield sarflandi.", "info");
          } else {
            setStreak(1);
            localStorage.setItem("streak", "1");
          }
        }
      }
      localStorage.setItem("lastActiveDate", todayStr);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => { localStorage.setItem("xp", xp.toString()); }, [xp]);
  useEffect(() => { localStorage.setItem("gems", gems.toString()); }, [gems]);
  useEffect(() => { localStorage.setItem("hearts", hearts.toString()); }, [hearts]);
  useEffect(() => { localStorage.setItem("league", league); }, [league]);
  useEffect(() => { localStorage.setItem("completedLevels", JSON.stringify(completedLevels)); }, [completedLevels]);
  useEffect(() => { localStorage.setItem("streakShields", streakShields.toString()); }, [streakShields]);
  useEffect(() => { localStorage.setItem("vipUnlocked", vipUnlocked.toString()); }, [vipUnlocked]);
  useEffect(() => { localStorage.setItem("goldCrownTheme", goldCrownTheme.toString()); }, [goldCrownTheme]);

  const startLesson = useCallback((lvl) => {
    setActiveLevel(lvl);
    setPage("quiz");
  }, []);

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
  const [confetti, setConfetti] = useState(false);

  // Flashcard state
  const [flashcardCategory, setFlashcardCategory] = useState("all");

  // Total gems earned (for achievements)
  const [totalGemsEarned, setTotalGemsEarned] = useState(() => {
    try { return parseInt(localStorage.getItem("totalGemsEarned") || "0", 10); } catch { return 0; }
  });

  // Unlocked achievements
  const [unlockedAchievements, setUnlockedAchievements] = useState(() => {
    try { return JSON.parse(localStorage.getItem("unlockedAchievements") || "[]"); } catch { return []; }
  });

  // Sync new states
  useEffect(() => { localStorage.setItem("totalGemsEarned", totalGemsEarned.toString()); }, [totalGemsEarned]);
  useEffect(() => { localStorage.setItem("unlockedAchievements", JSON.stringify(unlockedAchievements)); }, [unlockedAchievements]);

  // Init Web Speech API
  useEffect(() => { initSpeech(); }, []);

  // Achievement checker
  useEffect(() => {
    const stats = {
      streak,
      learntWords: learntWords.length,
      favorites: favorites.length,
      quizCount: quizHistory.length,
      perfectQuiz: quizHistory.filter(q => q.score === q.total).length,
      xp,
      totalGemsEarned,
      fastestMatch: fastestMatch === 999999 ? 0 : fastestMatch,
      completedLevels: completedLevels.length,
      vipUnlocked,
    };
    const newlyUnlocked = ACHIEVEMENTS.filter(
      a => !unlockedAchievements.includes(a.id) && a.check(stats)
    );
    if (newlyUnlocked.length > 0) {
      newlyUnlocked.forEach(a => showToast(`🏅 Yutuq: ${a.title}!`, "success"));
      setUnlockedAchievements(prev => [...prev, ...newlyUnlocked.map(a => a.id)]);
    }
  }, [streak, learntWords.length, favorites.length, quizHistory.length, xp, totalGemsEarned, fastestMatch, completedLevels.length, vipUnlocked]);

  const playAudio = useCallback((word) => {
    if (!word) return;
    setPlayingWord(word);
    speakWord(word, () => setPlayingWord(null));
  }, []);

  // Track gems earned
  const trackGems = useCallback((amount) => {
    setGems(g => g + amount);
    setTotalGemsEarned(t => t + amount);
  }, []);

  // quiz state
  const [quizCat, setQuizCat] = useState("all");
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [chosen, setChosen] = useState(null);
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

  const startQuiz = useCallback(() => {
    const qs = buildQuiz(quizCat, favorites);
    setQuestions(qs);
    setQIdx(0); setChosen(null); setScore(0); setDone(false);
    setPage("quiz");
  }, [quizCat, favorites]);

  const allCount = Object.values(VOCAB).reduce((s, a) => s + a.length, 0);

  if (!onboarded) {
    return (
      <div style={{ 
        background: "#0a0b0d", 
        minHeight: "100vh", 
        color: "#e3e4e6", 
        fontFamily: "'DM Sans', sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "40px 24px",
        boxSizing: "border-box",
        maxWidth: 480,
        margin: "0 auto",
        textAlign: "center"
      }}>
        {/* Brand Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 20 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="6" fill="#58cc02" />
            <circle cx="8" cy="10" r="4" fill="#fff" />
            <circle cx="8" cy="10" r="1.5" fill="#000" />
            <circle cx="16" cy="10" r="4" fill="#fff" />
            <circle cx="16" cy="10" r="1.5" fill="#000" />
            <path d="M10 14c0 1 1 2 2 2s2-1 2-2H10Z" fill="#ffc107" />
          </svg>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900,
            fontSize: 22,
            letterSpacing: -0.5,
            color: "#58cc02"
          }}>
            deutsch<span style={{ color: "#fff" }}>blitz</span>
          </span>
        </div>

        {/* Mascot & Friends Circle Illustration */}
        <div style={{ margin: "40px 0", display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
          <svg width="260" height="260" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="95" stroke="rgba(88, 204, 2, 0.04)" strokeWidth="6" strokeDasharray="8 8" />
            <circle cx="100" cy="100" r="85" fill="rgba(255, 255, 255, 0.01)" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            
            <circle cx="100" cy="100" r="38" fill="rgba(88, 204, 2, 0.12)" />
            <g transform="translate(78, 76)">
              <rect width="44" height="44" rx="14" fill="#58cc02" />
              <circle cx="14" cy="18" r="7" fill="#fff" />
              <circle cx="14" cy="18" r="2.5" fill="#000" />
              <circle cx="30" cy="18" r="7" fill="#fff" />
              <circle cx="30" cy="18" r="2.5" fill="#000" />
              <path d="M18 24 L22 29 L26 24 Z" fill="#ffc107" />
              <circle cx="7" cy="24" r="2" fill="#ff9800" opacity="0.6" />
              <circle cx="37" cy="24" r="2" fill="#ff9800" opacity="0.6" />
              <path d="M12 34 Q14 31 16 34" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M22 35 Q24 32 26 35" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M28 34 Q30 31 32 34" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            <circle cx="40" cy="70" r="16" fill="#1cb0f6" />
            <circle cx="36" cy="68" r="3" fill="#fff" /><circle cx="44" cy="68" r="3" fill="#fff" />
            <circle cx="36" cy="68" r="1" fill="#000" /><circle cx="44" cy="68" r="1" fill="#000" />
            <path d="M37 74 Q40 76 43 74" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
            <rect x="34" y="50" width="12" height="5" rx="2" fill="#ff4b4b" />

            <circle cx="160" cy="80" r="18" fill="#a435f0" />
            <path d="M146 76 C146 64, 174 64, 174 76" fill="#ffc837" />
            <circle cx="154" cy="78" r="3" fill="#fff" /><circle cx="166" cy="78" r="3" fill="#fff" />
            <circle cx="154" cy="78" r="1" fill="#000" /><circle cx="166" cy="78" r="1" fill="#000" />
            <path d="M157 84 Q160 86 163 84" stroke="#fff" strokeWidth="1.5" />

            <circle cx="65" cy="155" r="17" fill="#ff4b4b" />
            <path d="M52 144 C52 135, 78 135, 78 144 Z" fill="#ffc107" />
            <rect x="74" y="141" width="10" height="3" fill="#ffc107" />
            <circle cx="59" cy="153" r="3" fill="#fff" /><circle cx="71" cy="153" r="3" fill="#fff" />
            <circle cx="59" cy="153" r="1" fill="#000" /><circle cx="71" cy="153" r="1" fill="#000" />
            <path d="M62 160 Q65 162 68 160" stroke="#fff" strokeWidth="1.5" />

            <circle cx="138" cy="150" r="16" fill="#ff9800" />
            <circle cx="128" cy="138" r="4" fill="#ff9800" /><circle cx="148" cy="138" r="4" fill="#ff9800" />
            <circle cx="132" cy="148" r="2.5" fill="#fff" /><circle cx="144" cy="148" r="2.5" fill="#fff" />
            <circle cx="132" cy="148" r="1" fill="#000" /><circle cx="144" cy="148" r="1" fill="#000" />
            <path d="M135 154 Q138 156 141 154" stroke="#fff" strokeWidth="1.2" />

            <polygon points="100,20 102,25 107,25 103,28 105,33 100,30 95,33 97,28 93,25 98,25" fill="#ffc107" opacity="0.8" />
            <polygon points="175,125 176,128 179,128 177,130 178,133 175,131 172,133 173,130 171,128 174,128" fill="#1cb0f6" opacity="0.6" />
            <polygon points="25,120 26,123 29,123 27,125 28,128 25,126 22,128 23,125 21,123 24,123" fill="#ff4b4b" opacity="0.6" />
          </svg>
        </div>

        {/* Supporting Copy */}
        <div style={{ padding: "0 12px", marginBottom: 32 }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900,
            fontSize: 22,
            lineHeight: 1.4,
            marginBottom: 16,
            color: "#fff"
          }}>
            The free, fun, and effective way to learn German!
          </h1>
          <p style={{
            fontSize: 14,
            color: "#788290",
            lineHeight: 1.6
          }}>
            O'yinlar, tezkor testlar va to'laqonli nemischa lug'at yordamida til o'rganishni bugun, mutlaqo bepul boshlang!
          </p>
        </div>

        {/* Buttons Stack */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%", padding: "0 8px" }}>
          <button 
            onClick={() => setOnboarded(true)}
            style={{ 
              background: "#58cc02", 
              color: "#fff", 
              border: "none",
              borderRadius: 16,
              padding: "16px 24px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 4px 0 #3b9c02",
              transition: "all 0.15s ease",
              letterSpacing: 0.5,
              textTransform: "uppercase"
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "translateY(2px)";
              e.currentTarget.style.boxShadow = "0 2px 0 #3b9c02";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 4px 0 #3b9c02";
            }}
          >
            GET STARTED
          </button>
          
          <button 
            onClick={() => setOnboarded(true)}
            style={{ 
              background: "transparent", 
              color: "#1cb0f6", 
              border: "2px solid #1c2730",
              borderRadius: 16,
              padding: "14px 24px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              fontWeight: 800,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(28, 176, 246, 0.05)";
              e.currentTarget.style.borderColor = "#1cb0f6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "#1c2730";
            }}
          >
            I ALREADY HAVE AN ACCOUNT
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--color)", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Floating Toast Notification Container */}
      <div style={{
        position: "fixed",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        width: "90%",
        maxWidth: 360,
        pointerEvents: "none"
      }}>
        {toasts.map(t => (
          <div 
            key={t.id}
            className={`toast-banner ${t.type}`}
            style={{
              padding: "12px 18px",
              borderRadius: 14,
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              backdropFilter: "blur(12px)",
              animation: "toast-in 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
              display: "flex",
              alignItems: "center",
              gap: 10,
              pointerEvents: "auto",
              border: "1px solid rgba(255,255,255,0.1)"
            }}
          >
            <span style={{ fontSize: 16 }}>
              {t.type === "success" ? "✅" : t.type === "error" ? "❌" : t.type === "info" ? "🛡️" : "💡"}
            </span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <Navbar 
        page={page} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        navigate={navigate} 
        streak={streak}
        gems={gems}
        hearts={hearts}
        setHearts={setHearts}
        setGems={setGems}
        league={league}
        vipUnlocked={vipUnlocked}
        goldCrownTheme={goldCrownTheme}
        showToast={showToast}
      />

      {/* Pages Router Container */}
      <div className="main-content-layout">
        {page === "home" && (
          <Home 
            navigate={navigate} 
            completedLevels={completedLevels}
            hearts={hearts}
            startLesson={startLesson}
            showToast={showToast}
            gems={gems}
            setGems={setGems}
            xp={xp}
            setXp={setXp}
          />
        )}

        {page === "tips" && (
          <Tips 
            tipOpen={tipOpen} 
            setTipOpen={setTipOpen} 
          />
        )}

        {page === "vocab" && (
          <VocabList 
            vocabCat={vocabCat} 
            setVocabCat={setVocabCat} 
            vocabSearch={vocabSearch} 
            setVocabSearch={setVocabSearch} 
            flash={flash} 
            setFlash={setFlash} 
            flashIdx={flashIdx} 
            setFlashIdx={setFlashIdx} 
            flipped={flipped} 
            setFlipped={setFlipped} 
            favorites={favorites} 
            toggleFavorite={toggleFavorite} 
            learntWords={learntWords} 
            setLearntWords={setLearntWords} 
            playingWord={playingWord} 
            playAudio={playAudio} 
            allCount={allCount} 
          />
        )}

        {(page === "quizSetup" || page === "quiz") && (
          <QuizGame 
            quizCat={quizCat} 
            setQuizCat={setQuizCat} 
            questions={questions} 
            setQuestions={setQuestions} 
            qIdx={qIdx} 
            setQIdx={setQIdx} 
            chosen={chosen} 
            setChosen={setChosen} 
            score={score} 
            setScore={setScore} 
            done={done} 
            setDone={setDone} 
            favorites={favorites} 
            setQuizHistory={setQuizHistory} 
            navigate={navigate} 
            page={page} 
            setPage={setPage} 
            allCount={allCount} 
            startQuiz={startQuiz} 
            activeLevel={activeLevel}
            hearts={hearts}
            setHearts={setHearts}
            xp={xp}
            setXp={setXp}
            gems={gems}
            setGems={setGems}
            completedLevels={completedLevels}
            setCompletedLevels={setCompletedLevels}
            playAudio={playAudio}
            showToast={showToast}
          />
        )}

        {(page === "matchSetup" || page === "match") && (
          <MatchingGame 
            matchCat={matchCat} 
            setMatchCat={setMatchCat} 
            matchCards={matchCards} 
            setMatchCards={setMatchCards} 
            selectedCard={selectedCard} 
            setSelectedCard={setSelectedCard} 
            wrongCardId={wrongCardId} 
            setWrongCardId={setWrongCardId} 
            matchedIds={matchedIds} 
            setMatchedIds={setMatchedIds} 
            attempts={attempts} 
            setAttempts={setAttempts} 
            matchStartTime={matchStartTime} 
            setMatchStartTime={setMatchStartTime} 
            matchElapsedTime={matchElapsedTime} 
            setMatchElapsedTime={setMatchElapsedTime} 
            matchDone={matchDone} 
            setMatchDone={setMatchDone} 
            favorites={favorites} 
            setFastestMatch={setFastestMatch} 
            page={page} 
            setPage={setPage} 
            startMatchingGame={startMatchingGame} 
            handleCardClick={handleCardClick} 
          />
        )}

        {(page === "spellingSetup" || page === "spelling") && (
          <SpellingGame 
            spellingCat={spellingCat} 
            setSpellingCat={setSpellingCat} 
            spellingQuestions={spellingQuestions} 
            setSpellingQuestions={setSpellingQuestions} 
            spellingIdx={spellingIdx} 
            setSpellingIdx={setSpellingIdx} 
            spellingInput={spellingInput} 
            setSpellingInput={setSpellingInput} 
            spellingIsWrong={spellingIsWrong} 
            setSpellingIsWrong={setSpellingIsWrong} 
            spellingCorrectWord={spellingCorrectWord} 
            setSpellingCorrectWord={setSpellingCorrectWord} 
            spellingAttempts={spellingAttempts} 
            setSpellingAttempts={setSpellingAttempts} 
            spellingStartTime={spellingStartTime} 
            setSpellingStartTime={setSpellingStartTime} 
            spellingElapsedTime={spellingElapsedTime} 
            setSpellingElapsedTime={setSpellingElapsedTime} 
            spellingDone={spellingDone} 
            setSpellingDone={setSpellingDone} 
            favorites={favorites} 
            page={page} 
            setPage={setPage} 
            allCount={allCount} 
            startSpellingGame={startSpellingGame} 
            handleSpellingChange={handleSpellingChange} 
            handleUmlautClick={handleUmlautClick} 
            playingWord={playingWord} 
            playAudio={playAudio} 
          />
        )}

        {page === "league" && (
          <LeagueBoard 
            xp={xp} 
            league={league} 
          />
        )}

        {page === "shop" && (
          <Shop 
            gems={gems}
            setGems={setGems}
            hearts={hearts}
            setHearts={setHearts}
            streakShields={streakShields}
            setStreakShields={setStreakShields}
            vipUnlocked={vipUnlocked}
            setVipUnlocked={setVipUnlocked}
            goldCrownTheme={goldCrownTheme}
            setGoldCrownTheme={setGoldCrownTheme}
            showToast={showToast}
          />
        )}

        {page === "stats" && (
          <StatsDashboard 
            favorites={favorites} 
            learntWords={learntWords} 
            quizHistory={quizHistory} 
            fastestMatch={fastestMatch} 
            xp={xp}
            gems={gems}
            streak={streak}
            league={league}
            completedLevels={completedLevels}
            streakShields={streakShields}
            vipUnlocked={vipUnlocked}
            goldCrownTheme={goldCrownTheme}
            navigate={navigate}
            unlockedAchievements={unlockedAchievements}
          />
        )}

        {page === "flashcard" && (
          <Flashcard
            navigate={navigate}
            category={flashcardCategory}
            setCategory={setFlashcardCategory}
            favorites={favorites}
            showToast={showToast}
            xp={xp}
            setXp={setXp}
            gems={gems}
            setGems={setGems}
          />
        )}

        {page === "grammar" && (
          <Grammar
            navigate={navigate}
            showToast={showToast}
            xp={xp}
            setXp={setXp}
          />
        )}

        {page === "achievements" && (
          <Achievements
            navigate={navigate}
            unlockedAchievements={unlockedAchievements}
            stats={{
              streak, learntWords: learntWords.length, favorites: favorites.length,
              quizCount: quizHistory.length, xp, totalGemsEarned, fastestMatch,
              completedLevels: completedLevels.length, vipUnlocked
            }}
          />
        )}

        {/* Global Confetti */}
        <ConfettiEffect trigger={confetti} onDone={() => setConfetti(false)} />
      </div>
    </div>
  );
}