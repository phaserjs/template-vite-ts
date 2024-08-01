import { Scene } from 'phaser';

export class Welcome extends Scene
{

    constructor ()
    {
        super('Welcome');
    }

    create ()
    {

        const background = this.add.image(0, 0, 'start-screen').setOrigin(0);

        const room = this.add.image(280, 90, 'room-3d').setOrigin(0);

        const title = this.add.image(43, 46, 'title').setOrigin(0);

        const start = this.add.image(74, 252, 'start').setOrigin(0);

        const credits = this.add.image(74, 310, 'credits').setOrigin(0);
        
        const unionBug = this.add.image(600, 65, 'unionBug').setScale(.05)

        const arrow = this.add.image(50, 262, 'arrow')
        arrow.setVisible(false)

        const arrow2 = this.add.image(50, 320, 'arrow')
        arrow2.setVisible(false)

        start.setInteractive({ useHandCursor: true });
        start.on("pointerup", () => {
            this.scene.launch("Office");
            this.scene.stop("Welcome");
        });

        credits.setInteractive({ useHandCursor: true });
        credits.on("pointerup", () => {
            this.scene.launch("Credits");
            this.scene.stop("Welcome");
        });

        start.on("pointerover", () => {
            arrow.setVisible(true)
        });

        start.on("pointerout", () => {
            arrow.setVisible(false)
        });

        credits.on("pointerover", () => {
            arrow2.setVisible(true)
            console.log("hover")
        });

        credits.on("pointerout", () => {
            arrow2.setVisible(false)
            console.log("moved")
        });


    }


    
}
