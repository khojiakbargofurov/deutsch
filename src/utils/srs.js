/**
 * SRS (Spaced Repetition System) — SM-2 algoritmiga asoslangan
 * Har bir so'z uchun: easeFactor, interval, repetitions, nextReview saqlash
 */

const SRS_KEY = "srs_data";

function loadSRS() {
  try {
    const saved = localStorage.getItem(SRS_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function saveSRS(data) {
  try {
    localStorage.setItem(SRS_KEY, JSON.stringify(data));
  } catch {}
}

/**
 * Rating: 0 = bilmayman (qiyin), 1 = qiyin, 2 = yaxshi, 3 = oson
 */
export function recordReview(word, rating) {
  const data = loadSRS();
  const now = Date.now();

  const card = data[word] || {
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    nextReview: now,
    totalReviews: 0,
    correctCount: 0,
  };

  card.totalReviews += 1;
  if (rating >= 2) card.correctCount += 1;

  if (rating < 2) {
    // Xato: qaytadan boshlash
    card.repetitions = 0;
    card.interval = 1;
  } else {
    // To'g'ri: intervallarni hisoblash
    if (card.repetitions === 0) {
      card.interval = 1;
    } else if (card.repetitions === 1) {
      card.interval = 6;
    } else {
      card.interval = Math.round(card.interval * card.easeFactor);
    }
    card.repetitions += 1;
    // EaseFactor yangilash
    card.easeFactor = Math.max(1.3,
      card.easeFactor + 0.1 - (3 - rating) * (0.08 + (3 - rating) * 0.02)
    );
  }

  card.nextReview = now + card.interval * 24 * 60 * 60 * 1000;
  data[word] = card;
  saveSRS(data);
  return card;
}

/**
 * Bugun takrorlanishi kerak bo'lgan so'zlarni qaytarish
 */
export function getDueWords(allWords) {
  const data = loadSRS();
  const now = Date.now();
  return allWords.filter(w => {
    const card = data[w.de];
    if (!card) return true; // Yangi so'z — har doim ko'rsat
    return card.nextReview <= now;
  });
}

/**
 * So'z statistikasini qaytarish
 */
export function getWordStats(word) {
  const data = loadSRS();
  return data[word] || null;
}

/**
 * Barcha SRS ma'lumotlarini qaytarish (statistika uchun)
 */
export function getAllSRSStats() {
  const data = loadSRS();
  const words = Object.keys(data);
  const total = words.length;
  const mastered = words.filter(w => data[w].repetitions >= 5).length;
  const learning = words.filter(w => data[w].repetitions > 0 && data[w].repetitions < 5).length;
  const dueToday = words.filter(w => data[w].nextReview <= Date.now()).length;
  return { total, mastered, learning, dueToday };
}

/**
 * SRS ma'lumotlarini tozalash (reset)
 */
export function resetSRS() {
  localStorage.removeItem(SRS_KEY);
}
