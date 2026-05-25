import React from "react";

const S = {
  inner: { maxWidth: 720, margin: "0 auto", padding: "40px 16px 80px" },
};

export default function StatsDashboard({ favorites, learntWords, quizHistory, fastestMatch }) {
  return (
    <div style={S.inner} className="inner-pad">
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,6vw,38px)", fontWeight: 900, marginBottom: 8 }}>
          Natijalar <span style={{ color: "#f4d03f" }}>Tahlili</span>
        </h2>
        <p style={{ fontSize: 14, color: "var(--text-light)", lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>
          Shaxsiy o'zlashtirish ko'rsatkichlari, testlar tarixi va erishilgan yutuqlar.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid-3" style={{ marginBottom: 32, gap: 12 }}>
        <div className="home-tile" style={{ padding: "16px 12px", cursor: "default", transform: "none" }}>
          <div style={{ fontSize: 26, marginBottom: 6 }}>🌟</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 900, color: "#f4d03f" }}>
            {favorites.length}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Tanlangan so'zlar</div>
        </div>
        
        <div className="home-tile" style={{ padding: "16px 12px", cursor: "default", transform: "none" }}>
          <div style={{ fontSize: 26, marginBottom: 6 }}>✅</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 900, color: "#2ecc71" }}>
            {learntWords.length}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Yodlangan so'zlar</div>
        </div>

        <div className="home-tile" style={{ padding: "16px 12px", cursor: "default", transform: "none" }}>
          <div style={{ fontSize: 26, marginBottom: 6 }}>🧠</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 900, color: "#0088cc" }}>
            {quizHistory.length}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>O'ynalgan Quizlar</div>
        </div>
      </div>

      <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 18, padding: "24px 20px", marginBottom: 32 }}>
        <div style={{ fontSize: 11, color: "#f4d03f", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600 }}>So'nggi 8 ta test grafigi</div>
        {quizHistory.length === 0 ? (
          <div style={{ padding: "40px 0", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
            Hozircha natijalar mavjud emas. Quiz bo'limida o'zingizni sinab ko'ring!
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
              💡 Ustunlar ustiga bosib yoki sichqonchani olib borib aniq natijani ko'rishingiz mumkin.
            </div>
          </div>
        )}
      </div>

      {/* Achievements Section */}
      <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 18, padding: "24px 20px" }}>
        <div style={{ fontSize: 11, color: "#f4d03f", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>Erishilgan Yutuqlar</div>
        <div className="badges-grid">
          {[
            {
              id: "champion",
              icon: "🏆",
              title: "Nemischa Chempion",
              desc: "Quizda kamida 18 ta to'g'ri javob toping",
              unlocked: quizHistory.some(h => h.score >= 18)
            },
            {
              id: "fast",
              icon: "⚡",
              title: "Tezkor O'quvchi",
              desc: "So'z topish o'yinini 40 soniyadan tezroq yakunlang",
              unlocked: fastestMatch <= 40
            },
            {
              id: "patient",
              icon: "📚",
              title: "Sabrli Talaba",
              desc: "Kamida 5 marotaba Quiz o'ynang",
              unlocked: quizHistory.length >= 5
            },
            {
              id: "collector",
              icon: "⭐",
              title: "So'z Jamg'aruvchi",
              desc: "Tanlanganlar ro'yxatiga 10 tadan ortiq so'z qo'shing",
              unlocked: favorites.length >= 10
            }
          ].map(b => (
            <div key={b.id} className={`badge-card ${b.unlocked ? "unlocked" : "locked"}`}>
              <div className="badge-icon">{b.icon}</div>
              <div className="badge-title">{b.title}</div>
              <div className="badge-desc">{b.desc}</div>
              <div style={{ fontSize: 10, marginTop: 8, color: b.unlocked ? "#f4d03f" : "var(--text-muted)", fontWeight: 600 }}>
                {b.unlocked ? "✓ Bajarildi" : "🔒 Qulflangan"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
