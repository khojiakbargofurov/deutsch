import React from "react";
import { VOCAB, CAT_META } from "../data/vocabData";
import { formatTime } from "../utils/helpers";

const S = {
  inner: { maxWidth: 720, margin: "0 auto", padding: "40px 16px 80px" },
};

export default function MatchingGame({
  matchCat, setMatchCat,
  matchCards, setMatchCards,
  selectedCard, setSelectedCard,
  wrongCardId, setWrongCardId,
  matchedIds, setMatchedIds,
  attempts, setAttempts,
  matchStartTime, setMatchStartTime,
  matchElapsedTime, setMatchElapsedTime,
  matchDone, setMatchDone,
  favorites,
  setFastestMatch,
  page, setPage,
  startMatchingGame,
  handleCardClick
}) {
  if (page === "matchSetup") {
    return (
      <div style={{ ...S.inner, maxWidth: 520 }} className="inner-pad">
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(24px,6vw,36px)", fontWeight: 900, marginBottom: 6 }}>
          "So'z Top" <span style={{ color: "var(--accent)" }}>O'yini</span>
        </h2>
        <p style={{ fontSize: 13, color: "var(--text-light)", marginBottom: 32 }}>
          5 ta nemischa va 5 ta o'zbekcha so'zni juftlab topadigan premium interaktiv o'yin.
        </p>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: "var(--accent)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>Kategoriya tanlang</div>
          <div className="chips-row">
            <button className={`chip ${matchCat === "all" ? "chip-act" : ""}`}
              style={matchCat === "all" ? { background: "var(--color)", borderColor: "var(--color)", color: "var(--bg)", fontWeight: 600 } : {}}
              onClick={() => setMatchCat("all")}>🌐 Hammasi</button>
            {Object.entries(CAT_META).map(([cat, m]) => (
              <button key={cat}
                className={`chip ${matchCat === cat ? "chip-act" : ""}`}
                style={matchCat === cat ? { background: m.accent, borderColor: m.accent, color: "#0d0d0d", fontWeight: 600 } : {}}
                onClick={() => setMatchCat(cat)}>{m.label}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
          <button className="btn-y" onClick={startMatchingGame} style={{ fontSize: 16, padding: "14px 24px" }}>
            O'yinni Boshlash →
          </button>
        </div>
      </div>
    );
  }

  if (page === "match") {
    return (
      <div style={{ ...S.inner, maxWidth: 580 }} className="inner-pad">
        {!matchDone ? (
          <>
            {/* Header stats */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  ⏱️ Vaqt: <strong style={{ color: "var(--color)" }}>{formatTime(matchElapsedTime)}</strong>
                </span>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  ❌ Xatolar: <strong style={{ color: "var(--color)" }}>{attempts}</strong>
                </span>
              </div>
              <button className="btn-o" onClick={() => setPage("matchSetup")} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12 }}>
                ⏹️ Chiqish
              </button>
            </div>

            {/* Progress bar */}
            <div className="prog-bar" style={{ marginBottom: 22 }}>
              <div className="prog-fill" style={{ width: `${(matchedIds.length / 10) * 100}%`, background: "linear-gradient(90deg, var(--accent), var(--color))" }} />
            </div>

            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <span style={{ fontSize: 13, color: "var(--text-light)" }}>So'z va uning tarjimasini ketma-ket tanlang:</span>
            </div>

            {/* Cards Grid */}
            <div className="match-grid">
              {matchCards.map((card) => {
                const isSelected = selectedCard?.id === card.id;
                const isMatched = matchedIds.includes(card.id);
                const isWrong = wrongCardId === card.id || (wrongCardId && isSelected);
                
                let cls = "match-card";
                if (isMatched) cls += " matched";
                else if (isSelected) cls += " selected";
                else if (isWrong) cls += " incorrect";

                return (
                  <div 
                    key={card.id} 
                    className={cls}
                    onClick={() => handleCardClick(card)}
                  >
                    {card.text}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Victory Screen */
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,6vw,38px)", fontWeight: 900, marginBottom: 12 }}>
              Ajoyib, G'alaba! 🎉
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-light)", marginBottom: 32 }}>
              Barcha so'zlarni muvaffaqiyatli juftlab topdingiz!
            </p>

            <div style={{ display: "flex", justifyContent: "center", marginBottom: 36 }}>
              <div className="score-ring" style={{
                borderColor: attempts === 0 ? "#2ecc71" : attempts <= 2 ? "var(--accent)" : "#e63946",
                background: attempts === 0 ? "rgba(46, 204, 113, 0.05)" : attempts <= 2 ? "rgba(229, 193, 88, 0.05)" : "rgba(230, 57, 70, 0.05)",
                width: 140,
                height: 140
              }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>Sarflangan vaqt</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 900, color: "var(--color)" }}>
                  {formatTime(matchElapsedTime)}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>{attempts} ta xato</div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
              <button className="btn-y" onClick={startMatchingGame}>🔁 Qayta o'ynash</button>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-o" onClick={() => setPage("matchSetup")}>⚙️ Kategoriya</button>
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
