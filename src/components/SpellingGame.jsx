import React from "react";
import { VOCAB, CAT_META } from "../data/vocabData";
import { formatTime } from "../utils/helpers";

const S = {
  inner: { maxWidth: 720, margin: "0 auto", padding: "40px 16px 80px" },
};

export default function SpellingGame({
  spellingCat, setSpellingCat,
  spellingQuestions, setSpellingQuestions,
  spellingIdx, setSpellingIdx,
  spellingInput, setSpellingInput,
  spellingIsWrong, setSpellingIsWrong,
  spellingCorrectWord, setSpellingCorrectWord,
  spellingAttempts, setSpellingAttempts,
  spellingStartTime, setSpellingStartTime,
  spellingElapsedTime, setSpellingElapsedTime,
  spellingDone, setSpellingDone,
  favorites,
  page, setPage,
  allCount,
  startSpellingGame,
  handleSpellingChange,
  handleUmlautClick,
  playingWord,
  playAudio
}) {
  if (page === "spellingSetup") {
    return (
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
    );
  }

  if (page === "spelling") {
    return (
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
    );
  }

  return null;
}
