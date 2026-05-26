import React, { useState, useEffect, useCallback } from "react";
import { VOCAB, CAT_META, LEVELS } from "../data/vocabData";
import { shuffle } from "../utils/helpers";

const S = {
  inner: { maxWidth: 500, margin: "0 auto", padding: "24px 16px 120px" },
  sentenceSlots: {
    minHeight: 64,
    borderBottom: "2px solid var(--border-color)",
    padding: "8px 0",
    marginBottom: 24,
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  chip: {
    background: "var(--qopt-bg)",
    border: "1.5px solid var(--qopt-border)",
    borderRadius: 12,
    padding: "10px 16px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    userSelect: "none",
    transition: "all 0.15s ease",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginTop: 16,
  }
};

export default function QuizGame({
  quizCat, setQuizCat,
  questions, setQuestions,
  qIdx, setQIdx,
  chosen, setChosen,
  score, setScore,
  done, setDone,
  favorites,
  setQuizHistory,
  navigate,
  page, setPage,
  allCount,
  startQuiz,
  activeLevel,
  hearts,
  setHearts,
  xp,
  setXp,
  gems,
  setGems,
  completedLevels,
  setCompletedLevels,
  playAudio,
  addMistake
}) {
  // Lesson specific states
  const [arrangedWords, setArrangedWords] = useState([]);
  const [scrambledChips, setScrambledChips] = useState([]);
  const [lessonChecked, setLessonChecked] = useState(false);
  const [lessonCorrect, setLessonCorrect] = useState(false);

  // Spelling state inside lesson
  const [spellInput, setSpellInput] = useState("");
  const [spellChecked, setSpellChecked] = useState(false);
  const [spellCorrect, setSpellCorrect] = useState(false);

  // Mini Matching states inside lesson
  const [miniMatchedIds, setMiniMatchedIds] = useState([]);
  const [miniSelectedCard, setMiniSelectedCard] = useState(null);
  const [miniWrongId, setMiniWrongId] = useState(null);
  const [miniCards, setMiniCards] = useState([]);

  // Speech Recognition states
  const [isListening, setIsListening] = useState(false);
  const [speakTranscript, setSpeakTranscript] = useState("");
  const [speakChecked, setSpeakChecked] = useState(false);
  const [speakCorrect, setSpeakCorrect] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  // Hearts shake animation trigger
  const [shakeHearts, setShakeHearts] = useState(false);

  // Check speech recognition support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  // Setup current lesson questions on active level change
  useEffect(() => {
    if (activeLevel) {
      // Build a 6-step lesson for this specific level
      const levelWords = Object.entries(VOCAB)
        .flatMap(([cat, ws]) => ws.map(w => ({ ...w, cat })))
        .filter(w => activeLevel.words.includes(w.de));
      
      const shuffledLvlWords = shuffle(levelWords);

      // Card 1: Multiple choice
      const distractors1 = shuffle(
        Object.entries(VOCAB)
          .flatMap(([cat, ws]) => ws.map(w => ({ ...w, cat })))
          .filter(w => w.de !== shuffledLvlWords[0].de)
      ).slice(0, 3);
      
      const q1 = {
        type: "mc",
        word: shuffledLvlWords[0],
        options: shuffle([shuffledLvlWords[0], ...distractors1])
      };

      // Card 2: Multiple choice
      const distractors2 = shuffle(
        Object.entries(VOCAB)
          .flatMap(([cat, ws]) => ws.map(w => ({ ...w, cat })))
          .filter(w => w.de !== shuffledLvlWords[1].de)
      ).slice(0, 3);

      const q2 = {
        type: "mc",
        word: shuffledLvlWords[1],
        options: shuffle([shuffledLvlWords[1], ...distractors2])
      };

      // Card 3: Spelling/Dictation
      const q3 = {
        type: "spelling",
        word: shuffledLvlWords[2]
      };

      // Card 4: Sentence Builder
      const rawTargetWords = activeLevel.sentence.de.split(" ");
      const distractorsSentence = shuffle(levelWords.map(w => w.de).filter(w => !rawTargetWords.includes(w))).slice(0, 2);
      
      const q4 = {
        type: "sentence",
        sentence: activeLevel.sentence,
        scrambled: shuffle([...rawTargetWords, ...distractorsSentence])
      };

      // Card 5: Speaking Practice or Listening Comprehension fallback
      const q5 = {
        type: "speaking",
        sentence: activeLevel.sentence,
        // Distractors for fallback listening comprehension choices
        options: shuffle([
          { de: activeLevel.sentence.de, uz: activeLevel.sentence.uz },
          { de: activeLevel.sentence.de.replace(rawTargetWords[0], shuffledLvlWords[0].de), uz: "Muvaffaqiyatsiz gap" },
          { de: "Ich habe ein Problem", uz: "Menda muammo bor" }
        ])
      };

      // Card 6: Mini matching game using 4 words from the level
      const matchSubset = shuffledLvlWords.slice(3, 7);
      const q6 = {
        type: "match",
        words: matchSubset
      };

      setQuestions([q1, q2, q3, q4, q5, q6]);
      setQIdx(0);
      setChosen(null);
      setScore(0);
      setDone(false);

      // Reset sub-states
      setArrangedWords([]);
      setLessonChecked(false);
      setSpellInput("");
      setSpellChecked(false);
      setMiniMatchedIds([]);
      setMiniSelectedCard(null);
      setSpeakChecked(false);
      setSpeakTranscript("");
    }
  }, [activeLevel, setQuestions, setQIdx, setChosen, setScore, setDone]);

  // Setup spelling/speaking card voice playing
  useEffect(() => {
    if (questions.length > 0) {
      const q = questions[qIdx];
      if (q?.type === "spelling") {
        playAudio(q.word.de);
      } else if (q?.type === "speaking") {
        playAudio(q.sentence.de);
      }
    }
  }, [qIdx, questions, playAudio]);

  // Setup mini matching cards
  useEffect(() => {
    if (questions.length > 0 && questions[qIdx]?.type === "match") {
      const subset = questions[qIdx].words;
      const cards = [];
      subset.forEach((w, i) => {
        cards.push({ id: `de_${i}`, text: w.de, matchWord: w.de, type: "de" });
        cards.push({ id: `uz_${i}`, text: w.uz, matchWord: w.de, type: "uz" });
      });
      setMiniCards(shuffle(cards));
      setMiniMatchedIds([]);
      setMiniSelectedCard(null);
    }
  }, [qIdx, questions]);

  // Speaking / Pronunciation test trigger
  const startSpeakingRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    setIsListening(true);
    setSpeakTranscript("");
    setSpeakChecked(false);

    const recognition = new SpeechRecognition();
    recognition.lang = "de-DE";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSpeakTranscript(transcript);
      
      const q = questions[qIdx];
      const targetStr = q.sentence.de.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
      const userStr = transcript.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").replace(/\s+/g, " ").trim().toLowerCase();

      // Check if user spoke the phrase (approximate substring checks for voice accents)
      const isMatch = userStr === targetStr || targetStr.includes(userStr) || userStr.includes(targetStr);
      setSpeakCorrect(isMatch);
      setSpeakChecked(true);

      if (isMatch) {
        setScore(s => s + 1);
      } else {
        triggerHeartLoss();
        if (addMistake && q.sentence) {
          addMistake({ de: q.sentence.de, uz: q.sentence.uz });
        }
      }
    };

    recognition.onerror = (e) => {
      setIsListening(false);
      console.error(e);
      showToast("Ovozni eshitishda xatolik bo'ldi. Mikrofonga ruxsat berilganini tekshiring.", "error");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Scrambled Sentence Builder handlers
  const handleChipTap = (word, index, isArranged) => {
    if (lessonChecked) return;

    if (isArranged) {
      setArrangedWords(prev => prev.filter((_, i) => i !== index));
      setScrambledChips(prev => [...prev, word]);
    } else {
      setArrangedWords(prev => [...prev, word]);
      let removed = false;
      setScrambledChips(prev => prev.filter(w => {
        if (!removed && w === word) {
          removed = true;
          return false;
        }
        return true;
      }));
    }
  };

  // Sync scrambled list initially
  useEffect(() => {
    if (questions.length > 0 && questions[qIdx]?.type === "sentence") {
      setScrambledChips(questions[qIdx].scrambled);
      setArrangedWords([]);
      setLessonChecked(false);
    }
  }, [qIdx, questions]);

  // Check sentence builder correctness
  const checkSentence = () => {
    const q = questions[qIdx];
    const userStr = arrangedWords.join(" ").trim().toLowerCase();
    const correctStr = q.sentence.de
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

    const isMatch = userStr === correctStr;
    setLessonCorrect(isMatch);
    setLessonChecked(true);

    if (isMatch) {
      setScore(s => s + 1);
    } else {
      triggerHeartLoss();
      if (addMistake && q.sentence) {
        addMistake({ de: q.sentence.de, uz: q.sentence.uz });
      }
    }
  };

  // Check spelling correctness
  const checkSpelling = () => {
    const q = questions[qIdx];
    const isCorrect = spellInput.trim().toLowerCase() === q.word.de.toLowerCase();
    setSpellCorrect(isCorrect);
    setSpellChecked(true);

    if (isCorrect) {
      setScore(s => s + 1);
    } else {
      triggerHeartLoss();
      if (addMistake && q.word) {
        addMistake(q.word);
      }
    }
  };

  // Mini matching click handler
  const handleMiniCardClick = (card) => {
    if (miniMatchedIds.includes(card.id) || miniWrongId) return;

    if (!miniSelectedCard) {
      setMiniSelectedCard(card);
      return;
    }

    if (miniSelectedCard.id === card.id) {
      setMiniSelectedCard(null);
      return;
    }

    if (miniSelectedCard.type !== card.type && miniSelectedCard.matchWord === card.matchWord) {
      const newMatched = [...miniMatchedIds, miniSelectedCard.id, card.id];
      setMiniMatchedIds(newMatched);
      setMiniSelectedCard(null);

      if (card.type === "de") playAudio(card.text);
      else playAudio(miniSelectedCard.text);

      if (newMatched.length === 8) {
        setScore(s => s + 1);
        setTimeout(() => {
          advanceNext();
        }, 1000);
      }
    } else {
      setMiniWrongId(card.id);
      if (addMistake && miniSelectedCard) {
        const deWord = miniSelectedCard.matchWord;
        let foundWord = null;
        for (const cat of Object.values(VOCAB)) {
          const match = cat.find(w => w.de === deWord);
          if (match) { foundWord = match; break; }
        }
        if (foundWord) {
          addMistake(foundWord);
        } else {
          addMistake({ de: deWord, uz: "Kichik moslashtirish xatosi" });
        }
      }
      setMiniSelectedCard(null);
      triggerHeartLoss();

      setTimeout(() => {
        setMiniWrongId(null);
      }, 400);
    }
  };

  const triggerHeartLoss = () => {
    setHearts(h => {
      const nextH = Math.max(0, h - 1);
      if (nextH === 0) {
        setTimeout(() => {
          showToast("Afsuski jonlaringiz tugadi! 💔 Qayta to'ldiring yoki do'kondan sotib oling.", "error");
          setDone(true);
        }, 800);
      }
      return nextH;
    });

    setShakeHearts(true);
    setTimeout(() => setShakeHearts(false), 500);
  };

  const advanceNext = () => {
    if (qIdx + 1 >= questions.length || hearts === 0) {
      setDone(true);

      // If active level is completed successfully, record it!
      if (activeLevel && hearts > 0) {
        // Complete the level
        setCompletedLevels(prev => {
          if (prev.includes(activeLevel.id)) return prev;
          const nextCompleted = [...prev, activeLevel.id];
          return nextCompleted;
        });

        // Award rewards
        const isPerfect = hearts === 5;
        const xpEarned = isPerfect ? 20 : 15;
        const gemsEarned = isPerfect ? 15 : 10;

        setXp(x => x + xpEarned);
        setGems(g => g + gemsEarned);

        // Record history
        setQuizHistory(prev => [
          ...prev, 
          { 
            score: score + 1, 
            total: questions.length, 
            date: new Date().toLocaleDateString("uz-UZ") 
          }
        ].slice(-8));

        // Add daily quest stats check
        try {
          const questXP = parseInt(localStorage.getItem("quest_xp") || "0", 10);
          localStorage.setItem("quest_xp", (questXP + xpEarned).toString());
          if (isPerfect) {
            localStorage.setItem("quest_perfect", "true");
          }
        } catch {}
      }
    } else {
      setQIdx(i => i + 1);
      setChosen(null);
      setArrangedWords([]);
      setLessonChecked(false);
      setSpellInput("");
      setSpellChecked(false);
      setMiniMatchedIds([]);
      setSpeakChecked(false);
      setSpeakTranscript("");
    }
  };

  // Multiple Choice Pick handler for level lessons
  const pickLevelMc = (opt) => {
    if (chosen) return;
    setChosen(opt);
    playAudio(opt.de);

    const isCorrect = opt.de === questions[qIdx].word.de;
    if (isCorrect) {
      setScore(s => s + 1);
    } else {
      triggerHeartLoss();
      if (addMistake && questions[qIdx].word) {
        addMistake(questions[qIdx].word);
      }
    }
  };

  // Multiple Choice Listening comprehension pick handler (Speaking fallback)
  const pickListeningMc = (opt) => {
    if (chosen) return;
    setChosen(opt);

    const isCorrect = opt.de === questions[qIdx].sentence.de;
    if (isCorrect) {
      setScore(s => s + 1);
    } else {
      triggerHeartLoss();
      if (addMistake && questions[qIdx].sentence) {
        addMistake({ de: questions[qIdx].sentence.de, uz: questions[qIdx].sentence.uz });
      }
    }
  };

  // Custom Quiz Screen Setup page handles
  if (page === "quizSetup" && !activeLevel) {
    return (
      <div style={{ ...S.inner, maxWidth: 450 }} className="inner-pad">
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 900, marginBottom: 6 }}>
          Quiz <span style={{ color: "var(--accent)" }}>Sozlamalari</span>
        </h2>
        <p style={{ fontSize: 13, color: "var(--text-light)", marginBottom: 32 }}>20 ta takrorlanmaydigan savol • To'g'ri javobni tanlang</p>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: "var(--accent)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>Kategoriya tanlang</div>
          <div className="chips-row">
            <button className={`chip ${quizCat === "all" ? "chip-act" : ""}`}
              style={quizCat === "all" ? { background: "var(--color)", borderColor: "var(--color)", color: "var(--bg)", fontWeight: 600 } : {}}
              onClick={() => setQuizCat("all")}>🌐 Hammasi ({allCount})</button>
            {Object.entries(CAT_META).map(([cat, m]) => (
              <button key={cat}
                className={`chip ${quizCat === cat ? "chip-act" : ""}`}
                style={quizCat === cat ? { background: m.accent, borderColor: m.accent, color: "#0d0d0d", fontWeight: 600 } : {}}
                onClick={() => setQuizCat(cat)}>{m.label} ({VOCAB[cat].length})</button>
            ))}
            <button 
              className={`chip ${quizCat === "favorites" ? "chip-act" : ""}`}
              style={quizCat === "favorites" ? { background: "var(--accent)", borderColor: "var(--accent)", color: "var(--bg)", fontWeight: 600 } : {}}
              onClick={() => setQuizCat("favorites")}
            >
              🌟 Tanlanganlar ({favorites.length})
            </button>
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
    );
  }

  // Done screen rendering (Duolingo--Done-dark Mock realization)
  if (done) {
    const isLevelLesson = !!activeLevel;
    const isLevelSuccess = isLevelLesson && hearts > 0;
    const earnedXp = hearts === 5 ? 20 : 15;
    const earnedGems = hearts === 5 ? 15 : 10;
    const accuracy = hearts === 5 ? 100 : hearts === 4 ? 85 : hearts === 3 ? 70 : hearts === 2 ? 50 : 30;

    return (
      <div style={{ 
        maxWidth: 480, 
        margin: "0 auto", 
        padding: "40px 16px 60px",
        textAlign: "center",
        boxSizing: "border-box",
        minHeight: "85vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden"
      }} className="inner-pad">
        
        {/* CSS Confetti Overlay */}
        <div className="confetti-container" style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1
        }}>
          {/* We generate simple absolute divs that float down via css animation */}
          {[...Array(12)].map((_, i) => {
            const left = Math.random() * 100;
            const delay = Math.random() * 2;
            const color = ["#ffd700", "#58cc02", "#1cb0f6", "#ff4b4b", "#a435f0"][i % 5];
            return (
              <div 
                key={i} 
                className="confetti-particle"
                style={{
                  position: "absolute",
                  top: -20,
                  left: `${left}%`,
                  width: 8,
                  height: 14,
                  borderRadius: 2,
                  background: color,
                  opacity: 0.8,
                  animation: `confetti-fall ${2 + Math.random() * 2}s linear infinite`,
                  animationDelay: `${delay}s`,
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
              />
            );
          })}
        </div>

        <div style={{ zIndex: 2 }}>
          {/* Celebrating Mascot Owl & Muscle Builder Trainer SVG */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 10, margin: "20px 0 30px" }}>
            
            {/* Muscle Builder character */}
            <svg width="90" height="110" viewBox="0 0 60 70" fill="none" style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))" }}>
              {/* Muscle arms */}
              <circle cx="10" cy="38" r="7" fill="#f7b794" />
              <path d="M10 38 L20 40 L16 33 Z" fill="#f7b794" stroke="#ff4b4b" strokeWidth="1.5" />
              <circle cx="50" cy="38" r="7" fill="#f7b794" />
              <path d="M50 38 L40 40 L44 33 Z" fill="#f7b794" stroke="#ff4b4b" strokeWidth="1.5" />
              
              {/* T-shirt torso */}
              <rect x="18" y="32" width="24" height="24" rx="4" fill="#ff4b4b" />
              <rect x="23" y="52" width="14" height="10" fill="#1c2730" />
              
              {/* Head */}
              <rect x="20" y="10" width="20" height="22" rx="6" fill="#f7b794" />
              {/* Orange Headband & Hair */}
              <path d="M18 10 C18 4, 42 4, 42 10 Z" fill="#ff9600" />
              <rect x="20" y="15" width="20" height="4" fill="#ffc107" />
              
              {/* Face details */}
              <circle cx="26" cy="22" r="1.5" fill="#000" />
              <circle cx="34" cy="22" r="1.5" fill="#000" />
              <path d="M28 27 Q30 28 32 27" stroke="#000" strokeWidth="1.2" strokeLinecap="round" />
              
              {/* Shoes/Feet */}
              <circle cx="24" cy="64" r="3.5" fill="#ffc107" />
              <circle cx="36" cy="64" r="3.5" fill="#ffc107" />
            </svg>

            {/* Waving mascot owl */}
            <svg width="72" height="72" viewBox="0 0 44 44" fill="none" style={{ filter: "drop-shadow(0 4px 12px rgba(88,204,2,0.2))", animation: "bounce 1.5s infinite" }}>
              <rect width="44" height="44" rx="14" fill="#58cc02" />
              {/* Big happy eyes */}
              <circle cx="14" cy="18" r="7" fill="#fff" />
              <path d="M11 18 Q14 20 17 18" stroke="#000" strokeWidth="2" strokeLinecap="round" fill="none" />
              <circle cx="30" cy="18" r="7" fill="#fff" />
              <path d="M27 18 Q30 20 33 18" stroke="#000" strokeWidth="2" strokeLinecap="round" fill="none" />
              {/* Beak */}
              <path d="M18 22 L22 26 L26 22 Z" fill="#ffc107" />
              {/* Wings waving */}
              <path d="M4 22 C1 18, 0 14, 2 12" stroke="#58cc02" strokeWidth="4" strokeLinecap="round" />
              <path d="M40 22 C43 18, 44 14, 42 12" stroke="#58cc02" strokeWidth="4" strokeLinecap="round" />
            </svg>

          </div>

          <h2 style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: 28, 
            fontWeight: 900, 
            marginBottom: 6,
            color: "#ffd700",
            letterSpacing: -0.5
          }}>
            {isLevelSuccess ? "Perfect Score!" : "Lesson Completed!"}
          </h2>

          <p style={{ 
            fontSize: 14, 
            color: "#a3abb6", 
            lineHeight: 1.5, 
            marginBottom: 36,
            padding: "0 24px"
          }}>
            {isLevelSuccess 
              ? "You didn't make a single mistake in this lesson. Nemis tili sari olg'a qadam!" 
              : "Darsni muvaffaqiyatli yakunladingiz!"}
          </p>

          {/* Duolingo Mockup Stat boxes */}
          <div style={{ display: "flex", gap: 14, padding: "0 12px", marginBottom: 32 }}>
            {/* Total XP box */}
            <div style={{
              flex: 1,
              background: "#101216",
              border: "2px solid #1c2730",
              borderRadius: 16,
              padding: "16px 12px",
              textAlign: "center"
            }}>
              <div style={{
                fontSize: 10,
                fontWeight: 900,
                color: "#788290",
                textTransform: "uppercase",
                letterSpacing: 0.8,
                marginBottom: 10
              }}>
                TOTAL XP
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                fontSize: 20,
                fontWeight: 900,
                color: "#ff9600"
              }}>
                {/* Fire flame SVG */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5Z" />
                </svg>
                <span>{earnedXp}</span>
              </div>
            </div>

            {/* Accuracy percentage box */}
            <div style={{
              flex: 1,
              background: "#101216",
              border: "2px solid #1c2730",
              borderRadius: 16,
              padding: "16px 12px",
              textAlign: "center"
            }}>
              <div style={{
                fontSize: 10,
                fontWeight: 900,
                color: "#788290",
                textTransform: "uppercase",
                letterSpacing: 0.8,
                marginBottom: 10
              }}>
                EXTRAORDINARY
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                fontSize: 20,
                fontWeight: 900,
                color: "#58cc02"
              }}>
                {/* Accuracy Target Bullseye SVG */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                </svg>
                <span>{accuracy}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button stack matching Duolingo bottom buttons */}
        <div style={{ zIndex: 2, padding: "0 8px" }}>
          <button 
            className="btn-y" 
            onClick={() => navigate("home")} 
            style={{ 
              width: "100%", 
              background: "#58cc02", 
              color: "#fff",
              border: "none",
              borderRadius: 16,
              padding: "16px 24px",
              fontSize: 15,
              fontWeight: 800,
              boxShadow: "0 4px 0 #3b9c02",
              textTransform: "uppercase",
              letterSpacing: 0.8
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
            CONTINUE
          </button>
        </div>

      </div>
    );
  }

  // Active Lesson/Quiz engine
  if (questions.length > 0) {
    const q = questions[qIdx];
    const isLevel = !!activeLevel;
    const stepsCount = questions.length;

    return (
      <div style={S.inner} className="inner-pad">
        {/* Dynamic header tracker */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
            {qIdx + 1} / {stepsCount} - {isLevel ? "Dars" : "Quiz"}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: "var(--accent)", fontWeight: 700 }}>⚡ {score * 10} XP</span>
            <span style={{ fontSize: 13, color: "#e63946", fontWeight: 700 }} className={shakeHearts ? "shake" : ""}>
              ❤️ {hearts}
            </span>
          </div>
        </div>

        {/* Dynamic progress fill */}
        <div className="prog-bar">
          <div className="prog-fill" style={{ width: `${(qIdx / stepsCount) * 100}%` }} />
        </div>

        {/* ──────── CARD TYPE 1: MULTIPLE CHOICE ──────── */}
        {q.type === "mc" && (
          <div>
            <div style={{
              background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 20,
              padding: "36px 20px", textAlign: "center", marginBottom: 24
            }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>
                So'z ma'nosini tanlang:
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 900, lineHeight: 1.2, marginBottom: 8 }}>
                {q.word.de}
              </div>
              <button 
                className="speaker-btn" 
                onClick={() => playAudio(q.word.de)}
                title="Talaffuzni tinglash"
              >
                🔊
              </button>
            </div>

            {/* MCQ Options list */}
            {q.options.map((opt, i) => {
              const isCorrect = opt.de === q.word.de;
              const isSelected = chosen?.de === opt.de;
              let cls = "qopt";
              if (chosen) cls += isCorrect ? " correct" : isSelected ? " wrong" : "";

              return (
                <button 
                  key={i} 
                  className={cls} 
                  onClick={() => pickLevelMc(opt)} 
                  disabled={!!chosen}
                >
                  <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
                  <span>{opt.uz}</span>
                  {chosen && isCorrect && <span style={{ marginLeft: "auto", color: "#2ecc71" }}>✓</span>}
                  {chosen && isSelected && !isCorrect && <span style={{ marginLeft: "auto", color: "#e63946" }}>✗</span>}
                </button>
              );
            })}

            {/* MCQ Feedback block */}
            {chosen && (
              <div style={{ marginTop: 24, textAlign: "center" }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: chosen.de === q.word.de ? "#2ecc71" : "#e63946" }}>
                  {chosen.de === q.word.de ? "🎉 Ajoyib, to'g'ri!" : `❌ Xato! To'g'ri javob: "${q.word.uz}"`}
                </div>
                <button className="btn-y" style={{ margin: "0 auto" }} onClick={advanceNext}>
                  {qIdx + 1 >= stepsCount ? "Natijani Ko'r" : "Davom Etish →"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ──────── CARD TYPE 2: SPELLING / DIKTANT ──────── */}
        {q.type === "spelling" && (
          <div>
            <div style={{
              background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 20,
              padding: "28px 20px", textAlign: "center", marginBottom: 24
            }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>
                Eshitgan so'zingizni yozing:
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 14, alignItems: "center", marginBottom: 14 }}>
                <button 
                  className="speaker-btn playing" 
                  onClick={() => playAudio(q.word.de)}
                  style={{ width: 56, height: 56, fontSize: 24 }}
                >
                  🔊
                </button>
              </div>
              <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600 }}>
                Tarjimasi: "{q.word.uz}"
              </div>
            </div>

            {/* TextInput spelling */}
            <input
              type="text"
              className="search-inp"
              placeholder="Nemischa tarjimasini yozing..."
              value={spellInput}
              disabled={spellChecked}
              onChange={(e) => setSpellInput(e.target.value)}
              style={{
                textAlign: "center",
                fontSize: 16,
                padding: 14,
                borderWidth: 2,
                borderColor: spellChecked ? (spellCorrect ? "#2ecc71" : "#e63946") : "var(--search-border)"
              }}
            />

            {/* Umlaut helper keyboard */}
            {!spellChecked && (
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 14 }}>
                {["ä", "ö", "ü", "ß"].map(char => (
                  <button 
                    key={char} 
                    className="btn-o" 
                    onClick={() => setSpellInput(prev => prev + char)}
                    style={{ fontSize: 15, padding: "8px 14px", fontWeight: 700 }}
                  >
                    {char}
                  </button>
                ))}
              </div>
            )}

            {/* Spelling actions and feedback */}
            {!spellChecked ? (
              <button
                className="btn-y"
                onClick={checkSpelling}
                disabled={!spellInput.trim()}
                style={{ width: "100%", marginTop: 20, opacity: spellInput.trim() ? 1 : 0.6 }}
              >
                Tekshirish 🔍
              </button>
            ) : (
              <div style={{ marginTop: 24, textAlign: "center" }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: spellCorrect ? "#2ecc71" : "#e63946" }}>
                  {spellCorrect ? "🎉 Mukammal! To'g'ri topdingiz." : `❌ Noto'g'ri. To'g'ri yozilishi: "${q.word.de}"`}
                </div>
                <button className="btn-y" style={{ margin: "0 auto" }} onClick={advanceNext}>
                  {qIdx + 1 >= stepsCount ? "Natijani Ko'r" : "Davom Etish →"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ──────── CARD TYPE 3: SCRAMBLED SENTENCE BUILDER ──────── */}
        {q.type === "sentence" && (
          <div>
            <div style={{
              background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 20,
              padding: "24px 20px", textAlign: "center", marginBottom: 20
            }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>
                Ushbu gapni nemis tiliga tarjima qiling:
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900 }}>
                "{q.sentence.uz}"
              </h3>
            </div>

            {/* Arranged Slots box */}
            <div style={S.sentenceSlots}>
              {arrangedWords.map((word, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleChipTap(word, idx, true)} 
                  style={{ ...S.chip, borderColor: "var(--accent)", color: "var(--accent)" }}
                >
                  {word}
                </div>
              ))}
              {arrangedWords.length === 0 && (
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>So'zlarni bosib gap quring...</span>
              )}
            </div>

            {/* Scrambled Available chips */}
            {!lessonChecked && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 32 }}>
                {scrambledChips.map((word, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => handleChipTap(word, idx, false)} 
                    style={S.chip}
                  >
                    {word}
                  </div>
                ))}
              </div>
            )}

            {/* Actions & Feedback */}
            {!lessonChecked ? (
              <button
                className="btn-y"
                onClick={checkSentence}
                disabled={arrangedWords.length === 0}
                style={{ width: "100%", opacity: arrangedWords.length > 0 ? 1 : 0.6 }}
              >
                Tekshirish ✓
              </button>
            ) : (
              <div style={{ marginTop: 20, textAlign: "center" }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: lessonCorrect ? "#2ecc71" : "#e63946" }}>
                  {lessonCorrect ? "🎉 Ajoyib talaffuz va to'g'ri gap!" : `❌ Xato. To'g'ri gap: "${q.sentence.de}"`}
                </div>
                <button className="btn-y" style={{ margin: "0 auto" }} onClick={advanceNext}>
                  {qIdx + 1 >= stepsCount ? "Natijani Ko'r" : "Davom Etish →"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ──────── CARD TYPE 4: SPEECH RECOGNITION / LISTENING ──────── */}
        {q.type === "speaking" && (
          <div>
            <div style={{
              background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 20,
              padding: "28px 20px", textAlign: "center", marginBottom: 24
            }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>
                {speechSupported ? "Baland ovozda gapiring (Mikrofonni bosing):" : "Gapni eshiting va to'g'risini tanlang:"}
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900, marginBottom: 14 }}>
                "{q.sentence.de}"
              </h3>
              <button 
                className="speaker-btn" 
                onClick={() => playAudio(q.sentence.de)}
                title="Nemischa talaffuzni eshitish"
                style={{ width: 44, height: 44, fontSize: 18 }}
              >
                🔊
              </button>
            </div>

            {/* Speaking / SpeechRecognition interactive engine */}
            {speechSupported ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                <button
                  onClick={startSpeakingRecognition}
                  disabled={isListening}
                  className={`nb ${isListening ? "pulse-mic" : ""}`}
                  style={{
                    width: 78,
                    height: 78,
                    borderRadius: "50%",
                    background: isListening ? "#e63946" : "var(--accent)",
                    color: "var(--bg)",
                    fontSize: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: isListening ? "0 0 20px rgba(230, 57, 70, 0.4)" : "0 6px 16px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  {isListening ? "🎙️" : "🎤"}
                </button>
                <div style={{ fontSize: 13, color: isListening ? "#e63946" : "var(--text-muted)", fontWeight: 600 }}>
                  {isListening ? "Tinglamoqda... Gapiring! 🎧" : "Mikrofonni bosib gapiring."}
                </div>

                {/* Transcribed Text Feedback */}
                {speakTranscript && (
                  <div style={{
                    background: "var(--chip-bg)",
                    border: "1.5px solid var(--chip-border)",
                    borderRadius: 14,
                    padding: "12px 18px",
                    width: "100%",
                    textAlign: "center"
                  }}>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Biz eshitdik:</span>
                    <strong style={{ fontSize: 15, color: "var(--color)" }}>"{speakTranscript}"</strong>
                  </div>
                )}

                {/* Speaking results triggers */}
                {speakChecked ? (
                  <div style={{ textAlign: "center", width: "100%" }}>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: speakCorrect ? "#2ecc71" : "#e63946" }}>
                      {speakCorrect ? "🎉 Ajoyib! Talaffuz to'g'ri bajarildi." : "❌ Xato. Qaytadan urinib ko'ring."}
                    </div>
                    <div style={{ display: "flex", gap: 10, width: "100%" }}>
                      <button className="btn-o" style={{ flex: 1 }} onClick={startSpeakingRecognition}>
                        🎤 Qayta Urinish
                      </button>
                      <button className="btn-y" style={{ flex: 1 }} onClick={advanceNext}>
                        {qIdx + 1 >= stepsCount ? "Natijani Ko'r" : "Davom Etish →"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    className="nb nl" 
                    onClick={advanceNext} 
                    style={{ fontSize: 12, color: "var(--text-muted)", textDecoration: "underline" }}
                  >
                    Keyingisiga O'tkazish ➜
                  </button>
                )}
              </div>
            ) : (
              /* GRACEFUL DEGRADATION: Listening MCQ Comprehension Choices */
              <div>
                {q.options.map((opt, i) => {
                  const isCorrect = opt.de === q.sentence.de;
                  const isSelected = chosen?.de === opt.de;
                  let cls = "qopt";
                  if (chosen) cls += isCorrect ? " correct" : isSelected ? " wrong" : "";

                  return (
                    <button 
                      key={i} 
                      className={cls} 
                      onClick={() => pickListeningMc(opt)} 
                      disabled={!!chosen}
                    >
                      <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
                      <span>{opt.de}</span>
                      {chosen && isCorrect && <span style={{ marginLeft: "auto", color: "#2ecc71" }}>✓</span>}
                      {chosen && isSelected && !isCorrect && <span style={{ marginLeft: "auto", color: "#e63946" }}>✗</span>}
                    </button>
                  );
                })}

                {chosen && (
                  <div style={{ marginTop: 24, textAlign: "center" }}>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: chosen.de === q.sentence.de ? "#2ecc71" : "#e63946" }}>
                      {chosen.de === q.sentence.de ? "🎉 To'g'ri javob!" : "❌ Xato javob!"}
                    </div>
                    <button className="btn-y" style={{ margin: "0 auto" }} onClick={advanceNext}>
                      {qIdx + 1 >= stepsCount ? "Natijani Ko'r" : "Davom Etish →"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ──────── CARD TYPE 5: MINI MATCHING PAIRS ──────── */}
        {q.type === "match" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>
                So'zlar juftligini toping:
              </div>
              <p style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600 }}>Tegishli nemischa va o'zbekcha juftlarni tanlang.</p>
            </div>

            <div style={S.grid2}>
              {miniCards.map((card) => {
                const isSelected = miniSelectedCard?.id === card.id;
                const isMatched = miniMatchedIds.includes(card.id);
                const isWrong = miniWrongId === card.id;

                let cardClass = "match-card";
                if (isSelected) cardClass += " selected";
                if (isMatched) cardClass += " matched";
                if (isWrong) cardClass += " incorrect";

                return (
                  <div 
                    key={card.id} 
                    className={cardClass}
                    onClick={() => handleMiniCardClick(card)}
                  >
                    {card.text}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
