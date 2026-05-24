import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE = path.join(__dirname, "users.json");

// Read users from file
export function getUsers() {
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

// Save users to file
export function saveUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error("❌ users.json yozishda xato:", err);
  }
}

// Add user if not exists
export function addUser(user) {
  const users = getUsers();
  const exists = users.find(u => String(u.id) === String(user.id));
  
  if (!exists) {
    users.push({
      id: user.id,
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      username: user.username || "",
      highScore: 0,
      joinedAt: new Date().toISOString()
    });
    saveUsers(users);
    return true; // New user added
  } else {
    // Update existing user info if changed
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
    // Backward compatibility: initialize highScore if missing in old record
    if (users[idx].highScore === undefined) {
      users[idx].highScore = 0;
      updated = true;
    }
    if (updated) {
      saveUsers(users);
    }
    return false; // Already existed
  }
}

// Update user's highest score
export function updateHighScore(userId, score) {
  const users = getUsers();
  const idx = users.findIndex(u => String(u.id) === String(userId));
  
  if (idx !== -1) {
    const currentHighScore = users[idx].highScore || 0;
    if (score > currentHighScore) {
      users[idx].highScore = score;
      saveUsers(users);
      return { updated: true, oldHighScore: currentHighScore };
    }
    return { updated: false, oldHighScore: currentHighScore };
  }
  return { updated: false, oldHighScore: 0 };
}

// Get top 10 users sorted by high score desc
export function getLeaderboard() {
  const users = getUsers();
  // Filter out users who haven't played or have 0 score, then sort
  return users
    .filter(u => u.highScore > 0)
    .sort((a, b) => b.highScore - a.highScore)
    .slice(0, 10);
}
