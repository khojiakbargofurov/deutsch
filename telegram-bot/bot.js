import { Telegraf, Markup } from "telegraf";
import dotenv from "dotenv";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { VOCAB, TIPS, DAILY_WORDS } from "./data.js";
import { addUser, getUsers, updateHighScore, getLeaderboard } from "./usersStore.js";

dotenv.config();

const TOKEN = process.env.BOT_TOKEN;
const WEB_APP_URL = process.env.WEB_APP_URL || "https://deutsch-blitz.vercel.app/";
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID || "529303055";

if (!TOKEN || TOKEN === "YOUR_TELEGRAM_BOT_TOKEN_HERE") {
  console.log("⚠️ Eslatma: Telegram Bot tokeni kiritilmagan. Iltimos, .env faylini tahrirlang!");
}

const bot = new Telegraf(TOKEN || "MOCK_TOKEN");

// Register users on every update dynamically
bot.use((ctx, next) => {
  if (ctx.from) {
    addUser(ctx.from);
  }
  return next();
});

// User quiz sessions memory
const sessions = new Map();

// Admin action states memory
const adminStates = new Map();

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
    [Markup.button.callback("🎴 Fleshkartalar", "menu_flashcard_setup"), Markup.button.callback("🏆 Top O'quvchilar", "menu_leaderboard")],
    [Markup.button.callback("📖 Muhim Maslahatlar", "menu_tips")],
    [Markup.button.webApp("🌐 Deutsch Hub Saytini Ochish", WEB_APP_URL)]
  ]);
};

