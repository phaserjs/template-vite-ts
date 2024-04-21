import Phaser from "phaser";
import { addText, getGameScale } from "./PhaserDisplay";
import Config from "../config/config";

export const KeyboardEvent = {
  keyPressed: "pointerdown", // Event triggered when a key is pressed.
} as const;

export type KeyboardConfig = {
  font: string;
  fontSize: number;
  maxWidth: number;
};

class Keyboard extends Phaser.GameObjects.Container {
  private keys: Phaser.GameObjects.Text[] = [];
  private keyEvent: Phaser.Events.EventEmitter;

  constructor(scene: Phaser.Scene, config: KeyboardConfig) {
    super(scene);
    this.scene = scene;
    this.scene.add.existing(this);
    this.keyEvent = new Phaser.Events.EventEmitter();
    config.maxWidth = this.scene.sys.game.config.width as number; // Use the full screen width
    this.initializeKeys(config);
    this.scene.events.once("update", () => this.centerKeyboard());
  }

  private initializeKeys(config: KeyboardConfig): void {
    const scale = getGameScale(this.scene, Config);
    const scaledMaxWidth = config.maxWidth; // Adjust for full width
    const keyHeight = config.fontSize * 1.5 * scale;

    // Rows of a typical QWERTY keyboard
    const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

    // Calculate the starting x-offset for each row to create a staggered effect
    const offsets = [0.1, 0.15, 0.2]; // Percent of maxWidth for starting offset
    rows.forEach((row, rowIndex) => {
      const numKeys = row.length;
      const totalOffset = scaledMaxWidth * offsets[rowIndex];
      const keyWidth = (scaledMaxWidth - totalOffset * 2) / numKeys;

      row.split("").forEach((char, index) => {
        const x = totalOffset + index * keyWidth;
        const y = rowIndex * (keyHeight + 20 * scale);

        const key = addText(
          x,
          y,
          config.font,
          config.fontSize * scale,
          this,
          "#000000",
          char,
          Config
        );
        key.setOrigin(0.5, 0); // Center-align the text within each key horizontally
        key.setInteractive();
        key.on(KeyboardEvent.keyPressed, () => this.handleKeyPress(char));
        this.keys.push(key);
      });
    });
  }

  private centerKeyboard(): void {
    // Center the keyboard based on actual content width
    let minX = Math.min(...this.keys.map((key) => key.getBounds().left));
    let maxX = Math.max(...this.keys.map((key) => key.getBounds().right));
    let totalWidth = maxX - minX;
    this.x =
      ((this.scene.sys.game.config.width as number) - totalWidth) / 2 - minX;
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
