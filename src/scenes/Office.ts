import { Scene, GameObjects } from "phaser";
import {
  bugVisits,
  calVisits,
  changeOfficePlants,
  count,
  evaluatePlantStats,
  hasOpenedComputer,
  increaseBugVisits,
  increaseCalVisits,
  increaseClock,
  increaseMeetVisits,
  increasePlantVisits,
  meetVisits,
  PlantAction,
  PlantNames,
  plantVisits,
  setHasOpenedComputer,
  writeEndMessage,
} from "./helpers";

export class Office extends Scene {
  background: GameObjects.Image;
  plantMap: { [key: string]: { [key: number]: GameObjects.Image } };
  timestable: GameObjects.Image[];

  constructor() {
    super("Office");
  }

  create() {
    const sky = this.add.image(178 * 2, 54 * 2, "sky");
    sky.scale = 0.5;
    this.background = this.add.image(175 * 2, 125 * 2, "office");

    const emailNoti = this.sound.add('emailNoti');

    const rug = this.add.image(178 * 2, 235 * 2, "rug");
    const books = this.add.image(115 * 2, 91 * 2, "books");
    const desk = this.add.image(177 * 2, 178 * 2, "desk");
    const chair = this.add.image(211 * 2, 177 * 2, "chair");
    const laptop = this.add.image(175 * 2, 125 * 2, "laptop");
    const pots = this.add.image(212 * 2, 189, "pots");
    const pictures = this.add.image(313 * 2, 64 * 2, "pictures");
    const trash = this.add.image(60 * 2, 194 * 2, "trash");
    // Coffee
    const mug = this.add.image(140 * 2, 130 * 2, "mug");
    const peeText = this.add
      .text(540, 6, "Pee Meter", { color: "#000000", fontSize: "14px" })
      .setOrigin(0);
    const backBar = this.add.rectangle(540, 20, 150, 20, 0x000000).setOrigin(0);
    const peeBar = this.add.rectangle(543, 23, 0, 14, 0xffea00).setOrigin(0);
    peeBar.setVisible(false);
    backBar.setVisible(false);
    peeText.setVisible(false);

    // Clock
    const clock = this.add.image(80, 150, "clock");
    const nineAM = this.add.image(97, 78, "9am");
    const twelvePM = this.add.image(107, 78, "12pm");
    twelvePM.setVisible(false);
    const twoPM = this.add.image(104, 93, "2pm");
    twoPM.setVisible(false);
    const fivePM = this.add.image(103, 78, "5pm");
    fivePM.setVisible(false);
    this.timestable = [nineAM, twelvePM, twelvePM, twoPM, fivePM];

    // Plants 1
    const aloe1 = this.add.image(211 * 2, 84 * 2, "aloe1");
    const diffen1 = this.add.image(186 * 2, 79 * 2, "diffen1");
    diffen1.flipX = true;
    const poth1 = this.add.image(234 * 2, 83 * 2, "poth1");
    // Plants 2
    const aloe2 = this.add.image(211 * 2, 83 * 2, "aloe2");
    const diffen2 = this.add.image(192 * 2, 76 * 2, "diffen2");
    const poth2 = this.add.image(238 * 2, 80 * 2, "poth2");
    // Plants 3
    const aloe3 = this.add.image(212 * 2, 81 * 2, "aloe3");
    const diffen3 = this.add.image(193 * 2, 73 * 2, "diffen3");
    const poth3 = this.add.image(242 * 2, 175, "poth3");
    // Plants 4
    const aloe4 = this.add.image(423, 159, "aloe4");
    const diffen4 = this.add.image(193 * 2, 74 * 2, "diffen4");
    const poth4 = this.add.image(243 * 2, 183, "poth4");

    this.plantMap = {
      aloe: {
        "1": aloe1,
        "2": aloe2,
        "3": aloe3,
        "4": aloe4,
      },
      diffen: {
        "1": diffen1,
        "2": diffen2,
        "3": diffen3,
        "4": diffen4,
      },
      poth: {
        "1": poth1,
        "2": poth2,
        "3": poth3,
        "4": poth4,
      },
    };

    // Hide larger plants
    changeOfficePlants(this.plantMap, PlantNames.diffen);
    changeOfficePlants(this.plantMap, PlantNames.poth);
    changeOfficePlants(this.plantMap, PlantNames.aloe);

    // Plant game button
    pots.setInteractive({ useHandCursor: true });
    pots.on("pointerup", () => {
      this.scene.pause("Office");
      this.scene.launch("PlantGame");
    });

    // Coffee button
    mug.setInteractive({ useHandCursor: true });
    mug.on("pointerup", () => {
        peeBar.setVisible(true);
    backBar.setVisible(true);
    peeText.setVisible(true);
    peeBar.width +=15
    if (peeBar.width > backBar.width){
        writeEndMessage("You drank too much coffee\n\nYou aren't feeling well and have to\n\nsign off early")
        this.scene.pause("Office")
        this.scene.launch("Desktop")
        this.scene.pause("Desktop")
        this.scene.launch("GameOver")
    }
    });

    // Laptop Button
    laptop.setInteractive({ useHandCursor: true });
    laptop.on("pointerup", () => {
      this.scene.launch("Desktop");
      evaluatePlantStats();
      setHasOpenedComputer(true);
      changeOfficePlants(this.plantMap, PlantNames.diffen);
      changeOfficePlants(this.plantMap, PlantNames.poth);
      changeOfficePlants(this.plantMap, PlantNames.aloe);
      this.scene.pause("Office");
    });

    // gameover Button
    const over = this.add.rectangle(100, 100, 50, 50, 0x000000)
    over.setInteractive({ useHandCursor: true });
    over.on("pointerup", () => {
    this.scene.launch("Desktop");

      this.scene.launch("GameOver");
      this.scene.pause("Office");
    });
  }
  update() {
    if (plantVisits === 2) {
      increasePlantVisits();
      increaseClock(this.timestable);
    }
    if (calVisits === 1) {
      increaseCalVisits();
      increaseClock(this.timestable);
    }
    if (bugVisits === 1) {
      increaseBugVisits();
      increaseClock(this.timestable);
    }
    if (meetVisits === 1) {
        increaseMeetVisits();
        increaseClock(this.timestable);
      }
    if (count === 4){
        this.scene.launch("Desktop");
      this.scene.launch("GameOver");
      this.scene.pause("Office");
    }
  }
 
}
