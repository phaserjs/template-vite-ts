import { Game, GameObjects, Scene } from "phaser";
import { count, increaseMeetVisits, setIsRoomMessy } from "./helpers";

export class GoogleMeet extends Scene {
  isPicStraight: boolean;
  isClothesAway: boolean;
  isBooksShelved: boolean;
  alert: GameObjects.Image;
  success: GameObjects.Image;
  tooSlow: GameObjects.Image;
  text: GameObjects.Text;
  timedEvent: any;
  hasWon: boolean;
  constructor() {
    super("GoogleMeet");
  }

  create() {
    this.hasWon = false;
    const background = this.add.image(350, 250, "googleMeet");
    const bed = this.add.image(355, 290, "bed");
    const shelf = this.add.image(495, 280, "shelf");
    const closet = this.add.image(210, 264, "closet");
    const crooked = this.add.image(347, 233, "crooked");
    const floorBook = this.add.image(230, 325, "floorBook");
    const picturesBed = this.add.image(350, 230, "pictures-bed");
    picturesBed.setVisible(false);
    const shelfBooks = this.add.image(490, 282, "shelfBooks");
    shelfBooks.setVisible(false);
    const clothes = this.add.image(390, 298, "clothes");

    // Timer
    this.text = this.add.text(180, 160, "", { fontSize: 12 });
    this.timedEvent = this.time.delayedCall(24000, this.onEvent, [], this);

    // alert
    this.alert = this.add.image(355, 230, "alert");
    this.alert.setVisible(false);
    this.success = this.add.image(351, 243, "success");
    this.success.setVisible(false);
    this.tooSlow = this.add.image(350, 230, "tooSlow");
    this.tooSlow.setVisible(false);

    //Win conditions
    this.isPicStraight = false;
    this.isClothesAway = false;
    this.isBooksShelved = false;

    // Straighten picture
    crooked.setInteractive();
    crooked.on("pointerup", () => {
      crooked.setVisible(false);
      picturesBed.setVisible(true);
      this.isPicStraight = true;
    });

    // Move clothes
    clothes.setInteractive({ draggable: true });
    clothes.on("drag", function (pointer: any, dragX: any, dragY: any) {
      clothes.x = dragX;
      clothes.y = dragY;
    });
    clothes.on("pointerup", () => {
      if (
        this.input.x < 232 &&
        this.input.x > 187 &&
        this.input.y < 328 &&
        this.input.y > 199
      ) {
        clothes.setVisible(false);
        this.isClothesAway = true;
      }
    });

    // Move book
    floorBook.setInteractive({ draggable: true });
    floorBook.on("drag", function (pointer: any, dragX: any, dragY: any) {
      floorBook.x = dragX;
      floorBook.y = dragY;
    });
    floorBook.on("pointerup", () => {
      if (
        this.input.x < 535 &&
        this.input.x > 453 &&
        this.input.y < 353 &&
        this.input.y > 211
      ) {
        floorBook.setVisible(false);
        shelfBooks.setVisible(true);
        this.isBooksShelved = true;
      }
    });

    // Close window button
    const closeWindow = this.add.zone(152, 141, 7, 7).setOrigin(0);
    closeWindow.setInteractive({ useHandCursor: true });
    closeWindow.on("pointerup", () => {
      this.scene.stop("GoogleMeet");
    });

    // Close laptop button
    const close = this.add.rectangle(625, 45, 15, 15, 0x000000).setOrigin(0);
    const x = this.add.text(628, 45, "x").setOrigin(0);
    close.setInteractive({ useHandCursor: true });
    close.on("pointerup", () => {
      this.scene.stop("Desktop");
      this.scene.stop("GoogleMeet");
      this.scene.resume("Office");
    });
  }
  update() {
    if (!this.hasWon) {
      let countdown = ((1 - this.timedEvent.getProgress()) * 100).toFixed(0);
      this.text.setText(
        `Clean your room before someone joins the meeting! \nTime remaining: ${countdown}`
      );
    }

    if (this.isBooksShelved && this.isClothesAway && this.isPicStraight) {
      this.hasWon = true;
      increaseMeetVisits();
      this.alert.setVisible(true);
      this.success.setVisible(true);
    }
  }
  onEvent() {
    if (!this.hasWon) {
      increaseMeetVisits();
      setIsRoomMessy(true)
      this.alert.setVisible(true);
      this.tooSlow.setVisible(true);
    }
  }
}
