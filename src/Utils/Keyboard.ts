import Phaser from "phaser";
import Config from "../config/config";
import { addText, getGameScale } from "../Utils/PhaserDisplay";

export const KeyboardEvent = {
  keyPressed: "pointerdown", // Event triggered when a key is pressed.
} as const;

export type KeyboardConfig = {
  font: string;
  fontSize: number;
  color: string;
  keyHeight: number;
};

class Keyboard extends Phaser.GameObjects.Container {
  private keys: Phaser.GameObjects.Text[] = [];
  private keyEvent: Phaser.Events.EventEmitter;
  private config: KeyboardConfig;

  constructor(scene: Phaser.Scene, config: KeyboardConfig) {
    super(scene);
    this.scene = scene;
    this.scene.add.existing(this);
    this.keyEvent = new Phaser.Events.EventEmitter();
    this.config = config;
    this.initializeKeys();
  }

  private initializeKeys(): void {
    const scale = getGameScale(Config);

    const scaledKeyHeight = this.config.keyHeight * scale;
    const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
    const longestRowLength = Math.max(...rows.map((row) => row.length));

    // Calculate the width available for all keys after accounting for padding
    const availableWidth = window.innerWidth;
    const keyWidth = availableWidth / longestRowLength;

    rows.forEach((row, rowIndex) => {
      let xPosition = 0;

      row.split("").forEach((char) => {
        const key = addText(
          xPosition + keyWidth / 2,
          rowIndex * scaledKeyHeight,
          this.config.font,
          this.config.fontSize,
          this,
          this.config.color,
          char,
          Config
        );
        key.setOrigin(0.5, 0);
        key.setInteractive();
        key.on(KeyboardEvent.keyPressed, () => this.handleKeyPress(char));
        this.keys.push(key);

        // Update xPosition for the next key
        xPosition += keyWidth;
      });
    });
  }

  private handleKeyPress(char: string): void {
    console.log(`Key Pressed: ${char}`);
    this.keyEvent.emit(KeyboardEvent.keyPressed, char);
  }

  public onKeyPress(callback: (char: string) => void): void {
    this.keyEvent.on(KeyboardEvent.keyPressed, callback);
  }
}

export default Keyboard;
