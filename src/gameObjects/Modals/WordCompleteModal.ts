import { Scene } from "phaser";
import Config from "../../config/working-config";
import SpinningWheel from "../../GranadaLib/GameObjects/SpinningWheel";
import { addText } from "../../GranadaLib/Display/PhaserDisplay";
import Button from "../../GranadaLib/GameObjects/GranadaButton";
import AbstractScaledContainer from "../../GranadaLib/Display/AbstractScaledContainer";

export default class WordCompleteModal extends AbstractScaledContainer {
  private panelBg: Phaser.GameObjects.Image;
  private wheel: SpinningWheel;
  private heading: Phaser.GameObjects.Text;
  private btnPlay: Button;
  private onClose: () => void;

  constructor(scene: Scene, x: number, y: number, onClose: () => void) {
    super(scene, x, y);

    this.onClose = onClose;

    this.wheel = new SpinningWheel(scene, Config.images.wheel.key, 0x000, 0.5);
    scene.add.existing(this.wheel);
    this.wheel.alpha = 0;

    this.panelBg = scene.make.image({
      x: Config.size.x / 2,
      y: Config.size.y / 2,
      key: Config.images.completeSplash.key,
    });
    this.panelBg.setOrigin(0.5);
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
    this.wheel.alpha = 0;

    scene.tweens.add({
      targets: [this.wheel, this.panelBg],
      alpha: 1,
      duration: 1000,
      ease: Phaser.Math.Easing.Cubic.Out,
      repeat: 0,
      yoyo: false,
      delay: 3400,
    });

    scene.tweens.add({
      targets: [this],
      alpha: 1,
      duration: 1000,
      ease: Phaser.Math.Easing.Cubic.Out,
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