// Start Command
bot.start((ctx) => {
  const name = ctx.from.first_name || "Do'stim";
  const username = ctx.from.username ? `@${ctx.from.username}` : "Username yo'q";
  const userId = ctx.from.id;

  console.log(`👤 Start command by: ${name} (ID: ${userId}, Username: ${username})`);

  // Notify admin about new user start
  if (ADMIN_CHAT_ID) {
    if (String(userId) !== String(ADMIN_CHAT_ID)) {
      const adminNotification = 
        `🔔 *Yangi foydalanuvchi!* (Deutsch Hub Bot)\n\n` +
        `👤 *Ismi:* ${ctx.from.first_name} ${ctx.from.last_name || ""}\n` +
        `🏷️ *Username:* ${username}\n` +
        `🆔 *Telegram ID:* \`${userId}\``;
      
      ctx.telegram.sendMessage(ADMIN_CHAT_ID, adminNotification, { parse_mode: "Markdown" })
        .catch(err => console.error("⚠️ Admin xabar yuborishda xato:", err));
    } else {
      // If it is the admin, send a test notification to confirm it works
      const selfNotification = 
        `🔔 *Siz (Admin) botni ishga tushirdingiz!*\n\n` +
        `Xabarnoma tizimi faol va to'g'ri ishlamoqda. Yangi foydalanuvchilar kelganda sizga xabar keladi.`;
      
      ctx.telegram.sendMessage(ADMIN_CHAT_ID, selfNotification, { parse_mode: "Markdown" })
        .catch(err => console.error("⚠️ Admin test xabari yuborishda xato:", err));
    }
  }

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

// My ID command
bot.command("myid", (ctx) => {
  ctx.replyWithMarkdown(`🆔 Sizning Telegram ID: \`${ctx.from.id}\``);
});

// ── ADMIN PANEL ──

const adminKeyboard = () => {
  return Markup.inlineKeyboard([
    [Markup.button.callback("📊 Statistika", "admin_stats"), Markup.button.callback("👥 Foydalanuvchilar", "admin_users")],
    [Markup.button.callback("📢 Xabar yuborish", "admin_broadcast_prompt"), Markup.button.callback("📅 Kunlik so'z", "admin_daily_word")],
    [Markup.button.callback("🏠 Bosh menyu", "menu_main")]
  ]);
};

// Admin command `/admin`
bot.command("admin", (ctx) => {
  const userId = ctx.from.id;
  if (String(userId) !== String(ADMIN_CHAT_ID)) {
    return ctx.reply("❌ Bu komandadan faqat bot admini foydalanishi mumkin.");
  }
  
  ctx.replyWithMarkdown(
    `⚙️ *Deutsch Hub — Admin Paneli*\n\nBoshqaruv bo'limini tanlang:`,
    adminKeyboard()
  );
});

// Admin stats
bot.action("admin_stats", (ctx) => {
  const userId = ctx.from.id;
  if (String(userId) !== String(ADMIN_CHAT_ID)) return ctx.answerCbQuery("Taqqiqlangan!");
  
  ctx.answerCbQuery();
  const users = getUsers();
  
  ctx.editMessageText(
    `📊 *Bot statistikasi:*\n\n` +
    `• Jami foydalanuvchilar soni: *${users.length} ta*\n\n` +
    `_Eslatma: Quyidagi ro'yxat faqat botda /start yoki boshqa buyruqlarni bosganlardan shakllanadi._`,
    { parse_mode: "Markdown", ...adminKeyboard() }
  );
});

// Admin users list
bot.action("admin_users", (ctx) => {
  const userId = ctx.from.id;
  if (String(userId) !== String(ADMIN_CHAT_ID)) return ctx.answerCbQuery("Taqqiqlangan!");
  
  ctx.answerCbQuery();
  const users = getUsers();
  
  if (users.length === 0) {
    return ctx.editMessageText("👥 Foydalanuvchilar hali mavjud emas.", {
      parse_mode: "Markdown", ...adminKeyboard()
    });
  }

  let text = `👥 *Bot foydalanuvchilari* (Jami *${users.length}*):\n\n`;
  users.forEach((u, i) => {
    const username = u.username ? `@${u.username}` : "Username yo'q";
    text += `${i + 1}. *${u.first_name} ${u.last_name || ""}* — ${username} (\`${u.id}\`)\n`;
  });

  ctx.editMessageText(text, {
    parse_mode: "Markdown",
    ...adminKeyboard()
  });
});

// Admin broadcast prompt
bot.action("admin_broadcast_prompt", (ctx) => {
  const userId = ctx.from.id;
  if (String(userId) !== String(ADMIN_CHAT_ID)) return ctx.answerCbQuery("Taqqiqlangan!");
  
  ctx.answerCbQuery();
  adminStates.set(userId, "broadcast");
  
  ctx.editMessageText(
    `📢 *Xabar yuborish bo'limi (Broadcast)*\n\n` +
    `Barcha foydalanuvchilarga yubormoqchi bo'lgan xabaringizni yozib yuboring.\n\n` +
    `• _Xabarda matnlar, havolalar va emojilar ishlatishingiz mumkin._\n` +
    `• _Bekor qilish uchun_ *bekor* _deb yozing._`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([[Markup.button.callback("❌ Bekor qilish", "admin_main")]])
    }
  );
});

// Return to admin main menu
bot.action("admin_main", (ctx) => {
  const userId = ctx.from.id;
  if (String(userId) !== String(ADMIN_CHAT_ID)) return ctx.answerCbQuery("Taqqiqlangan!");
  
  ctx.answerCbQuery();
  adminStates.delete(userId);
  
  ctx.editMessageText(
    `⚙️ *Deutsch Hub — Admin Paneli*\n\nBoshqaruv bo'limini tanlang:`,
    { parse_mode: "Markdown", ...adminKeyboard() }
  );
});

// Admin daily word manual trigger
bot.action("admin_daily_word", async (ctx) => {
  const userId = ctx.from.id;
  if (String(userId) !== String(ADMIN_CHAT_ID)) return ctx.answerCbQuery("Taqqiqlangan!");
  
  ctx.answerCbQuery("Yuborilmoqda...");
  ctx.editMessageText("⏳ *Kunlik 5 ta so'z barcha foydalanuvchilarga yuborilmoqda...*", { parse_mode: "Markdown" });
  
  const result = await sendDailyWord(bot);
  
  if (result) {
    const wordsList = result.words.map(w => `• *${w.de}* — *${w.uz}*`).join("\n");
    ctx.replyWithMarkdown(
      `✅ *Kunlik 5 ta so'z muvaffaqiyatli yuborildi!*\n\n` +
      `${wordsList}\n\n` +
      `• Yetkazildi: *${result.success} ta*`,
      Markup.inlineKeyboard([[Markup.button.callback("⚙️ Admin paneliga qaytish", "admin_main")]])
    );
  } else {
    ctx.reply("❌ Yuborishda xatolik yuz berdi.", Markup.inlineKeyboard([[Markup.button.callback("⚙️ Admin paneliga qaytish", "admin_main")]]));
  }
});

// Menu Navigation Handlers
bot.action("menu_main", (ctx) => {
  ctx.answerCbQuery();
  ctx.editMessageText(
    `*Deutsch Hub — Bosh Menyusi*\n\nO'rganishni davom ettirish uchun bo'limni tanlang:`,
    { parse_mode: "Markdown", ...mainKeyboard() }
  );
});

// Leaderboard callback
bot.action("menu_leaderboard", (ctx) => {
  ctx.answerCbQuery();
  const topUsers = getLeaderboard();
  
  let text = `🏆 *Deutsch Hub — Top O'quvchilar Reytingi* 🏆\n\n` +
             `Foydalanuvchilarning Quiz (testlar) bo'yicha eng yuqori erishgan rekord natijalari:\n\n`;
               
  if (topUsers.length === 0) {
    text += `*Hali hech kim test topshirmadi.* Birinchi bo'lib testni boshlang va rekord o'rnating! 🚀`;
  } else {
    const medals = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
    topUsers.forEach((u, i) => {
      const icon = medals[i] || "🔹";
      const name = `${u.first_name} ${u.last_name || ""}`.trim();
      const username = u.username ? ` (@${u.username})` : "";
      text += `${icon} *${name}*${username} — *${u.highScore} ball*\n`;
    });
  }

  text += `\n🎯 Siz ham test yechib o'z rekordingizni o'rnating!`;

  ctx.editMessageText(text, {
    parse_mode: "Markdown",
    ...Markup.inlineKeyboard([
      [Markup.button.callback("🧠 Testni boshlash", "menu_quiz")],
      [Markup.button.callback("⬅️ Bosh menyuga qaytish", "menu_main")]
    ])
  });
});

// TTS ( Ovozli talaffuz ) callback
bot.action(/^tts_(.+)$/, (ctx) => {
  const word = ctx.match[1];
  ctx.answerCbQuery(`"${word}" talaffuzi...`);
  
  const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(word)}&tl=de&client=tw-ob`;
  
  ctx.replyWithVoice({ url: ttsUrl })
    .catch(err => {
      console.error("❌ TTS yuborishda xato:", err.message);
      ctx.reply("❌ Ovozli talaffuzni yuklashda muammo yuz berdi. Iltimos, keyinroq urinib ko'ring.");
    });
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

    // Update high score in DB
    const { updated, oldHighScore } = updateHighScore(ctx.from.id, finalScore);

    let emoji = "🎖";
    if (finalScore >= 9) emoji = "🏆 Ajoyib natija!";
    else if (finalScore >= 7) emoji = "🌟 Yaxshi natija!";
    else if (finalScore >= 5) emoji = "👍 Qoniqarli!";
    else emoji = "📚 Ko'proq lug'at yodlang!";

    let recordText = "";
    if (updated) {
      recordText = `🎉 *YANGI SHAXSIY REKORD!* \nAvvalgi rekord: *${oldHighScore} ball* ➡️ Yangi rekord: *${finalScore} ball*\n\n`;
    } else {
      const currentHighScore = Math.max(oldHighScore, finalScore);
      recordText = `🎯 Sizning eng yuqori natijangiz: *${currentHighScore} ball*\n\n`;
    }

    const resultText = 
      `🏁 *Test yakunlandi!*\n\n` +
      `${feedback}\n\n` +
      `${recordText}` +
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

// ── FLASHCARDS GAME MODULE ──

// Setup Menu
bot.action("menu_flashcard_setup", (ctx) => {
  ctx.answerCbQuery();
  const flashButtons = [
    [Markup.button.callback("🔴 Fe'llar (Verben)", "flash_start_Verben"), Markup.button.callback("🟡 Otlar (Nomen)", "flash_start_Nomen")],
    [Markup.button.callback("🟢 Sifatlar (Adjektive)", "flash_start_Adjektive"), Markup.button.callback("🔵 Ravishlar (Adverbien)", "flash_start_Adverbien")],
    [Markup.button.callback("🌟 Barcha so'zlar", "flash_start_all")],
    [Markup.button.callback("⬅️ Bosh menyuga qaytish", "menu_main")]
  ];

  ctx.editMessageText(
    `*🎴 Fleshkartalar yordamida so'z yodlash o'yini*\n\n` +
    `Qaysi toifadagi so'zlarni yodlashni xohlaysiz? Ro'yxatdan toifani tanlang:`,
    { parse_mode: "Markdown", ...Markup.inlineKeyboard(flashButtons) }
  );
});

// Helper: Build Flashcards (20 random unique cards)
function buildFlashcards(category) {
  const pool = category === "all"
    ? Object.entries(VOCAB).flatMap(([cat, ws]) => ws.map(w => ({ ...w, cat })))
    : VOCAB[category].map(w => ({ ...w, cat: category }));

  const shuffled = shuffle(pool);
  return shuffled.slice(0, Math.min(20, shuffled.length));
}

// Start Game action
bot.action(/^flash_start_(.+)$/, (ctx) => {
  ctx.answerCbQuery();
  const cat = ctx.match[1];
  const cards = buildFlashcards(cat);

  if (cards.length === 0) {
    return ctx.reply("❌ So'zlar topilmadi.");
  }

  const chatId = ctx.chat.id;
  sessions.set(chatId, {
    type: "flashcards",
    cards,
    fIdx: 0,
    flipped: false,
    knowCount: 0,
    dontKnowCount: 0
  });

  renderFlashcard(ctx, chatId);
});

// Render Flashcard Helper
function renderFlashcard(ctx, chatId) {
  const session = sessions.get(chatId);
  if (!session) return ctx.reply("Sessiya topilmadi. Bosh menyuga qayting.", mainKeyboard());

  const { cards, fIdx, flipped } = session;
  const current = cards[fIdx];
  const total = cards.length;

  const categoryLabels = {
    Verben: "🔴 Fe'llar",
    Nomen: "🟡 Otlar",
    Adjektive: "🟢 Sifatlar",
    Adverbien: "🔵 Ravishlar"
  };

  let text = "";
  let buttons = [];

  if (!flipped) {
    text = 
      `🎴 *FLASHKARTA* (Karta ${fIdx + 1}/${total})\n\n` +
      `Quyidagi so'zning tarjimasini eslashga harakat qiling:\n\n` +
      `👉 *${current.de}*\n\n` +
      `_Turkumi: ${categoryLabels[current.cat]}_`;

    buttons = [
      [Markup.button.callback("👁 Tarjimasini ko'rish", "flash_flip")],
      [Markup.button.callback(`🔉 Talaffuzi`, `tts_${current.de}`)],
      [Markup.button.callback("⏹ O'yinni to'xtatish", "flash_stop")]
    ];
  } else {
    text = 
      `🎴 *FLASHKARTA* (Karta ${fIdx + 1}/${total}) - Tarjimasi\n\n` +
      `Nemischa: *${current.de}*\n` +
      `O'zbekcha: *${current.uz}*\n\n` +
      `_Ushbu so'zni eslay oldingizmi?_`;

    buttons = [
      [Markup.button.callback("✅ Bildim", "flash_action_correct"), Markup.button.callback("❌ Bilmadim", "flash_action_wrong")],
      [Markup.button.callback(`🔉 Talaffuzi`, `tts_${current.de}`)],
      [Markup.button.callback("⏹ O'yinni to'xtatish", "flash_stop")]
    ];
  }

  const replyMarkup = Markup.inlineKeyboard(buttons);

  if (ctx.updateType === "callback_query") {
    ctx.editMessageText(text, { parse_mode: "Markdown", ...replyMarkup });
  } else {
    ctx.replyWithMarkdown(text, replyMarkup);
  }
}

