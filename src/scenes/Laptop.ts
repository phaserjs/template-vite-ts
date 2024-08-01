import Phaser from "phaser";
import { animateText, increaseBugVisits, setIsBugsSquished } from "./helpers";
// const phrases = ["SQUASHED!!", "SPLATTED!!", "DESTROYED!!", "Kiiiiiiilled", "Die tree killer!!", "EAT FIST", "GET MUSHED"]
export default class Laptop extends Phaser.Scene {
fist: Phaser.Types.Physics.Arcade.ImageWithDynamicBody | undefined
charge: number;
space: any;
playerImageKey: any;
punching: boolean;
bugs: number;
squash_power: number;
word_slam: Phaser.GameObjects.Text | undefined;
word: number;
constructor() {
    super("Laptop");
    this.charge = 0;
    this.punching = true;
    this.bugs = 0;
    this.squash_power = 1;
    this.word = 0;
}
init(data: any) {
  this.playerImageKey = data.playerImageKey;

}
  create() {

    const background = this.add.rectangle(350, 250, 533, 370, 0x000000)
    let text = this.add.text(
      105,
      80,
      "System Malfunction!! Hit 'Space' to squash some \
      \ninvasive species.",
      { color: "#0BDA51", fontSize: "14px" }
    );
    animateText(text);
    // this.word_slam = this.add.text(
    //   105,
    //   180,
    //   "",
    //   { color: "#FFFFFF", fontSize: "24px" }
    // );
    let fly_facts = this.add.text(
      105,
      150,
      "The Spotted Lanternfly (SLF) is an invasive planthopper,\
      \nfirst discovered in New York City in July 2020. While it can infest trees,\
      \nit is not considered a widespread threat to our city’s forests.\
      \nHowever, it is a significant threat to a wide range of agricultural\
      \ncrops including walnut, grapes, hops, apples, blueberries, and stone fruits.\
      \n\nSLF adults are very colorful when their wings are displayed during hopping.\
      \nThey have red hind wings with black spots, have a black head, and a yellow\
      \nabdomen with black bands. Their grayish forewings have black spots with a\
      \ndistinctive black brick-like pattern on the tips.\
      \n\nWhile these insects can jump and fly short distances, they spread mainly\
      \nthrough human activity. SLF can lay their eggs on any number of surfaces,\
      \nsuch as vehicles, stone, rusty metal, outdoor furniture, and firewood.\
      \nAdult SLF can hitch rides in vehicles, on any outdoor item, or cling to\
      \nclothing or hats, and be easily transported into and throughout New York.",
      { color: "#0BDA51", fontSize: "10px" }
    );
    animateText(fly_facts);

    //fist
    this.fist = this.physics.add.image(0, -170, 'big-fist')
    //fist physics
    this.fist.setVelocity(400, 0)
    this.fist.setBounce(1, 0)

    //fist bounds
    const left_zone = this.add.zone(-30, 0, 100, 1000);
    this.physics.world.enable(left_zone, 1);
    const right_zone = this.add.zone(680, 0, 10, 1000);
    this.physics.world.enable(right_zone, 1);
    const bottom_zone = this.add.zone(0, 500, 10000, 100);
    this.physics.world.enable(bottom_zone, 1);
    const top_zone = this.add.zone(0, -440, 10000, 100);
    this.physics.world.enable(top_zone, 1);
    this.physics.add.collider(this.fist, left_zone);
    this.physics.add.collider(this.fist, right_zone);
    this.physics.add.collider(this.fist, bottom_zone, () => {  
      this.fist?.setVelocity(0, -600);
      this.punching = false;
    });
    this.physics.add.overlap(this.fist, top_zone);

    //bug bounds
    const bug_zones: { [name: string]: any }  =  {
      "left": this.add.zone(30, 0, 100, 1000),
      "right": this.add.zone(620, 0, 10, 1000),
      "bottom": this.add.zone(0, 480, 10000, 100),
      "top": this.add.zone(0, 25, 10000, 100)
    };
    for (const k in bug_zones){
      this.physics.world.enable(bug_zones[k], 1);
    }

    //bugs 
    const blockGroup = this.physics.add.group();
    for (let row = 0; row < 5; row++) {
      for (let i = 0; i < 7; i++) {
        if (Math.random() > .6) {
          blockGroup.create((130 + i * 90) % 620, 150 + 65 * row, "fly");
          this.bugs += 1;
      }}
        
    }
    blockGroup.setVelocity(100,100);
    blockGroup.scaleXY(1.5,1.5);

    for (const block of blockGroup.getChildren()) {
      const body = <Phaser.Physics.Arcade.Body> block.body;
      this.physics.add.existing(block);
      body.setBounce(1.1,1.1);
      body.setMaxVelocity(200 + Math.random() * 300)
      for (const k in bug_zones){
        this.physics.add.collider(bug_zones[k], block);
      }
      body.setAcceleration(Math.random() * 20, Math.random() * 200);
      this.physics.add.collider(this.fist, block, () => {
        if (this.punching){
          block.destroy();
          this.bugs+= -1;
          this.squash_power+= -1;
          if (this.squash_power < 1){
            this.fist?.setVelocity(0, -600);
            this.punching = false;
            // this.word += (this.word + 1) % phrases.length;
            // this.word_slam?.setText(phrases[this.word]);
            // this.word_slam?.updateText();
            // //animateText(this.word_slam);
          }
        }
      });
    }

    // key objects
    this.space = this.input?.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

     // Close button
     const close = this.add.rectangle(625, 45, 15, 15, 0x000000).setOrigin(0);
     const x = this.add.text(628, 45, "x").setOrigin(0);
     close.setInteractive({ useHandCursor: true });
     close.on("pointerup", () => {
      increaseBugVisits()
       this.scene.stop("Desktop");
       this.scene.stop("Laptop");
       this.scene.resume("Office");
     });

  }
  update(): void {
    if (this.space.isDown){
      this.punching = false;
      this.squash_power = 1 + Math.floor(this.charge/60)
      if (this.charge < 301){
        this.charge += 1;
        this.fist?.setVelocity(0, 0);
        this.fist?.setScale(1, 1 - this.charge/600)
      } else {
        this.fist?.setVelocity(0, 0);
      }
    } else if (this.charge != 0){
      this.fist?.setVelocity(0, (this.charge) ** 2);
      //this.fist?.setAccelerationY(-2);
      this.charge = 0
      this.punching = true;
      this.fist?.setScale(1,1)
    } 
    else if (this.fist?.body.touching.up && !this.punching){
      this.fist?.setVelocity(400, 0);
      this.fist?.setScale(1,1)
      this.fist?.setPosition(this.fist.x, -150);      
    }
    if (this.bugs < 1){
      this.fist?.destroy();
      setIsBugsSquished(true)
      this.scene.stop();

    }
  }
}
