/**
 * Кристалл Судьбы — светящееся сердечко
 */
export class Crystal {
    constructor(scene, x, y) {
        this.scene = scene;
        this.width = 24;
        this.height = 24;
        this.collected = false;

        // Создаём спрайт через Phaser Physics
        this.sprite = scene.physics.add.sprite(x, y, 'crystal');
        this.sprite.setCollideWorldBounds(false);
        this.sprite.body.allowGravity = false;

        this.graphic = this.sprite; // Используем sprite как graphic
        this.baseY = y;
        this.floatOffset = Math.random() * Math.PI * 2;
    }

    draw() {
        // Спрайт уже нарисован в BootScene, просто анимируем пульсацию
        const time = this.scene.time.now;
        const pulse = 1 + Math.sin(time * 0.005 + this.floatOffset) * 0.15;
        this.sprite.setScale(pulse);
    }

    update(time, delta) {
        if (!this.collected) {
            const y = this.baseY + Math.sin(time * 0.002 + this.floatOffset) * 8;
            this.sprite.y = y;
            this.draw();
        }
    }

    collect() {
        if (this.collected) return;
        this.collected = true;

        this.scene.game.events.emit('crystal-collected');

        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0,
            scale: 2,
            duration: 300,
            onComplete: () => {
                this.sprite.destroy();
                this.active = false;
            }
        });
    }

    isOffScreen() {
        return this.sprite.x < -50 || this.sprite.x > 1350;
    }

    destroy() {
        this.sprite.destroy();
    }
}