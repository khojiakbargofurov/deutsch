import React from "react";
import { VOCAB, CAT_META } from "../data/vocabData";

const S = {
  inner: { maxWidth: 720, margin: "0 auto", padding: "40px 16px 80px" },
};

export default function VocabList({
  vocabCat, setVocabCat,
  vocabSearch, setVocabSearch,
  flash, setFlash,
  flashIdx, setFlashIdx,
  flipped, setFlipped,
  favorites, toggleFavorite,
  learntWords, setLearntWords,
  playingWord, playAudio,
  allCount
}) {
  const filtered = (vocabCat === "favorites"
    ? Object.entries(VOCAB).flatMap(([cat, ws]) => ws.map(w => ({ ...w, cat })))
      .filter(w => favorites.includes(w.de))
    : VOCAB[vocabCat] || []
  ).filter(w =>
    w.de.toLowerCase().includes(vocabSearch.toLowerCase()) ||
    w.uz.toLowerCase().includes(vocabSearch.toLowerCase())
  );

  return (
    <div style={S.inner} className="inner-pad">
      <div className="vocab-hdr">
        <div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(24px,5vw,34px)", fontWeight: 900, marginBottom: 4 }}>
            Lug'at <span style={{ color: "#f4d03f" }}>Bazasi</span>
          </h2>
          <p style={{ fontSize: 12, color: "#555" }}>{allCount} so'z • Nemischa → O'zbekcha</p>
        </div>
        <button className="btn-o"
          onClick={() => { setFlash(f => !f); setFlashIdx(0); setFlipped(false); }}>
          {flash ? "📋 Ro'yxat" : "🃏 Flashcard"}
        </button>
      </div>

      {/* Category chips */}
      <div className="chips-row">
        {Object.entries(CAT_META).map(([cat, m]) => (
          <button key={cat}
            className={`chip ${vocabCat === cat ? "chip-act" : ""}`}
            style={vocabCat === cat ? { background: m.accent, borderColor: m.accent, color: "#0d0d0d", fontWeight: 600 } : {}}
            onClick={() => { setVocabCat(cat); setFlashIdx(0); setFlipped(false); setVocabSearch(""); }}>
            {m.label} <span style={{ opacity: .6 }}>({VOCAB[cat].length})</span>
          </button>
        ))}
        <button 
          className={`chip ${vocabCat === "favorites" ? "chip-act" : ""}`}
          style={vocabCat === "favorites" ? { background: "#f1c40f", borderColor: "#f1c40f", color: "#0d0d0d", fontWeight: 600 } : {}}
          onClick={() => { setVocabCat("favorites"); setFlashIdx(0); setFlipped(false); setVocabSearch(""); }}
        >
          🌟 Tanlanganlar <span style={{ opacity: .6 }}>({favorites.length})</span>
        </button>
      </div>

      {/* FLASHCARD MODE */}
      {flash ? (
        filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 18 }}>
            {vocabCat === "favorites"
              ? "Fleshkarta o'ynash uchun kamida 1 ta so'zni tanlanganlar ⭐ ro'yxatiga qo'shing!"
              : "Ushbu toifada hech qanday so'z topilmadi."}
          </div>
        ) : (
          <div>
            <div style={{ textAlign: "center", fontSize: 13, color: "#555", marginBottom: 16 }}>
              {flashIdx + 1} / {filtered.length} — kartani bosib ag'dar
            </div>
            <div className="flash-wrap" onClick={() => setFlipped(f => !f)}>
              <div className={`flash-inner ${flipped ? "flipped" : ""}`}>
                <div className="flash-face flash-front">
                  <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", marginBottom: 10, padding: "0 10px" }}>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: 1.5, textTransform: "uppercase" }}>Nemischa</span>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <button 
                        className={`speaker-btn ${playingWord === filtered[flashIdx]?.de ? "playing" : ""}`}
                        onClick={(e) => { e.stopPropagation(); playAudio(filtered[flashIdx]?.de); }}
                        title="Talaffuzni eshitish"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        </svg>
                      </button>
                      
                      <button 
                        className={`fav-btn ${favorites.includes(filtered[flashIdx]?.de) ? "active" : ""}`}
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(filtered[flashIdx]?.de); }}
                        title={favorites.includes(filtered[flashIdx]?.de) ? "Tanlanganlardan o'chirish" : "Tanlanganlarga qo'shish"}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill={favorites.includes(filtered[flashIdx]?.de) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,6vw,38px)", fontWeight: 900, margin: "16px 0" }}>{filtered[flashIdx]?.de}</div>
                  <div style={{ fontSize: 12, color: "var(--text-light)", marginTop: 12 }}>bosib o'zbek tiliga o'gir →</div>
                </div>
                <div className="flash-face flash-back">
                  <div style={{ fontSize: 11, color: "#2ecc71", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>O'zbekcha</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(22px,5vw,32px)", fontWeight: 700, color: "#2ecc71" }}>{filtered[flashIdx]?.uz}</div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20, flexWrap: "wrap", width: "100%" }}>
              <button className="btn-o" style={{ flex: 1, minWidth: 100, textAlign: "center" }}
                onClick={() => { setFlashIdx(i => Math.max(0, i - 1)); setFlipped(false); }}>‹ Oldingi</button>
              <button className="btn-o"
                onClick={() => {
                  const deWord = filtered[flashIdx]?.de;
                  if (deWord && !learntWords.includes(deWord)) {
                    setLearntWords(prev => [...prev, deWord]);
                  }
                  if (flashIdx + 1 < filtered.length) {
                    setFlashIdx(i => i + 1);
                    setFlipped(false);
                  }
                }}
                style={{ background: "#2ecc71", color: "white", borderColor: "#2ecc71", flex: 2, minWidth: 160, textAlign: "center", fontWeight: "600" }}
              >
                ✅ Yodladim & Keyingi
              </button>
              <button className="btn-o" style={{ flex: 1, minWidth: 100, textAlign: "center" }}
                onClick={() => { if (flashIdx + 1 < filtered.length) { setFlashIdx(i => i + 1); setFlipped(false); } }}>Keyingi ›</button>
            </div>
          </div>
        )
      ) : (
        <>
          <input className="search-inp" placeholder="Qidirish: nemischa yoki o'zbekcha..."
            value={vocabSearch} onChange={e => setVocabSearch(e.target.value)}
            style={{ marginBottom: 16 }} />
          <div style={{ border: "1px solid var(--border-color)", borderRadius: 16, overflow: "hidden" }}>
            <div style={{
              background: vocabCat === "favorites" ? "rgba(241, 196, 15, 0.08)" : (CAT_META[vocabCat]?.bg || "rgba(255,255,255,0.02)"),
              padding: "10px 18px",
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <span style={{
                fontSize: 12, 
                color: vocabCat === "favorites" ? "#f1c40f" : (CAT_META[vocabCat]?.accent || "var(--color)"), 
                fontWeight: 600,
                letterSpacing: 1.2, textTransform: "uppercase"
              }}>
                {vocabCat === "favorites" ? "🌟 Tanlanganlar" : (CAT_META[vocabCat]?.label || "")}
              </span>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{filtered.length} so'z</span>
            </div>
            {filtered.length === 0
              ? <div style={{ padding: 40, textAlign: "center", color: "var(--text-light)", fontSize: 14 }}>
                  {vocabCat === "favorites" 
                    ? "Tanlangan so'zlar hali mavjud emas. So'zlar yonidagi yulduzchani ⭐ bosib saqlang!" 
                    : "Hech narsa topilmadi"}
                </div>
              : filtered.map((w, i) => (
                <div key={i} className="vrow" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button 
                      className={`speaker-btn ${playingWord === w.de ? "playing" : ""}`}
                      onClick={() => playAudio(w.de)}
                      title="Talaffuzni eshitish"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                      </svg>
                    </button>
                    
                    <button 
                      className={`fav-btn ${favorites.includes(w.de) ? "active" : ""}`}
                      onClick={() => toggleFavorite(w.de)}
                      title={favorites.includes(w.de) ? "Tanlanganlardan o'chirish" : "Tanlanganlarga qo'shish"}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={favorites.includes(w.de) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    </button>
                    
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, marginLeft: 4 }}>{w.de}</span>
                  </div>
                  <span style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "right", marginLeft: 12 }}>{w.uz}</span>
                </div>
              ))
            }
          </div>
        </>
      )}
    </div>
  );
}
