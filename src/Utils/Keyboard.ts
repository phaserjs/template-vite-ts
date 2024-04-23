import Phaser from "phaser";
import Config from "../config/config";
import { addText, getGameScale } from "../Utils/PhaserDisplay";

export const KeyboardEvent = {
  keyPressed: "pointerdown", // Event triggered when a key is pressed.
} as const;

export type KeyboardConfig = {
  font: string;
  fontSize: number;
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
    this.scene.events.once("update", () => this.centerKeyboard());
  }

  private initializeKeys(): void {
    const scale = getGameScale(Config);
    const scaledMaxWidth = window.innerWidth;
    const dynamicPadding = scaledMaxWidth * 0.02; // Adjusted padding

    const keyHeight = this.config.fontSize * 1.5 * scale;
    const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

    rows.forEach((row, rowIndex) => {
      const rowWidths = row.split("").map((char) => {
        const tempText = this.scene.add.text(0, 0, char, {
          font: `${this.config.fontSize * scale}px ${this.config.font}`,
          color: "#000000",
        });
        const textWidth = tempText.width;
        tempText.destroy();
        return textWidth;
      });

      const totalRowWidth =
        rowWidths.reduce((acc, width) => acc + width, 0) +
        dynamicPadding * (row.length - 1);
      const xOffset = (scaledMaxWidth - totalRowWidth) / 2;

      let xPosition = xOffset;

      row.split("").forEach((char, index) => {
        const key = addText(
          xPosition + rowWidths[index] / 2,
          rowIndex * (keyHeight + dynamicPadding),
          this.config.font,
          this.config.fontSize * scale,
          this,
          "#000000",
          char,
          Config
        );
        key.setOrigin(0.5, 0);
        key.setInteractive();
        key.on(KeyboardEvent.keyPressed, () => this.handleKeyPress(char));
        this.keys.push(key);

        // Move the position to the next key, accounting for the current key's width and padding
        xPosition += rowWidths[index] + dynamicPadding;
      });
    });
  }

  private centerKeyboard(): void {}

  private handleKeyPress(char: string): void {
    console.log(`Key Pressed: ${char}`);
    this.keyEvent.emit(KeyboardEvent.keyPressed, char);
  }

  public onKeyPress(callback: (char: string) => void): void {
    this.keyEvent.on(KeyboardEvent.keyPressed, callback);
  }
}

export default Keyboard;
