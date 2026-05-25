import React from "react";

const NAV_ITEMS = [
  { id: "home", label: "Bosh sahifa" },
  { id: "tips", label: "Maslahatlar" },
  { id: "vocab", label: "Lug'at" },
  { id: "quizSetup", label: "Quiz" },
  { id: "matchSetup", label: "So'z Top" },
  { id: "stats", label: "Natijalar" },
  { id: "spellingSetup", label: "Yozish" },
];

const S = {
  nav: {
    position: "sticky", top: 0, zIndex: 100, background: "var(--nav-bg)",
    backdropFilter: "blur(10px)", borderBottom: "1px solid var(--border-color)",
    padding: "0 16px", display: "flex", alignItems: "center",
    justifyContent: "space-between", height: 56
  },
  navLogo: { display: "flex", alignItems: "center", gap: 10, flexShrink: 0, cursor: "pointer" },
  navFlag: {
    width: 28, height: 28, borderRadius: 7,
    background: "linear-gradient(135deg,#000 33%,#e63946 33% 66%,#f4d03f 66%)"
  },
  navTitle: {
    fontFamily: "'Playfair Display',serif", fontWeight: 700,
    fontSize: 17, color: "var(--color)", whiteSpace: "nowrap"
  },
};

export default function Navbar({ page, theme, toggleTheme, menuOpen, setMenuOpen, navigate }) {
  return (
    <>
      <nav style={S.nav}>
        <div style={S.navLogo} onClick={() => navigate("home")} role="button">
          <div style={S.navFlag} />
          <span style={S.navTitle}>Deutsch Hub</span>
        </div>

        {/* Desktop links */}
        <div className="desktop-nav">
          {NAV_ITEMS.map(n => (
            <button key={n.id} className={`nb nl ${page === n.id || (n.id === "quizSetup" && page === "quiz") || (n.id === "spellingSetup" && page === "spelling") || (n.id === "matchSetup" && page === "match") ? "act" : ""}`}
              onClick={() => navigate(n.id)}>{n.label}</button>
          ))}
        </div>

        {/* Mobile menu utilities */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button className="theme-toggle-btn mobile-toggle" onClick={toggleTheme} title="Mavzuni o'zgartirish">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {/* Mobile hamburger */}
          <button className="nb mobile-menu-btn ham" onClick={() => setMenuOpen(m => !m)}>
            <span style={menuOpen ? { transform: "rotate(45deg) translate(5px,5px)" } : {}} />
            <span style={menuOpen ? { opacity: 0 } : {}} />
            <span style={menuOpen ? { transform: "rotate(-45deg) translate(5px,-5px)" } : {}} />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="mob-menu">
          {NAV_ITEMS.map(n => (
            <button key={n.id}
              className={`nb mob-nl ${page === n.id || (n.id === "quizSetup" && page === "quiz") || (n.id === "spellingSetup" && page === "spelling") || (n.id === "matchSetup" && page === "match") ? "act" : ""}`}
              onClick={() => navigate(n.id)}>{n.label}</button>
          ))}
        </div>
      )}
    </>
  );
}
