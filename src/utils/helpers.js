import { VOCAB } from "../data/vocabData";

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build 20 unique questions — each word used AT MOST once
export function buildQuiz(category, favorites = []) {
  const pool = category === "all"
    ? Object.entries(VOCAB).flatMap(([cat, ws]) => ws.map(w => ({ ...w, cat })))
    : category === "favorites"
      ? Object.entries(VOCAB).flatMap(([cat, ws]) => ws.map(w => ({ ...w, cat }))).filter(w => favorites.includes(w.de))
      : VOCAB[category].map(w => ({ ...w, cat: category }));

  const shuffled = shuffle(pool);
  const selected = shuffled.slice(0, Math.min(20, shuffled.length));
  const fullPool = Object.entries(VOCAB).flatMap(([cat, ws]) => ws.map(w => ({ ...w, cat })));

  return selected.map(word => {
    const distractors = shuffle(fullPool.filter(w => w.de !== word.de)).slice(0, 3);
    const options = shuffle([word, ...distractors]);
    return { word, options };
  });
}

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

// ── AUDIO / SPEECH ──────────────────────────────────────────
let currentUtterance = null;

export function speakWord(word, onEnd = null) {
  if (!word) return;

  // Cancel any currently playing speech
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }

  // Try Web Speech API first (best quality, no CORS)
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "de-DE";
    utterance.rate = 0.85;
    utterance.pitch = 1;

    // Try to find a German voice
    const voices = window.speechSynthesis.getVoices();
    const germanVoice = voices.find(v => v.lang.startsWith("de"));
    if (germanVoice) utterance.voice = germanVoice;

    if (onEnd) utterance.onend = onEnd;
    utterance.onerror = () => {
      // Fallback to Google TTS if Web Speech fails
      playGoogleTTS(word, onEnd);
    };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    return;
  }

  // Fallback: Google TTS
  playGoogleTTS(word, onEnd);
}

function playGoogleTTS(word, onEnd) {
  try {
    const audio = new Audio(
      `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(word)}&tl=de&client=tw-ob`
    );
    audio.crossOrigin = "anonymous";
    if (onEnd) audio.addEventListener("ended", onEnd);
    audio.addEventListener("error", () => {
      if (onEnd) onEnd();
    });
    audio.play().catch(() => {
      if (onEnd) onEnd();
    });
  } catch {
    if (onEnd) onEnd();
  }
}

export function stopSpeech() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

// Preload voices (needed for some browsers)
export function initSpeech() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }
}