// Flip Flashcard action
bot.action("flash_flip", (ctx) => {
  ctx.answerCbQuery();
  const chatId = ctx.chat.id;
  const session = sessions.get(chatId);
  if (!session) return;

  session.flipped = true;
  renderFlashcard(ctx, chatId);
});

// Handle "Bildim" / "Bilmadim" clicks
bot.action(/^flash_action_(correct|wrong)$/, (ctx) => {
  const isCorrect = ctx.match[1] === "correct";
  ctx.answerCbQuery(isCorrect ? "Barakalla! 🎉" : "Yana takrorlang 📚");
  
  const chatId = ctx.chat.id;
  const session = sessions.get(chatId);
  if (!session) return;

  if (isCorrect) session.knowCount += 1;
  else session.dontKnowCount += 1;

  session.fIdx += 1;
  session.flipped = false;

  if (session.fIdx >= session.cards.length) {
    // Finished Game
    const total = session.cards.length;
    const know = session.knowCount;
    const dont = session.dontKnowCount;
    
    let evalText = "";
    if (know >= 18) evalText = "🏆 Ajoyib natija! So'z boyligingiz ajoyib darajada!";
    else if (know >= 14) evalText = "🌟 Judayam yaxshi! Ko'pchilik so'zni eslay oldingiz!";
    else if (know >= 8) evalText = "👍 Qoniqarli, so'zlarni muntazam takrorlab boring!";
    else evalText = "📚 Ko'proq mashq qilishingiz kerak. Yana urinib ko'ring!";

    const finalReportText = 
      `🏁 *Fleshkartalar yodlash yakunlandi!*\n\n` +
      `📊 *Natijangiz:*\n` +
      `• Jami so'zlar: *${total} ta*\n` +
      `• Eslay olganingiz: *${know} ta* ✅\n` +
      `• Eslay olmaganingiz: *${dont} ta* ❌\n\n` +
      `📝 *Baholash:* _${evalText}_\n\n` +
      `Yana mashq qilasizmi? Bosh menyuga qayting yoki yangi fleshkartalarni boshlang:`;

    sessions.delete(chatId);

    ctx.editMessageText(finalReportText, {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("🎴 Yangi fleshkartalar boshlash", "menu_flashcard_setup")],
        [Markup.button.callback("🏠 Bosh menyu", "menu_main")]
      ])
    });
  } else {
    renderFlashcard(ctx, chatId);
  }
});

