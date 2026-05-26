import React, { useState } from "react";
import { ACHIEVEMENTS, ACHIEVEMENT_CATEGORIES } from "../data/achievementsData";

export default function Achievements({ navigate, stats, unlockedAchievements }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = ["all", ...Object.keys(ACHIEVEMENT_CATEGORIES)];

  const filtered = activeCategory === "all"
    ? ACHIEVEMENTS
    : ACHIEVEMENTS.filter(a => a.category === activeCategory);

  const unlockedCount = ACHIEVEMENTS.filter(a => unlockedAchievements.includes(a.id)).length;

  return (
    <div style={{ padding: "20px 16px", maxWidth: 540, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={() => navigate("stats")} style={{
          background: "var(--hover-bg)", border: "none", borderRadius: 10,
          padding: "8px 12px", cursor: "pointer", color: "var(--text-light)", fontSize: 18
        }}>←</button>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900 }}>
            🏅 Yutuqlar
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
            {unlockedCount} / {ACHIEVEMENTS.length} ochilgan
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        background: "var(--card-bg)", border: "1px solid var(--border-color)",
        borderRadius: 16, padding: 16, marginBottom: 20
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>Umumiy progress</span>
          <span style={{ fontSize: 13, color: "var(--accent)", fontWeight: 800 }}>
            {Math.round((unlockedCount / ACHIEVEMENTS.length) * 100)}%
          </span>
        </div>
        <div style={{ height: 8, background: "var(--hover-bg)", borderRadius: 4, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${(unlockedCount / ACHIEVEMENTS.length) * 100}%`,
            background: "linear-gradient(90deg, #ffd700, #ff9600)",
            borderRadius: 4, transition: "width 0.6s ease"
          }} />
        </div>
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 20 }}>
        {categories.map(cat => {
          const meta = ACHIEVEMENT_CATEGORIES[cat];
          const catUnlocked = cat === "all"
            ? unlockedCount
            : ACHIEVEMENTS.filter(a => a.category === cat && unlockedAchievements.includes(a.id)).length;
          const catTotal = cat === "all"
            ? ACHIEVEMENTS.length
            : ACHIEVEMENTS.filter(a => a.category === cat).length;

          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "8px 14px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 700,
                whiteSpace: "nowrap",
                background: activeCategory === cat ? "var(--accent)" : "var(--hover-bg)",
                color: activeCategory === cat
                  ? (document.body.classList.contains("light-theme") ? "#fff" : "#000")
                  : "var(--text-light)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {cat === "all" ? "Hammasi" : `${meta.icon} ${meta.label}`}
              <span style={{
                marginLeft: 6,
                background: "rgba(0,0,0,0.12)",
                borderRadius: 10,
                padding: "1px 6px",
                fontSize: 10
              }}>
                {catUnlocked}/{catTotal}
              </span>
            </button>
          );
        })}
      </div>

      {/* Achievement grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {filtered.map(achievement => {
          const isUnlocked = unlockedAchievements.includes(achievement.id);
          return (
            <div
              key={achievement.id}
              style={{
                background: "var(--card-bg)",
                border: `1px solid ${isUnlocked ? achievement.color + "40" : "var(--border-color)"}`,
                borderRadius: 16,
                padding: 16,
                opacity: isUnlocked ? 1 : 0.5,
                position: "relative",
                overflow: "hidden",
                transition: "all 0.2s ease",
              }}
            >
              {/* Glow bg for unlocked */}
              {isUnlocked && (
                <div style={{
                  position: "absolute", inset: 0,
                  background: `radial-gradient(ellipse at top left, ${achievement.color}10, transparent 70%)`,
                  pointerEvents: "none"
                }} />
              )}

              {/* Lock icon for locked */}
              {!isUnlocked && (
                <div style={{
                  position: "absolute", top: 8, right: 8,
                  fontSize: 12, color: "var(--text-muted)"
                }}>🔒</div>
              )}

              {/* Checkmark for unlocked */}
              {isUnlocked && (
                <div style={{
                  position: "absolute", top: 8, right: 8,
                  width: 18, height: 18, borderRadius: "50%",
                  background: achievement.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, color: "#fff", fontWeight: 900
                }}>✓</div>
              )}

              <div style={{ fontSize: 32, marginBottom: 8 }}>{achievement.icon}</div>
              <div style={{
                fontSize: 13, fontWeight: 800, marginBottom: 4,
                color: isUnlocked ? achievement.color : "var(--text-light)"
              }}>
                {achievement.title}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>
                {achievement.desc}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ height: 20 }} />
    </div>
  );
}
