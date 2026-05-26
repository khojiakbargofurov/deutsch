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
import MistakeReview from "./components/MistakeReview";
import Onboarding from "./components/Onboarding";

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

  const [userProfile, setUserProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem("userProfile") || "null"); } catch { return null; }
  });

  // Mistakes state
  const [mistakes, setMistakes] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mistakes") || "[]"); } catch { return []; }
  });

  useEffect(() => { localStorage.setItem("mistakes", JSON.stringify(mistakes)); }, [mistakes]);

  const addMistake = useCallback((word) => {
    setMistakes(prev => {
      const existing = prev.find(m => m.de === word.de);
      if (existing) {
        return prev.map(m => m.de === word.de ? { ...m, count: (m.count || 1) + 1 } : m);
      }
      return [...prev, { ...word, count: 1 }];
    });
  }, []);

  const clearMistakes = useCallback(() => {
    setMistakes([]);
  }, []);

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
      if (spellingQuestions[spellingIdx]) {
        addMistake(spellingQuestions[spellingIdx]);
      }
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
      if (spellingQuestions[spellingIdx]) {
        addMistake(spellingQuestions[spellingIdx]);
      }
    }
  };

  const startQuiz = useCallback(() => {
    const qs = buildQuiz(quizCat, favorites);
    setQuestions(qs);
    setQIdx(0); setChosen(null); setScore(0); setDone(false);
    setPage("quiz");
  }, [quizCat, favorites]);

  const allCount = Object.values(VOCAB).reduce((s, a) => s + a.length, 0);

  const handleOnboardingComplete = useCallback(({ goal, avatar, level }) => {
    const profile = { goal, avatar, level, xpGoal: goal * 10, name: "Talaba" };
    setUserProfile(profile);
    localStorage.setItem("userProfile", JSON.stringify(profile));
    setOnboarded(true);
    localStorage.setItem("onboarded", "true");
    showToast("Deutsch Blitz-ga xush kelibsiz! 🎉");
  }, [showToast]);

  if (!onboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
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
            addMistake={addMistake}
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
            mistakes={mistakes}
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

        {page === "mistakes" && (
          <MistakeReview 
            navigate={navigate}
            mistakes={mistakes}
            clearMistakes={clearMistakes}
            showToast={showToast}
          />
        )}

        {/* Global Confetti */}
        <ConfettiEffect trigger={confetti} onDone={() => setConfetti(false)} />
      </div>
    </div>
  );
}