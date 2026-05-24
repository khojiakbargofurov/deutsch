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
    if (updated) {
      saveUsers(users);
    }
    return false; // Already existed
  }
}
