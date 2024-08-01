import { Scene } from "phaser";
import { currentPlant, evaluatePlantStats, plantHealthMap, PlantNames, plantStats } from "./helpers";

export class PlantHealth extends Scene {
  constructor() {
    super("PlantHealth");
  }

  create() {
    

    // Textbox
    let plantName = currentPlant;
    let health = plantStats[plantName].health;
    const textbox = this.add.image(350, 80, "textbox2");
    this.add
      .text(220, 40, `${plantStats[currentPlant].name}`, {
        fontSize: 14,
        color: "#000000",
        align: "center",
      })
      .setOrigin(0);
    this.add
      .text(485, 40, `Health: ${plantStats[currentPlant].health}`, {
        fontSize: 14,
        color: "#000000",
        align: "center",
      })
      .setOrigin(1, 0);
    this.add
      .text(220, 65, `Water`, {
        fontSize: 14,
        color: "#000000",
        align: "center",
      })
      .setOrigin(0);
    this.add
      .text(220, 90, `Sunlight`, {
        fontSize: 14,
        color: "#000000",
        align: "center",
      })
      .setOrigin(0);

    // Water Slider
    const sliderW = this.add.container(395, 73);

    const barW = this.add.rectangle(0, 0, 180, 3, 0x000000);
    const controlW = this.add.rectangle(plantStats[currentPlant].water, 0, 6, 15, 0x097969);

    sliderW.add([barW, controlW]);

    controlW.setInteractive({ draggable: true });

    controlW.on("drag", function (pointer: any, dragX: any, dragY: any) {
      controlW.x = Phaser.Math.Clamp(dragX, -90, 90);
      plantStats[currentPlant].water = controlW.x
    });

    sliderW.setSize(400, 32);


    // Sunlight Slider
    const sliderS = this.add.container(395, 97);

    const barS = this.add.rectangle(0, 0, 180, 3, 0x000000);
    const controlS = this.add.rectangle(plantStats[currentPlant].sunlight, 0, 6, 15, 0x097969);

    sliderS.add([barS, controlS]);

    controlS.setInteractive({ draggable: true });

    controlS.on("drag", function (pointer: any, dragX: any, dragY: any) {
      controlS.x = Phaser.Math.Clamp(dragX, -90, 90);
      plantStats[currentPlant].sunlight = controlS.x
    });

    sliderS.setSize(400, 32);
  }
}
