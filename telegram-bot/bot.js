import { Telegraf, Markup } from "telegraf";
import dotenv from "dotenv";
import http from "http";
import { VOCAB, TIPS } from "./data.js";

dotenv.config();

const TOKEN = process.env.BOT_TOKEN;
const WEB_APP_URL = process.env.WEB_APP_URL || "https://deutsch-blitz.vercel.app/";

if (!TOKEN || TOKEN === "YOUR_TELEGRAM_BOT_TOKEN_HERE") {
  console.log("⚠️ Eslatma: Telegram Bot tokeni kiritilmagan. Iltimos, .env faylini tahrirlang!");
}

const bot = new Telegraf(TOKEN || "MOCK_TOKEN");

// User quiz sessions memory
const sessions = new Map();

// Helper: Shuffle array
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Helper: Build Quiz (10 questions)
function buildBotQuiz() {
  const pool = Object.entries(VOCAB).flatMap(([cat, ws]) => ws.map(w => ({ ...w, cat })));
  const shuffled = shuffle(pool);
  const selected = shuffled.slice(0, 10); // 10 questions for quick mobile practice

  return selected.map(word => {
    const distractors = shuffle(pool.filter(w => w.de !== word.de)).slice(0, 3);
    const options = shuffle([word, ...distractors]);
    return { word, options };
  });
}

// Main Keyboard Menu
const mainKeyboard = () => {
  return Markup.inlineKeyboard([
    [Markup.button.callback("📚 Lug'at Bo'limi", "menu_vocab"), Markup.button.callback("🧠 Test Boshlash", "menu_quiz")],
    [Markup.button.callback("📖 Muhim Maslahatlar", "menu_tips")],
    [Markup.button.webApp("🌐 Deutsch Hub Saytini Ochish", WEB_APP_URL)]
  ]);
};

// Start Command
bot.start((ctx) => {
  const name = ctx.from.first_name || "Do'stim";
  const welcomeText = 
    `🇩🇪 *Herzlich willkommen, ${name}!* 🇺🇿\n\n` +
    `*Deutsch Hub* til o'rganish botiga xush kelibsiz!\n\n` +
    `Ushbu bot yordamida siz nemis tili so'z boyligingizni oshirishingiz, interaktiv testlar yordamida bilimingizni sinashingiz va foydali o'rganish maslahatlarini olishingiz mumkin.\n\n` +
    `📌 *Asosiy imkoniyatlar:*\n` +
    `• 📚 *Lug'at bo'limi* — turli toifalardagi yuzlab nemischa so'zlar.\n` +
    `• 🔍 *So'z qidiruv* — botga istalgan so'zni yuboring va u nemischa/o'zbekcha tarjimasini izlab topadi!\n` +
    `• 🧠 *Quiz* — 10 talik interaktiv testlar.\n` +
    `• 🌐 *Web App* — platformaning chiroyli veb-versiyasini bevosita Telegram-da ochish.\n\n` +
    `Quyidagi tugmalardan birini tanlang va o'rganishni boshlang! 👇`;

  ctx.replyWithMarkdown(welcomeText, mainKeyboard());
});

// Help command
bot.help((ctx) => {
  ctx.replyWithMarkdown(
    `*Botdan foydalanish bo'yicha yordam:*\n\n` +
    `• /start — Bosh menyuga qaytish va botni ishga tushirish.\n` +
    `• Istalgan so'zni yozib yuboring (masalan, "yaxshi" yoki "haben") — bot uni lug'atimizdan izlaydi.\n\n` +
    `Muammolar yuzaga kelsa, /start orqali menyuni qayta yangilang.`,
    mainKeyboard()
  );
});

// Menu Navigation Handlers
bot.action("menu_main", (ctx) => {
  ctx.answerCbQuery();
  ctx.editMessageText(
    `*Deutsch Hub — Bosh Menyusi*\n\nO'rganishni davom ettirish uchun bo'limni tanlang:`,
    { parse_mode: "Markdown", ...mainKeyboard() }
  );
});

