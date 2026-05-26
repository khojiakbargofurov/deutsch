import React, { useState } from "react";
import { 
  PathIcon, 
  VocabIcon, 
  LeagueIcon, 
  ShopIcon, 
  StatsIcon, 
  FlameIcon, 
  GemIcon, 
  HeartIcon 
} from "./Icons";

const LEAGUE_ICONS = {
  "Bronza": "🥉",
  "Kumush": "🥈",
  "Oltin": "🥇",
  "Yoqut (Ruby)": "♦️",
  "Olmos (Diamond)": "💎",
};

export default function Navbar({
  page,
  theme,
  toggleTheme,
  navigate,
  streak,
  gems,
  hearts,
  setHearts,
  setGems,
  league,
  vipUnlocked,
  goldCrownTheme,
  showToast
}) {
  const [showHeartsModal, setShowHeartsModal] = useState(false);

  const refillHearts = () => {
    if (gems >= 100) {
      setGems(g => g - 100);
      setHearts(5);
      setShowHeartsModal(false);
      showToast("Jonlaringiz to'liq tiklandi! ❤️ (5/5)", "success");
    } else {
      showToast("Gevharlar yetarli emas! 💎", "error");
    }
  };

  return (
    <>
      {/* ── FIXED DESKTOP LEFT SIDEBAR NAVIGATION ── */}
      <aside className="desktop-sidebar-only" style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        width: 240,
        background: "var(--nav-bg)",
        backdropFilter: "blur(16px)",
        borderRight: "1px solid var(--border-color)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "24px 16px",
        zIndex: 100,
        boxSizing: "border-box",
      }}>
        {/* Brand / Logo Section */}
        <div>
          <div 
            onClick={() => navigate("home")} 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 10, 
              cursor: "pointer",
              marginBottom: 32,
              padding: "0 8px"
            }}
          >
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "linear-gradient(135deg, #000 33%, #e63946 33% 66%, #e5c158 66%)",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
            }} />
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              fontSize: 18,
              letterSpacing: -0.5,
              whiteSpace: "nowrap"
            }}>
              Deutsch <span style={{ color: "var(--accent)" }}>Blitzi</span>
              {vipUnlocked && <span style={{ color: "#ffd700", marginLeft: 4 }} title="Oltin VIP A'zo">👑</span>}
            </span>
          </div>

          {/* Navigation Links Stack */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { id: "home", component: PathIcon, label: "Yo'l" },
              { id: "vocab", component: VocabIcon, label: "Lug'at" },
              { id: "league", component: LeagueIcon, label: "Liga" },
              { id: "shop", component: ShopIcon, label: "Do'kon" },
              { id: "stats", component: StatsIcon, label: "Profil" },
            ].map((item) => {
              const isActive = page === item.id || 
                (item.id === "home" && (page === "quiz" || page === "quizSetup")) || 
                (item.id === "vocab" && (page === "spelling" || page === "spellingSetup" || page === "match" || page === "matchSetup"));
              
              const Icon = item.component;
              
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`sidebar-btn-item ${isActive ? "active" : ""}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    width: "100%",
                    padding: "10px 16px",
                    borderRadius: 14,
                    color: isActive ? "var(--accent)" : "var(--text-light)",
                    fontWeight: isActive ? 700 : 500,
                    fontSize: 14,
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                    position: "relative",
                    background: isActive ? "var(--hover-bg)" : "transparent",
                  }}
                >
                  {isActive && (
                    <div style={{
                      position: "absolute",
                      left: 0,
                      top: "20%",
                      bottom: "20%",
                      width: 4,
                      borderRadius: "0 4px 4px 0",
                      background: "var(--accent)",
                      boxShadow: "0 0 10px var(--accent)"
                    }} />
                  )}
                  <Icon size={26} active={isActive} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Section: Theme & Stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Divider */}
          <div style={{ height: 1, background: "var(--border-color)", width: "100%" }} />

          {/* Stats indicators Stack */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "0 8px" }}>
            {/* League Rank */}
            <div 
              onClick={() => navigate("league")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 13,
                cursor: "pointer",
              }}
              title="Liganing o'rni"
            >
              <span style={{ fontSize: 18 }}>{LEAGUE_ICONS[league] || "🥉"}</span>
              <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "var(--text-light)" }}>
                {league} Liga
              </span>
            </div>

            {/* Streak */}
            <div 
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 13,
                fontWeight: 700,
                color: "#e67e22"
              }}
              title="Kunlik faollik streak"
            >
              <FlameIcon size={18} color="#e67e22" />
              <span>{streak} kun faol</span>
            </div>

            {/* Gems */}
            <div 
              onClick={() => navigate("shop")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 13,
                fontWeight: 700,
                color: "#00d2ff",
                cursor: "pointer"
              }}
              title="Gevharlar"
            >
              <GemIcon size={18} color="#00d2ff" />
              <span>{gems} gevhar</span>
            </div>

            {/* Hearts (Clickable Refill) */}
            <div 
              onClick={() => setShowHeartsModal(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 13,
                fontWeight: 700,
                color: "#e63946",
                cursor: "pointer"
              }}
              title="Jonlar (To'ldirish uchun bosing)"
            >
              <HeartIcon size={18} color="#e63946" />
              <span>{hearts} / 5 jon</span>
            </div>
          </div>

          {/* Theme switcher button */}
          <button 
            onClick={toggleTheme}
            className="theme-toggle-btn"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              width: "100%",
              padding: "10px 16px",
              borderRadius: 12,
              background: "var(--chip-bg)",
              border: "1px solid var(--border-color)",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500,
              color: "var(--color)"
            }}
          >
            <span>{theme === "dark" ? "☀️ Yorug' mavzu" : "🌙 Qorong'u mavzu"}</span>
          </button>
        </div>
      </aside>

      {/* ── TOP STATUS BAR (MOBILE ONLY) ── */}
      <nav className="mobile-top-bar" style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "var(--nav-bg)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-color)",
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
      }}>
        {/* Mockup Circular Flag of Germany */}
        <div 
          onClick={() => showToast("Nemis tili kursi faol! 🇩🇪", "info")}
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "linear-gradient(180deg, #000 33%, #d9212c 33% 66%, #ffcc00 66%)",
            border: "2px solid rgba(255, 255, 255, 0.15)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            flexShrink: 0,
            cursor: "pointer"
          }} 
        />

        {/* Dynamic Minimalist Stats indicators matching Mockup exactly */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Streak Flame indicator */}
          <div 
            title="Kunlik faollik streak"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 15,
              fontWeight: 800,
              color: "#ff9600"
            }}
          >
            <FlameIcon size={20} color="#ff9600" />
            <span>{streak}</span>
          </div>

          {/* Gems indicator */}
          <div 
            title="Gevharlar"
            onClick={() => navigate("shop")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 15,
              fontWeight: 800,
              color: "#1cb0f6",
              cursor: "pointer"
            }}
          >
            <GemIcon size={20} color="#1cb0f6" />
            <span>{gems}</span>
          </div>

          {/* Hearts indicator */}
          <div 
            onClick={() => setShowHeartsModal(true)}
            title="Jonlar (To'ldirish uchun bosing)"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 15,
              fontWeight: 800,
              color: "#ff4b4b",
              cursor: "pointer",
              transition: "transform 0.15s ease",
            }}
            className="hearts-indicator"
          >
            <HeartIcon size={20} color="#ff4b4b" />
            <span>{hearts}</span>
          </div>
        </div>
      </nav>

      {/* ── HEARTS REFILL MODAL/SHEET (SHARED ON BOTH DESKTOP & MOBILE) ── */}
      {showHeartsModal && (
        <div 
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(4px)",
            zIndex: 1001,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center"
          }}
          onClick={() => setShowHeartsModal(false)}
        >
          <div 
            style={{
              background: "var(--card-bg)",
              borderTop: "1px solid var(--border-color)",
              borderRadius: "24px 24px 0 0",
              width: "100%",
              maxWidth: 450,
              padding: "32px 24px 40px",
              boxShadow: "0 -10px 40px rgba(0, 0, 0, 0.15)",
              boxSizing: "border-box",
              animation: "slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
              textAlign: "center"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
              <HeartIcon size={56} color="#e63946" />
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900, marginBottom: 8 }}>
              Jonlaringiz Tahlili
            </h3>
            <p style={{ fontSize: 14, color: "var(--text-light)", lineHeight: 1.6, marginBottom: 24 }}>
              Hozirda sizda <strong>{hearts} ta jon</strong> bor. Darslarda xato qilganingizda jonlar kamayib boradi.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {hearts < 5 ? (
                <button 
                  className="btn-y" 
                  onClick={refillHearts}
                  disabled={gems < 100}
                  style={{ width: "100%", maxWidth: "none", opacity: gems < 100 ? 0.6 : 1 }}
                >
                  💎 100 Gevhar evaziga to'ldirish (5/5 ❤️)
                </button>
              ) : (
                <div style={{
                  background: "var(--chip-bg)",
                  border: "1px solid var(--chip-border)",
                  borderRadius: 12,
                  padding: 12,
                  color: "#2ecc71",
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 8
                }}>
                  ✓ Jonlaringiz to'liq! Darsga tayyorsiz.
                </div>
              )}

              <button 
                className="btn-o" 
                onClick={() => {
                  setShowHeartsModal(false);
                  navigate("spellingSetup");
                }}
                style={{ width: "100%" }}
              >
                ⚡ Tezkor mashq orqali jon to'plash (+1 ❤️)
              </button>

              <button 
                className="nb nl" 
                onClick={() => setShowHeartsModal(false)}
                style={{ marginTop: 8 }}
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FIXED MOBILE BOTTOM NAVIGATION BAR (MOBILE ONLY) ── */}
      <div className="mobile-bottom-bar" style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        background: "var(--nav-bg)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid var(--border-color)",
        height: 68,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}>
        {[
          { id: "home", component: PathIcon, label: "Yo'l" },
          { id: "vocab", component: VocabIcon, label: "Lug'at" },
          { id: "league", component: LeagueIcon, label: "Liga" },
          { id: "shop", component: ShopIcon, label: "Do'kon" },
          { id: "stats", component: StatsIcon, label: "Profil" },
        ].map((item) => {
          const isActive = page === item.id || 
            (item.id === "home" && (page === "quiz" || page === "quizSetup")) || 
            (item.id === "vocab" && (page === "spelling" || page === "spellingSetup" || page === "match" || page === "matchSetup"));
          
          const Icon = item.component;
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className="nb"
              title={item.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                height: "100%",
                transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                transform: isActive ? "scale(1.15) translateY(-3px)" : "scale(1)",
              }}
            >
              {/* Active pill highlight */}
              <div style={{
                padding: "8px 12px",
                borderRadius: 16,
                background: isActive ? "var(--hover-bg)" : "transparent",
                transition: "background 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Icon size={34} active={isActive} />
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
