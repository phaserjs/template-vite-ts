import * as Phaser from 'phaser';
import { GameObjects, Input, Scene } from 'phaser';

type Hazard = {
    body: GameObjects.Container;
    velocity: Phaser.Math.Vector2;
    spin: number;
    radius: number;
};

type Shard = {
    body: GameObjects.Container;
    velocity: Phaser.Math.Vector2;
    radius: number;
};

type Spark = {
    body: GameObjects.Arc;
    velocity: Phaser.Math.Vector2;
    life: number;
    maxLife: number;
};

export class Game extends Scene
{
    private player!: GameObjects.Container;
    private playerGlow!: GameObjects.Arc;
    private hazards: Hazard[] = [];
    private shards: Shard[] = [];
    private sparks: Spark[] = [];
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private wasd!: Record<string, Input.Keyboard.Key>;
    private score = 0;
    private health = 3;
    private combo = 1;
    private comboTimer = 0;
    private elapsed = 0;
    private spawnTimer = 0;
    private shardTimer = 0;
    private dashCooldown = 0;
    private dashTimer = 0;
    private invulnerable = 0;
    private gameEnded = false;
    private scoreText!: GameObjects.Text;
    private comboText!: GameObjects.Text;
    private healthIcons: GameObjects.Arc[] = [];
    private dashBar!: GameObjects.Rectangle;
    private hint!: GameObjects.Text;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.resetState();
        this.cameras.main.setBackgroundColor(0x050816);
        this.drawArena();
        this.createPlayer();
        this.createHud();

