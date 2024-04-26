import { Scene } from "phaser";
import Config from "../config/config";
import SpinningWheel from "./SpinningWheel";
import { addText } from "../GranadaLib/display/PhaserDisplay";
import Button from "./Button";

export default class WelcomeModal extends Phaser.GameObjects.Container {
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
      x: 0,
      y: 246,
      key: Config.images.welcomeSplash.key,
    });
    this.panelBg.setOrigin(0);
    this.add(this.panelBg);

    this.heading = addText(
      Config.size.x / 2,
      288,
      Config.fonts.PoetsenOne,
      24,
      this,
      "#000",
      "WELCOME TO!"
    );
    this.heading.setOrigin(0.5, 0);

    this.btnPlay = new Button(scene, 105, 501, "Play", () => this.handlePlay());
    this.add(this.btnPlay);
  }

  public handlePlay() {
    this.btnPlay.disableInteractive();
    this.scene.tweens.add({
      targets: [this],
      duration: 1000,
      ease: "Linear",
      repeat: 0,
      alpha: 0,
      onComplete: () => {
        this.onClose();
      },
    });
  }
}
