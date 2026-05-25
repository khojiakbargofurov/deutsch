import React from "react";
import { VOCAB, CAT_META } from "../data/vocabData";

const S = {
  inner: { maxWidth: 720, margin: "0 auto", padding: "40px 16px 80px" },
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
  startQuiz
}) {
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

  // Render Quiz Setup Screen
  if (page === "quizSetup") {
    return (
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
    );
  }

  // Render Quiz Done Screen
  if (done) {
    return (
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
            <button className="btn-o" onClick={() => setPage("quizSetup")}>⚙️ Sozlamalar</button>
            <button className="btn-o" onClick={() => navigate("vocab")}>📚 Lug'at</button>
          </div>
        </div>
      </div>
    );
  }

  // Render Active Quiz Screen
  if (questions.length > 0) {
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
  }

  return null;
}
