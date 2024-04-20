export const CONFIG = {
  gameWidth: 375,
  gameHeight: 667,
} as const;

export const PAGES = {
  Boot: "Boot",
  Game: "Game",
} as const;

export const IS_DEV_MODE = import.meta.env.VITE_DEV_MODE === "true";
