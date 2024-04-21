import { helloWorld } from "granadalib/dist/GranadaProxy/GranadaProxy";
import { Scene } from "phaser";
import Config from "../../config";
import { images } from "../config/assets";
import { addImage, getGameScale } from "../Utils/PhaserDisplay";
import Keyboard, { KeyboardConfig } from "../Utils/Keyboard";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;

  topBar: Phaser.GameObjects.Image;
  question: Phaser.GameObjects.Image;
  submit: Phaser.GameObjects.Image;

  container: Phaser.GameObjects.Container;

  msg_text: Phaser.GameObjects.Text;

  virtualKeyboard: Keyboard;

  constructor() {
    super("Game");
  }

  create() {
    this.camera = this.cameras.main;
    this.container = this.add.container(0, 0);

    helloWorld("hey....Json");

    // this.msg_text = this.add.text(
    //   20,
    //   20,
    //   "Make something fun!\nand share it with us:\nsupport@phaser.io",
    //   {
    //     fontFamily: Config.fonts.PoetsenOne,
    //     fontSize: 38,
    //     color: "#ffffff",
    //     stroke: "#000000",
    //     strokeThickness: 8,
    //     align: "center",
    //   }
    // );
    // this.msg_text.setOrigin(0.5);

    this.topBar = addImage(
      0,
      30,
      images.topBar.key,
      this.container,
      Config,
      true
    );

    this.question = addImage(
      0,
      100,
      images.questions.key,
      this.container,
      Config,
      true
    );

    this.submit = addImage(
      0,
      Config.size.y - 80,
      images.submit.key,
      this.container,
      Config,
      true
    );

    const keyboardConfig: KeyboardConfig = {
      font: Config.fonts.PoetsenOne,
      fontSize: 38,
      maxWidth: window.innerWidth,
    };

    this.virtualKeyboard = new Keyboard(this, keyboardConfig);
    this.virtualKeyboard.y = getGameScale(this, Config) * Config.size.y - 360;
    console.log(this.virtualKeyboard.width);

    this.virtualKeyboard.onKeyPress((char) => {
      console.log(`Character ${char} was pressed.`);
    });
  }
}
