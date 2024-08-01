import { Scene } from 'phaser';

export class GoogleMeet extends Scene
{

    constructor ()
    {
        super('GoogleMeet');
    }

    create ()
    {
        const background = this.add.image(350, 250, 'googleMeet');
        const alert = this.add.image(355, 230, 'alert');
        alert.setVisible(false)
        const bed = this.add.image(175, 125, 'bed');
        const closet = this.add.image(175, 125, 'closet');
        const clothes = this.add.image(175, 125, 'clothes');
        const crooked = this.add.image(175, 125, 'crooked');
        const floorBook = this.add.image(175, 125, 'floorBook');
        const picturesBed = this.add.image(175, 125, 'pictures-bed');
        const shelf = this.add.image(175, 125, 'shelf');
        const shelfBooks = this.add.image(175, 125, 'shelfBooks');
        const success = this.add.image(351, 243, 'success');
        success.setVisible(false)
        const tooSlow = this.add.image(350, 230, 'tooSlow');
        tooSlow.setVisible(false)


        
    }
}
