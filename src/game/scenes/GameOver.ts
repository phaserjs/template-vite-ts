import { Scene } from 'phaser';

type RunResult = {
    score?: number;
    time?: number;
    best?: number;
};

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    create (data: RunResult)
    {
        const score = data.score ?? 0;
        const time = data.time ?? 0;
        const previousBest = Number(localStorage.getItem('neon-salvage-best') ?? 0);
        const best = Math.max(score, data.best ?? 0, previousBest);
        localStorage.setItem('neon-salvage-best', best.toString());

        this.cameras.main.setBackgroundColor(0x050816);
        this.add.circle(512, 260, 230, 0x261238, 0.28);
        this.add.circle(512, 260, 165).setStrokeStyle(2, 0xff4fd8, 0.18);

        this.add.text(512, 168, 'SIGNAL LOST', {
            fontFamily: 'Trebuchet MS, sans-serif',
            fontSize: 54,
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#64244f',
            strokeThickness: 7,
            letterSpacing: 5
        }).setOrigin(0.5);

        this.add.text(512, 245, 'SALVAGE RECOVERED', {
            fontFamily: 'Trebuchet MS, sans-serif',
            fontSize: 13,
            fontStyle: 'bold',
            color: '#6883a2',
            letterSpacing: 3
        }).setOrigin(0.5);

        this.add.text(512, 299, score.toString().padStart(6, '0'), {
            fontFamily: 'Consolas, monospace',
            fontSize: 52,
            fontStyle: 'bold',
            color: '#63f3ff'
        }).setOrigin(0.5);

        this.add.rectangle(512, 386, 470, 1, 0x27435e);
        this.add.text(390, 423, 'FLIGHT TIME', {
            fontFamily: 'Trebuchet MS, sans-serif', fontSize: 13, color: '#657d9a', letterSpacing: 2
        }).setOrigin(0.5);
        this.add.text(390, 457, `${time}s`, {
            fontFamily: 'Consolas, monospace', fontSize: 26, color: '#ffffff'
        }).setOrigin(0.5);
        this.add.text(634, 423, 'BEST RUN', {
            fontFamily: 'Trebuchet MS, sans-serif', fontSize: 13, color: '#657d9a', letterSpacing: 2
        }).setOrigin(0.5);
        this.add.text(634, 457, best.toString().padStart(6, '0'), {
            fontFamily: 'Consolas, monospace', fontSize: 26, color: '#fff478'
        }).setOrigin(0.5);

        const retry = this.add.rectangle(512, 548, 310, 62, 0x183b55)
            .setStrokeStyle(2, 0x54eaff)
            .setInteractive({ useHandCursor: true });
        this.add.text(512, 548, 'RELAUNCH', {
            fontFamily: 'Trebuchet MS, sans-serif',
            fontSize: 21,
            fontStyle: 'bold',
            color: '#ffffff',
            letterSpacing: 3
        }).setOrigin(0.5);

        retry.on('pointerover', () => retry.setFillStyle(0x245a78));
        retry.on('pointerout', () => retry.setFillStyle(0x183b55));
        retry.on('pointerdown', () => this.scene.start('Game'));
        this.input.keyboard?.once('keydown-SPACE', () => this.scene.start('Game'));
        this.input.keyboard?.once('keydown-ENTER', () => this.scene.start('Game'));

        this.add.text(512, 625, 'SPACE / ENTER TO PLAY AGAIN', {
            fontFamily: 'Trebuchet MS, sans-serif',
            fontSize: 13,
            color: '#526a86',
            letterSpacing: 2
        }).setOrigin(0.5);
        this.cameras.main.fadeIn(350);
    }
}