// Stop Flashcards callback
bot.action("flash_stop", (ctx) => {
  ctx.answerCbQuery();
  const chatId = ctx.chat.id;
  sessions.delete(chatId);
  ctx.editMessageText("Fleshkartalar to'xtatildi.", {
    parse_mode: "Markdown",
    ...mainKeyboard()
  });
});

// Handle text messages as real-time search queries or admin broadcast messages
bot.on("text", async (ctx) => {
  const userId = ctx.from.id;
  const msgText = ctx.message.text;

  // Check if admin is currently broadcasting
  if (String(userId) === String(ADMIN_CHAT_ID) && adminStates.get(userId) === "broadcast") {
    if (msgText.toLowerCase().trim() === "bekor") {
      adminStates.delete(userId);
      return ctx.reply("❌ Xabar yuborish bekor qilindi.", Markup.inlineKeyboard([[Markup.button.callback("⚙️ Admin paneliga qaytish", "admin_main")]]));
    }

    adminStates.delete(userId);
    const users = getUsers();
    
    if (users.length === 0) {
      return ctx.reply("👥 Yuborish uchun birorta ham foydalanuvchi topilmadi.");
    }

    const statusMsg = await ctx.reply(`📢 *Xabar yuborish boshlandi...*\n\nJami foydalanuvchilar: *${users.length} ta*`, { parse_mode: "Markdown" });
    
    let success = 0;
    let fail = 0;

    for (const u of users) {
      try {
        await ctx.telegram.sendMessage(u.id, msgText);
        success++;
      } catch (err) {
        console.error(`⚠️ User ${u.id} ga xabar yuborishda xato:`, err.message);
        fail++;
      }
      // Simple sleep/delay to prevent Telegram rate limit issues (20-30 messages per second limit)
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    return ctx.telegram.editMessageText(
      ctx.chat.id,
      statusMsg.message_id,
      undefined,
      `✅ *Xabar yuborish yakunlandi!*\n\n` +
      `• Muvaffaqiyatli yetkazildi: *${success} ta*\n` +
      `• Yetkazib berilmadi (bloklangan): *${fail} ta*`,
      {
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard([[Markup.button.callback("⚙️ Admin paneliga qaytish", "admin_main")]])
      }
    ).catch(err => {
      ctx.replyWithMarkdown(
        `✅ *Xabar yuborish yakunlandi!*\n\n` +
        `• Muvaffaqiyatli yetkazildi: *${success} ta*\n` +
        `• Yetkazib berilmadi: *${fail} ta*`,
        Markup.inlineKeyboard([[Markup.button.callback("⚙️ Admin paneliga qaytish", "admin_main")]])
      );
    });
  }

  const query = msgText.trim().toLowerCase();
  
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

  const buttons = [
    [Markup.button.callback("🏠 Bosh menyu", "menu_main"), Markup.button.webApp("🌐 To'liq Lug'at sayti", WEB_APP_URL)]
  ];

  // If there are matches, offer a quick TTS button for the first (best) match
  if (topMatches.length > 0) {
    buttons.unshift([Markup.button.callback(`🔉 "${topMatches[0].de}" talaffuzini eshitish`, `tts_${topMatches[0].de}`)]);
  }

  ctx.replyWithMarkdown(text, Markup.inlineKeyboard(buttons));
});

// ── DAILY WORD BROADCAST HELPER & SCHEDULER ──

const STATUS_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), "dailyStatus.json");

