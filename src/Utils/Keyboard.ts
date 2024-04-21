import Phaser from "phaser";
import { addText, getGameScale } from "./PhaserDisplay";
import Config from "../../config";

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

    const rows = ["QWERTYUIOP", " ASDFGHJKL ", "  ZXCVBNM  "]; // Preceding spaces for stagger
    const staggerOffset = scaledMaxWidth * 0.05; // Offset for each subsequent row

    rows.forEach((row, rowIndex) => {
      const trimmedRow = row.trim();
      const keyWidth = scaledMaxWidth / 10; // Base key width on the widest row

      let xOffset = staggerOffset * rowIndex; // Calculate initial offset based on row index
      trimmedRow.split("").forEach((char, index) => {
        const x = xOffset + index * keyWidth;
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
        key.setInteractive();
        key.on(KeyboardEvent.keyPressed, () => this.handleKeyPress(char));
        this.keys.push(key);
      });
    });
  }

  private centerKeyboard(): void {
    let minX = Math.min(...this.keys.map((key) => key.x));
    let maxX = Math.max(...this.keys.map((key) => key.x + key.width));
    let totalWidth = maxX - minX;
    this.x =
      ((this.scene.sys.game.config.width as number) - totalWidth) / 2 - minX; // Adjust container's x to center the actual used width
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
