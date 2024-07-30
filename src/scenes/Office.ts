import { Scene, GameObjects } from 'phaser';

export class Office extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.background = this.add.image(175, 125, 'office');

        const rug = this.add.image(173, 235, 'rug');
        const books = this.add.image(119, 91, 'books');
        const desk = this.add.image(177, 178, 'desk');
        const chair = this.add.image(211, 177, 'chair');
        const mug = this.add.image(175, 125, 'mug');
        const laptop = this.add.image(175, 125, 'laptop');
        const pots = this.add.image(209, 96, 'pots');
        const diffen1 = this.add.image(188, 76, 'diffen1');
        const poth1 = this.add.image(234, 82, 'poth1');
        const aloe1 = this.add.image(208, 83, 'aloe1');
        const pictures = this.add.image(313, 64, 'pictures');
        const trash = this.add.image(60, 194, 'trash');

        this.title = this.add.text(512, 460, 'Main Menu', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });
    }
}
