import React, { useState, useEffect } from "react";
import { LEVELS } from "../data/vocabData";
import { StarIcon } from "./Icons";
import LessonModal from "./LessonModal";

// Inline Custom Premium SVGs for mock alignment
const MascotOwl = ({ size = 56, hasBell = false }) => (
  <div style={{ position: "relative", width: size, height: size }}>
    <img 
      src="/logo.png" 
      alt="Mascot" 
      style={{ 
        width: size, 
        height: size, 
        borderRadius: "16px",
        boxShadow: "0 4px 15px rgba(88,204,2,0.3)",
        border: "2px solid #58cc02",
        objectFit: "cover",
        display: "block"
      }} 
    />
    {hasBell && (
      <div style={{
        position: "absolute",
        bottom: -2,
        right: -2,
        width: size * 0.45,
        height: size * 0.45,
        borderRadius: "50%",
        background: "#ffd700",
        border: "1.5px solid #0a0b0d",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.25,
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
      }}>
        🔔
      </div>
    )}
  </div>
);

const ChestIcon = ({ isUnlocked, isOpened }) => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={isOpened ? "#2ecc71" : isUnlocked ? "#ffd700" : "#5f6975"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "all 0.2s ease" }}>
    <path d="M19 10H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Z" fill={isOpened ? "rgba(46,204,113,0.15)" : isUnlocked ? "rgba(255,215,0,0.15)" : "rgba(255,255,255,0.02)"} />
    <path d="M12 22V10" />
    <path d="M12 10a4 4 0 0 0-4-4H5a2 2 0 0 0-2 2v2h18V8a2 2 0 0 0-2-2h-3a4 4 0 0 0-4 4Z" />
    {!isUnlocked && <circle cx="12" cy="15" r="1.5" fill="#5f6975" />}
    {isUnlocked && !isOpened && <circle cx="12" cy="15" r="1.5" fill="#ffd700" className="pulse-active" />}
  </svg>
);

const TrophyIcon = ({ isUnlocked, isClaimed }) => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={isClaimed ? "#2ecc71" : isUnlocked ? "#ffd700" : "#5f6975"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "all 0.2s ease" }}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
    <path d="M12 2a6 6 0 0 1 6 6v5a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8a6 6 0 0 1 6-6Z" fill={isClaimed ? "rgba(46,204,113,0.15)" : isUnlocked ? "rgba(255,215,0,0.15)" : "rgba(255,255,255,0.02)"} />
  </svg>
);

const S = {
  container: {
    maxWidth: 480,
    margin: "0 auto",
    padding: "24px 16px 120px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  unitHeader: {
    width: "100%",
    borderRadius: 20,
    padding: "20px 24px",
    marginBottom: 40,
    color: "#fff",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.05)",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  node: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    cursor: "pointer",
    transition: "all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
    position: "relative",
    marginBottom: 28,
  },
  connector: {
    width: 6,
    height: 28,
    background: "var(--border-color)",
    margin: "-16px 0 12px 0",
    borderRadius: 3,
  }
};

// Flat primary unit color matches Duolingo Mockup perfectly
const UNIT_METAS = {
  1: { gradient: "linear-gradient(135deg, #58cc02, #46a302)", shadow: "rgba(88, 204, 2, 0.25)" },
  2: { gradient: "linear-gradient(135deg, #1cb0f6, #189fdc)", shadow: "rgba(28, 176, 246, 0.25)" },
  3: { gradient: "linear-gradient(135deg, #ff9600, #e68500)", shadow: "rgba(255, 150, 0, 0.25)" },
  4: { gradient: "linear-gradient(135deg, #ff4b4b, #ea2b2b)", shadow: "rgba(255, 75, 75, 0.25)" },
};

