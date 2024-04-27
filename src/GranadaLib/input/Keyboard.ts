import Config from "../../config/config";
import { addImage, addText } from "../Display/PhaserDisplay";
import { GameConfig } from "../types/types";

/**
 * Represents the configuration for the Keyboard class.
 * @typedef {Object} KeyboardConfig
 * @property {string} font - The font family to use for the keys.
 * @property {number} fontSize - The font size for the keys.
 * @property {string} color - The color of the key text.
 * @property {number} keyHeight - The height of each key, before scaling.
 * @property {number} maxWidth - The maximum width of the keyboard, before scaling.
 */
export type KeyboardConfig = {
  font: string;
  fontSize: number;
  color: string;
  padding: number;
};

export const GranadaKeyboardEvents = {
  ...Phaser.Input.Events,
  DELETE: "deletePressed",
};

/**
 * A virtual keyboard component for Phaser games.
 */
class GranadaKeyboard extends Phaser.GameObjects.Container {
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
    this.config = config;
    this.gameConfig = gameConfig;
    this.initializeKeys();
  }

  /**
   * Initializes the keys based on the provided configuration.
   * Each key is a Phaser.GameObjects.Text object positioned according to the specified layout.
   */
  private initializeKeys(): void {
    const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
    const padding = this.config.padding;
    const keyWidth = this.config.fontSize;
    let xPosition = 0;
    rows.forEach((row, rowIndex) => {
      xPosition =
        (Config.size.x - (row.length * keyWidth + (row.length - 1) * padding)) /
        2;

      row.split("").forEach((char) => {
        const key = this.addKey(
          xPosition + keyWidth / 2,
          rowIndex * (this.config.fontSize + padding),
          char
        );
        this.keys.push(key);
        xPosition += keyWidth + padding;
      });
    });

    // Add Delete Button
    const deleteButtonX = 330;
    const deleteButtonY = 65;
    const deleteKey = addImage(
      deleteButtonX,
      deleteButtonY,
      this.gameConfig.images.deleteBtn.key,
      this
    );
    deleteKey.setInteractive();
    deleteKey.x = deleteButtonX;
    deleteKey.on(Phaser.Input.Events.POINTER_DOWN, () =>
      this.handleDeletePress()
    );
  }

  private addKey(x: number, y: number, char: string): Phaser.GameObjects.Text {
    const keyBacking = addImage(x, y, this.gameConfig.images.letter.key, this);
    keyBacking.setOrigin(0.5);
    keyBacking.setScale(0.8);
    keyBacking.setInteractive();
    keyBacking.alpha = 0.08;

    const key = addText(
      x,
      y,
      this.config.font,
      this.config.fontSize,
      this,
      this.config.color,
      char.toLowerCase()
    );
    key.setOrigin(0.5);

    keyBacking.on(Phaser.Input.Events.POINTER_DOWN, () =>
      this.handleKeyPress(char)
    );
    return key;
  }

  private handleDeletePress(): void {
    this.emit(GranadaKeyboardEvents.DELETE);
  }

  /**
   * Handles a key press event by emitting a Phaser.Input.Events.POINTER_DOWN event with the pressed character.
   * @param {string} char - The character of the key that was pressed.
   */
  private handleKeyPress(char: string): void {
    this.emit(GranadaKeyboardEvents.POINTER_DOWN, char);
  }
}

export default GranadaKeyboard;
