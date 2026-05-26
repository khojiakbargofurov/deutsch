import React, { useState, useEffect } from "react";

const S = {
  inner: { maxWidth: 500, margin: "0 auto", padding: "40px 16px 120px" },
  profileCard: {
    background: "var(--card-bg)",
    border: "1px solid var(--border-color)",
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    boxShadow: "0 8px 30px rgba(0,0,0,0.03)",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginBottom: 32,
  },
  statsTile: {
    background: "var(--card-bg)",
    border: "1px solid var(--border-color)",
    borderRadius: 16,
    padding: 16,
    textAlign: "center",
  }
};

const LEAGUE_ICONS = {
  "Bronza": "🥉",
  "Kumush": "🥈",
  "Oltin": "🥇",
  "Yoqut (Ruby)": "♦️",
  "Olmos (Diamond)": "💎",
};

export default function StatsDashboard({
  favorites,
  learntWords,
  quizHistory,
  fastestMatch,
  xp,
  gems,
  streak,
  league,
  completedLevels,
  streakShields,
  vipUnlocked,
  goldCrownTheme,
  navigate,
  unlockedAchievements = [],
}) {
  // Daily Quests states loaded from localStorage
  const [questXP, setQuestXP] = useState(0);
  const [questPerfect, setQuestPerfect] = useState(false);

  useEffect(() => {
    try {
      const savedXP = localStorage.getItem("quest_xp");
      if (savedXP) setQuestXP(parseInt(savedXP, 10));
      
      const savedPerfect = localStorage.getItem("quest_perfect");
      if (savedPerfect) setQuestPerfect(savedPerfect === "true");
    } catch {}
  }, []);

  return (
    <div style={S.inner} className="inner-pad">

      {/* Quick Nav Buttons */}
      {navigate && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
          {[
            { icon: "🏅", label: "Yutuqlar", page: "achievements", color: "#ffd700",
              badge: unlockedAchievements.length },
            { icon: "🃏", label: "Flashcard", page: "flashcard", color: "#1cb0f6" },
            { icon: "📝", label: "Grammatika", page: "grammar", color: "#58cc02" },
          ].map(btn => (
            <button key={btn.page} onClick={() => navigate(btn.page)} style={{
              background: "var(--card-bg)",
              border: `1px solid ${btn.color}30`,
              borderRadius: 16, padding: "14px 8px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              cursor: "pointer", transition: "all 0.2s ease", position: "relative"
            }}>
              {btn.badge > 0 && (
                <div style={{
                  position: "absolute", top: 8, right: 8,
                  background: btn.color, color: "#000",
                  borderRadius: 10, fontSize: 10, fontWeight: 900,
                  padding: "1px 5px", minWidth: 16, textAlign: "center"
                }}>{btn.badge}</div>
              )}
              <div style={{ fontSize: 24 }}>{btn.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: btn.color }}>{btn.label}</div>
            </button>
          ))}
        </div>
      )}


      <div 
        style={{
          ...S.profileCard,
          borderColor: vipUnlocked ? "#ffd700" : "var(--border-color)",
          boxShadow: vipUnlocked ? "0 10px 40px rgba(255,215,0,0.08)" : "0 8px 30px rgba(0,0,0,0.03)",
          position: "relative"
        }}
      >
        {/* VIP golden crown top right */}
        {vipUnlocked && (
          <div style={{
            position: "absolute",
            top: 14,
            right: 18,
            fontSize: 24,
            filter: "drop-shadow(0 2px 5px rgba(255,215,0,0.3))"
          }} title="VIP A'zo">
            👑
          </div>
        )}

        <div style={{
          width: 68,
          height: 68,
          borderRadius: "50%",
          background: vipUnlocked 
            ? "linear-gradient(135deg, #ffd700, #b58c3d)" 
            : "linear-gradient(135deg, var(--accent), var(--color))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32,
          margin: "0 auto 12px",
          boxShadow: vipUnlocked 
            ? "0 4px 20px rgba(255, 215, 0, 0.4)" 
            : "0 4px 15px rgba(229, 193, 88, 0.2)",
          border: vipUnlocked ? "3px solid #fff" : "none"
        }}>
          {vipUnlocked ? "🤴" : "⚡"}
        </div>
        
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900, textAlign: "center", marginBottom: 4 }}>
          {vipUnlocked ? "Siz (VIP O'quvchi)" : "Siz (O'quvchi)"}
        </h3>
        
        <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", marginBottom: 18 }}>
          {vipUnlocked ? "🎖️ Premium Oltin A'zo" : "Nemis Blitz Platformasi A'zosi"}
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
          <div style={{
            background: vipUnlocked ? "rgba(255, 215, 0, 0.12)" : "var(--chip-bg)",
            border: vipUnlocked ? "1.5px solid #ffd700" : "1px solid var(--chip-border)",
            borderRadius: 20,
            padding: "5px 12px",
            fontSize: 12,
            fontWeight: 700,
            color: vipUnlocked ? "#ffd700" : "var(--accent)"
          }}>
            {LEAGUE_ICONS[league] || "🥉"} {league} Ligasi
          </div>
          
          {streakShields > 0 && (
            <div style={{
              background: "rgba(46, 204, 113, 0.08)",
              border: "1.5px solid #2ecc71",
              borderRadius: 20,
              padding: "5px 12px",
              fontSize: 12,
              fontWeight: 700,
              color: "#2ecc71"
            }} title="Streak Shield faol">
              🛡️ {streakShields} faol
            </div>
          )}
        </div>
      </div>

      {/* ── GAMIFIED METRICS GRID ── */}
      <div style={S.statsGrid}>
        <div style={S.statsTile}>
          <div style={{ fontSize: 24, marginBottom: 4 }}>⚡</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "var(--color)" }}>{xp}</div>
          <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>Jami Tajriba (XP)</div>
        </div>

        <div style={S.statsTile}>
          <div style={{ fontSize: 24, marginBottom: 4 }}>💎</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#00d2ff" }}>{gems}</div>
          <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>Gevharlar</div>
        </div>

        <div style={S.statsTile}>
          <div style={{ fontSize: 24, marginBottom: 4 }}>🔥</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#e67e22" }}>{streak} kun</div>
          <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>Faol Kunlik Streak</div>
        </div>

        <div style={S.statsTile}>
          <div style={{ fontSize: 24, marginBottom: 4 }}>👑</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#2ecc71" }}>{completedLevels.length} / 16</div>
          <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>Tugatilgan Darslar</div>
        </div>
      </div>

      {/* ── DAILY QUESTS SECTION ── */}
      <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 18, padding: "24px 20px", marginBottom: 32 }}>
        <div style={{ fontSize: 11, color: "var(--accent)", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>
          Kunlik Vazifalar & Quests 🎯
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Quest 1: XP quest */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              <span>⚡ Bugun 30 XP to'plash</span>
              <span style={{ color: "var(--accent)" }}>{Math.min(30, questXP)} / 30 XP</span>
            </div>
            <div className="prog-bar" style={{ marginBottom: 0, height: 6 }}>
              <div className="prog-fill" style={{ width: `${Math.min(100, (questXP / 30) * 100)}%` }} />
            </div>
          </div>

          {/* Quest 2: Perfect lesson quest */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              <span>👑 Bugun 1 ta xatosiz dars yechish</span>
              <span style={{ color: questPerfect ? "#2ecc71" : "var(--text-muted)" }}>
                {questPerfect ? "✓ Bajarildi" : "0 / 1"}
              </span>
            </div>
            <div className="prog-bar" style={{ marginBottom: 0, height: 6 }}>
              <div className="prog-fill" style={{ width: questPerfect ? "100%" : "0%", background: "#2ecc71" }} />
            </div>
          </div>

          {/* Quest 3: Star words quest */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              <span>⭐ 3 ta yangi so'zni Sevimlilarga qo'shish</span>
              <span style={{ color: favorites.length >= 3 ? "#2ecc71" : "var(--accent)" }}>
                {Math.min(3, favorites.length)} / 3 ta
              </span>
            </div>
            <div className="prog-bar" style={{ marginBottom: 0, height: 6 }}>
              <div className="prog-fill" style={{ width: `${Math.min(100, (favorites.length / 3) * 100)}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── GRAPH OF QUIZZES HISTORY ── */}
      <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 18, padding: "24px 20px", marginBottom: 32 }}>
        <div style={{ fontSize: 11, color: "var(--accent)", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 700 }}>Test Natijalari Tarixi</div>
        {quizHistory.length === 0 ? (
          <div style={{ padding: "40px 0", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
            Hozircha natijalar mavjud emas. Darslar yechish orqali natijalarni to'plang!
          </div>
        ) : (
          <div>
            <div className="chart-container">
              {quizHistory.map((h, i) => {
                const percentage = (h.score / h.total) * 100;
                return (
                  <div key={i} className="chart-column">
                    <div className="chart-bar" style={{ height: `${Math.max(8, percentage)}%` }}>
                      <span className="chart-tooltip">{h.score}/{h.total} ({Math.round(percentage)}%)</span>
                    </div>
                    <span className="chart-label">{h.date || `Test ${i + 1}`}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ textAlign: "center", fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>
              💡 Ustunlar ustiga bosib aniq natijani ko'rishingiz mumkin.
            </div>
          </div>
        )}
      </div>

      {/* ── ACHIEVEMENTS (BADGES GRID) ── */}
      <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 18, padding: "24px 20px" }}>
        <div style={{ fontSize: 11, color: "var(--accent)", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>
          Erishilgan Yutuqlar & Nishonlar
        </div>
        <div className="badges-grid">
          {[
            {
              id: "champion",
              icon: "🏆",
              title: "Nemischa Chempion",
              desc: "1-Bosqich darslarini to'liq tamomlang (4 ta dars)",
              unlocked: completedLevels.length >= 4
            },
            {
              id: "gems_king",
              icon: "💎",
              title: "Gevharlar Qiroli",
              desc: "Gevharlar sonini kamida 200 taga yetkazing",
              unlocked: gems >= 200
            },
            {
              id: "fast",
              icon: "⚡",
              title: "Tezkor O'quvchi",
              desc: "Match o'yinini 40 soniyadan tezroq yakunlang",
              unlocked: fastestMatch <= 40
            },
            {
              id: "streak_pro",
              icon: "🔥",
              title: "Sabrli O'quvchi",
              desc: "1 ta darsni xatosiz, to'liq jonlar bilan bajaring (Perfect Lesson)",
              unlocked: quizHistory.some(h => h.score === h.total && h.total > 0)
            }
          ].map(b => (
            <div key={b.id} className={`badge-card ${b.unlocked ? "unlocked" : "locked"}`}>
              <div className="badge-icon" style={{ fontSize: 32, marginBottom: 8 }}>{b.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{b.title}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.3, minHeight: 34 }}>{b.desc}</div>
              <div style={{ fontSize: 10, marginTop: 10, color: b.unlocked ? "var(--accent)" : "var(--text-muted)", fontWeight: 700 }}>
                {b.unlocked ? "✓ Bajarildi" : "🔒 Qulflangan"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
