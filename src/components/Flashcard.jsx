import React, { useState, useEffect, useCallback } from "react";
import { VOCAB } from "../data/vocabData";
import { shuffle } from "../utils/helpers";
import { speakWord } from "../utils/helpers";
import { recordReview, getDueWords } from "../utils/srs";

export default function Flashcard({
  navigate,
  category,
  setCategory,
  favorites,
  showToast,
  xp,
  setXp,
  gems,
  setGems,
}) {
  const [cards, setCards] = useState([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({ easy: 0, hard: 0, skip: 0 });
  const [done, setDone] = useState(false);
  const [showSetup, setShowSetup] = useState(true);
  const [playingWord, setPlayingWord] = useState(false);

  const cats = Object.keys(VOCAB);

  const startSession = useCallback(() => {
    const allWords = category === "all"
      ? Object.entries(VOCAB).flatMap(([cat, ws]) => ws.map(w => ({ ...w, cat })))
      : category === "favorites"
        ? Object.entries(VOCAB).flatMap(([cat, ws]) => ws.map(w => ({ ...w, cat }))).filter(w => favorites.includes(w.de))
        : (VOCAB[category] || []).map(w => ({ ...w, cat: category }));

    // SRS: faqat takrorlanishi kerak bo'lgan so'zlar
    const due = getDueWords(allWords);
    const pool = due.length >= 5 ? due : allWords;
    const shuffled = shuffle(pool).slice(0, 20);

    if (shuffled.length === 0) {
      showToast("Bu kategoriyada so'z yo'q!", "error");
      return;
    }

    setCards(shuffled);
    setIdx(0);
    setFlipped(false);
    setSessionStats({ easy: 0, hard: 0, skip: 0 });
    setDone(false);
    setShowSetup(false);
  }, [category, favorites]);

  const handleFlip = () => setFlipped(f => !f);

  const handleRate = (rating) => {
    const word = cards[idx];
    recordReview(word.de, rating);

    if (rating === 3) {
      setSessionStats(s => ({ ...s, easy: s.easy + 1 }));
      setXp(x => x + 5);
    } else if (rating === 1) {
      setSessionStats(s => ({ ...s, hard: s.hard + 1 }));
    } else {
      setSessionStats(s => ({ ...s, skip: s.skip + 1 }));
    }

    const next = idx + 1;
    if (next >= cards.length) {
      setDone(true);
      const earned = sessionStats.easy * 5 + 10;
      setGems(g => g + 5);
      showToast(`Sessiya tugadi! +${earned} XP, +5 💎`, "success");
    } else {
      setIdx(next);
      setFlipped(false);
    }
  };

  const handleSpeak = (e) => {
    e.stopPropagation();
    const word = cards[idx]?.de;
    if (!word) return;
    setPlayingWord(true);
    speakWord(word, () => setPlayingWord(false));
  };

  const progress = cards.length > 0 ? ((idx) / cards.length) * 100 : 0;

  if (showSetup) {
    return (
      <div style={{ padding: "24px 16px", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button onClick={() => navigate("home")} style={{
            background: "var(--hover-bg)", border: "none", borderRadius: 10,
            padding: "8px 12px", cursor: "pointer", color: "var(--text-light)", fontSize: 18
          }}>←</button>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900 }}>
              🃏 Flashcard
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
              Spaced Repetition bilan o'rgan
            </p>
          </div>
        </div>

        {/* Category selector */}
        <div style={{
          background: "var(--card-bg)", border: "1px solid var(--border-color)",
          borderRadius: 18, padding: 20, marginBottom: 20
        }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 14 }}>
            Kategoriya tanlang
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["all", "favorites", ...cats].map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 600,
                  background: category === cat ? "var(--accent)" : "var(--hover-bg)",
                  color: category === cat ? (document.body.classList.contains("light-theme") ? "#fff" : "#000") : "var(--text-light)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {cat === "all" ? "🌍 Hammasi" : cat === "favorites" ? "⭐ Sevimlilar" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* SRS info */}
        <div style={{
          background: "linear-gradient(135deg, rgba(88,204,2,0.08), rgba(28,176,246,0.08))",
          border: "1px solid rgba(88,204,2,0.15)",
          borderRadius: 16, padding: 16, marginBottom: 24
        }}>
          <div style={{ fontSize: 13, color: "var(--text-light)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--accent)" }}>Spaced Repetition (SRS)</strong> — aqlli takrorlash tizimi.<br />
            "Oson" degan so'zlar kamroq, "Qiyin" degan so'zlar tez-tez chiqadi.<br />
            Bu usul bilan so'zlarni <strong>5x tezroq</strong> esda saqlash mumkin!
          </div>
        </div>

        <button
          className="btn-y"
          onClick={startSession}
          style={{ width: "100%", padding: "16px", fontSize: 16, fontWeight: 800 }}
        >
          🃏 Boshlash
        </button>
      </div>
    );
  }

  if (done) {
    const total = sessionStats.easy + sessionStats.hard + sessionStats.skip;
    const accuracy = total > 0 ? Math.round((sessionStats.easy / total) * 100) : 0;
    return (
      <div style={{ padding: "24px 16px", maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>
          {accuracy >= 80 ? "🎉" : accuracy >= 50 ? "👍" : "💪"}
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, marginBottom: 8 }}>
          Sessiya Tugadi!
        </h2>
        <p style={{ color: "var(--text-muted)", marginBottom: 28 }}>
          Ajoyib ish! Davom eting.
        </p>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 28 }}>
          {[
            { label: "Oson", value: sessionStats.easy, color: "#58cc02", icon: "✓" },
            { label: "Qiyin", value: sessionStats.hard, color: "#ff4b4b", icon: "✗" },
            { label: "O'tkazib", value: sessionStats.skip, color: "#ff9600", icon: "→" },
          ].map(s => (
            <div key={s.label} style={{
              background: "var(--card-bg)", border: "1px solid var(--border-color)",
              borderRadius: 14, padding: 14, textAlign: "center"
            }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{
          background: "var(--card-bg)", border: "1px solid var(--border-color)",
          borderRadius: 16, padding: 16, marginBottom: 24
        }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: accuracy >= 80 ? "#58cc02" : "#e5c158" }}>
            {accuracy}%
          </div>
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Aniqlik darajasi</div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn-y" onClick={startSession} style={{ flex: 1 }}>
            🔄 Yana o'yna
          </button>
          <button className="btn-o" onClick={() => navigate("home")} style={{ flex: 1 }}>
            🏠 Bosh sahifa
          </button>
        </div>
      </div>
    );
  }

  const card = cards[idx];
  if (!card) return null;

  return (
    <div style={{ padding: "20px 16px", maxWidth: 480, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <button onClick={() => setShowSetup(true)} style={{
          background: "var(--hover-bg)", border: "none", borderRadius: 10,
          padding: "8px 12px", cursor: "pointer", color: "var(--text-light)", fontSize: 18
        }}>←</button>
        <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>
          {idx + 1} / {cards.length}
        </div>
        <div style={{ fontSize: 13, color: "#58cc02", fontWeight: 700 }}>
          ✓ {sessionStats.easy}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        height: 6, background: "var(--hover-bg)", borderRadius: 3, marginBottom: 24, overflow: "hidden"
      }}>
        <div style={{
          height: "100%", width: `${progress}%`,
          background: "linear-gradient(90deg, #58cc02, #1cb0f6)",
          borderRadius: 3, transition: "width 0.4s ease"
        }} />
      </div>

      {/* Card */}
      <div
        onClick={handleFlip}
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border-color)",
          borderRadius: 24,
          minHeight: 220,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          padding: 32,
          marginBottom: 20,
          position: "relative",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          transition: "transform 0.15s ease",
          userSelect: "none",
        }}
      >
        {/* Category chip */}
        <div style={{
          position: "absolute", top: 16, left: 16,
          background: "var(--hover-bg)", borderRadius: 8,
          padding: "4px 10px", fontSize: 11, fontWeight: 700,
          color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5
        }}>
          {card.cat}
        </div>

        {/* Speaker button */}
        <button
          onClick={handleSpeak}
          style={{
            position: "absolute", top: 12, right: 12,
            background: playingWord ? "rgba(28,176,246,0.15)" : "var(--hover-bg)",
            border: "none", borderRadius: 10,
            padding: "8px 10px", cursor: "pointer",
            fontSize: 16, transition: "all 0.2s ease",
          }}
        >
          {playingWord ? "🔊" : "🔈"}
        </button>

        {!flipped ? (
          <>
            {/* Front: German word */}
            <div style={{
              fontSize: 36, fontWeight: 900,
              fontFamily: "'Playfair Display', serif",
              textAlign: "center", lineHeight: 1.2,
              marginBottom: 8
            }}>
              {card.de}
            </div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 12 }}>
              👆 Bosing — tarjima ko'ring
            </div>
          </>
        ) : (
          <>
            {/* Back: Translation */}
            <div style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 8, fontWeight: 600 }}>
              Tarjima:
            </div>
            <div style={{
              fontSize: 28, fontWeight: 800,
              color: "var(--accent)", textAlign: "center"
            }}>
              {card.uz}
            </div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 8 }}>
              🇩🇪 {card.de}
            </div>
          </>
        )}
      </div>

      {/* Rating buttons (only after flip) */}
      {flipped ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <button
            onClick={() => handleRate(0)}
            style={{
              padding: "14px 8px", borderRadius: 16, border: "2px solid #ff4b4b",
              background: "rgba(255,75,75,0.08)", color: "#ff4b4b",
              fontWeight: 700, fontSize: 13, cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            ✗ Bilmadim
          </button>
          <button
            onClick={() => handleRate(1)}
            style={{
              padding: "14px 8px", borderRadius: 16, border: "2px solid #ff9600",
              background: "rgba(255,150,0,0.08)", color: "#ff9600",
              fontWeight: 700, fontSize: 13, cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            ~ Qiyin
          </button>
          <button
            onClick={() => handleRate(3)}
            style={{
              padding: "14px 8px", borderRadius: 16, border: "2px solid #58cc02",
              background: "rgba(88,204,2,0.08)", color: "#58cc02",
              fontWeight: 700, fontSize: 13, cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            ✓ Oson!
          </button>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <div style={{
            background: "var(--hover-bg)", borderRadius: 14,
            padding: "12px 20px", display: "inline-block",
            fontSize: 13, color: "var(--text-muted)"
          }}>
            Esladingizmi? Kartochkani bosing va baholang.
          </div>
        </div>
      )}
    </div>
  );
}
