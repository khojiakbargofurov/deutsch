import React from "react";

/* ─────────────────────────────────────────────
   DUOLINGO-STYLE COLORFUL NAV ICONS
   Each icon has active (colored) + inactive (grey) state
───────────────────────────────────────────── */

// 🏠 Home / Path icon — orange house
export const PathIcon = ({ size = 28, color = "currentColor", active = false }) => {
  const isActive = active || color !== "currentColor";
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Roof */}
      <path
        d="M4 16L16 4L28 16"
        fill={isActive ? "#ff9600" : "#b0b8c1"}
        stroke={isActive ? "#e07800" : "#8a9099"}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* House body */}
      <rect
        x="8" y="15" width="16" height="13" rx="2"
        fill={isActive ? "#ffbc4b" : "#c8d0d8"}
        stroke={isActive ? "#e07800" : "#8a9099"}
        strokeWidth="1.5"
      />
      {/* Door */}
      <rect
        x="13" y="21" width="6" height="7" rx="1.5"
        fill={isActive ? "#e07800" : "#8a9099"}
      />
      {/* Roof triangle peak */}
      <polygon
        points="16,5 6,16 26,16"
        fill={isActive ? "#ff9600" : "#b0b8c1"}
        stroke={isActive ? "#c06000" : "#7a8088"}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// 📖 Vocab icon — colorful open book
export const VocabIcon = ({ size = 28, color = "currentColor", active = false }) => {
  const isActive = active || color !== "currentColor";
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Left page */}
      <path
        d="M4 7C4 7 10 6 16 9V26C10 23 4 24 4 24V7Z"
        fill={isActive ? "#1cb0f6" : "#b0b8c1"}
        stroke={isActive ? "#0090d0" : "#8a9099"}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Right page */}
      <path
        d="M28 7C28 7 22 6 16 9V26C22 23 28 24 28 24V7Z"
        fill={isActive ? "#4cd4ff" : "#c8d0d8"}
        stroke={isActive ? "#0090d0" : "#8a9099"}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Spine */}
      <line
        x1="16" y1="9" x2="16" y2="26"
        stroke={isActive ? "#0090d0" : "#8a9099"}
        strokeWidth="2"
      />
      {/* Lines on left page */}
      {isActive && <>
        <line x1="8" y1="13" x2="14" y2="12" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
        <line x1="8" y1="16" x2="14" y2="15" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
        <line x1="8" y1="19" x2="14" y2="18" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
      </>}
    </svg>
  );
};

// 🏆 League icon — trophy cup
export const LeagueIcon = ({ size = 28, color = "currentColor", active = false }) => {
  const isActive = active || color !== "currentColor";
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Cup body */}
      <path
        d="M10 5H22V18C22 21.31 19.31 24 16 24C12.69 24 10 21.31 10 18V5Z"
        fill={isActive ? "#ffd700" : "#c8d0d8"}
        stroke={isActive ? "#e0a800" : "#8a9099"}
        strokeWidth="1.5"
      />
      {/* Handles */}
      <path d="M10 8H6C6 8 5 13 10 14" stroke={isActive ? "#e0a800" : "#8a9099"} strokeWidth="1.5" fill={isActive ? "#ffec6e" : "#d8e0e8"} strokeLinecap="round"/>
      <path d="M22 8H26C26 8 27 13 22 14" stroke={isActive ? "#e0a800" : "#8a9099"} strokeWidth="1.5" fill={isActive ? "#ffec6e" : "#d8e0e8"} strokeLinecap="round"/>
      {/* Base */}
      <rect x="13" y="24" width="6" height="3" rx="1" fill={isActive ? "#e0a800" : "#8a9099"}/>
      <rect x="10" y="27" width="12" height="2.5" rx="1.25" fill={isActive ? "#ffd700" : "#b0b8c1"}/>
      {/* Star on cup */}
      {isActive && <polygon points="16,9 17,12 20,12 17.5,14 18.5,17 16,15.5 13.5,17 14.5,14 12,12 15,12" fill="#fff" opacity="0.6"/>}
    </svg>
  );
};

