import React, { useState, useEffect } from "react";

const LEAGUES = [
  { name: "Bronza", icon: "🥉", color: "#cd7f32", border: "#df9c57" },
  { name: "Kumush", icon: "🥈", color: "#c0c0c0", border: "#dcdcdc" },
  { name: "Oltin", icon: "🥇", color: "#ffd700", border: "#fff099" },
  { name: "Yoqut (Ruby)", icon: "♦️", color: "#e63946", border: "#f08080" },
  { name: "Olmos (Diamond)", icon: "💎", color: "#00d2ff", border: "#8be7ff" },
];

const BOT_TEMPLATES = [
  { name: "Sarah 🇩🇪", avatar: "👩‍🚀", xpBase: 120 },
  { name: "Lukas 🇦🇹", avatar: "👨‍🎨", xpBase: 90 },
  { name: "Javohir 🇺🇿", avatar: "🧑‍💻", xpBase: 150 },
  { name: "Anja 🇨🇭", avatar: "👩‍⚕️", xpBase: 80 },
  { name: "Elias 🇩🇪", avatar: "👨‍🚀", xpBase: 110 },
];

export default function LeagueBoard({ xp, league }) {
  const leagueIndex = LEAGUES.findIndex((l) => l.name === league) === -1 
    ? 0 
    : LEAGUES.findIndex((l) => l.name === league);
  
  const currentLeague = LEAGUES[leagueIndex];

  const [leaderboard, setLeaderboard] = useState(() => {
    try {
      const saved = localStorage.getItem(`leaderboard_${currentLeague.name}`);
      if (saved) return JSON.parse(saved);
    } catch {}

    // Generate simulated initial scores
    const initialBots = BOT_TEMPLATES.map((bot, i) => {
      const randomOffset = Math.floor(Math.random() * 60) - 30; // -30 to +30
      return {
        id: `bot_${i}`,
        name: bot.name,
        avatar: bot.avatar,
        xp: Math.max(10, bot.xpBase * (leagueIndex + 1) + randomOffset),
        isPlayer: false,
      };
    });

    return [...initialBots, { id: "player", name: "Siz (O'quvchi)", avatar: "⚡", xp: xp, isPlayer: true }];
  });

  // Sort leaderboard by XP
  const sortedBoard = [...leaderboard].sort((a, b) => b.xp - a.xp);

  // Sync user XP dynamically and simulate minor increments for bots to create competition
  useEffect(() => {
    setLeaderboard((prev) => {
      const updated = prev.map((item) => {
        if (item.isPlayer) {
          return { ...item, xp: xp };
        } else {
          // 20% chance that a bot gains 5-15 XP when player opens the board to simulate active study
          const shouldGain = Math.random() < 0.25;
          if (shouldGain) {
            return { ...item, xp: item.xp + Math.floor(Math.random() * 10) + 5 };
          }
        }
        return item;
      });
      
      localStorage.setItem(`leaderboard_${currentLeague.name}`, JSON.stringify(updated));
      return updated;
    });
  }, [xp, currentLeague.name]);

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "40px 16px 80px" }} className="inner-pad">
      {/* Header Banner */}
      <div style={{
        background: `linear-gradient(135deg, ${currentLeague.color}22, ${currentLeague.color}0a)`,
        border: `1.5px solid ${currentLeague.color}44`,
        borderRadius: 24,
        padding: 24,
        textAlign: "center",
        marginBottom: 32,
        position: "relative",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.03)"
      }}>
        <div style={{ fontSize: 60, marginBottom: 8, filter: `drop-shadow(0 4px 10px ${currentLeague.color}44)` }}>
          {currentLeague.icon}
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, marginBottom: 4 }}>
          {currentLeague.name} Ligasi
        </h2>
        <p style={{ fontSize: 13, color: "var(--text-light)", margin: "0 auto 12px", maxWidth: 300 }}>
          Haftalik jadvalda yuqori natijalar ko'rsatib, keyingi darajaga ko'tariling!
        </p>
        <div style={{
          display: "inline-block",
          background: "var(--bg)",
          border: "1px solid var(--border-color)",
          borderRadius: 20,
          padding: "6px 14px",
          fontSize: 12,
          fontWeight: 600,
          color: "var(--text-muted)"
        }}>
          ⏳ Musobaqa tugashiga: <strong>1d 14h</strong> qoldi
        </div>
      </div>

      {/* Leaderboard list */}
      <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 20, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "var(--text-muted)", fontWeight: 600 }}>Tarkibiy Reyting</span>
          <span style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600 }}>Top 3 ta keyingi ligaga 🚀</span>
        </div>

        {sortedBoard.map((user, index) => {
          const rank = index + 1;
          let rankColor = "var(--text-muted)";
          if (rank === 1) rankColor = "#ffd700";
          else if (rank === 2) rankColor = "#c0c0c0";
          else if (rank === 3) rankColor = "#cd7f32";

          const isPromotionZone = rank <= 3;

          return (
            <div 
              key={user.id} 
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                borderBottom: "1px solid var(--border-color)",
                background: user.isPlayer ? "var(--hover-bg)" : "transparent",
                position: "relative",
              }}
            >
              {/* Promotion accent line */}
              {isPromotionZone && (
                <div style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 3,
                  backgroundColor: "#2ecc71"
                }} />
              )}

              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {/* Position */}
                <span style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 18,
                  fontWeight: 900,
                  color: rankColor,
                  minWidth: 20,
                  textAlign: "center"
                }}>
                  {rank}
                </span>

                {/* Avatar */}
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background: "var(--chip-bg)",
                  border: "1px solid var(--border-color)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18
                }}>
                  {user.avatar}
                </div>

                {/* Name */}
                <div>
                  <span style={{ 
                    fontSize: 14, 
                    fontWeight: user.isPlayer ? 700 : 500,
                    color: user.isPlayer ? "var(--accent)" : "var(--color)"
                  }}>
                    {user.name}
                  </span>
                  {user.isPlayer && (
                    <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Sizning joriy o'rningiz</div>
                  )}
                </div>
              </div>

              {/* XP score */}
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: "var(--color)" }}>
                  {user.xp}
                </span>
                <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 4 }}>
                  XP
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-muted)", marginTop: 16, lineHeight: 1.6 }}>
        📢 Har kuni nemis tili lug'atlarini o'rganing va testlarni yechib ball to'plang. Top 3 talikka kirganlar dushanba kuni avtomatik ravishda yuqori ligaga ko'tariladi!
      </p>
    </div>
  );
}