        this.cursors = this.input.keyboard!.createCursorKeys();
        this.wasd = this.input.keyboard!.addKeys('W,A,S,D,SPACE') as Record<string, Input.Keyboard.Key>;
        this.input.keyboard!.on('keydown-SPACE', this.tryDash, this);
        this.events.once('shutdown', () => this.input.keyboard?.off('keydown-SPACE', this.tryDash, this));
        this.cameras.main.fadeIn(250);
    }

    update (_time: number, deltaMs: number)
    {
        if (this.gameEnded) return;

        const delta = Math.min(deltaMs, 40) / 1000;
        this.elapsed += delta;
        this.spawnTimer -= delta;
        this.shardTimer -= delta;
        this.dashCooldown = Math.max(0, this.dashCooldown - delta);
        this.dashTimer = Math.max(0, this.dashTimer - delta);
        this.invulnerable = Math.max(0, this.invulnerable - delta);
        this.comboTimer = Math.max(0, this.comboTimer - delta);

        if (this.comboTimer === 0 && this.combo > 1)
        {
            this.combo = 1;
            this.updateCombo();
        }

        this.movePlayer(delta);
        this.spawnObjects();
        this.moveObjects(delta);
        this.updateSparks(delta);
        this.checkCollisions();
        this.updateHud();
    }

    private resetState ()
    {
        this.hazards = [];
        this.shards = [];
        this.sparks = [];
        this.score = 0;
        this.health = 3;
        this.combo = 1;
        this.comboTimer = 0;
        this.elapsed = 0;
        this.spawnTimer = 0.8;
        this.shardTimer = 0.4;
        this.dashCooldown = 0;
        this.dashTimer = 0;
        this.invulnerable = 0;
        this.gameEnded = false;
        this.healthIcons = [];
    }

    private drawArena ()
    {
        const grid = this.add.graphics();
        grid.lineStyle(1, 0x163151, 0.42);
        for (let x = 32; x < 1024; x += 64) grid.lineBetween(x, 0, x, 768);
        for (let y = 0; y < 768; y += 64) grid.lineBetween(0, y, 1024, y);

        for (let i = 0; i < 65; i++)
        {
            this.add.circle(
                Phaser.Math.Between(0, 1024),
                Phaser.Math.Between(0, 768),
                Phaser.Math.Between(1, 2),
                0x8ddfff,
                Phaser.Math.FloatBetween(0.12, 0.4)
            );
        }

        this.add.rectangle(512, 384, 1000, 744)
            .setStrokeStyle(2, 0x234c72, 0.65);
    }

    private createPlayer ()
    {
        this.playerGlow = this.add.circle(0, 0, 28, 0x45eaff, 0.12);
        const ship = this.add.triangle(0, 0, 0, 26, 14, -14, -14, -14, 0x8ff8ff)
            .setStrokeStyle(2, 0xffffff);
        const core = this.add.circle(0, 2, 5, 0xff62da);
        const tail = this.add.triangle(0, 26, -7, 12, 7, 12, 0, 30, 0x5af2ff, 0.7);
        this.player = this.add.container(512, 590, [this.playerGlow, tail, ship, core]);
    }

    private createHud ()
    {
        this.add.text(32, 25, 'SALVAGE', {
            fontFamily: 'Trebuchet MS, sans-serif',
            fontSize: 12,
            fontStyle: 'bold',
            color: '#607d9e',
            letterSpacing: 3
        });
        this.scoreText = this.add.text(30, 42, '000000', {
            fontFamily: 'Consolas, monospace',
            fontSize: 31,
            fontStyle: 'bold',
            color: '#ffffff'
        });

        this.comboText = this.add.text(512, 35, 'CHAIN x1', {
            fontFamily: 'Trebuchet MS, sans-serif',
            fontSize: 17,
            fontStyle: 'bold',
            color: '#ff62da',
            letterSpacing: 2
        }).setOrigin(0.5);

        this.add.text(825, 25, 'HULL', {
            fontFamily: 'Trebuchet MS, sans-serif',
            fontSize: 12,
            fontStyle: 'bold',
            color: '#607d9e',
            letterSpacing: 3
        });
        for (let i = 0; i < 3; i++)
        {
            this.healthIcons.push(this.add.circle(849 + i * 34, 56, 9, 0xff4c78));
        }

        this.add.text(31, 710, 'DASH', {
            fontFamily: 'Trebuchet MS, sans-serif',
            fontSize: 11,
            fontStyle: 'bold',
            color: '#607d9e',
            letterSpacing: 2
        });
        this.add.rectangle(31, 735, 146, 8, 0x14263e).setOrigin(0, 0.5);
        this.dashBar = this.add.rectangle(31, 735, 146, 8, 0x54eaff).setOrigin(0, 0.5);

        this.hint = this.add.text(512, 660, 'Collect the cyan shards', {
            fontFamily: 'Trebuchet MS, sans-serif',
            fontSize: 16,
            color: '#a6dce8'
        }).setOrigin(0.5).setAlpha(0);
        this.tweens.add({
            targets: this.hint,
            alpha: { from: 0, to: 0.9 },
            yoyo: true,
            hold: 1600,
            duration: 500,
            onComplete: () => this.hint.destroy()
        });
    }

    private movePlayer (delta: number)
    {
        const direction = new Phaser.Math.Vector2(0, 0);
        if (this.cursors.left.isDown || this.wasd.A.isDown) direction.x -= 1;
        if (this.cursors.right.isDown || this.wasd.D.isDown) direction.x += 1;
        if (this.cursors.up.isDown || this.wasd.W.isDown) direction.y -= 1;
        if (this.cursors.down.isDown || this.wasd.S.isDown) direction.y += 1;

        const pointer = this.input.activePointer;
        if (pointer.isDown && direction.lengthSq() === 0)
        {
            direction.set(pointer.worldX - this.player.x, pointer.worldY - this.player.y);
            if (direction.length() < 12) direction.set(0, 0);
        }

        if (direction.lengthSq() > 0)
        {
            direction.normalize();
            const speed = this.dashTimer > 0 ? 650 : 275;
            this.player.x += direction.x * speed * delta;
            this.player.y += direction.y * speed * delta;
            this.player.rotation = Phaser.Math.Angle.RotateTo(
                this.player.rotation,
                direction.angle() + Math.PI / 2,
                0.18
            );
        }

        this.player.x = Phaser.Math.Clamp(this.player.x, 28, 996);
        this.player.y = Phaser.Math.Clamp(this.player.y, 92, 732);
        this.playerGlow.setAlpha(this.dashTimer > 0 ? 0.45 : 0.12);
        this.player.setAlpha(this.invulnerable > 0 && Math.floor(this.invulnerable * 16) % 2 === 0 ? 0.25 : 1);
    }

    private tryDash ()
    {
        if (this.dashCooldown > 0 || this.gameEnded) return;

        this.dashCooldown = 2.2;
        this.dashTimer = 0.28;
        this.invulnerable = Math.max(this.invulnerable, 0.34);
        this.burst(this.player.x, this.player.y, 0x54eaff, 12);
        this.cameras.main.shake(80, 0.003);
    }

    private spawnObjects ()
    {
        if (this.spawnTimer <= 0)
        {
            this.spawnHazard();
            const pace = Math.max(0.28, 0.82 - this.elapsed * 0.006);
            this.spawnTimer = Phaser.Math.FloatBetween(pace * 0.75, pace * 1.25);
        }

        if (this.shardTimer <= 0)
        {
            this.spawnShard();
            this.shardTimer = Phaser.Math.FloatBetween(1.05, 1.65);
        }
    }

    private spawnHazard ()
    {
        const radius = Phaser.Math.Between(15, 27);
        const x = Phaser.Math.Between(radius + 12, 1024 - radius - 12);
        const body = this.add.container(x, -radius - 10);
        const glow = this.add.circle(0, 0, radius + 8, 0xff315f, 0.1);
        const mine = this.add.star(0, 0, 8, radius * 0.65, radius, 0xff315f)
            .setStrokeStyle(2, 0xffa0b5);
        const core = this.add.circle(0, 0, radius * 0.27, 0x5c1028);
        body.add([glow, mine, core]);

        const speed = Phaser.Math.Between(125, 185) + Math.min(150, this.elapsed * 2.6);
        this.hazards.push({
            body,
            velocity: new Phaser.Math.Vector2(Phaser.Math.Between(-38, 38), speed),
            spin: Phaser.Math.FloatBetween(-2.4, 2.4),
            radius
        });
    }

    private spawnShard ()
    {
        const x = Phaser.Math.Between(45, 979);
        const body = this.add.container(x, -30);
        const glow = this.add.circle(0, 0, 21, 0x52efff, 0.12);
        const diamond = this.add.polygon(0, 0, [0, -14, 9, 0, 0, 14, -9, 0], 0x64f5ff)
            .setStrokeStyle(2, 0xeaffff);
        body.add([glow, diamond]);
        this.tweens.add({ targets: glow, scale: 1.35, alpha: 0.04, yoyo: true, repeat: -1, duration: 650 });

        this.shards.push({
            body,
            velocity: new Phaser.Math.Vector2(Phaser.Math.Between(-20, 20), Phaser.Math.Between(105, 145)),
            radius: 16
        });
    }

    private moveObjects (delta: number)
    {
        for (let i = this.hazards.length - 1; i >= 0; i--)
        {
            const hazard = this.hazards[i];
            hazard.body.x += hazard.velocity.x * delta;
            hazard.body.y += hazard.velocity.y * delta;
            hazard.body.rotation += hazard.spin * delta;
            if (hazard.body.x < hazard.radius || hazard.body.x > 1024 - hazard.radius)
            {
                hazard.velocity.x *= -1;
            }
            if (hazard.body.y > 810)
            {
                hazard.body.destroy();
                this.hazards.splice(i, 1);
            }
        }

        for (let i = this.shards.length - 1; i >= 0; i--)
        {
            const shard = this.shards[i];
            shard.body.x += shard.velocity.x * delta;
            shard.body.y += shard.velocity.y * delta;
            shard.body.rotation += delta * 1.8;
            if (shard.body.y > 800)
            {
                shard.body.destroy();
                this.shards.splice(i, 1);
                this.combo = 1;
                this.updateCombo();
            }
        }
    }

    private checkCollisions ()
    {
        for (let i = this.shards.length - 1; i >= 0; i--)
        {
            const shard = this.shards[i];
            if (Phaser.Math.Distance.Between(this.player.x, this.player.y, shard.body.x, shard.body.y) < 27)
            {
                const points = 100 * this.combo;
                this.score += points;
                this.combo = Math.min(9, this.combo + 1);
                this.comboTimer = 3.2;
                this.floatText(shard.body.x, shard.body.y, `+${points}`, '#68f6ff');
                this.burst(shard.body.x, shard.body.y, 0x68f6ff, 9);
                shard.body.destroy();
                this.shards.splice(i, 1);
                this.updateCombo();
            }
        }

        if (this.invulnerable > 0) return;

        for (let i = this.hazards.length - 1; i >= 0; i--)
        {
            const hazard = this.hazards[i];
            if (Phaser.Math.Distance.Between(this.player.x, this.player.y, hazard.body.x, hazard.body.y) < hazard.radius + 12)
            {
                this.health--;
                this.combo = 1;
                this.comboTimer = 0;
                this.invulnerable = 1.5;
                this.burst(hazard.body.x, hazard.body.y, 0xff416c, 16);
                hazard.body.destroy();
                this.hazards.splice(i, 1);
                this.cameras.main.shake(260, 0.014);
                this.cameras.main.flash(120, 255, 45, 91, false);
                this.updateCombo();
                this.updateHealth();

                if (this.health <= 0) this.endGame();
                break;
            }
        }
    }

    private updateHud ()
    {
        this.scoreText.setText(this.score.toString().padStart(6, '0'));
        const ready = 1 - this.dashCooldown / 2.2;
        this.dashBar.width = 146 * Phaser.Math.Clamp(ready, 0, 1);
        this.dashBar.setFillStyle(this.dashCooldown === 0 ? 0x54eaff : 0x31556e);
    }

    private updateCombo ()
    {
        this.comboText.setText(`CHAIN x${this.combo}`);
        this.comboText.setColor(this.combo > 4 ? '#fff478' : '#ff62da');
        this.tweens.add({ targets: this.comboText, scale: 1.25, duration: 80, yoyo: true });
    }

    private updateHealth ()
    {
        this.healthIcons.forEach((icon, index) => {
            icon.setFillStyle(index < this.health ? 0xff4c78 : 0x26334a);
        });
    }

    private burst (x: number, y: number, color: number, amount: number)
    {
        for (let i = 0; i < amount; i++)
        {
            const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
            const speed = Phaser.Math.Between(45, 170);
            const life = Phaser.Math.FloatBetween(0.3, 0.7);
            this.sparks.push({
                body: this.add.circle(x, y, Phaser.Math.Between(2, 4), color),
                velocity: new Phaser.Math.Vector2(Math.cos(angle) * speed, Math.sin(angle) * speed),
                life,
                maxLife: life
            });
        }
    }

    private updateSparks (delta: number)
    {
        for (let i = this.sparks.length - 1; i >= 0; i--)
        {
            const spark = this.sparks[i];
            spark.life -= delta;
            spark.body.x += spark.velocity.x * delta;
            spark.body.y += spark.velocity.y * delta;
            spark.velocity.scale(0.96);
            spark.body.setAlpha(Math.max(0, spark.life / spark.maxLife));
            if (spark.life <= 0)
            {
                spark.body.destroy();
                this.sparks.splice(i, 1);
            }
        }
    }

    private floatText (x: number, y: number, value: string, color: string)
    {
        const text = this.add.text(x, y, value, {
            fontFamily: 'Consolas, monospace',
            fontSize: 18,
            fontStyle: 'bold',
            color
        }).setOrigin(0.5);
        this.tweens.add({ targets: text, y: y - 42, alpha: 0, duration: 650, onComplete: () => text.destroy() });
    }

    private endGame ()
    {
        this.gameEnded = true;
        this.burst(this.player.x, this.player.y, 0xff62da, 28);
        this.player.setVisible(false);
        this.time.delayedCall(650, () => {
            this.scene.start('GameOver', {
                score: this.score,
                time: Math.floor(this.elapsed),
                best: Math.max(this.score, Number(localStorage.getItem('neon-salvage-best') ?? 0))
            });
        });
    }
}
