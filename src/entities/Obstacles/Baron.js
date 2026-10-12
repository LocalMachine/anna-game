/**
 * Барон-Толстяк — катится навстречу как шар
 * Нужно перепрыгнуть
 */
export class Baron {
    constructor(scene, x, y) {
        this.scene = scene;
        this.width = 80;
        this.height = 80;
        this.speed = scene.chapterManager.currentChapter * 50 + 150;

        this.sprite = scene.physics.add.sprite(x, y, 'baron');
        this.sprite.body.setVelocityX(-this.speed);
        this.sprite.body.setCollideWorldBounds(false);

        this.graphic = this.sprite;
    }

    isOffScreen() {
        return this.sprite.x < -100;
    }

    destroy() {
        this.sprite.destroy();
    }
}