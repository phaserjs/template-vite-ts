import { Scene } from "phaser";
import Config from "../config/config";
import SpinningWheel from "./SpinningWheel";
import { addText } from "../GranadaLib/display/PhaserDisplay";
import Button from "./Button";

export default class WordCompleteModal extends Phaser.GameObjects.Container {
  private panelBg: Phaser.GameObjects.Image;
  private wheel: SpinningWheel;
  private heading: Phaser.GameObjects.Text;
  private btnPlay: Button;
  private onClose: () => void;

  constructor(scene: Scene, x: number, y: number, onClose: () => void) {
    super(scene, x, y);

    this.onClose = onClose;

    this.wheel = new SpinningWheel(scene, Config.size.x / 2, Config.size.y / 2);
    this.add(this.wheel);

    this.panelBg = scene.make.image({
      x: 26,
      y: 206,
      key: Config.images.completeSplash.key,
    });
    this.panelBg.setOrigin(0);
    this.add(this.panelBg);

    this.heading = addText(
      Config.size.x / 2,
      278,
      Config.fonts.PoetsenOne,
      24,
      this,
      "#000",
      "NICE JOB!"
    );
    this.heading.setOrigin(0.5, 0);

    this.btnPlay = new Button(scene, 105, 600, "CONTINUE", () =>
      this.handlePlay()
    );
    this.add(this.btnPlay);

    this.alpha = 0;

    scene.tweens.add({
      targets: [this],
      alpha: 1,
      duration: 700,
      ease: "Linear",
      repeat: 0,
      yoyo: false,
      delay: 3000,
    });
  }

  public handlePlay() {
    this.btnPlay.disableInteractive();
    this.onClose();
  }
}