// TIPS section
bot.action("menu_tips", (ctx) => {
  ctx.answerCbQuery();
  const tipButtons = TIPS.map(t => [Markup.button.callback(`${t.icon} ${t.title}`, `tip_${t.number}`)]);
  tipButtons.push([Markup.button.callback("⬅️ Bosh menyuga qaytish", "menu_main")]);

  ctx.editMessageText(
    `*📖 Nemis tilini o'rganish bo'yicha 5 ta oltin qoida:*\n\nBatafsil o'qish uchun quyidagi qoidalardan birini tanlang:`,
    { parse_mode: "Markdown", ...Markup.inlineKeyboard(tipButtons) }
  );
});

// Single TIP view
bot.action(/^tip_(\d+)$/, (ctx) => {
  ctx.answerCbQuery();
  const num = ctx.match[1];
  const tip = TIPS.find(t => t.number === num);

  if (!tip) return ctx.reply("Maslahat topilmadi.");

  const text = `*${tip.icon} ${tip.number}. ${tip.title}*\n\n` +
               `💡 _Qisqacha:_ ${tip.short}\n\n` +
               `📝 _Batafsil:_ ${tip.detail}`;

  ctx.editMessageText(text, {
    parse_mode: "Markdown",
    ...Markup.inlineKeyboard([
      [Markup.button.callback("⬅️ Ro'yxatga qaytish", "menu_tips")],
      [Markup.button.callback("🏠 Bosh menyu", "menu_main")]
    ])
  });
});

// VOCAB section
bot.action("menu_vocab", (ctx) => {
  ctx.answerCbQuery();
  const vocabButtons = [
    [Markup.button.callback("🔴 Fe'llar (Verben)", "vocab_Verben_0"), Markup.button.callback("🟡 Otlar (Nomen)", "vocab_Nomen_0")],
    [Markup.button.callback("🟢 Sifatlar (Adjektive)", "vocab_Adjektive_0"), Markup.button.callback("🔵 Ravishlar (Adverbien)", "vocab_Adverbien_0")],
    [Markup.button.callback("⬅️ Bosh menyuga qaytish", "menu_main")]
  ];

  ctx.editMessageText(
    `*📚 Lug'at Bo'limi*\n\nSo'zlarni ko'rish uchun toifalardan birini tanlang yoki istalgan so'zni to'g'ridan-to'g'ri botga yozib yuboring (Masalan: *schreiben* yoki *ota*):`,
    { parse_mode: "Markdown", ...Markup.inlineKeyboard(vocabButtons) }
  );
});

// Vocab list with pagination
bot.action(/^vocab_(Verben|Nomen|Adjektive|Adverbien)_(\d+)$/, (ctx) => {
  ctx.answerCbQuery();
  const cat = ctx.match[1];
  const pageIdx = parseInt(ctx.match[2], 10);
  const words = VOCAB[cat] || [];
  const pageSize = 8;
  const totalPages = Math.ceil(words.length / pageSize);

  const start = pageIdx * pageSize;
  const pageWords = words.slice(start, start + pageSize);

  let title = "";
  if (cat === "Verben") title = "🔴 Fe'llar (Verben)";
  else if (cat === "Nomen") title = "🟡 Otlar (Nomen)";
  else if (cat === "Adjektive") title = "🟢 Sifatlar (Adjektive)";
  else if (cat === "Adverbien") title = "🔵 Ravishlar (Adverbien)";

  let text = `*📚 ${title}* (Sahifa ${pageIdx + 1}/${totalPages}):\n\n`;
  pageWords.forEach(w => {
    text += `• *${w.de}* — ${w.uz}\n`;
  });

  const navRow = [];
  if (pageIdx > 0) {
    navRow.push(Markup.button.callback("⬅️ Oldingi", `vocab_${cat}_${pageIdx - 1}`));
  }
  if (pageIdx + 1 < totalPages) {
    navRow.push(Markup.button.callback("Keyingi ➡️", `vocab_${cat}_${pageIdx + 1}`));
  }

  ctx.editMessageText(text, {
    parse_mode: "Markdown",
    ...Markup.inlineKeyboard([
      navRow,
      [Markup.button.callback("📂 Boshqa toifalar", "menu_vocab")],
      [Markup.button.callback("🏠 Bosh menyu", "menu_main")]
    ])
  });
});

