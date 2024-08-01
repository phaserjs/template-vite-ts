import { Scene } from 'phaser';

export class Credits extends Scene
{

    constructor ()
    {
        super('Credits');
    }

    create ()
    {
        const background = this.add.image(0, 0, 'credits-bg').setOrigin(0);
 
        const fires = this.add.sprite(274, 277, 'fire',0).setOrigin(0);
    }


    
}
