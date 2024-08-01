import { Scene } from "phaser";

export class Preloader extends Scene {
  music: any;
  constructor() {
    super("Preloader");
  }

  preload() {
    //  Load the assets for the game - Replace with your own assets
    this.load.setPath("assets");

    // Sounds
    this.load.audio("music", "sounds/music.mp3");
    this.load.audio("emailNoti", "sounds/slackNoti.mp3");
    this.load.audio("meetSound", "sounds/meetSound.mp3");

    // Game Over
    this.load.image("GameOver", "backgrounds/GameOver.png");
    this.load.image("creditsButton", "creditsButton.png");
    // Welcome Background
    this.load.image(
      "start-screen",
      "backgrounds/welcome-screen-background.png"
    );

    // Welcome Sprites
    this.load.image("unionBug", "union-bug.png");
    this.load.image("arrow", "sprites/arrow.png");
    this.load.image("credits", "sprites/credits-text.png");
    this.load.image("room-3d", "sprites/room-3d.png");
    this.load.image("start", "sprites/start-text.png");
    this.load.image("title", "sprites/title-text.png");

    // Credits Background
    this.load.image("credits-bg", "backgrounds/credits-background.png");

    // Credits Sprites
    this.load.spritesheet("fire", "fire-frames.png", {frameWidth: 153, frameHeight: 79});


    // Office Backgrounds
    this.load.image("sky", "backgrounds/sky.png");
    this.load.image("office", "backgrounds/office.png");

    // Office Sprites
    this.load.image("chair", "chair.png");
    this.load.image("laptop", "laptop.png");
    this.load.image("rug", "rug.png");
    this.load.image("mug", "mug.png");
    this.load.image("desk", "desk.png");
    this.load.image("books", "books.png");
    this.load.image("pots", "pots.png");
    this.load.image("trash", "trash.png");
    this.load.image("pictures", "pictures.png");
    this.load.image("diffen1", "diffen1.png");
    this.load.image("diffen2", "diffen2.png");
    this.load.image("diffen3", "diffen3.png");
    this.load.image("diffen4", "diffen4.png");
    this.load.image("aloe1", "aloe1.png");
    this.load.image("aloe2", "aloe2.png");
    this.load.image("aloe3", "aloe3.png");
    this.load.image("aloe4", "aloe4.png");
    this.load.image("poth1", "poth1.png");
    this.load.image("poth2", "poth2.png");
    this.load.image("poth3", "poth3.png");
    this.load.image("poth4", "poth4.png");
    this.load.image("clock", "clock.png");
    this.load.image("sun", "sun.png");
    this.load.image("2pm", "2pm.png");
    this.load.image("9am", "9am.png");
    this.load.image("12pm", "12pm.png");
    this.load.image("5pm", "5pm.png");

    // Laptop Overlays
    this.load.image("bg-laptop", "backgrounds/laptop.png");
    this.load.image("plantlady", "backgrounds/plantlady.png");
    this.load.image("desktop", "backgrounds/desktop.png");
    this.load.image("alert", "backgrounds/alert.png");
    this.load.image("googleMeet", "backgrounds/googleMeet.png");

    // Laptop Sprites
    this.load.image("big-fist", "sprites/big-fist.png");
    this.load.image("small-fist", "sprites/small-fist.png");
    this.load.image("fly", "sprites/fly.png");
    this.load.image("slack-box", "sprites/slack-box.png");
    this.load.image("textbox", "sprites/textbox.png");
    this.load.image("vscode", "vscode.png");
    this.load.image("gcal", "gcal.png");
    this.load.image("aloe-text", "aloe-text.png");
    this.load.image("diffen-text", "diffen-text.png");
    this.load.image("poth-text", "poth-text.png");
    this.load.image("plant-text", "plant-text.png");
    this.load.image("block", "block.png");
    this.load.image("left-arrow", "left-arrow.png");
    this.load.image("right-arrow", "right-arrow.png");
    this.load.image("bed", "bed.png");
    this.load.image("closet", "closet.png");
    this.load.image("clothes", "clothes.png");
    this.load.image("crooked", "crooked.png");
    this.load.image("floorBook", "floorBook.png");
    this.load.image("pictures-bed", "pictures-bed.png");
    this.load.image("shelf", "shelf.png");
    this.load.image("shelfBooks", "shelfBooks.png");
    this.load.image("success", "success.png");
    this.load.image("tooSlow", "tooSlow.png");
    this.load.image("meet", "meet.png");
    this.load.image("leaf", "leaf.png");

    // Overlays
    this.load.image("bg-laptop", "backgrounds/laptop.png");
    this.load.image("cal-overlay", "backgrounds/cal-overlay.png");
    this.load.spritesheet(
      "very-important-meeting",
      "sprites/very-important-meeting.png",
      { frameWidth: 72, frameHeight: 36 }
    );
    this.load.spritesheet("ticker", "sprites/ticker-sheet.png", {
      frameWidth: 74,
      frameHeight: 9,
    });

    // Plant Game Sprites
    this.load.image("textbox2", "textbox.png");
    this.load.image("bigDiffen1", "plants/diffen1.png");
    this.load.image("bigDiffen2", "plants/diffen2.png");
    this.load.image("bigDiffen3", "plants/diffen3.png");
    this.load.image("bigDiffen4", "plants/diffen4.png");
    this.load.image("bigAloe1", "plants/aloe1.png");
    this.load.image("bigAloe2", "plants/aloe2.png");
    this.load.image("bigAloe3", "plants/aloe3.png");
    this.load.image("bigAloe4", "plants/aloe4.png");
    this.load.image("bigPoth1", "plants/poth1.png");
    this.load.image("bigPoth2", "plants/poth2.png");
    this.load.image("bigPoth3", "plants/poth3.png");
    this.load.image("bigPoth4", "plants/poth4.png");

    // Plant Game Overlays
    this.load.image("plantGame", "backgrounds/plantGame.png");
  }
  create() {
    this.add.image(350, 250, "welcome-background");
    this.music = this.sound.add("music");
    this.music?.play({
      mute: false,
      volume: 0.35,
      loop: true,
    });
    this.scene.start("Welcome", {
      music: this.music,
    });
  }
}
