import React from "react";
import { GemIcon, HeartIcon, FlameIcon, LeagueIcon } from "./Icons";

const SHOP_ITEMS = [
  {
    id: "hearts",
    component: HeartIcon,
    color: "#e63946",
    title: "Jonlar to'plami (5/5)",
    desc: "Jonlaringiz sonini to'liq 5 tagacha tiklaydi. Darslarni kutmasdan davom ettiring.",
    cost: 100,
  },
  {
    id: "shield",
    component: FlameIcon,
    color: "#e67e22",
    title: "Streak Himoyasi (Streak Shield)",
    desc: "Bir kun dars yechishni unutsangiz ham, kunlik faollik streak-ingizni buzilishdan saqlaydi.",
    cost: 250,
  },
  {
    id: "vip",
    component: LeagueIcon,
    color: "#ffd700",
    title: "Oltin VIP Nishoni",
    desc: "Profil va reyting jadvallarida ismingiz yoniga chiroyli oltin toj va VIP ramka qo'shadi.",
    cost: 150,
  },
  {
    id: "gold_theme",
    component: () => (
      <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#c09010" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" />
        <path d="M7.5 10.5c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5Z" />
        <path d="M11.5 7.5c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5Z" />
        <path d="M16.5 9.5c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5Z" />
        <path d="M6 14c0-2 2-3 6-3s6 1 6 3" />
      </svg>
    ),
    color: "#c09010",
    title: "Golden Luxury Dizayni",
    desc: "Butun platformadagi neon va ko'k elementlarni oltin-bronza hashamatli mavzuga o'zgartiradi.",
    cost: 300,
  }
];

export default function Shop({
  gems,
  setGems,
  hearts,
  setHearts,
  streakShields,
  setStreakShields,
  vipUnlocked,
  setVipUnlocked,
  goldCrownTheme,
  setGoldCrownTheme,
  showToast
}) {
  const buyItem = (item) => {
    if (gems < item.cost) {
      showToast("Gevharlar yetarli emas! 💎 Darslarni yechib ko'proq to'plang.", "error");
      return;
    }

    if (item.id === "hearts") {
      if (hearts === 5) {
        showToast("Jonlaringiz allaqachon to'liq! ❤️", "info");
        return;
      }
      setHearts(5);
      setGems(g => g - item.cost);
      showToast("Jonlaringiz to'liq tiklandi! ❤️ (5/5)", "success");
    } 
    else if (item.id === "shield") {
      setStreakShields(s => s + 1);
      setGems(g => g - item.cost);
      showToast("Streak Himoyasi sotib olindi! 🛡️ Jami: " + (streakShields + 1) + " ta", "success");
    } 
    else if (item.id === "vip") {
      if (vipUnlocked) {
        showToast("Siz allaqachon VIP a'zosisiz! 👑", "info");
        return;
      }
      setVipUnlocked(true);
      setGems(g => g - item.cost);
      showToast("Tabriklaymiz! Siz Oltin VIP a'zo bo'ldingiz! 👑", "success");
    } 
    else if (item.id === "gold_theme") {
      if (goldCrownTheme) {
        showToast("Sizda ushbu mavzu allaqachon faollashtirilgan! 🎨", "info");
        return;
      }
      setGoldCrownTheme(true);
      setGems(g => g - item.cost);
      showToast("Oltin Luxury mavzusi faollashtirildi! 🎨 Platforma oltin tusga kirdi.", "success");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "40px 16px 80px" }} className="inner-pad">
      {/* Shop Header Banner */}
      <div style={{
        background: "linear-gradient(135deg, rgba(0, 210, 255, 0.12), rgba(0, 210, 255, 0.03))",
        border: "1.5px solid rgba(0, 210, 255, 0.25)",
        borderRadius: 24,
        padding: "24px 20px",
        textAlign: "center",
        marginBottom: 32,
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.02)"
      }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
          <GemIcon size={56} color="#00d2ff" />
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, marginBottom: 4 }}>
          Gevharlar Do'koni
        </h2>
        <p style={{ fontSize: 13, color: "var(--text-light)", marginBottom: 16 }}>
          Ballar to'plab sotib oling va platformadagi imkoniyatlarni kengaytiring!
        </p>

        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "var(--bg)",
          border: "1.5px solid var(--accent)",
          borderRadius: 20,
          padding: "8px 20px",
          fontSize: 16,
          fontWeight: 800,
          color: "var(--accent)"
        }}>
          <GemIcon size={18} color="var(--accent)" />
          <span>{gems}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>
            Gevhar jami
          </span>
        </div>
      </div>

      {/* Shop Items List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {SHOP_ITEMS.map((item) => {
          let isOwned = false;
          if (item.id === "vip" && vipUnlocked) isOwned = true;
          if (item.id === "gold_theme" && goldCrownTheme) isOwned = true;

          const ItemIcon = item.component;

          return (
            <div 
              key={item.id}
              style={{
                background: "var(--card-bg)",
                border: "1.5px solid var(--border-color)",
                borderRadius: 20,
                padding: 20,
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
                transition: "all 0.2s ease"
              }}
              className="shop-card"
            >
              {/* Item Icon wrap */}
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                background: "var(--chip-bg)",
                border: "1.5px solid var(--chip-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}>
                <ItemIcon size={24} color={item.color} />
              </div>

              {/* Title & Desc */}
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: "var(--color)" }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.4, marginBottom: 12 }}>
                  {item.desc}
                </p>

                {item.id === "shield" && (
                  <div style={{ fontSize: 11, color: "var(--accent)", fontWeight: 700, marginBottom: 10 }}>
                    🛡️ Zaxiradagi himoyalar soni: {streakShields} ta
                  </div>
                )}

                {/* Buy Button */}
                <button
                  className={isOwned ? "btn-o act" : "btn-y"}
                  onClick={() => buyItem(item)}
                  disabled={isOwned}
                  style={{
                    width: "auto",
                    padding: "8px 18px",
                    fontSize: 12,
                    fontWeight: 700,
                    borderRadius: 10,
                    maxWidth: 160,
                    textAlign: "center"
                  }}
                >
                  {isOwned ? "✓ Sotib Olingan" : `💎 ${item.cost} Gevhar`}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
