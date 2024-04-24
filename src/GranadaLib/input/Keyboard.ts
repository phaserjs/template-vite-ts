import { addText, getGameScale } from "../display/PhaserDisplay";
import { GameConfig } from "../types/types";

/**
 * Represents the configuration for the Keyboard class.
 * @typedef {Object} KeyboardConfig
 * @property {string} font - The font family to use for the keys.
 * @property {number} fontSize - The font size for the keys.
 * @property {string} color - The color of the key text.
 * @property {number} keyHeight - The height of each key, before scaling.
 */
export type KeyboardConfig = {
  font: string;
  fontSize: number;
  color: string;
  keyHeight: number;
};

/**
 * A virtual keyboard component for Phaser games.
 */
class Keyboard extends Phaser.GameObjects.Container {
  private keys: Phaser.GameObjects.Text[] = [];
  private config: KeyboardConfig;
  private gameConfig: GameConfig;

  /**
   * Constructs a Keyboard instance with specific configurations and game settings.
   * @param {Phaser.Scene} scene - The Phaser scene to which this keyboard will be added.
   * @param {KeyboardConfig} config - Configuration settings for the keyboard layout and appearance.
   * @param {GameConfig} gameConfig - General game configuration, used primarily for scaling.
   */
  constructor(
    scene: Phaser.Scene,
    config: KeyboardConfig,
    gameConfig: GameConfig
  ) {
    super(scene);
    this.scene = scene;
    this.scene.add.existing(this);
    this.config = config;
    this.gameConfig = gameConfig;
    this.initializeKeys();
  }

  /**
   * Initializes the keys based on the provided configuration.
   * Each key is a Phaser.GameObjects.Text object positioned according to the specified layout.
   */
  private initializeKeys(): void {
    const scale = getGameScale(this.gameConfig);
    const scaledKeyHeight = this.config.keyHeight * scale;
    const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
    const longestRowLength = Math.max(...rows.map((row) => row.length));

    const padding = 10 * scale * 2;
    const availableWidth = window.innerWidth - padding * (longestRowLength - 1);
    const keyWidth = availableWidth / longestRowLength;

    rows.forEach((row, rowIndex) => {
      let xPosition =
        (window.innerWidth -
          (row.length * keyWidth + (row.length - 1) * padding)) /
        2;

      row.split("").forEach((char) => {
        const key = addText(
          xPosition + keyWidth / 2,
          rowIndex * scaledKeyHeight,
          this.config.font,
          this.config.fontSize,
          this,
          this.config.color,
          char,
          this.gameConfig
        );
        key.setOrigin(0.5);
        key.setInteractive();
        key.on(Phaser.Input.Events.POINTER_DOWN, () =>
          this.handleKeyPress(char)
        );
        this.keys.push(key);

        xPosition += keyWidth + padding;
      });
    });
  }

  /**
   * Handles a key press event by emitting a Phaser.Input.Events.POINTER_DOWN event with the pressed character.
   * @param {string} char - The character of the key that was pressed.
   */
  private handleKeyPress(char: string): void {
    console.log(`Key Pressed: ${char}`);
    this.emit(Phaser.Input.Events.POINTER_DOWN, char);
  }
}

export default Keyboard;
