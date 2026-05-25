import React from "react";

const S = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(4px)",
    zIndex: 1000,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  sheet: {
    background: "var(--card-bg)",
    borderTop: "1px solid var(--border-color)",
    borderRadius: "24px 24px 0 0",
    width: "100%",
    maxWidth: 500,
    padding: "32px 24px 40px",
    boxShadow: "0 -10px 40px rgba(0, 0, 0, 0.15)",
    boxSizing: "border-box",
    animation: "slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 24,
    fontWeight: 900,
    marginBottom: 6,
    color: "var(--color)",
  },
  subtitle: {
    fontSize: 12,
    color: "var(--accent)",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    fontWeight: 600,
    marginBottom: 16,
  },
  desc: {
    fontSize: 14,
    color: "var(--text-light)",
    lineHeight: 1.6,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: 600,
    marginBottom: 12,
  },
  wordList: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 32,
  },
  wordChip: {
    background: "var(--chip-bg)",
    border: "1px solid var(--chip-border)",
    borderRadius: 12,
    padding: "6px 12px",
    fontSize: 13,
    color: "var(--color)",
    fontWeight: 500,
  },
  footer: {
    display: "flex",
    gap: 12,
  },
};

export default function LessonModal({ level, onClose, onStart, hearts }) {
  if (!level) return null;

  return (
    <div style={S.backdrop} onClick={onClose}>
      <div style={S.sheet} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div>
            <span style={S.subtitle}>{level.unitTitle}</span>
            <h3 style={S.title}>{level.title}</h3>
          </div>
          <button 
            className="nb theme-toggle-btn" 
            onClick={onClose}
            style={{ width: 32, height: 32, fontSize: 14 }}
          >
            ✕
          </button>
        </div>

        <p style={S.desc}>{level.desc}</p>

        <div style={S.sectionTitle}>Ushbu darsda o'rganiladigan so'zlar:</div>
        <div style={S.wordList}>
          {level.words.map((w, idx) => (
            <div key={idx} style={S.wordChip}>
              {w}
            </div>
          ))}
        </div>

        <div style={S.footer}>
          <button 
            className="btn-o" 
            onClick={onClose}
            style={{ flex: 1, textAlign: "center", padding: "14px" }}
          >
            Orqaga
          </button>
          
          <button 
            className="btn-y" 
            onClick={() => onStart(level)}
            disabled={hearts === 0}
            style={{ 
              flex: 2, 
              padding: "14px", 
              opacity: hearts === 0 ? 0.5 : 1, 
              cursor: hearts === 0 ? "not-allowed" : "pointer" 
            }}
          >
            {hearts === 0 ? "Jonlar qolmagan! 💔" : "Darsni Boshlash 🚀"}
          </button>
        </div>
      </div>
    </div>
  );
}
