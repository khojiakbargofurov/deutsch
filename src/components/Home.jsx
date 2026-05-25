import React from "react";
import { TIPS } from "../data/vocabData";

const S = {
  inner: { maxWidth: 720, margin: "0 auto", padding: "40px 16px 80px" },
};

export default function Home({ navigate, allCount }) {
  return (
    <div style={S.inner} className="inner-pad">
      <div style={{ textAlign: "center", marginBottom: 52 }}>
        <div style={{
          display: "inline-block", background: "var(--card-bg)", border: "1px solid var(--border-color)",
          borderRadius: 30, padding: "5px 16px", marginBottom: 22
        }}>
          <span style={{ fontSize: 11, color: "#f4d03f", letterSpacing: 2, textTransform: "uppercase" }}>
            Nemis tili o'rganish platformasi
          </span>
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display',serif", fontWeight: 900,
          fontSize: "clamp(34px,8vw,60px)", lineHeight: 1.1, marginBottom: 18
        }}>
          Fließend<br /><span style={{ color: "#f4d03f" }}>Deutsch</span> sprechen
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-light)", lineHeight: 1.7, maxWidth: 440, margin: "0 auto" }}>
          {allCount}+ so'z, 5 ta muhim maslahat va takrorlashsiz interaktiv quiz — o'zbek tilida nemis tilini o'rgan!
        </p>
      </div>

      <div className="grid-3" style={{ marginBottom: 40 }}>
        {[
          { emoji: "📖", title: "5 ta Maslahat", sub: "Ravon gaplashish uchun yo'riqnoma", go: "tips", color: "#2ecc71" },
          { emoji: "📚", title: "Lug'at Bazasi", sub: `${allCount}+ so'z, 4 kategoriya`, go: "vocab", color: "#e63946" },
          { emoji: "🧠", title: "Interaktiv Quiz", sub: "Takrorlashsiz 20 ta savol", go: "quizSetup", color: "#0088cc" },
          { emoji: "🎮", title: "So'z Top O'yini", sub: "Tezkor bilingual xotira o'yini", go: "matchSetup", color: "#f4d03f" },
          { emoji: "📊", title: "Natijalar", sub: "Progress tahlili va nishonlar", go: "stats", color: "#e67e22" },
          { emoji: "✍️", title: "Yozish Mashqi", sub: "Umlautlar bilan diktant o'yini", go: "spellingSetup", color: "#9b59b6" },
        ].map(item => (
          <div key={item.go} className="home-tile" onClick={() => navigate(item.go)} style={{ position: "relative", overflow: "hidden" }}>
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "3px",
              background: `linear-gradient(90deg, ${item.color}, transparent)`
            }} />
            <div style={{ fontSize: 36, marginBottom: 14 }}>{item.emoji}</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, fontWeight: 700, marginBottom: 6 }}>{item.title}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.4 }}>{item.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 18, padding: "24px 20px" }}>
        <div style={{ fontSize: 11, color: "#f4d03f", letterSpacing: 2, textTransform: "uppercase", marginBottom: 18 }}>Qisqa xulosa</div>
        {TIPS.map((t, i) => (
          <div key={i} style={{ display: "flex", gap: 14, marginBottom: 14, alignItems: "flex-start" }}>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 900, color: "var(--border-color)", minWidth: 30 }}>{t.number}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{t.icon} {t.title}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{t.short}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Telegram Bot Promo Card */}
      <div className="tg-promo-card">
        <div className="tg-promo-icon-wrap">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m22 2-7 20-4-9-9-4Z"></path>
            <path d="M22 2 11 13"></path>
          </svg>
        </div>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 900, marginBottom: 8 }}>
          Telegram Botimizni Sinab Ko'ring! 🤖
        </h3>
        <p style={{ fontSize: 14, color: "var(--text-light)", lineHeight: 1.6 }}>
          Nemis tilini yo'l-yo'lakay va yanada qiziqarliroq o'rganing. Botimiz orqali har kuni Toshkent vaqti bilan 09:00 da avtomatik yangi so'zlarni oling, interaktiv testlar yeching va guruhlarda tezkor inline qidiruvdan foydalaning!
        </p>
        
        <div className="tg-features-grid">
          <div className="tg-feature-item">
            <span className="tg-feature-emoji">📅</span>
            <div className="tg-feature-title">Kunlik Yangi So'z</div>
            <div className="tg-feature-desc">Har kuni 09:00 da o'zbekcha gap namunalari bilan so'zlar.</div>
          </div>
          <div className="tg-feature-item">
            <span className="tg-feature-emoji">🏆</span>
            <div className="tg-feature-title">Top O'quvchilar</div>
            <div className="tg-feature-desc">Testlarni yechib, eng yaxshi 10 o'quvchi ro'yxatidan joy oling.</div>
          </div>
          <div className="tg-feature-item">
            <span className="tg-feature-emoji">🔍</span>
            <div className="tg-feature-title">Inline Qidiruv</div>
            <div className="tg-feature-desc">Guruhlarda shunchaki @deutch_blitz_bot yozib so'z qidiring.</div>
          </div>
        </div>
        
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <a href="https://t.me/deutch_blitz_bot" target="_blank" rel="noopener noreferrer" className="btn-tg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 2-7 20-4-9-9-4Z"></path>
              <path d="M22 2 11 13"></path>
            </svg>
            Telegram-da Ochish
          </a>
        </div>
      </div>
    </div>
  );
}
