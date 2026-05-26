import React, { useState } from "react";

const GOALS = [
  { id: 5,  emoji: "😊", label: "Sust",    desc: "Kuniga 5 daqiqa" },
  { id: 10, emoji: "🎯", label: "Oddiy",   desc: "Kuniga 10 daqiqa" },
  { id: 15, emoji: "💪", label: "Jiddiy",  desc: "Kuniga 15 daqiqa" },
  { id: 20, emoji: "🔥", label: "Intensiv",desc: "Kuniga 20 daqiqa" },
];

const AVATARS = ["🦉", "🐧", "🦊", "🐸", "🐯", "🦁", "🐺", "🦅"];

const LEVEL_QUESTIONS = [
  {
    q: "Siz ilgari nemis tilini o'rganganmisiz?",
    opts: ["Ha, ozroq", "Deyarli yo'q", "Umuman yo'q"],
    scores: [2, 1, 0],
  },
  {
    q: "'Danke' nima degani?",
    opts: ["Iltimos", "Rahmat", "Xayr"],
    scores: [0, 2, 0],
    correct: "Rahmat",
  },
  {
    q: "'Ich bin Student' nima degani?",
    opts: ["U student", "Men studentman", "Biz studentmiz"],
    scores: [0, 2, 0],
    correct: "Men studentman",
  },
  {
    q: "Qaysi so'z 'uy' degani?",
    opts: ["das Haus", "die Schule", "der Baum"],
    scores: [2, 0, 0],
    correct: "das Haus",
  },
];

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0); // 0=welcome, 1=goal, 2=avatar, 3=level-test, 4=done
  const [goal, setGoal] = useState(10);
  const [avatar, setAvatar] = useState("🦉");
  const [levelIdx, setLevelIdx] = useState(0);
  const [levelScore, setLevelScore] = useState(0);
  const [levelChosen, setLevelChosen] = useState(null);

  const handleLevelAnswer = (opt, score) => {
    if (levelChosen) return;
    setLevelChosen(opt);
    const newScore = levelScore + score;
    setTimeout(() => {
      if (levelIdx + 1 >= LEVEL_QUESTIONS.length) {
        // Determine level from score
        const level = newScore >= 6 ? "Intermediate" : newScore >= 3 ? "Beginner+" : "Beginner";
        onComplete({ goal, avatar, level });
      } else {
        setLevelIdx(i => i + 1);
        setLevelChosen(null);
        setLevelScore(newScore);
      }
    }, 750);
  };

  // ── STEP 0: WELCOME ────────────────────────────────────────
  if (step === 0) {
    return (
      <div style={outer}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          {/* Logo */}
          <div style={{ marginBottom: 32, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <img 
              src="/logo.png" 
              alt="Blitzi Mascot" 
              style={{ 
                width: 120, 
                height: 120, 
                borderRadius: "28px", 
                marginBottom: 16, 
                boxShadow: "0 8px 30px rgba(88,204,2,0.25)",
                border: "3px solid #58cc02",
                objectFit: "cover"
              }} 
            />
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900, fontSize: 32, color: "#58cc02",
              letterSpacing: -0.5
            }}>
              blitzi
            </div>
            <div style={{ color: "#788290", fontSize: 14, marginTop: 6 }}>
              O'zbekcha · Nemis tili platformasi
            </div>
          </div>

          {/* Features */}
          <div style={{ width: "100%", maxWidth: 340 }}>
            {[
              { icon: "🎯", text: "539+ so'z va iboralar" },
              { icon: "🃏", text: "Flashcard + Spaced Repetition" },
              { icon: "📝", text: "10 ta grammatika darsi" },
              { icon: "🔊", text: "Nemischa talaffuz" },
              { icon: "🏅", text: "Yutuqlar va ligalar" },
            ].map((f, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "12px 16px", marginBottom: 8,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14
              }}>
                <div style={{ fontSize: 22, flexShrink: 0 }}>{f.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#c8d0d8" }}>{f.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ width: "100%", paddingBottom: 20 }}>
          <button onClick={() => setStep(1)} style={btnGreen}>
            BOSHLASH 🚀
          </button>
          <button onClick={() => onComplete({ goal: 10, avatar: "🦉", level: "Beginner" })} style={btnGhost}>
            Allaqachon bilaman
          </button>
        </div>
      </div>
    );
  }

  // ── STEP 1: GOAL ───────────────────────────────────────────
  if (step === 1) {
    return (
      <div style={outer}>
        <ProgressDots total={3} current={0} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
          <h2 style={heading}>Kunlik maqsadingiz nima?</h2>
          <p style={sub}>Har kuni o'rganish uchun qancha vaqt ajrata olasiz?</p>

          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
            {GOALS.map(g => (
              <button
                key={g.id}
                onClick={() => setGoal(g.id)}
                style={{
                  padding: "16px 20px",
                  borderRadius: 16,
                  border: `2px solid ${goal === g.id ? "#58cc02" : "rgba(255,255,255,0.08)"}`,
                  background: goal === g.id ? "rgba(88,204,2,0.12)" : "rgba(255,255,255,0.03)",
                  display: "flex", alignItems: "center", gap: 16,
                  cursor: "pointer", transition: "all 0.15s ease", width: "100%",
                }}
              >
                <div style={{ fontSize: 28 }}>{g.emoji}</div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: goal === g.id ? "#58cc02" : "#e3e4e6" }}>
                    {g.label}
                  </div>
                  <div style={{ fontSize: 12, color: "#788290" }}>{g.desc}</div>
                </div>
                {goal === g.id && (
                  <div style={{ marginLeft: "auto", color: "#58cc02", fontSize: 20 }}>✓</div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div style={{ width: "100%", paddingBottom: 20 }}>
          <button onClick={() => setStep(2)} style={btnGreen}>
            DAVOM ETISH →
          </button>
        </div>
      </div>
    );
  }

  // ── STEP 2: AVATAR ─────────────────────────────────────────
  if (step === 2) {
    return (
      <div style={outer}>
        <ProgressDots total={3} current={1} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%" }}>
          <div style={{ fontSize: 72, marginBottom: 12 }}>{avatar}</div>
          <h2 style={heading}>Avatarni tanlang</h2>
          <p style={sub}>O'zingizga yoqqan belgini tanlang!</p>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12, marginTop: 16, width: "100%", maxWidth: 320
          }}>
            {AVATARS.map(av => (
              <button
                key={av}
                onClick={() => setAvatar(av)}
                style={{
                  padding: 16, borderRadius: 16, fontSize: 36,
                  border: `2px solid ${avatar === av ? "#58cc02" : "rgba(255,255,255,0.08)"}`,
                  background: avatar === av ? "rgba(88,204,2,0.12)" : "rgba(255,255,255,0.03)",
                  cursor: "pointer", transition: "all 0.15s ease",
                  transform: avatar === av ? "scale(1.12)" : "scale(1)",
                }}
              >
                {av}
              </button>
            ))}
          </div>
        </div>

        <div style={{ width: "100%", paddingBottom: 20 }}>
          <button onClick={() => setStep(3)} style={btnGreen}>
            DAVOM ETISH →
          </button>
          <button onClick={() => setStep(1)} style={btnBack}>← Orqaga</button>
        </div>
      </div>
    );
  }

  // ── STEP 3: LEVEL TEST ─────────────────────────────────────
  if (step === 3) {
    const q = LEVEL_QUESTIONS[levelIdx];
    return (
      <div style={outer}>
        <ProgressDots total={3} current={2} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🧠</div>
          <h2 style={{ ...heading, fontSize: 18, marginBottom: 6 }}>Daraja testi</h2>
          <p style={{ ...sub, marginBottom: 24 }}>
            {levelIdx + 1} / {LEVEL_QUESTIONS.length}
          </p>

          {/* Progress */}
          <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, marginBottom: 24, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${(levelIdx / LEVEL_QUESTIONS.length) * 100}%`,
              background: "#58cc02", borderRadius: 3, transition: "width 0.3s ease"
            }} />
          </div>

          {/* Question */}
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 18, padding: "20px 24px",
            marginBottom: 20, textAlign: "center", width: "100%"
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#e3e4e6", lineHeight: 1.5 }}>
              {q.q}
            </div>
          </div>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
            {q.opts.map((opt, i) => {
              const isCorrect = q.correct && opt === q.correct;
              const isChosen = levelChosen === opt;
              let bg = "rgba(255,255,255,0.03)";
              let border = "rgba(255,255,255,0.08)";
              let color = "#c8d0d8";
              if (levelChosen) {
                if (isCorrect) { bg = "rgba(88,204,2,0.15)"; border = "#58cc02"; color = "#58cc02"; }
                else if (isChosen && !isCorrect) { bg = "rgba(255,75,75,0.12)"; border = "#ff4b4b"; color = "#ff4b4b"; }
              }
              return (
                <button
                  key={i}
                  onClick={() => handleLevelAnswer(opt, q.scores[i])}
                  style={{
                    padding: "14px 20px", borderRadius: 14,
                    background: bg, border: `2px solid ${border}`,
                    color, fontWeight: 600, fontSize: 14,
                    cursor: levelChosen ? "default" : "pointer",
                    textAlign: "left", transition: "all 0.2s ease",
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ width: "100%", paddingBottom: 20 }}>
          <button
            onClick={() => onComplete({ goal, avatar, level: "Beginner" })}
            style={btnBack}
          >
            Testni o'tkazib yuborish
          </button>
        </div>
      </div>
    );
  }

  return null;
}

// ── HELPERS ────────────────────────────────────────────────
function ProgressDots({ total, current }) {
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 24, paddingTop: 16 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i === current ? 24 : 8,
          height: 8, borderRadius: 4,
          background: i <= current ? "#58cc02" : "rgba(255,255,255,0.12)",
          transition: "all 0.3s ease"
        }} />
      ))}
    </div>
  );
}

// ── STYLES ──────────────────────────────────────────────────
const outer = {
  background: "#0a0b0d",
  minHeight: "100vh",
  color: "#e3e4e6",
  fontFamily: "'DM Sans', sans-serif",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "24px 24px 0",
  boxSizing: "border-box",
  maxWidth: 480,
  margin: "0 auto",
};

const heading = {
  fontFamily: "'Playfair Display', serif",
  fontWeight: 900,
  fontSize: 22,
  marginBottom: 8,
  textAlign: "center",
  color: "#fff",
};

const sub = {
  fontSize: 14,
  color: "#788290",
  textAlign: "center",
  marginBottom: 8,
  lineHeight: 1.5,
};

const btnGreen = {
  width: "100%",
  background: "#58cc02",
  color: "#fff",
  border: "none",
  borderRadius: 16,
  padding: "16px 24px",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 15,
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: "0 4px 0 #3b9c02",
  marginBottom: 12,
  letterSpacing: 0.5,
  transition: "all 0.15s ease",
};

const btnGhost = {
  width: "100%",
  background: "transparent",
  color: "#1cb0f6",
  border: "2px solid rgba(28,176,246,0.2)",
  borderRadius: 16,
  padding: "14px 24px",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
  marginBottom: 12,
};

const btnBack = {
  width: "100%",
  background: "transparent",
  color: "#788290",
  border: "none",
  padding: "12px",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  marginBottom: 8,
};
