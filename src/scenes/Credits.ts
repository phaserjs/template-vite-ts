import { Scene } from 'phaser';

export class Credits extends Scene
{
     credits: Phaser.GameObjects.Text;

    constructor ()
    {
        super('Credits');
    }

    create ()
    {
        const blackSquare = this.add.rectangle(0, 0, 700, 500, 0x000000).setOrigin(0);
 

        this.credits = this.add.text(195, 200,
        "Credits\
        \n \
        \n Game By:\
        \n Hope Fourie,\
        \n Julian Meltzer,\
        \n Frances Dai\
        \n \
        \n With Additional Graphics By:\
        \n Crystal Wang,\
        \n Meagan Hughes\
        \n \
        \n Thinktank Contributors:\
        \n Shay Culpepper,\
        \n Eric Katz\
        \n \
        \n This project is union made.\
        \n Thank you for playing! \
        \n ", 
        { color: "#F8D85F", fontSize: "14px", align: "center", fontFamily: "dogicapixel" });

        const background = this.add.image(0, 0, 'credits-bg').setOrigin(0);
        const fires = this.add.sprite(274, 277, 'fire',0).setOrigin(0);

        this.anims.create({
            key: 'flames',
            frames: this.anims.generateFrameNumbers('fire', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });
        fires.anims.play('flames');
    }

    update () {
        this.credits.y -= 0.2;
     }


    
}