// QUIZ initialization
bot.action("menu_quiz", (ctx) => {
  ctx.answerCbQuery();
  const chatId = ctx.chat.id;
  const questions = buildBotQuiz();

  sessions.set(chatId, {
    questions,
    qIdx: 0,
    score: 0
  });

  sendQuizQuestion(ctx, chatId);
});

// Send Single Quiz Question Helper
function sendQuizQuestion(ctx, chatId) {
  const session = sessions.get(chatId);
  if (!session) return ctx.reply("Lekin faol test topilmadi. Qaytadan boshlang.", mainKeyboard());

  const { questions, qIdx } = session;
  const current = questions[qIdx];
  const total = questions.length;

  const text = `*🧠 Deutsch Hub Testi* (Savol ${qIdx + 1}/${total}):\n\n` +
               `Quyidagi so'zning to'g'ri o'zbekcha tarjimasini toping:\n` +
               `👉 *${current.word.de}*`;

  // Build inline options buttons
  const optButtons = current.options.map((opt, i) => {
    return [Markup.button.callback(`${i + 1})  ${opt.uz}`, `quiz_ans_${opt.de === current.word.de ? "correct" : "wrong"}_${i}`)];
  });

  optButtons.push([Markup.button.callback("⏹ Testni to'xtatish", "quiz_stop")]);

  const replyMarkup = Markup.inlineKeyboard(optButtons);

  if (ctx.updateType === "callback_query") {
    ctx.editMessageText(text, { parse_mode: "Markdown", ...replyMarkup });
  } else {
    ctx.replyWithMarkdown(text, replyMarkup);
  }
}

// Handle Quiz Answer click
bot.action(/^quiz_ans_(correct|wrong)_(\d+)$/, (ctx) => {
  const isCorrect = ctx.match[1] === "correct";
  const chatId = ctx.chat.id;
  const session = sessions.get(chatId);

  if (!session) {
    ctx.answerCbQuery("Sessiya muddati tugadi.");
    return ctx.editMessageText("Test sessiyasi tugagan. Yangi test boshlang.", mainKeyboard());
  }

  const { questions, qIdx, score } = session;
  const current = questions[qIdx];

  let feedback = "";
  if (isCorrect) {
    session.score += 1;
    feedback = `✅ *To'g'ri!* \n*${current.word.de}* — ${current.word.uz}`;
    ctx.answerCbQuery("To'g'ri! 🎉");
  } else {
    feedback = `❌ *Noto'g'ri!* \nTo'g'ri javob: *${current.word.de}* — *${current.word.uz}*`;
    ctx.answerCbQuery("Noto'g'ri! 😔");
  }

  // Go to next question
  session.qIdx += 1;

  if (session.qIdx >= questions.length) {
    // Finished Quiz
    const finalScore = session.score;
    const total = questions.length;
    let emoji = "🎖";
    if (finalScore >= 9) emoji = "🏆 Ajoyib natija!";
    else if (finalScore >= 7) emoji = "🌟 Yaxshi natija!";
    else if (finalScore >= 5) emoji = "👍 Qoniqarli!";
    else emoji = "📚 Ko'proq lug'at yodlang!";

    const resultText = 
      `🏁 *Test yakunlandi!*\n\n` +
      `${feedback}\n\n` +
      `📊 *Natijangiz:*\n` +
      `• To'g'ri javoblar: *${finalScore}/${total}*\n` +
      `• Baholash: *${emoji}*\n\n` +
      `Yana mashq qilishni xohlaysizmi? Quyidagi tugmalardan foydalaning!`;

    sessions.delete(chatId);

    ctx.editMessageText(resultText, {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("🧠 Yangi test boshlash", "menu_quiz")],
        [Markup.button.callback("🏠 Bosh menyu", "menu_main")]
      ])
    });
  } else {
    // Send feedback then transition directly to next question in 1.2s to make UX smooth
    ctx.editMessageText(`${feedback}\n\n⏳ _Keyingi savol yuklanmoqda..._`, { parse_mode: "Markdown" });
    setTimeout(() => {
      sendQuizQuestion(ctx, chatId);
    }, 1200);
  }
});

