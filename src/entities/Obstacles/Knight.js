/**
 * Рыцарь-Стихоплет — стоит на колене, читает стихи
 * Нужно проскользнуть под ним (подкат)
 */
export class Knight {
    constructor(scene, x, y) {
        this.scene = scene;
        this.width = 60;
        this.height = 100;
        this.speed = scene.chapterManager.currentChapter * 40 + 130;

        this.sprite = scene.physics.add.sprite(x, y, 'knight');
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