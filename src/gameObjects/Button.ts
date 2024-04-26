import { Scene } from "phaser";
import Config from "../config/config";
import { addImage, addText } from "../GranadaLib/display/PhaserDisplay";

export default class Button extends Phaser.GameObjects.Container {
  constructor(
    scene: Scene,
    x: number,
    y: number,
    text: string,
    callback: () => void
  ) {
    super(scene, x, y);

    const bg = addImage(0, 0, Config.images.button.key, this);
    bg.setOrigin(0);
    bg.setInteractive();
    bg.on("pointerup", callback);

    const label = addText(
      bg.width / 2,
      bg.height / 2,
      Config.fonts.PoetsenOne,
      24,
      this,
      "#fff",
      text
    );
    label.setOrigin(0.5);
  }
}
