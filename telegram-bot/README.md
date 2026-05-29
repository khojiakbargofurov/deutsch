# Blitzi Telegram Bot 🤖🇺🇿

Ushbu katalogda **Blitzi** nemis tili platformasining Telegram boti joylashgan. Bot foydalanuvchilarga nemischa so'zlarni izlash, Fleshkartalar orqali o'rganish, Quiz (testlar) yechish va har kuni shaxsiy belgilangan vaqtda **kunlik 5 ta yangi so'z** qabul qilish imkonini beradi.

---

## 🚀 Ishga tushirish (Getting Started)

Botni mahalliy (local) kompyuterda yoki VPS serverda ishga tushirish uchun:

### 1. Bog'liqliklarni o'rnatish
Katalog ichiga kiring va kerakli paketlarni yuklang:
```bash
cd telegram-bot
npm install
```

### 2. .env faylini sozlash
`telegram-bot/` katalogida `.env` faylini yarating yoki mavjudini tahrirlang:
```env
BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN_HERE
WEB_APP_URL=https://deutsch-blitz.vercel.app/
ADMIN_CHAT_ID=529303055
```

### 3. Botni ishga tushirish
Development rejimida (nodemon orqali avtomatik qayta ishga tushadi):
```bash
npm run dev
```
Production rejimida:
```bash
npm start
```

---

## 🔥 Foydalanuvchilar ma'lumotlarini doimiy saqlash (Firestore Persistence)

Bot foydalanuvchilarining rekordlari (highScore), shaxsiy sozlamalari (dailyWordTime) va oxirgi marta kunlik so'z qabul qilgan sanalarini doimiy saqlash uchun **Firebase Cloud Firestore** bazasi integratsiya qilingan.

Agar Firebase konfiguratsiyasi o'rnatilmasa, bot avtomatik ravishda local **`users.json`** fayl tizimiga o'tadi (fallback). Bulutli bazani ulash uchun quyidagi ikki usuldan birini tanlang:

### Usul A: Environment Variables (Tavsiya etiladi - Render, Heroku yoki Vercel uchun)
Hech qanday maxfiy fayl yaratmasdan, faqatgina `.env` (yoki hosting muhiti o'zgaruvchilari) orqali Firestore-ni ulash:

1. Firebase Console-ga kiring -> **Project Settings** -> **Service Accounts**.
2. **Generate New Private Key** tugmasini bosing va yuklangan JSON fayldan quyidagi ma'lumotlarni oling:
3. Quyidagi parametrlarni `.env` yoki xostingizning **Environment Variables** bo'limiga qo'shing:
   * `FIREBASE_PROJECT_ID` — Loyihangiz IDsi (project_id)
   * `FIREBASE_CLIENT_EMAIL` — Loyiha hisob xizmati emaili (client_email)
   * `FIREBASE_PRIVATE_KEY` — Loyihaning maxfiy kaliti (private_key). **DIQQAT:** Kalit tarkibidagi barcha yangi qatorlarni (`\n`) bitta qator qilib joylashtiring.

`.env` namunasi:
```env
FIREBASE_PROJECT_ID="blitzi-app"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@blitzi-app.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQ...\n-----END PRIVATE KEY-----\n"
```

### Usul B: firebase-key.json Fayli (Local yoki VPS uchun)
Firebase'dan yuklab olingan xizmat hisobi JSON faylini bevosita ishlatish:

1. Firebase Console-dan yuklangan maxfiy kalit (Service Account JSON) faylini **`firebase-key.json`** deb nomlang.
2. Ushbu faylni `telegram-bot/` katalogining ichiga joylashtiring.
3. Bot ishga tushganda ushbu faylni avtomatik aniqlaydi va Firestore bulutli bazasiga ulanadi.

*(Eslatma: `firebase-key.json` fayli `.gitignore` ga kiritilgan bo'lib, GitHub repozitoriyangizga hech qachon chiqib ketmaydi va xavfsizlik 100% ta'minlanadi.)*

---

## 📢 Kunlik Imkoniyatlar Xabarnomasini Yuborish (Broadcast Script)

Foydalanuvchilarga yangi brending, kunlik 5 ta so'z va sozlamalar bo'limi haqida e'lon xabarini yuborish uchun maxsus skript:
```bash
node broadcast-features.js
```
*Tizim Telegram rate-limit qoidalariga rioya qilgan holda xavfsiz va chiroyli Web App tugmasi bilan xabarni barcha faol a'zolarga yetkazadi.*
