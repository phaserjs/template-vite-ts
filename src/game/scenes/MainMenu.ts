import * as Phaser from 'phaser';
import { GameObjects, Scene } from 'phaser';

export class MainMenu extends Scene
{
    private stars: GameObjects.Arc[] = [];

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x050816);

        for (let i = 0; i < 90; i++)
        {
            const star = this.add.circle(
                Phaser.Math.Between(0, 1024),
                Phaser.Math.Between(0, 768),
                Phaser.Math.Between(1, 2),
                i % 5 === 0 ? 0x63f3ff : 0xffffff,
                Phaser.Math.FloatBetween(0.2, 0.8)
            );
            star.setData('speed', Phaser.Math.FloatBetween(6, 22));
            this.stars.push(star);
        }

        this.add.circle(512, 280, 180, 0x102452, 0.35);
        this.add.circle(512, 280, 122).setStrokeStyle(2, 0x54eaff, 0.4);
        this.add.circle(512, 280, 96).setStrokeStyle(2, 0xff4fd8, 0.25);

        this.add.text(512, 217, 'NEON', {
            fontFamily: 'Trebuchet MS, sans-serif',
            fontSize: 88,
            fontStyle: 'bold',
            color: '#f5fbff',
            stroke: '#175b76',
            strokeThickness: 8,
            letterSpacing: 10
        }).setOrigin(0.5);

        this.add.text(512, 304, 'S A L V A G E', {
            fontFamily: 'Trebuchet MS, sans-serif',
            fontSize: 35,
            fontStyle: 'bold',
            color: '#ff62d8',
            letterSpacing: 9
        }).setOrigin(0.5);

        this.add.text(512, 384, 'Recover the lost light. Survive the dark.', {
            fontFamily: 'Trebuchet MS, sans-serif',
            fontSize: 19,
            color: '#91a8c6'
        }).setOrigin(0.5);

        const play = this.add.rectangle(512, 474, 310, 64, 0x152a4f, 0.95)
            .setStrokeStyle(2, 0x54eaff)
            .setInteractive({ useHandCursor: true });
        const playText = this.add.text(512, 474, 'LAUNCH RUN', {
            fontFamily: 'Trebuchet MS, sans-serif',
            fontSize: 22,
            fontStyle: 'bold',
            color: '#ffffff',
            letterSpacing: 3
        }).setOrigin(0.5);

        play.on('pointerover', () => {
            play.setFillStyle(0x214772);
            playText.setColor('#63f3ff');
        });
        play.on('pointerout', () => {
            play.setFillStyle(0x152a4f);
            playText.setColor('#ffffff');
        });
        play.on('pointerdown', () => this.startGame());

        this.add.text(512, 550, 'WASD / ARROWS TO MOVE  •  SPACE TO DASH\nor hold the pointer to steer', {
            fontFamily: 'Trebuchet MS, sans-serif',
            fontSize: 15,
            color: '#7187a6',
            align: 'center',
            lineSpacing: 9
        }).setOrigin(0.5);

        this.add.text(512, 700, 'Collect cyan shards  •  Avoid crimson mines  •  Keep the combo alive', {
            fontFamily: 'Trebuchet MS, sans-serif',
            fontSize: 14,
            color: '#536985'
        }).setOrigin(0.5);

        this.input.keyboard?.once('keydown-SPACE', () => this.startGame());
        this.input.keyboard?.once('keydown-ENTER', () => this.startGame());
        this.cameras.main.fadeIn(450);
    }

    update (_time: number, delta: number)
    {
        for (const star of this.stars)
        {
            star.y += star.getData('speed') * delta / 1000;
            if (star.y > 770)
            {
                star.y = -2;
                star.x = Phaser.Math.Between(0, 1024);
            }
        }
    }

    private startGame ()
    {
        this.cameras.main.fadeOut(220, 4, 8, 22);
        this.time.delayedCall(220, () => this.scene.start('Game'));
    }
}
