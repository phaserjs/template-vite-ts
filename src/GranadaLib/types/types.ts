import { GameObjects } from "phaser";

/**
 * Represents a point in a two-dimensional space.
 */
export type Point = {
  x: number; // The x-coordinate of the point.
  y: number; // The y-coordinate of the point.
};

/**
 * Represents a display object that can be rendered in a Phaser scene.
 * It can be one of several types, including Sprite, Text, Image, Container, Graphics, TileSprite,
 * BitmapText, or ParticleEmitter.
 */
export type DisplayObject =
  | GameObjects.Sprite
  | GameObjects.Text
  | GameObjects.Image
  | GameObjects.Container
  | GameObjects.Graphics
  | GameObjects.TileSprite
  | GameObjects.BitmapText
  | GameObjects.Particles.ParticleEmitter;

/**
 * Configuration interface for the game, containing size, page mappings, font mappings, and image configurations.
 */
export interface GameConfig {
  size: Point; // The size of the game canvas.
  pages: Record<string, string>; // Mapping of page names to their respective URLs.
  fonts: Record<string, string>; // Mapping of font names to their respective font files.
  images: Images; // Mapping of image keys to their respective configurations.
  audio: Audio; // Mapping of audio keys to their respective audio files.
}

/**
 * Configuration interface for images used in the game.
 */
export interface AssetConfig {
  key: string; // The key used to reference the image.
  path: string; // The file path or URL of the image.
}

/**
 * Type representing a collection of images used in the game, with each image identified by its key and having a corresponding configuration.
 */
export type Images = {
  [key: string]: AssetConfig;
};

/**
 * Type representing a collection of images used in the game, with each image identified by its key and having a corresponding configuration.
 */
export type Audio = {
  [key: string]: AssetConfig;
};

/**
 * Type representing the page type, ensuring that it is a valid page name defined in the game configuration.
 */
export type PageType = GameConfig["pages"][keyof GameConfig["pages"]];

/**
 * Type representing the font type, ensuring that it is a valid font name defined in the game configuration.
 */
export type FontType = GameConfig["fonts"][keyof GameConfig["fonts"]];
