import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import admin from "firebase-admin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE = path.join(__dirname, "users.json");

let db = null;
let useFirestore = false;

// Attempt to initialize Firebase Admin dynamically
try {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  const keyFilePath = path.join(__dirname, "firebase-key.json");

  if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, "\n"),
      }),
    });
    db = admin.firestore();
    useFirestore = true;
    console.log("🔥 Firebase Firestore muvaffaqiyatli ulandi (Env variables orqali)!");
  } else if (fs.existsSync(keyFilePath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(keyFilePath, "utf8"));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    db = admin.firestore();
    useFirestore = true;
    console.log("🔥 Firebase Firestore muvaffaqiyatli ulandi (firebase-key.json orqali)!");
  } else {
    console.warn("⚠️ Firebase parametrlari (.env yoki firebase-key.json) topilmadi. Local JSON fayl tizimidan foydalaniladi.");
  }
} catch (err) {
  console.error("❌ Firebase ulanishida xatolik, Local JSON ga o'tilmoqda:", err.message);
  useFirestore = false;
  db = null;
}

// ── LOCAL JSON HELPER FUNCTIONS ──
function getLocalUsers() {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(USERS_FILE, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error("❌ users.json o'qishda xato:", err);
    return [];
  }
}

function saveLocalUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error("❌ users.json yozishda xato:", err);
  }
}


// ── EXPORTED DATABASE ACTIONS ──

// Read all users
export async function getUsers() {
  if (useFirestore) {
    try {
      const snapshot = await db.collection("users").get();
      const list = [];
      snapshot.forEach(doc => list.push(doc.data()));
      return list;
    } catch (err) {
      console.error("❌ Firestore getUsers xato, Local JSON ga o'tilmoqda:", err.message);
    }
  }
  return getLocalUsers();
}

// Add user if not exists
export async function addUser(user) {
  if (useFirestore) {
    try {
      const userRef = db.collection("users").doc(String(user.id));
      const doc = await userRef.get();
      
      if (!doc.exists) {
        const newUser = {
          id: user.id,
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          username: user.username || "",
          highScore: 0,
          dailyWordTime: "09:00",
          joinedAt: new Date().toISOString()
        };
        await userRef.set(newUser);
        return true; // Added
      } else {
        // Update details if changed
        const data = doc.data();
        let updated = false;
        const updates = {};
        
        if (data.first_name !== (user.first_name || "")) { updates.first_name = user.first_name || ""; updated = true; }
        if (data.last_name !== (user.last_name || "")) { updates.last_name = user.last_name || ""; updated = true; }
        if (data.username !== (user.username || "")) { updates.username = user.username || ""; updated = true; }
        if (data.highScore === undefined) { updates.highScore = 0; updated = true; }
        if (data.dailyWordTime === undefined) { updates.dailyWordTime = "09:00"; updated = true; }
        
        if (updated) {
          await userRef.update(updates);
        }
        return false; // Already existed
      }
    } catch (err) {
      console.error("❌ Firestore addUser xato, Local JSON ga o'tilmoqda:", err.message);
    }
  }

  // Fallback Local JSON mode
  const users = getLocalUsers();
  const exists = users.find(u => String(u.id) === String(user.id));
  
  if (!exists) {
    users.push({
      id: user.id,
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      username: user.username || "",
      highScore: 0,
      dailyWordTime: "09:00",
      joinedAt: new Date().toISOString()
    });
    saveLocalUsers(users);
    return true;
  } else {
    let updated = false;
    const idx = users.findIndex(u => String(u.id) === String(user.id));
    if (users[idx].first_name !== (user.first_name || "") ||
        users[idx].last_name !== (user.last_name || "") ||
        users[idx].username !== (user.username || "")) {
      users[idx].first_name = user.first_name || "";
      users[idx].last_name = user.last_name || "";
      users[idx].username = user.username || "";
      updated = true;
    }
    if (users[idx].highScore === undefined) {
      users[idx].highScore = 0;
      updated = true;
    }
    if (users[idx].dailyWordTime === undefined) {
      users[idx].dailyWordTime = "09:00";
      updated = true;
    }
    if (updated) {
      saveLocalUsers(users);
    }
    return false;
  }
}

// Update user's highest score
export async function updateHighScore(userId, score) {
  if (useFirestore) {
    try {
      const userRef = db.collection("users").doc(String(userId));
      const doc = await userRef.get();
      
      if (doc.exists) {
        const currentHighScore = doc.data().highScore || 0;
        if (score > currentHighScore) {
          await userRef.update({ highScore: score });
          return { updated: true, oldHighScore: currentHighScore };
        }
        return { updated: false, oldHighScore: currentHighScore };
      }
      return { updated: false, oldHighScore: 0 };
    } catch (err) {
      console.error("❌ Firestore updateHighScore xato, Local JSON ga o'tilmoqda:", err.message);
    }
  }

  // Fallback Local JSON mode
  const users = getLocalUsers();
  const idx = users.findIndex(u => String(u.id) === String(userId));
  
  if (idx !== -1) {
    const currentHighScore = users[idx].highScore || 0;
    if (score > currentHighScore) {
      users[idx].highScore = score;
      saveLocalUsers(users);
      return { updated: true, oldHighScore: currentHighScore };
    }
    return { updated: false, oldHighScore: currentHighScore };
  }
  return { updated: false, oldHighScore: 0 };
}

// Get top 10 users sorted by high score desc
export async function getLeaderboard() {
  if (useFirestore) {
    try {
      const snapshot = await db.collection("users")
        .where("highScore", ">", 0)
        .orderBy("highScore", "desc")
        .limit(10)
        .get();
      const list = [];
      snapshot.forEach(doc => list.push(doc.data()));
      return list;
    } catch (err) {
      console.error("❌ Firestore getLeaderboard xato, Local JSON ga o'tilmoqda:", err.message);
    }
  }

  // Fallback Local JSON mode
  const users = getLocalUsers();
  return users
    .filter(u => u.highScore > 0)
    .sort((a, b) => b.highScore - a.highScore)
    .slice(0, 10);
}

// Retrieve an individual user profile by ID
export async function getUser(userId) {
  if (useFirestore) {
    try {
      const doc = await db.collection("users").doc(String(userId)).get();
      return doc.exists ? doc.data() : null;
    } catch (err) {
      console.error("❌ Firestore getUser xato, Local JSON ga o'tilmoqda:", err.message);
    }
  }

  // Fallback Local JSON mode
  const users = getLocalUsers();
  return users.find(u => String(u.id) === String(userId));
}

// Update a user's daily word delivery time preference
export async function setUserTime(userId, timeStr) {
  if (useFirestore) {
    try {
      const userRef = db.collection("users").doc(String(userId));
      await userRef.update({ dailyWordTime: timeStr });
      const doc = await userRef.get();
      return doc.data();
    } catch (err) {
      console.error("❌ Firestore setUserTime xato, Local JSON ga o'tilmoqda:", err.message);
    }
  }

  // Fallback Local JSON mode
  const users = getLocalUsers();
  const idx = users.findIndex(u => String(u.id) === String(userId));
  
  if (idx !== -1) {
    users[idx].dailyWordTime = timeStr;
    saveLocalUsers(users);
    return users[idx];
  }
  return null;
}
