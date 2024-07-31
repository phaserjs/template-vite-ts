import Phaser from "phaser";

export default class BugFist extends Phaser.Scene {
fist: Phaser.Types.Physics.Arcade.ImageWithDynamicBody | undefined
space: any;
constructor() {
    super("BugFist");
  }

  create() {

    //background
    this.add.image(350, 250, "panel");
    //fist
    this.fist = this.physics.add.image(0, 0, 'big-fist')
    //fist physics
    this.fist.setVelocity(400, 0)
    this.fist.setBounce(1, 0)
	  this.fist.setCollideWorldBounds(true)
    // key objects
    this.space = this.input.keyboard?.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
      );
    

    // Resume Scene Button
    const ResumeButton = this.add.text(100, 100, "Resume Scene", {color: '000000'});
    ResumeButton.setInteractive();
    // ResumeButton.on("pointerdown", () => {
    //   this.scene.resume("ElevatorScene");
    //   this.scene.stop();
    // });
  }
  update(): void {
    if (this.space.isDown){
        this.fist?.setVelocity(0, 600);
    }
    else if (this.fist?.y && this.fist.y > 42){
        this.fist?.setVelocity(0, -600);
    }else if (this.fist?.body.velocity.x == 0){
        this.fist?.setVelocity(400, 0);
    }
  }
}
