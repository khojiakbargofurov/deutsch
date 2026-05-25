import React, { useState, useCallback, useEffect } from "react";

// Data & Helpers
import { VOCAB, CAT_META } from "./data/vocabData";
import { shuffle, buildQuiz } from "./utils/helpers";

// Components
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Tips from "./components/Tips";
import VocabList from "./components/VocabList";
import QuizGame from "./components/QuizGame";
import MatchingGame from "./components/MatchingGame";
import SpellingGame from "./components/SpellingGame";
import StatsDashboard from "./components/StatsDashboard";

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

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--color)", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Navigation */}
      <Navbar 
        page={page} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        menuOpen={menuOpen} 
        setMenuOpen={setMenuOpen} 
        navigate={navigate} 
      />

      {/* Pages Router */}
      {page === "home" && (
        <Home 
          navigate={navigate} 
          allCount={allCount} 
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

      {page === "stats" && (
        <StatsDashboard 
          favorites={favorites} 
          learntWords={learntWords} 
          quizHistory={quizHistory} 
          fastestMatch={fastestMatch} 
        />
      )}
    </div>
  );
}