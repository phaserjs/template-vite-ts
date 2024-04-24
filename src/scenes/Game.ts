import { Scene } from "phaser";
import Config from "../config/config";
import { helloWorld } from "../GranadaLib/GranadaProxy/GranadaProxy";
import { addImage } from "../GranadaLib/display/PhaserDisplay";
import LabeledImageGrid, { GridConfig } from "../gameObjects/LabeledImageGrid";
import Keyboard, { KeyboardConfig } from "../GranadaLib/input/Keyboard";
import { QuestionType } from "../types";
import { images } from "../config/assets";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;

  topBar: Phaser.GameObjects.Image;
  question: Phaser.GameObjects.Image;
  submit: Phaser.GameObjects.Image;

  container: Phaser.GameObjects.Container;

  labeleldImageGrid: LabeledImageGrid;

  virtualKeyboard: Keyboard;

  questionData: QuestionType;

  currentRowIndex: number = 0;
  currentColIndex: number = 0;
  attemptHistory: string[][] = [];

  constructor() {
    super("Game");
  }

  create() {
    this.camera = this.cameras.main;
    this.container = this.add.container(0, 0);

    this.questionData = {
      question: "I have a face but no eyes, hands but no arms. What am I?",
      answer: "clock",
    };

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
      window.innerHeight * 0.01,
      images.topBar.key,
      this.container,
      Config,
      true
    );

    this.question = addImage(
      0,
      window.innerHeight * 0.15,
      images.questions.key,
      this.container,
      Config,
      true
    );

    this.submit = addImage(
      0,
      window.innerHeight * 0.9,
      images.submit.key,
      this.container,
      Config,
      true
    );

    const gridConfig: GridConfig = {
      rows: 5,
      cols: 5,
      xPadding: 10,
      yPadding: 10,
    };

    this.attemptHistory = Array.from({ length: gridConfig.rows }, () => []);
    for (let i = 0; i < gridConfig.rows; i++) {
      this.attemptHistory[i] = new Array(gridConfig.cols).fill("");
    }

    console.log(this.attemptHistory);

    this.labeleldImageGrid = new LabeledImageGrid(
      this,
      0,
      200,
      images.letter.key,
      gridConfig,
      Config
    );

    this.labeleldImageGrid.x =
      window.innerWidth / 2 - this.labeleldImageGrid.width / 2;

    const keyboardConfig: KeyboardConfig = {
      font: Config.fonts.PoetsenOne,
      fontSize: 38,
      color: "#000000",
      keyHeight: 40,
    };

    this.virtualKeyboard = new Keyboard(this, keyboardConfig, Config);
    this.virtualKeyboard.y = window.innerHeight * 0.6;

    this.virtualKeyboard.on(
      Phaser.Input.Events.POINTER_DOWN,
      (char: string) => {
        this.attemptHistory[this.currentRowIndex][this.currentColIndex] = char;
        this.labeleldImageGrid.setLabelText(
          this.currentRowIndex,
          this.currentColIndex,
          char
        );
        this.currentRowIndex = Math.min(
          this.currentRowIndex + 1,
          gridConfig.cols - 1
        );

        console.log(`Character ${char} was pressed.`);
      }
    );
  }
}
