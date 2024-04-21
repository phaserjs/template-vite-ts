import Phaser from "phaser";
import { addText } from "./PhaserDisplay";
import Config from "../../config";

/**
 * Defines custom keyboard event types.
 */
export const KeyboardEvent = {
  keyPressed: "pointerdown", // Event triggered when a key is pressed.
} as const;

/**
 * Configuration interface for Keyboard setup.
 */
export type KeyboardConfig = {
  font: string; // The font family for the keyboard characters.
  fontSize: number; // The font size of the keyboard characters.
  maxWidth: number; // Maximum width of the keyboard.
};

/**
 * A virtual keyboard represented as a container of interactive text elements in Phaser.
 * Handles the creation and management of keyboard keys and their interactions.
 */
class Keyboard extends Phaser.GameObjects.Container {
  private keys: Phaser.GameObjects.Text[]; // Stores each key as a Phaser text object.
  private keyEvent: Phaser.Events.EventEmitter; // Manages and emits keyboard events.

  /**
   * Creates an instance of a Keyboard.
   * @param scene - The Phaser scene to which this keyboard will be added.
   * @param config - Configuration for the keyboard setup, including font, size, and layout dimensions.
   */
  constructor(scene: Phaser.Scene, config: KeyboardConfig) {
    super(scene);
    this.scene = scene;
    this.scene.add.existing(this); // Add this container to the scene.
    this.keyEvent = new Phaser.Events.EventEmitter();
    this.keys = [];
    this.initializeKeys(config);
  }

  /**
   * Initializes the keys of the keyboard based on the provided configuration.
   * This method sets up the visual representation and functionality of each key.
   * @param config - Configuration specifying how keys should be displayed and behave.
   */
  private initializeKeys(config: KeyboardConfig): void {
    const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
    const rowOffsets = [0, config.maxWidth * 0.05, config.maxWidth * 0.1];

    rows.forEach((row, rowIndex) => {
      const numKeys = row.length;
      const keyWidth = (config.maxWidth - rowOffsets[rowIndex]) / numKeys;
      const keyHeight = config.fontSize * 1.2;

      for (let i = 0; i < numKeys; i++) {
        const char = row[i];
        const x = i * keyWidth + rowOffsets[rowIndex];
        const y = rowIndex * (keyHeight + 20);

        const key = addText(
          x,
          y,
          config.font,
          config.fontSize,
          this.scene,
          char,
          Config,
          false
        );
        key.setInteractive();

        key.on(KeyboardEvent.keyPressed, () => this.handleKeyPress(char));
        this.keys.push(key);
      }
    });
  }

  /**
   * Responds to key presses by emitting an event with the pressed character.
   * @param char - The character of the key that was pressed.
   */
  private handleKeyPress(char: string): void {
    console.log(`Key Pressed: ${char}`);
    this.keyEvent.emit(KeyboardEvent.keyPressed, char);
  }

  /**
   * Registers a callback to be executed when a key is pressed.
   * @param callback - The function to call when a key is pressed, receiving the character as an argument.
   */
  public onKeyPress(callback: (char: string) => void): void {
    this.keyEvent.on(KeyboardEvent.keyPressed, callback);
  }
}

export default Keyboard;
