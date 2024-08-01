import Phaser from "phaser";
import { animateText, height, width, alignObjectsHorizontal } from "./helpers";

interface KeyContext {
  key: Phaser.Input.Keyboard.Key;
  icon: Phaser.GameObjects.Text;
  x_pos: number;
  note_zone : Phaser.GameObjects.Zone;
  meetings: Phaser.Physics.Arcade.Group;
}
const missed_meeting = ( note_zone: Phaser.GameObjects.Zone, icon: Phaser.GameObjects.Text) => {
}
export default class Calendar extends Phaser.Scene {
cols: KeyContext[];
boxes: Phaser.GameObjects.Text[];
constructor() {
    super("Calendar");
    this.cols = [];
    this.boxes = [];
}
  create() {
    //background
    this.add.image(350, 250, "bg-laptop-cal");
    if (!this.input || !this.input.keyboard) {
      console.error('Error: No keyboard found');
      return;
    }
    const top_zone = this.add.zone(0, 0, width, 200);
    let KeyCodes = Phaser.Input.Keyboard.KeyCodes;
    for (const [keyCode, str] of [ [KeyCodes.ESC, "ESC" ],
                                  [KeyCodes.A, "A"],
                                  [KeyCodes.S, "S"],
                                  [KeyCodes.D, "D"],
                                  [KeyCodes.F, "F"],
                                  [KeyCodes.SPACE, "SPACE"],
                                  [KeyCodes.SHIFT, "SHIFT"]]) {
        const index = this.cols.length;
        const x_pos = 118 + 32.5 + index * 72;
        const icon = this.add.text(x_pos, 160, str.toString(), {fontSize: 15, color: 'rgb(0,0,0)'});
        icon.setOrigin(0.5, 0.5);
        const key = this.input.keyboard.addKey(keyCode);
        const note_zone = this.add.zone(0, 200, width, 900); //todo: make narrower
        const group = this.physics.add.group();
        this.physics.add.collider(top_zone, group);
        this.cols.push({ key: key, icon: icon, x_pos: x_pos, note_zone, meetings: group });
        this.boxes.push(icon);
    }
    const s = this.cols[0].meetings.create(this.cols[0].x_pos, 300, 'very-important-meeting', 2);
    s.setVelocityY(-20);
  }
  update(): void { 
    const down_count = this.cols.filter((keyContext) => keyContext.key.isDown).length;
    this.cols.forEach((keyContext) => {
      this.keyUpdate(keyContext, down_count);
    });
  }
  keyUpdate(keyContext: KeyContext, down_count: number) {

    const key = keyContext.key ;
    const box = keyContext.icon;
    key.isDown && down_count === 1 ?  box.setColor('rgb(0,255,0)') :
      key.isDown ?  box.setColor('rgb(255,0,0)')
        : box.setColor('rgb(0 ,0,0)') ;
  }
  
}
