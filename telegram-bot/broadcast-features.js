import { Telegraf, Markup } from "telegraf";
import dotenv from "dotenv";
import { getUsers } from "./usersStore.js";

dotenv.config();

const TOKEN = process.env.BOT_TOKEN;
const WEB_APP_URL = process.env.WEB_APP_URL || "https://deutsch-blitz.vercel.app/";

if (!TOKEN || TOKEN === "YOUR_TELEGRAM_BOT_TOKEN_HERE") {
  console.error("❌ Xatolik: BOT_TOKEN topilmadi. Iltimos, .env faylini tekshiring!");
  process.exit(1);
}

const bot = new Telegraf(TOKEN);

const broadcastMessage = 
  `🚀 *BLITZI YANGI IMKONIYATLAR TAQDIM ETADI!* 🚀\n\n` +
  `Assalomu alaykum, aziz til o'rganuvchi! Nemis tilini yanada samarali va qiziqarli o'rganishingiz uchun *Blitzi* ilovamiz va botimizda juda katta o'zgarishlar va yangi imkoniyatlar joriy etildi! 🌟\n\n` +
  `Yangi joriy etilgan ajoyib imkoniyatlar bilan tanishing:\n\n` +
  `1️⃣ *Yangi Premium Brend va Maskot:* \n` +
  `Ilovamiz va botimiz rasman **Blitzi** nomiga o'tdi! Endilikda bizni yanada aqlli va quvnoq yangi maskotimiz — peshonasida sariq chaqmoq bo'lgan premium bayqush/burgut qahramonimiz boshqaradi! Sayt favikoni va dizaynlari Duolingo uslubida yumshoq to'rtburchak ko'rinishga keltirildi. 🦉\n\n` +
  `2️⃣ *Kunlik 5 tadan Yangi So'z:* \n` +
  `Oldingi 1 ta so'z o'rniga, endi botimiz sizga har kuni **5 ta yangi so'z va iboralarni** yuboradi! Har bir so'zning o'zbekcha tarjimasi hamda gaplarda ishlatilish namunalari bilan so'z boyligingiz 5 baravar tezroq o'sadi! 📚\n\n` +
  `3️⃣ *Shaxsiy So'z Yuborish Vaqti (Scheduler):* \n` +
  `Endi kunlik so'zlarni qachon qabul qilishni **o'zingiz hal qilasiz**! Botimiz bosh menyusidagi **⚙️ Sozlamalar** tugmasini bosing va o'zingizga eng qulay soatni (ertalabki 07:00 dan kechki 22:00 gacha) tanlang. Tizim aynan siz belgilagan vaqtda yangi so'zlarni yetkazib beradi! ⚙️\n\n` +
  `---\n` +
  `🧠 Bilim olishdan to'xtamang, chunki *Blitzi* siz bilan har soniya birga!\n\n` +
  `🌐 Ilovamizning to'liq premium veb-versiyasini bevosita Telegram-da ochish uchun quyidagi tugmani bosing:`;

const keyboard = Markup.inlineKeyboard([
  [Markup.button.webApp("🌐 Blitzi Saytini Ochish", WEB_APP_URL)],
  [Markup.button.callback("⬅️ Bosh menyuga qaytish", "menu_main")]
]);

async function runBroadcast() {
  try {
    const users = await getUsers();
    console.log(`📢 ${users.length} ta foydalanuvchiga yangi imkoniyatlar xabarnomasi yuborilmoqda...`);
    
    let successCount = 0;
    let failCount = 0;

    for (const u of users) {
      try {
        await bot.telegram.sendMessage(u.id, broadcastMessage, { 
          parse_mode: "Markdown",
          ...keyboard
        });
        successCount++;
        console.log(`✅ Yetkazildi: ${u.first_name || "Foydalanuvchi"} (ID: ${u.id})`);
      } catch (err) {
        failCount++;
        console.error(`⚠️ Yuborilmadi: ${u.id} - ${err.message}`);
      }
      // Delay to respect Telegram limits
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    console.log(`\n🏁 Xabarnoma yakunlandi!`);
    console.log(`📈 Muvaffaqiyatli: ${successCount}`);
    console.log(`📉 Muvaffaqiyatsiz: ${failCount}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Xabarnomada kutilmagan xato:", err);
    process.exit(1);
  }
}

runBroadcast();
