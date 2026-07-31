const AVATAR_COLORS = [
  "#2563EB",
  "#7C3AED",
  "#10B981",
  "#F59E0B",
  "#EC4899",
  "#06B6D4",
];

export function randomAvatarColor() {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}
