import { Scene } from "phaser";

export class Desktop extends Scene {
  constructor() {
    super("Desktop");
  }

  create() {
    const meetSound = this.sound.add("meetSound")
    
    const laptop = this.add.image(350, 250, "bg-laptop");
    const desktop = this.add.image(351, 244, "desktop");
    const gcal = this.add.image(570, 170, "gcal");
    const vscode = this.add.image(570, 120, "vscode");
    const meet = this.add.image(575, 220, "meet");
    const leaf = this.add.image(570, 265, "leaf");
    leaf.setScale(1.5).setAngle(45)

     // bug game button
     vscode.setInteractive({ useHandCursor: true });
     vscode.on("pointerup", () => {
       this.scene.launch("Laptop");
       this.scene.pause("Desktop");
     });

     // google meet game button
     meet.setInteractive({ useHandCursor: true });
     meet.on("pointerdown", () => {
        meetSound.play()
      });
     
     meet.on("pointerup", () => {
        this.scene.launch("GoogleMeet");
      });
     

     // gcal game button
     gcal.setInteractive({ useHandCursor: true });
     gcal.on("pointerup", () => {
       this.scene.launch("Calendar");
       this.scene.pause("Desktop");
     });

     // plant lady game button
     leaf.setInteractive({ useHandCursor: true });
     leaf.on("pointerup", () => {
       this.scene.launch("PlantLady");
     });

     // Close button
    const close = this.add.rectangle(625, 45, 15, 15, 0x000000).setOrigin(0);
    const x = this.add.text(628, 45, "x").setOrigin(0);
    close.setInteractive({ useHandCursor: true });
    close.on("pointerup", () => {
      this.scene.stop("Desktop");
      this.scene.stop("Laptop");
      this.scene.resume("Office");
    });
  }
}