export default function Home({ 
  navigate, 
  completedLevels, 
  hearts, 
  startLesson, 
  showToast,
  gems,
  setGems,
  xp,
  setXp
}) {
  const [selectedLevel, setSelectedLevel] = useState(null);

  // Load chests/trophies claims
  const [openedChests, setOpenedChests] = useState(() => {
    try {
      const saved = localStorage.getItem("openedChests");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [claimedTrophies, setClaimedTrophies] = useState(() => {
    try {
      const saved = localStorage.getItem("claimedTrophies");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Daily Streak Reminder sheet state (mock reminder banner)
  const [showStreakReminder, setShowStreakReminder] = useState(() => {
    try {
      const shown = sessionStorage.getItem("streakReminderShown");
      return shown !== "true";
    } catch {
      return true;
    }
  });

  const dismissReminder = (turnOn = false) => {
    setShowStreakReminder(false);
    sessionStorage.setItem("streakReminderShown", "true");
    if (turnOn) {
      showToast("Kunlik faollik eslatmalari faollashtirildi! 🔔", "success");
    }
  };

  // Group levels by units
  const units = {};
  LEVELS.forEach(lvl => {
    if (!units[lvl.unit]) {
      units[lvl.unit] = {
        title: lvl.unitTitle,
        levels: []
      };
    }
    units[lvl.unit].levels.push(lvl);
  });

  const handleNodeClick = (lvl, isLocked) => {
    if (isLocked) {
      showToast("Bu bosqich hali qulflangan! 🔒 Oldingi darslarni tamomlang.", "error");
      return;
    }
    setSelectedLevel(lvl);
  };

  const handleChestClick = (chestId, isUnlocked) => {
    if (!isUnlocked) {
      showToast("Bu sovg'a hali qulflangan! 🔒 Oldingi darslarni tamomlang.", "error");
      return;
    }
    if (openedChests.includes(chestId)) {
      showToast("Ushbu sovg'a allaqachon ochilgan! 💎", "info");
      return;
    }
    const nextChests = [...openedChests, chestId];
    setOpenedChests(nextChests);
    localStorage.setItem("openedChests", JSON.stringify(nextChests));
    setGems(g => g + 50);
    showToast("Muvaffaqiyatli ochildi! 🎁 +50 Gevhar qo'lga kiritdingiz! 💎", "success");
  };

  const handleTrophyClick = (trophyId, isUnlocked) => {
    if (!isUnlocked) {
      showToast("Bu kubok hali qulflangan! 🏆 Unit tarkibidagi barcha darslarni yeching.", "error");
      return;
    }
    if (claimedTrophies.includes(trophyId)) {
      showToast("Ushbu kubok allaqachon qo'lga kiritilgan! 🏆", "info");
      return;
    }
    const nextTrophies = [...claimedTrophies, trophyId];
    setClaimedTrophies(nextTrophies);
    localStorage.setItem("claimedTrophies", JSON.stringify(nextTrophies));
    setGems(g => g + 100);
    setXp(x => x + 50);
    showToast("Ajoyib! 🏆 Unit kubogi qo'lga kiritildi! +100 Gevhar 💎 va +50 XP ⚡", "success");
  };

  return (
    <div style={S.container}>
      {/* Quick Practice Banner */}
      <div style={{
        width: "100%",
        background: "var(--card-bg)",
        border: "1px solid var(--border-color)",
        borderRadius: 20,
        padding: "16px 20px",
        marginBottom: 36,
        boxSizing: "border-box",
        textAlign: "center"
      }}>
        <div style={{ fontSize: 11, color: "var(--accent)", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>
          Tezkor Mashqlar ⚡
        </div>
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>
          Jonlarni tiklash yoki qo'shimcha XP to'plash uchun mashqlarni bajaring:
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button 
            className="btn-o" 
            onClick={() => navigate("matchSetup")}
            style={{ fontSize: 12, padding: "8px 14px", flex: 1 }}
          >
            🎮 Juftliklar (Match)
          </button>
          <button 
            className="btn-o" 
            onClick={() => navigate("spellingSetup")}
            style={{ fontSize: 12, padding: "8px 14px", flex: 1 }}
          >
            ✍️ Diktant (Spelling)
          </button>
        </div>
      </div>

      {/* Render units and nodes */}
      {Object.entries(units).map(([unitNum, unitData]) => {
        const meta = UNIT_METAS[unitNum] || UNIT_METAS[1];

        return (
          <div key={unitNum} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* Flat Solid primary Header matching Mockup */}
            <div style={{
              ...S.unitHeader,
              background: meta.gradient,
              boxShadow: `0 8px 24px ${meta.shadow}`
            }}>
              <div style={{ textAlign: "left", flex: 1 }}>
                <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", opacity: 0.8, fontWeight: 900, marginBottom: 4 }}>
                  PART 1, UNIT {unitNum}
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 900 }}>
                  {unitData.title.split(": ")[1] || unitData.title}
                </h3>
              </div>
              
              {/* Custom Booklet Tips Icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9, cursor: "pointer", flexShrink: 0, marginLeft: 12 }} title="Unit ma'lumotlari">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M6 6h10" />
                <path d="M6 10h10" />
              </svg>
            </div>

            {/* Level Nodes and injected Chests/Trophies in Sinusoidal curve */}
            {unitData.levels.map((lvl, idx) => {
              const isCompleted = completedLevels.includes(lvl.id);
              const isUnlocked = lvl.id === 1 || completedLevels.includes(lvl.id - 1);
              const isLocked = !isUnlocked && !isCompleted;

              // Sinusoidal offset calculation
              const horizontalOffset = Math.sin(idx * 1.5) * 50;

              let nodeBg = "var(--border-color)";
              let nodeBorder = "var(--border-color)";
              let nodeShadow = "none";
              let content = "🔒";

              if (isCompleted) {
                // Completed nodes are flat green with white checkmark
                nodeBg = "linear-gradient(135deg, #58cc02, #46a302)";
                nodeBorder = "#58cc02";
                nodeShadow = "0 6px 16px rgba(88, 204, 2, 0.35)";
                content = "✓";
              } else if (isUnlocked) {
                // Active node is flat dark background with glowing gold Star icon
                nodeBg = "var(--bg)";
                nodeBorder = "var(--accent)";
                nodeShadow = "0 0 15px rgba(229, 193, 88, 0.4)";
                content = <StarIcon size={24} color="var(--accent)" />;
              }

              // Draw active mascot owl standing next to active pulsing node
              const isCurrentActive = isUnlocked && !isCompleted;
              const mascotDirection = horizontalOffset >= 0 ? -1 : 1;

              return (
                <div key={lvl.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", position: "relative" }}>
                  
                  {/* Floating active mascot owl SVG */}
                  {isCurrentActive && (
                    <div style={{
                      position: "absolute",
                      left: `calc(50% + ${horizontalOffset + (mascotDirection * 68)}px - 28px)`,
                      top: 6,
                      zIndex: 10,
                      animation: "bounce 2.2s infinite"
                    }}>
                      <MascotOwl size={56} />
                    </div>
                  )}

                  {/* Circular Level Node */}
                  <div
                    onClick={() => handleNodeClick(lvl, isLocked)}
                    className={`snake-node ${isCurrentActive ? "pulse-active" : ""}`}
                    style={{
                      ...S.node,
                      transform: `translateX(${horizontalOffset}px)`,
                      background: nodeBg,
                      border: `4px solid ${nodeBorder}`,
                      boxShadow: nodeShadow,
                      color: isCompleted ? "#fff" : "var(--accent)"
                    }}
                  >
                    {content}

                    {/* Active pulsing START badge */}
                    {isCurrentActive && (
                      <div style={{
                        position: "absolute",
                        top: -38,
                        background: "var(--accent)",
                        color: "var(--bg)",
                        fontSize: 10,
                        fontWeight: 900,
                        padding: "4px 10px",
                        borderRadius: 10,
                        whiteSpace: "nowrap",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                        animation: "bounce 1.5s infinite"
                      }}>
                        START
                      </div>
                    )}
                  </div>

                  {/* Connector line to next node */}
                  <div style={{
                    ...S.connector,
                    transform: `translateX(${horizontalOffset + (Math.sin((idx + 0.5) * 1.5) * 50 - horizontalOffset) / 2}px)`
                  }} />

                  {/* Dynamic Chest Node Injection (After 2nd level node: idx === 1) */}
                  {idx === 1 && (
                    <>
                      {(() => {
                        const chestId = parseInt(unitNum, 10) * 10 + 1; // Unique chest ID e.g. 11, 21, 31, 41
                        const isChestUnlocked = completedLevels.includes(lvl.id);
                        const isChestOpened = openedChests.includes(chestId);
                        const chestPathOffset = Math.sin((idx + 0.5) * 1.5) * 50;

                        return (
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                            <div 
                              onClick={() => handleChestClick(chestId, isChestUnlocked)}
                              className={`snake-node ${isChestUnlocked && !isChestOpened ? "pulse-active" : ""}`}
                              style={{
                                ...S.node,
                                transform: `translateX(${chestPathOffset}px)`,
                                background: isChestOpened ? "var(--bg)" : "var(--card-bg)",
                                border: `3.5px solid ${isChestOpened ? "#2ecc71" : isChestUnlocked ? "#ffd700" : "var(--border-color)"}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                              title="Gevharlar sovg'asi 🎁"
                            >
                              <ChestIcon isUnlocked={isChestUnlocked} isOpened={isChestOpened} />
                            </div>
                            <div style={{
                              ...S.connector,
                              transform: `translateX(${chestPathOffset + (Math.sin((idx + 1) * 1.5) * 50 - chestPathOffset) / 2}px)`
                            }} />
                          </div>
                        );
                      })()}
                    </>
                  )}

                  {/* Dynamic Trophy Node Injection (At the end of unit: idx === 3) */}
                  {idx === 3 && (
                    <>
                      {(() => {
                        const trophyId = parseInt(unitNum, 10); // Trophy ID e.g. 1, 2, 3, 4
                        // Unlocked if all levels in the unit are completed
                        const isTrophyUnlocked = unitData.levels.every(l => completedLevels.includes(l.id));
                        const isTrophyClaimed = claimedTrophies.includes(trophyId);
                        const trophyPathOffset = Math.sin((idx + 0.5) * 1.5) * 50;

                        return (
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                            <div 
                              onClick={() => handleTrophyClick(trophyId, isTrophyUnlocked)}
                              className={`snake-node ${isTrophyUnlocked && !isTrophyClaimed ? "pulse-active" : ""}`}
                              style={{
                                ...S.node,
                                transform: `translateX(${trophyPathOffset}px)`,
                                background: isTrophyClaimed ? "var(--bg)" : "var(--card-bg)",
                                border: `3.5px solid ${isTrophyClaimed ? "#2ecc71" : isTrophyUnlocked ? "#ffd700" : "var(--border-color)"}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                              title="Unit Kubogi 🏆"
                            >
                              <TrophyIcon isUnlocked={isTrophyUnlocked} isClaimed={isTrophyClaimed} />
                            </div>
                            {/* Connector spacer to unit space */}
                            {unitNum !== "4" && (
                              <div style={{
                                ...S.connector,
                                transform: `translateX(${trophyPathOffset}px)`
                              }} />
                            )}
                          </div>
                        );
                      })()}
                    </>
                  )}
                </div>
              );
            })}

            {/* Space between units */}
            <div style={{ height: 32 }} />
          </div>
        );
      })}

      {/* Telegram Bot Banner */}
      <div style={{
        width: "100%",
        background: "var(--card-bg)",
        border: "1px solid var(--border-color)",
        borderRadius: 20,
        padding: "20px",
        marginTop: 20,
        boxSizing: "border-box",
        textAlign: "left"
      }}>
        <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 900, marginBottom: 6 }}>
          Telegram Botimiz 🤖
        </h4>
        <p style={{ fontSize: 12, color: "var(--text-light)", lineHeight: 1.5, marginBottom: 12 }}>
          Har kuni Toshkent vaqti bilan 09:00 da yangi nemischa so'zlarni oling, testlar yeching va raqobatlashing!
        </p>
        <a 
          href="https://t.me/deutch_blitz_bot" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn-tg"
          style={{ width: "100%", fontSize: 13, padding: "10px", textDecoration: "none", display: "inline-flex" }}
        >
          Telegramda qo'shilish
        </a>
      </div>

      {/* ── FIXED SLIDE-UP NOTIFICATION PANEL (Maintain your streak) ── */}
      {showStreakReminder && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(4px)",
          zIndex: 1001,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center"
        }}
        onClick={() => dismissReminder(false)}
        >
          <div style={{
            background: "var(--card-bg)",
            borderTop: "1.5px solid var(--border-color)",
            borderRadius: "24px 24px 0 0",
            width: "100%",
            maxWidth: 450,
            padding: "36px 24px 40px",
            boxShadow: "0 -10px 40px rgba(0, 0, 0, 0.15)",
            boxSizing: "border-box",
            animation: "slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            textAlign: "center"
          }}
          onClick={(e) => e.stopPropagation()}
          >
            {/* Mascot Bell SVG */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <MascotOwl size={64} hasBell={true} />
            </div>

            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900, marginBottom: 10 }}>
              Maintain your streak
            </h3>
            
            <p style={{ fontSize: 13, color: "var(--text-light)", lineHeight: 1.6, marginBottom: 30, padding: "0 12px" }}>
              We will send you a reminder so you don't forget to practice.
              Kunlik faollik eslatmalari sizga nemis tilini to'xtovsiz o'rganishda yordam beradi!
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button 
                onClick={() => dismissReminder(true)}
                style={{ 
                  background: "#1cb0f6", 
                  color: "#fff", 
                  border: "none",
                  borderRadius: 16,
                  padding: "15px 24px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 15,
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: "0 4px 0 #189fdc",
                  transition: "all 0.15s ease",
                  textTransform: "uppercase"
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = "translateY(2px)";
                  e.currentTarget.style.boxShadow = "0 2px 0 #189fdc";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 4px 0 #189fdc";
                }}
              >
                GET STARTED
              </button>

              <button 
                className="btn-o" 
                onClick={() => dismissReminder(false)}
                style={{ 
                  width: "100%",
                  padding: "13px 24px",
                  borderRadius: 16,
                  border: "2px solid #1c2730",
                  fontSize: 14,
                  fontWeight: 700,
                  textTransform: "uppercase"
                }}
              >
                NOT NOW
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Render detailed level modal */}
      {selectedLevel && (
        <LessonModal
          level={selectedLevel}
          hearts={hearts}
          onClose={() => setSelectedLevel(null)}
          onStart={(lvl) => {
            setSelectedLevel(null);
            startLesson(lvl);
          }}
        />
      )}
    </div>
  );
}
