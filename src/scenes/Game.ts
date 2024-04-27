import { Scene } from "phaser";
import Config from "../config/config";
import {
  addImage,
  createSceneContainer,
} from "../GranadaLib/display/PhaserDisplay";
import LabeledImageGrid, { GridConfig } from "../gameObjects/LabeledImageGrid";
import Keyboard, {
  GranadaKeyboardEvents,
  KeyboardConfig,
} from "../GranadaLib/input/Keyboard";
import { QuestionType } from "../types";
import { images } from "../config/assets";

import WordCompleteModal from "../gameObjects/WordCompleteModal";
import WelcomeModal from "../gameObjects/WelcomeModal";
import { createConfetti } from "../GranadaLib/display/createConfetti";
import { AudioFiles } from "../Audio";

export const gridConfig: GridConfig = {
  rows: 5,
  cols: 5,
  xPadding: 16,
  yPadding: 16,
};

export const keyboardConfig: KeyboardConfig = {
  font: "Poppins",
  fontSize: 20,
  color: "#000000",
  padding: 16,
};

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

  welcomeModal: WelcomeModal | null = null;
  completeModal: WordCompleteModal | null = null;

  confetti: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor() {
    super("Game");
  }

  create() {
    const music = this.sound.add(AudioFiles.name);
    music.play();

    this.camera = this.cameras.main;
    this.container = createSceneContainer(this);

    this.confetti = createConfetti(this);
    this.container.add(this.confetti);

    this.questionData = {
      question: "I have a face but no eyes, hands but no arms. What am I?",
      answer: "clock",
    };

    this.topBar = addImage(0, 43, images.topBar.key, this.container);
    this.question = addImage(20, 107, images.questions.key, this.container);

    this.submit = addImage(124, 676, images.submit.key, this.container);
    this.submit.setInteractive();
    this.submit.on("pointerdown", this.checkAnswer, this.container);

    this.resetHistory();

    this.labeleldImageGrid = new LabeledImageGrid(
      this,
      64,
      277,
      images.letter.key,
      gridConfig
    );
    this.container.add(this.labeleldImageGrid);

    this.labeleldImageGrid.setSelected(
      this.currentRowIndex,
      this.currentColIndex
    );

    this.virtualKeyboard = new Keyboard(this, keyboardConfig, Config);
    this.virtualKeyboard.y = 560;
    this.container.add(this.virtualKeyboard);

    this.virtualKeyboard.on(GranadaKeyboardEvents.DELETE, () => {
      this.attemptHistory[this.currentRowIndex][this.currentColIndex] = "";
      this.labeleldImageGrid.setLabelText(
        this.currentRowIndex,
        this.currentColIndex,
        ""
      );

      this.currentColIndex = Math.max(this.currentColIndex - 1, 0);

      this.labeleldImageGrid.setSelected(
        this.currentRowIndex,
        this.currentColIndex
      );
    });

    this.virtualKeyboard.on(
      GranadaKeyboardEvents.POINTER_DOWN,
      (char: string) => {
        this.attemptHistory[this.currentRowIndex][this.currentColIndex] = char;
        this.labeleldImageGrid.setLabelText(
          this.currentRowIndex,
          this.currentColIndex,
          char
        );

        this.currentColIndex = Math.min(
          this.currentColIndex + 1,
          gridConfig.cols - 1
        );

        this.labeleldImageGrid.setSelected(
          this.currentRowIndex,
          this.currentColIndex
        );
      }
    );

    this.welcomeModal = new WelcomeModal(this, 0, 0, () => {
      this.welcomeModal!.destroy();
      this.welcomeModal = null;
    });

    this.add.existing(this.welcomeModal);
  }

  resetHistory = () => {
    Array.from({ length: gridConfig.rows }, () => []);
    for (let i = 0; i < gridConfig.rows; i++) {
      this.attemptHistory[i] = new Array(gridConfig.cols).fill("");
    }
  };

  checkAnswer = () => {
    if (this.welcomeModal) {
      return;
    }

    const answer = this.attemptHistory[this.currentRowIndex]
      .join("")
      .toLowerCase();
    if (answer.length < this.questionData.answer.length) {
      return;
    }

    if (answer === this.questionData.answer) {
      console.log("Correct Answer");
      this.confetti.start();
      this.setAnswers();
      this.fadeOutElements();
      this.labeleldImageGrid.resetFilters();
      this.completeModal = new WordCompleteModal(this, 0, 0, () => {
        this.completeModal!.destroy();
        this.completeModal = null;
        this.scene.start(Config.pages.GameOver);
      });
      this.add.existing(this.completeModal);
    } else {
      console.log("Incorrect Answer");
      this.setAnswers();

      if (this.currentRowIndex >= gridConfig.rows - 1) {
        this.currentRowIndex = 0;
        this.resetHistory();
        this.labeleldImageGrid.reset();
      } else {
        this.currentRowIndex += 1;
      }

      this.currentColIndex = 0;
      this.labeleldImageGrid.setSelected(
        this.currentRowIndex,
        this.currentColIndex
      );
    }
  };

  private fadeOutElements = () => {
    this.tweens.add({
      targets: [this.topBar, this.question, this.submit, this.virtualKeyboard],
      alpha: 0,
      duration: 1000,
      ease: "Linear",
      repeat: 0,
      yoyo: false,
    });
  };

  private setAnswers = () => {
    this.labeleldImageGrid.setAnswers(
      this.currentRowIndex,
      this.attemptHistory[this.currentRowIndex],
      this.questionData.answer
    );
  };
}