// 🛒 Shop icon — treasure chest
export const ShopIcon = ({ size = 28, color = "currentColor", active = false }) => {
  const isActive = active || color !== "currentColor";
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Chest bottom */}
      <rect
        x="4" y="16" width="24" height="12" rx="3"
        fill={isActive ? "#c87d2f" : "#b0b8c1"}
        stroke={isActive ? "#8b5e24" : "#8a9099"}
        strokeWidth="1.5"
      />
      {/* Chest lid */}
      <path
        d="M4 16C4 12 6 10 8 10H24C26 10 28 12 28 16H4Z"
        fill={isActive ? "#e8962e" : "#c8d0d8"}
        stroke={isActive ? "#8b5e24" : "#8a9099"}
        strokeWidth="1.5"
      />
      {/* Bands */}
      <line x1="4" y1="19" x2="28" y2="19" stroke={isActive ? "#8b5e24" : "#8a9099"} strokeWidth="1.5"/>
      {/* Lock */}
      <rect x="13" y="17" width="6" height="4" rx="1" fill={isActive ? "#ffd700" : "#8a9099"}/>
      <path d="M14 17V15.5C14 14.1 18 14.1 18 15.5V17" stroke={isActive ? "#ffd700" : "#8a9099"} strokeWidth="1.5" fill="none"/>
      {/* Gems peeking out */}
      {isActive && <>
        <circle cx="9" cy="23" r="1.5" fill="#1cb0f6" opacity="0.9"/>
        <circle cx="23" cy="23" r="1.5" fill="#ff4b4b" opacity="0.9"/>
        <circle cx="16" cy="24" r="1.5" fill="#ffd700" opacity="0.9"/>
      </>}
    </svg>
  );
};

// 👤 Stats / Profile icon — owl mascot face
export const StatsIcon = ({ size = 28, color = "currentColor", active = false }) => {
  const isActive = active || color !== "currentColor";
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Head */}
      <circle
        cx="16" cy="14" r="10"
        fill={isActive ? "#58cc02" : "#c8d0d8"}
        stroke={isActive ? "#3a9900" : "#8a9099"}
        strokeWidth="1.5"
      />
      {/* Eyes */}
      <circle cx="12" cy="13" r="3.5" fill="white"/>
      <circle cx="20" cy="13" r="3.5" fill="white"/>
      <circle cx="12.5" cy="13.5" r="1.8" fill={isActive ? "#2d2d2d" : "#6a7180"}/>
      <circle cx="20.5" cy="13.5" r="1.8" fill={isActive ? "#2d2d2d" : "#6a7180"}/>
      {/* Eye shine */}
      {isActive && <>
        <circle cx="13.2" cy="12.5" r="0.7" fill="white"/>
        <circle cx="21.2" cy="12.5" r="0.7" fill="white"/>
      </>}
      {/* Beak */}
      <path d="M14 17L16 19.5L18 17" fill={isActive ? "#ff9600" : "#8a9099"}/>
      {/* Eyebrows */}
      <path d="M9.5 10.5 Q12 9 14 10.5" stroke={isActive ? "#3a9900" : "#8a9099"} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <path d="M18 10.5 Q20 9 22.5 10.5" stroke={isActive ? "#3a9900" : "#8a9099"} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {/* Body */}
      <ellipse cx="16" cy="26" rx="8" ry="5" fill={isActive ? "#58cc02" : "#b0b8c1"} stroke={isActive ? "#3a9900" : "#8a9099"} strokeWidth="1.2"/>
    </svg>
  );
};

// 🔥 Flame icon — streak indicator
export const FlameIcon = ({ size = 24, color = "#ff9600" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2C12 2 7 7 7 13C7 15.8 9.24 18 12 18C14.76 18 17 15.8 17 13C17 10.5 15 8 15 8C15 8 14 11 12 11C10 11 9 9 9 9C9 9 12 6 12 2Z"
      fill={color}
    />
    <path
      d="M12 22C9.24 22 7 19.76 7 17C7 15.5 7.5 14.2 8.5 13.2C8.8 14.5 9.8 15.5 11 16C11 15 11.5 14 12 13.5C12.5 14 13 15 13 16C14.2 15.5 15.2 14.5 15.5 13.2C16.5 14.2 17 15.5 17 17C17 19.76 14.76 22 12 22Z"
      fill={color === "#ff9600" ? "#ffbc4b" : color}
    />
  </svg>
);

// 💎 Gem icon — diamond
export const GemIcon = ({ size = 24, color = "#1cb0f6" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M6 3h12l4 6-10 12L2 9Z" fill={color} opacity="0.9"/>
    <path d="M2 9h20" stroke="white" strokeWidth="0.8" opacity="0.5"/>
    <path d="M12 3L8 9l4 12 4-12-4-6Z" fill="white" opacity="0.25"/>
  </svg>
);

// ❤️ Heart icon — lives
export const HeartIcon = ({ size = 24, color = "#ff4b4b" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.81 3.81 12 5C12.19 3.81 13.76 3 15.5 3C18.58 3 21 5.42 21 8.5C21 14.5 12 21 12 21Z"
      fill={color}
    />
    <path
      d="M12 8C12 8 10 7 9 8.5C8.5 9.3 9 10 9 10"
      stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.5"
    />
  </svg>
);

// 🔊 Speaker icon
export const SpeakerIcon = ({ size = 24, strokeWidth = 2.2, color = "currentColor", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 5 6 9H2v6h4l5 4V5Z"/>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
  </svg>
);

// ⭐ Star icon
export const StarIcon = ({ size = 24, strokeWidth = 2.2, color = "currentColor", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
