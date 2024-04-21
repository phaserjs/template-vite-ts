import { GameObjects } from "phaser";
import Config from "../config/config";

export type Point = {
  x: number;
  y: number;
};

export type DisplayObject =
  | GameObjects.Sprite
  | GameObjects.Text
  | GameObjects.Image
  | GameObjects.Container
  | GameObjects.Graphics
  | GameObjects.TileSprite
  | GameObjects.BitmapText
  | GameObjects.Particles.ParticleEmitter;

// Utilizing TypeScript's utility types to enforce the use of specific literal values
export type PageType = (typeof Config.pages)[keyof typeof Config.pages];
export type FontType = (typeof Config.fonts)[keyof typeof Config.fonts];

// Defining the GameConfig interface
export interface GameConfig {
  size: Point;
  pages: {
    [key: string]: string;
  };
  fonts: {
    [key: string]: string;
  };
  images: Images;
}

export type Images = {
  [key: string]: ImageConfig;
};

export type ImageConfig = {
  key: string;
  path: string;
};
