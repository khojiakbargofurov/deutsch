import React, { useState } from "react";
import { GRAMMAR_LESSONS } from "../data/grammarData";

export default function Grammar({ navigate, showToast, xp, setXp }) {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [quizMode, setQuizMode] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [completedLessons, setCompletedLessons] = useState(() => {
    try { return JSON.parse(localStorage.getItem("completedGrammar") || "[]"); }
    catch { return []; }
  });

  const handleSelectLesson = (lesson) => {
    setSelectedLesson(lesson);
    setQuizMode(false);
    setQuizIdx(0);
    setChosen(null);
    setScore(0);
    setDone(false);
  };

  const startQuiz = () => {
    setQuizMode(true);
    setQuizIdx(0);
    setChosen(null);
    setScore(0);
    setDone(false);
  };

  const handleChoose = (opt) => {
    if (chosen) return;
    setChosen(opt);
    const correct = selectedLesson.quiz[quizIdx].answer;
    if (opt === correct) {
      setScore(s => s + 1);
    }
    setTimeout(() => {
      const next = quizIdx + 1;
      if (next >= selectedLesson.quiz.length) {
        setDone(true);
        const earned = score + (opt === correct ? 1 : 0);
        setXp(x => x + earned * 10);
        if (earned === selectedLesson.quiz.length) {
          const updated = [...new Set([...completedLessons, selectedLesson.id])];
          setCompletedLessons(updated);
          localStorage.setItem("completedGrammar", JSON.stringify(updated));
          showToast(`Mukammal! ${selectedLesson.title} bajarildi! +${earned * 10} XP`, "success");
        } else {
          showToast(`+${earned * 10} XP earned!`, "success");
        }
      } else {
        setQuizIdx(next);
        setChosen(null);
      }
    }, 900);
  };

  // Lesson list
  if (!selectedLesson) {
    return (
      <div style={{ padding: "20px 16px", maxWidth: 540, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button onClick={() => navigate("home")} style={{
            background: "var(--hover-bg)", border: "none", borderRadius: 10,
            padding: "8px 12px", cursor: "pointer", color: "var(--text-light)", fontSize: 18
          }}>←</button>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900 }}>
              📝 Grammatika
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
              {completedLessons.length} / {GRAMMAR_LESSONS.length} dars bajarildi
            </p>
          </div>
        </div>

        {/* Progress */}
        <div style={{ height: 6, background: "var(--hover-bg)", borderRadius: 3, marginBottom: 24, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${(completedLessons.length / GRAMMAR_LESSONS.length) * 100}%`,
            background: "linear-gradient(90deg, #58cc02, #1cb0f6)",
            borderRadius: 3, transition: "width 0.5s ease"
          }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {GRAMMAR_LESSONS.map((lesson, i) => {
            const isCompleted = completedLessons.includes(lesson.id);
            const isLocked = i > 0 && !completedLessons.includes(GRAMMAR_LESSONS[i - 1].id);
            return (
              <button
                key={lesson.id}
                onClick={() => !isLocked && handleSelectLesson(lesson)}
                style={{
                  background: "var(--card-bg)",
                  border: `1px solid ${isCompleted ? lesson.color + "50" : "var(--border-color)"}`,
                  borderRadius: 18,
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  cursor: isLocked ? "not-allowed" : "pointer",
                  opacity: isLocked ? 0.45 : 1,
                  textAlign: "left",
                  transition: "all 0.2s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {isCompleted && (
                  <div style={{
                    position: "absolute", inset: 0,
                    background: `linear-gradient(135deg, ${lesson.color}08, transparent)`,
                    pointerEvents: "none"
                  }} />
                )}
                <div style={{
                  width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                  background: isCompleted ? lesson.color : "var(--hover-bg)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22,
                  boxShadow: isCompleted ? `0 4px 16px ${lesson.color}40` : "none"
                }}>
                  {isLocked ? "🔒" : lesson.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{lesson.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.4 }}>
                    {lesson.quiz.length} ta savol
                    {isCompleted && <span style={{ color: "#58cc02", marginLeft: 8 }}>✓ Bajarildi</span>}
                  </div>
                </div>
                {!isLocked && (
                  <div style={{ color: "var(--text-muted)", fontSize: 18 }}>›</div>
                )}
              </button>
            );
          })}
        </div>
        <div style={{ height: 24 }} />
      </div>
    );
  }

  // Quiz done screen
  if (done) {
    const total = selectedLesson.quiz.length;
    const accuracy = Math.round((score / total) * 100);
    return (
      <div style={{ padding: "24px 16px", maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>
          {accuracy === 100 ? "🏆" : accuracy >= 60 ? "👍" : "💪"}
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900, marginBottom: 8 }}>
          {accuracy === 100 ? "Mukammal!" : "Yaxshi harakat!"}
        </h2>
        <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>
          {score} / {total} to'g'ri javob
        </p>
        <div style={{ fontSize: 48, fontWeight: 900, color: accuracy >= 80 ? "#58cc02" : "#e5c158", marginBottom: 24 }}>
          {accuracy}%
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn-y" onClick={startQuiz} style={{ flex: 1 }}>🔄 Qayta</button>
          <button className="btn-o" onClick={() => setSelectedLesson(null)} style={{ flex: 1 }}>← Orqaga</button>
        </div>
      </div>
    );
  }

  // Lesson detail / quiz
  if (quizMode) {
    const q = selectedLesson.quiz[quizIdx];
    const correct = q.answer;
    return (
      <div style={{ padding: "20px 16px", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={() => setQuizMode(false)} style={{
            background: "var(--hover-bg)", border: "none", borderRadius: 10,
            padding: "8px 12px", cursor: "pointer", color: "var(--text-light)", fontSize: 18
          }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ height: 6, background: "var(--hover-bg)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${((quizIdx) / selectedLesson.quiz.length) * 100}%`,
                background: selectedLesson.color, borderRadius: 3, transition: "width 0.3s ease"
              }} />
            </div>
          </div>
          <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>
            {quizIdx + 1}/{selectedLesson.quiz.length}
          </span>
        </div>

        <div style={{
          background: "var(--card-bg)", border: "1px solid var(--border-color)",
          borderRadius: 20, padding: 24, marginBottom: 20
        }}>
          <div style={{ fontSize: 11, color: selectedLesson.color, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 }}>
            {selectedLesson.icon} {selectedLesson.title}
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.5 }}>
            {q.question}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {q.options.map((opt, i) => {
            let bg = "var(--card-bg)";
            let border = "var(--border-color)";
            let color = "var(--color)";
            if (chosen) {
              if (opt === correct) { bg = "rgba(88,204,2,0.12)"; border = "#58cc02"; color = "#58cc02"; }
              else if (opt === chosen) { bg = "rgba(255,75,75,0.12)"; border = "#ff4b4b"; color = "#ff4b4b"; }
            }
            return (
              <button
                key={i}
                onClick={() => handleChoose(opt)}
                style={{
                  padding: "16px 20px", borderRadius: 14,
                  background: bg, border: `2px solid ${border}`,
                  color, fontWeight: 600, fontSize: 15,
                  cursor: chosen ? "default" : "pointer",
                  textAlign: "left", transition: "all 0.2s ease",
                }}
              >
                {["A", "B", "C"][i]}. {opt}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Lesson detail (theory)
  return (
    <div style={{ padding: "20px 16px", maxWidth: 540, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={() => setSelectedLesson(null)} style={{
          background: "var(--hover-bg)", border: "none", borderRadius: 10,
          padding: "8px 12px", cursor: "pointer", color: "var(--text-light)", fontSize: 18
        }}>←</button>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: selectedLesson.color,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20
        }}>{selectedLesson.icon}</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16 }}>{selectedLesson.title}</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{selectedLesson.quiz.length} ta test savoli</div>
        </div>
      </div>

      {/* Intro */}
      <div style={{
        background: `linear-gradient(135deg, ${selectedLesson.color}15, transparent)`,
        border: `1px solid ${selectedLesson.color}30`,
        borderRadius: 16, padding: 16, marginBottom: 20
      }}>
        <div style={{ fontSize: 14, lineHeight: 1.7, color: "var(--color)" }}>
          {selectedLesson.intro}
        </div>
      </div>

      {/* Rules */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
        {selectedLesson.rules.map((rule, i) => (
          <div key={i} style={{
            background: "var(--card-bg)", border: "1px solid var(--border-color)",
            borderRadius: 14, padding: 16, display: "flex", gap: 12
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8, flexShrink: 0,
              background: selectedLesson.color,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 900, fontSize: 12
            }}>{i + 1}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{rule.rule}</div>
              <div style={{
                fontSize: 13, color: selectedLesson.color,
                fontStyle: "italic", fontFamily: "monospace", lineHeight: 1.4
              }}>
                {rule.example}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        className="btn-y"
        onClick={startQuiz}
        style={{ width: "100%", padding: "16px", fontSize: 15, fontWeight: 800 }}
      >
        🎯 Testni boshlash ({selectedLesson.quiz.length} ta savol)
      </button>
      <div style={{ height: 24 }} />
    </div>
  );
}
