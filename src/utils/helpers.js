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