function getDailyStatus() {
  try {
    if (fs.existsSync(STATUS_FILE)) {
      const data = fs.readFileSync(STATUS_FILE, "utf8");
      return JSON.parse(data || "{}");
    }
  } catch (err) {
    console.error("⚠️ dailyStatus.json o'qishda xato:", err);
  }
  return {};
}

function saveDailyStatus(status) {
  try {
    fs.writeFileSync(STATUS_FILE, JSON.stringify(status, null, 2));
  } catch (err) {
    console.error("⚠️ dailyStatus.json yozishda xato:", err);
  }
}

// Helper: Send Daily Word Broadcast (5 words)
async function sendDailyWord(botInstance) {
  try {
    // Select 5 words based on current day of the year
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const selectedWords = [];
    for (let i = 0; i < 5; i++) {
      const wordIdx = (dayOfYear * 5 + i) % DAILY_WORDS.length;
      selectedWords.push(DAILY_WORDS[wordIdx]);
    }

    let message = `🌟 *KUNLIK 5 TA YANGI SO'Z* 🌟\n\n`;
    for (let i = 0; i < 5; i++) {
      const w = selectedWords[i];
      message += 
        `*${i + 1}.* 🇩🇪 \`${w.de}\` — 🇺🇿 *${w.uz}*\n` +
        `📝 _${w.exampleDe}_\n` +
        `👉 _${w.exampleUz}_\n\n`;
    }
    message += `📚 *Blitzi* orqali bilimingizni boyitishda davom eting!`;

    const users = getUsers();
    let success = 0;
    
    for (const u of users) {
      try {
        await botInstance.telegram.sendMessage(u.id, message, { parse_mode: "Markdown" });
        success++;
      } catch (err) {
        console.error(`⚠️ User ${u.id} ga kunlik so'zlar yuborilmadi:`, err.message);
      }
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    console.log(`📢 Kunlik so'zlar ${users.length} ta foydalanuvchidan ${success} tasiga yuborildi.`);
    return { success, word: selectedWords[0], words: selectedWords };
  } catch (err) {
    console.error("❌ Kunlik so'z yuborishda xato:", err);
    return null;
  }
}

// Word of the Day scheduler loop (checks every 15 minutes)
setInterval(async () => {
  const now = new Date();
  const uzTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tashkent" }));
  const uzHours = uzTime.getHours();
  const uzDateStr = uzTime.toISOString().slice(0, 10);

  // Check if it's 9:00 AM (or between 9:00 and 10:00 AM) in Tashkent
  if (uzHours === 9) {
    const status = getDailyStatus();
    if (status.lastSentDate !== uzDateStr) {
      status.lastSentDate = uzDateStr;
      saveDailyStatus(status);
      console.log(`⏰ Avtomatik kunlik so'z yuborish boshlandi (Sana: ${uzDateStr})...`);
      await sendDailyWord(bot);
    }
  }
}, 15 * 60 * 1000);

// ── TELEGRAM INLINE QUERY MODE ──

bot.on("inline_query", (ctx) => {
  const query = ctx.inlineQuery.query.trim().toLowerCase();
  if (!query) {
    return ctx.answerInlineQuery([], {
      switch_pm_text: "Qidirish uchun so'z yozing (Masalan: der Mensch)...",
      switch_pm_parameter: "inline_help"
    });
  }

  const matches = [];
  for (const [cat, words] of Object.entries(VOCAB)) {
    words.forEach(w => {
      if (w.de.toLowerCase().includes(query) || w.uz.toLowerCase().includes(query)) {
        matches.push({ ...w, cat });
      }
    });
  }

  const categoryLabels = {
    Verben: "🔴 Fe'llar",
    Nomen: "🟡 Otlar",
    Adjektive: "🟢 Sifatlar",
    Adverbien: "🔵 Ravishlar"
  };

  const results = matches.slice(0, 10).map((w, idx) => {
    const title = `${w.de} — ${w.uz}`;
    const description = `Turkumi: ${categoryLabels[w.cat]}`;
    const messageText = 
      `🇩🇪 <b>Nemischa:</b> <code>${w.de}</code>\n` +
      `🇺🇿 <b>O'zbekcha:</b> <b>${w.uz}</b>\n\n` +
      `📁 <b>Turkumi:</b> <i>${categoryLabels[w.cat]}</i>\n` +
      `🌐 <a href="${WEB_APP_URL}">Deutsch Hub Saytiga O'tish</a>`;

    return {
      type: "article",
      id: `inline_${w.cat}_${idx}`,
      title: title,
      description: description,
      input_message_content: {
        message_text: messageText,
        parse_mode: "HTML",
        disable_web_page_preview: true
      },
      reply_markup: {
        inline_keyboard: [
          [{ text: "🌐 Veb-saytni ochish", url: WEB_APP_URL }]
        ]
      }
    };
  });

  return ctx.answerInlineQuery(results, { cache_time: 300 });
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