// Stop Quiz callback
bot.action("quiz_stop", (ctx) => {
  ctx.answerCbQuery();
  const chatId = ctx.chat.id;
  sessions.delete(chatId);
  ctx.editMessageText("Test bekor qilindi.", {
    parse_mode: "Markdown",
    ...mainKeyboard()
  });
});

// Handle text messages as real-time search queries
bot.on("text", (ctx) => {
  const query = ctx.message.text.trim().toLowerCase();
  
  // Skip command prefix
  if (query.startsWith("/")) return;

  const matches = [];

  // Search through all vocabulary categories
  for (const [cat, words] of Object.entries(VOCAB)) {
    words.forEach(w => {
      if (w.de.toLowerCase().includes(query) || w.uz.toLowerCase().includes(query)) {
        matches.push({ ...w, cat });
      }
    });
  }

  if (matches.length === 0) {
    return ctx.replyWithMarkdown(
      `🔍 *"${ctx.message.text}"* so'zi bo'yicha hech narsa topilmadi.\n\n` +
      `Boshqa so'zni izlab ko'ring yoki quyidagi tugma orqali to'liq lug'atni oching:`,
      Markup.inlineKeyboard([
        [Markup.button.callback("📚 Lug'at Bo'limi", "menu_vocab")],
        [Markup.button.callback("🏠 Bosh menyu", "menu_main")]
      ])
    );
  }

  // Display top 8 matches for readable layout
  const topMatches = matches.slice(0, 8);
  let categoryLabels = {
    Verben: "🔴 Fe'llar",
    Nomen: "🟡 Otlar",
    Adjektive: "🟢 Sifatlar",
    Adverbien: "🔵 Ravishlar"
  };

  let text = `🔍 *"${ctx.message.text}"* so'zi bo'yicha qidiruv natijalari (${matches.length} ta topildi):\n\n`;
  topMatches.forEach((w, i) => {
    text += `${i + 1}. *${w.de}* — ${w.uz}  \\[_${categoryLabels[w.cat]}_\\]\n`;
  });

  if (matches.length > 8) {
    text += `\n...va yana *${matches.length - 8} ta* o'xshash so'zlar bor. Barcha so'zlarni saytimizda topasiz.`;
  }

  ctx.replyWithMarkdown(text, Markup.inlineKeyboard([
    [Markup.button.callback("🏠 Bosh menyu", "menu_main"), Markup.button.webApp("🌐 To'liq Lug'at sayti", WEB_APP_URL)]
  ]));
});

// Catch errors gracefully
bot.catch((err, ctx) => {
  console.error(`⚠️ Bot error for update ${ctx.updateType}:`, err);
});

// Start a simple HTTP health-check server for cloud hosting services (like Render)
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Deutsch Hub Bot is active and running!");
}).listen(PORT, () => {
  console.log(`📡 Health-check server listening on port ${PORT}`);
});

// Launch Bot
if (TOKEN && TOKEN !== "YOUR_TELEGRAM_BOT_TOKEN_HERE") {
  bot.launch()
    .then(() => console.log("🚀 Deutsch Hub Telegram Bot muvaffaqiyatli ishga tushdi!"))
    .catch((err) => console.error("❌ Botni ishga tushirishda xato:", err));
} else {
  console.log("ℹ️ Iltimos, botni to'liq ishga tushirish uchun .env fayliga BOT_TOKEN yozing!");
}

// Graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

// Prevent process crash on uncaught exceptions and promise rejections (e.g. expired Telegram callback queries)
process.on("unhandledRejection", (reason, promise) => {
  console.error("⚠️ Unhandled Promise Rejection:", reason);
});
process.on("uncaughtException", (error) => {
  console.error("⚠️ Uncaught Exception:", error);
});
