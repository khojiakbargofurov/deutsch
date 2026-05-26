import React, { useState } from "react";
import { speakWord } from "../utils/helpers";

export default function MistakeReview({ navigate, mistakes, clearMistakes, showToast }) {
  const [quizMode, setQuizMode] = useState(false);
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Build quiz from mistakes: shuffle distractors from mistake list itself
  const buildMistakeQuiz = () => {
    return mistakes.map(m => {
      const distractors = mistakes
        .filter(x => x.de !== m.de)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      const opts = [m, ...distractors].sort(() => Math.random() - 0.5);
      return { word: m, options: opts };
    }).sort(() => Math.random() - 0.5).slice(0, Math.min(10, mistakes.length));
  };

  const [quizQuestions] = useState(() => buildMistakeQuiz());

  const handleSpeak = (word) => {
    setPlaying(true);
    speakWord(word, () => setPlaying(false));
  };

  const handleChoose = (opt) => {
    if (chosen) return;
    setChosen(opt.de);
    if (opt.de === quizQuestions[idx].word.de) setScore(s => s + 1);
    setTimeout(() => {
      if (idx + 1 >= quizQuestions.length) {
        setDone(true);
      } else {
        setIdx(i => i + 1);
        setChosen(null);
      }
    }, 900);
  };

  // ── LIST VIEW ──────────────────────────────────────────────
  if (!quizMode) {
    return (
      <div style={{ padding: "20px 16px", maxWidth: 500, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={() => navigate("home")} style={{
            background: "var(--hover-bg)", border: "none", borderRadius: 10,
            padding: "8px 12px", cursor: "pointer", color: "var(--text-light)", fontSize: 18
          }}>←</button>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900 }}>
              ❌ Xato So'zlar
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
              {mistakes.length} ta so'z — takrorlash kerak
            </p>
          </div>
        </div>

        {mistakes.length === 0 ? (
          <div style={{
            background: "var(--card-bg)", border: "1px solid var(--border-color)",
            borderRadius: 20, padding: 32, textAlign: "center"
          }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
              Xatolar yo'q!
            </div>
            <div style={{ fontSize: 14, color: "var(--text-muted)" }}>
              Ajoyib! Hozircha hech qanday xato yo'q. O'yin o'ynab, xatolaringiz bu yerda saqlanadi.
            </div>
          </div>
        ) : (
          <>
            {/* Actions */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <button
                className="btn-y"
                onClick={() => setQuizMode(true)}
                style={{ flex: 1, padding: "14px", fontWeight: 800 }}
              >
                🎯 Test — xato so'zlardan
              </button>
              <button
                onClick={() => {
                  clearMistakes();
                  showToast("Barcha xatolar tozalandi! 🧹", "success");
                }}
                style={{
                  padding: "14px 16px",
                  borderRadius: 14,
                  background: "rgba(255,75,75,0.08)",
                  border: "1px solid rgba(255,75,75,0.2)",
                  color: "#ff4b4b",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                🗑️ Tozala
              </button>
            </div>

            {/* Mistakes info banner */}
            <div style={{
              background: "rgba(255,75,75,0.06)",
              border: "1px solid rgba(255,75,75,0.15)",
              borderRadius: 16, padding: "12px 16px", marginBottom: 20,
              fontSize: 13, color: "var(--text-light)", lineHeight: 1.6
            }}>
              💡 Bu so'zlarni <strong>Flashcard</strong> yoki <strong>Test</strong> yordamida takrorlang — tezroq esda qoladi!
            </div>

            {/* Mistakes list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {mistakes.map((m, i) => (
                <div
                  key={m.de + i}
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid rgba(255,75,75,0.15)",
                    borderRadius: 16,
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  {/* Number */}
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: "rgba(255,75,75,0.12)",
                    color: "#ff4b4b",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 800, flexShrink: 0
                  }}>
                    {i + 1}
                  </div>

                  {/* Word */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 16 }}>{m.de}</div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
                      {m.uz}
                    </div>
                  </div>

                  {/* Xato soni */}
                  <div style={{
                    background: "rgba(255,75,75,0.1)",
                    border: "1px solid rgba(255,75,75,0.2)",
                    borderRadius: 8,
                    padding: "4px 10px",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#ff4b4b",
                    whiteSpace: "nowrap"
                  }}>
                    {m.count || 1}× xato
                  </div>

                  {/* Audio button */}
                  <button
                    onClick={() => handleSpeak(m.de)}
                    style={{
                      background: "var(--hover-bg)", border: "none",
                      borderRadius: 8, padding: "8px", cursor: "pointer", fontSize: 16
                    }}
                  >
                    🔊
                  </button>
                </div>
              ))}
            </div>

            <div style={{ height: 24 }} />
          </>
        )}
      </div>
    );
  }

  // ── QUIZ DONE ─────────────────────────────────────────────
  if (done) {
    const acc = Math.round((score / quizQuestions.length) * 100);
    return (
      <div style={{ padding: "24px 16px", maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>
          {acc >= 80 ? "🎉" : acc >= 50 ? "👍" : "💪"}
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900, marginBottom: 8 }}>
          {acc >= 80 ? "Ajoyib!" : "Davom eting!"}
        </h2>
        <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>
          {score} / {quizQuestions.length} to'g'ri
        </p>
        <div style={{
          fontSize: 52, fontWeight: 900,
          color: acc >= 80 ? "#58cc02" : "#e5c158",
          marginBottom: 28
        }}>{acc}%</div>
        {acc >= 80 && (
          <div style={{
            background: "rgba(88,204,2,0.1)", border: "1px solid rgba(88,204,2,0.2)",
            borderRadius: 14, padding: "12px 16px", marginBottom: 20,
            fontSize: 13, color: "#58cc02", fontWeight: 600
          }}>
            🎯 Yaxshi ish! Endi bu so'zlarni tozalashingiz mumkin.
          </div>
        )}
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn-y" onClick={() => { setIdx(0); setChosen(null); setScore(0); setDone(false); }} style={{ flex: 1 }}>
            🔄 Qayta
          </button>
          <button className="btn-o" onClick={() => setQuizMode(false)} style={{ flex: 1 }}>
            ← Ro'yxat
          </button>
        </div>
      </div>
    );
  }

  // ── QUIZ MODE ─────────────────────────────────────────────
  const q = quizQuestions[idx];
  if (!q) return null;
  const correctDe = q.word.de;

  return (
    <div style={{ padding: "20px 16px", maxWidth: 480, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={() => setQuizMode(false)} style={{
          background: "var(--hover-bg)", border: "none", borderRadius: 10,
          padding: "8px 12px", cursor: "pointer", color: "var(--text-light)", fontSize: 18
        }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ height: 6, background: "var(--hover-bg)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${(idx / quizQuestions.length) * 100}%`,
              background: "#ff4b4b", borderRadius: 3, transition: "width 0.3s ease"
            }} />
          </div>
        </div>
        <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>
          {idx + 1}/{quizQuestions.length}
        </span>
      </div>

      {/* Question card */}
      <div style={{
        background: "var(--card-bg)", border: "1px solid rgba(255,75,75,0.2)",
        borderRadius: 20, padding: 28, marginBottom: 20, textAlign: "center"
      }}>
        <div style={{ fontSize: 12, color: "#ff4b4b", fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 14 }}>
          ❌ Xato So'zlar Testi
        </div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 10 }}>
          Bu so'zning tarjimasini toping:
        </div>
        <div style={{ fontSize: 30, fontWeight: 900, fontFamily: "'Playfair Display', serif", marginBottom: 16 }}>
          {q.word.de}
        </div>
        <button
          onClick={() => handleSpeak(q.word.de)}
          style={{
            background: "var(--hover-bg)", border: "none",
            borderRadius: 10, padding: "8px 16px", cursor: "pointer",
            fontSize: 14, color: "var(--text-muted)"
          }}
        >
          🔊 Talaffuz
        </button>
      </div>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {q.options.map((opt, i) => {
          const isCorrect = opt.de === correctDe;
          const isChosen = chosen === opt.de;
          let bg = "var(--card-bg)";
          let border = "var(--border-color)";
          let color = "var(--color)";
          if (chosen) {
            if (isCorrect) { bg = "rgba(88,204,2,0.12)"; border = "#58cc02"; color = "#58cc02"; }
            else if (isChosen) { bg = "rgba(255,75,75,0.12)"; border = "#ff4b4b"; color = "#ff4b4b"; }
          }
          return (
            <button
              key={i}
              onClick={() => handleChoose(opt)}
              style={{
                padding: "15px 20px", borderRadius: 14,
                background: bg, border: `2px solid ${border}`,
                color, fontWeight: 600, fontSize: 15,
                cursor: chosen ? "default" : "pointer",
                textAlign: "left", transition: "all 0.2s ease"
              }}
            >
              {opt.uz}
            </button>
          );
        })}
      </div>
    </div>
  );
}
