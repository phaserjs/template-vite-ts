import Phaser from "phaser";
import { width } from "./helpers";

interface ColumnContext {
  key: Phaser.Input.Keyboard.Key;
  icon: Phaser.GameObjects.Text;
  x_pos: number;
  miss_zone : Phaser.Physics.Arcade.StaticBody;
  hit_zone : Phaser.Physics.Arcade.Sprite;

  meetings: Phaser.Physics.Arcade.Sprite[];
}
// Beat map: column, time, velocity
const BeatMap = [
  [1, 0, 50],
  [1, 4000, 50],
  [1, 8000, 50],
  [2, 10000, 50],
  [1, 12000, 50],
  [2, 13000, 50],
  [1, 14000, 50],
  [1, 15000, 50],
  [1, 16000, 50],
  [2, 17000, 50],
  [3, 19000, 70],
  [3, 20000, 70],
  [2, 21000, 70],
  [3, 21500, 70],
  [3, 22000, 70],
  [2, 22500, 70],
  [3, 23000, 70],
  [3, 24500, 70],
  [1, 26000, 70],
  [3, 27000, 70],
  [3, 28000, 70],
  [1, 29000, 70],
  [2, 30000, 70],
  [3, 31000, 70],
  [1, 32000, 70]






  // [3, 13000, 50],
  // [3, 16000, 50],
  // [4, 8000, 50],
  // [5, 2000, 50],
  // [5, 4000, 50],
  // [5, 16000, 50],
  // [6, 16000, 50],
];
function missed_meeting_collision_callback_factory(col: ColumnContext, meeting: Phaser.Physics.Arcade.Sprite) {
  return ( ) => {
    if (!meeting.active) {return;}
    console.log('missed meeting');
    meeting.setVelocityY(0);
    meeting.setFrame(0);
    meeting.setActive(false);
    col.miss_zone.setSize(col.miss_zone.width, col.miss_zone.height + meeting.height);
    col.hit_zone.setPosition(col.hit_zone.x, col.hit_zone.y + meeting.height);
    meeting.body?.destroy();
  }
}

export default class Calendar extends Phaser.Scene {
cols: ColumnContext[];
boxes: Phaser.GameObjects.Text[];
constructor() {
    super("Calendar");
    this.cols = [];
    this.boxes = [];
}
  create() {
    //background
    this.add.image(350, 250, "cal-overlay");
    if (!this.input || !this.input.keyboard) {
      console.error('Error: No keyboard found');
      return;
    }
    // helpers & constants
    const x_posistions = [150.5, 222.5, 294, 364, 434, 504, 576];
    const spawn_meeting_for_col = (col: ColumnContext, velocity: number) => {
      const s = this.physics.add.sprite(col.x_pos, 400, 'very-important-meeting', 2);
      s.setVelocityY(velocity * -1);
      this.physics.add.collider(col.miss_zone as unknown as Phaser.Physics.Arcade.Sprite, s, missed_meeting_collision_callback_factory(col, s));
      col.meetings.push(s);
    }
    const spawn_meeting_for_index = (index: integer, velocity: number = 20) => {
      spawn_meeting_for_col(this.cols[index], velocity);
    }
    let KeyCodes = Phaser.Input.Keyboard.KeyCodes;
    for (const [keyCode, str] of [ [KeyCodes.ESC, "ESC" ],
                                  [KeyCodes.A, "A"],
                                  [KeyCodes.S, "S"],
                                  [KeyCodes.D, "D"],
                                  [KeyCodes.F, "F"],
                                  [KeyCodes.SPACE, "SPACE"],
                                  [KeyCodes.SHIFT, "SHIFT"]]) {
        const index = this.cols.length;
        const icon = this.add.text(x_posistions[index], 380, str.toString(), {fontSize: 12, color: 'rgb(0,0,0)'});
        icon.setOrigin(0.5, 0.5);
        const key = this.input.keyboard.addKey(keyCode);
        const miss_zone = this.physics.add.staticBody(0, 0, width, 158);
        const hit_zone = this.physics.add.sprite(x_posistions[index], 156, 'ticker', 0,);
        hit_zone.setOrigin(0.5, 0);
        hit_zone.setDepth(1);
        icon.setDepth(2);
        // miss_zone.setOrigin(0, 0);
        // this.physics.world.enableBody(miss_zone); 
        // miss_zone.body.setStatic(true);
        this.cols.push({ key: key, icon: icon, x_pos: x_posistions[index], miss_zone, hit_zone, meetings: [] });
        this.boxes.push(icon);
    }
    for (const [index, delay, velocity] of BeatMap) {
      this.time.addEvent({delay: delay, callback: () => {spawn_meeting_for_index(index, velocity)}});
    }
    


  }
  update(): void { 
    const down_count = this.cols.filter((keyContext) => keyContext.key.isDown).length;
    this.cols.forEach((c) => c.hit_zone.setVisible(false));

    this.cols.reduce((prev: ColumnContext, curent: ColumnContext) => {
      const dist = (c: ColumnContext) => (c.meetings.filter((meeting) => meeting.active)[0]?.y || Infinity) - c.hit_zone.y;
      return dist(curent) < dist(prev) ? curent : prev;
    }).hit_zone?.setVisible(true);

    this.cols.forEach((keyContext) => {
      this.keyUpdate(keyContext, down_count);
    });
  }
  keyUpdate(keyContext: ColumnContext, down_count: number) {
    keyContext.hit_zone;

    const key = keyContext.key;
    const box = keyContext.icon;
    const on_hit = (meeting: Phaser.Physics.Arcade.Sprite) => {
      meeting.setFrame(1);
      meeting.setVelocityY(0);
      meeting.disableBody(true, false);
      this.time.addEvent({delay: 200, callback: () => {meeting.destroy()}});

    }
    const check_hit = (meeting: Phaser.Physics.Arcade.Sprite) => {
      this.physics.overlap(keyContext.hit_zone as unknown as Phaser.Physics.Arcade.Sprite, meeting) ? 
        on_hit(meeting) : null;
    }
    // this.physics.checkOverlap(keyContext.miss_zone, keyContext.meetings, missed_meeting_collision_callback);
    if (key.isDown && down_count === 1){
      box.setColor('rgb(0,255,0)');
      keyContext.meetings.forEach(check_hit);
      keyContext.hit_zone.setFrame(1);
    } else if (key.isDown) { 
      box.setColor('rgb(255,0,0)');
      keyContext.hit_zone.setFrame(0);

    } else {
      box.setColor('rgb(0 ,0,0)') ;
      keyContext.hit_zone.setFrame(0);

    }
  }
  
}
