import React from "react";
import { TIPS } from "../data/vocabData";

const S = {
  inner: { maxWidth: 720, margin: "0 auto", padding: "40px 16px 80px" },
};

export default function Tips({ tipOpen, setTipOpen }) {
  return (
    <div style={S.inner} className="inner-pad">
      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,6vw,36px)", fontWeight: 900, marginBottom: 6 }}>
        5 ta Muhim <span style={{ color: "#f4d03f" }}>Maslahat</span>
      </h2>
      <p style={{ fontSize: 13, color: "#555", marginBottom: 32 }}>Nemischa ravon gaplashish uchun asosiy yo'riqnoma</p>

      {TIPS.map((t, i) => (
        <div key={i} className="tip-card" onClick={() => setTipOpen(tipOpen === i ? null : i)}>
          <div style={{ padding: "18px 20px", display: "flex", gap: 16, alignItems: "center" }}>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 900, color: "#1c1c1c", minWidth: 38 }}>{t.number}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3 }}>{t.icon} {t.title}</div>
              <div style={{ fontSize: 13, color: "#555", lineHeight: 1.5 }}>{t.short}</div>
            </div>
            <span style={{
              color: "#333", fontSize: 22, flexShrink: 0,
              transition: "transform .25s", transform: tipOpen === i ? "rotate(90deg)" : "none"
            }}>›</span>
          </div>
          {tipOpen === i && (
            <div className="tip-detail">
              {t.detail}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
