/**
 * Маг-Недоучка — летает на метле, кидает «любовные зелья»
 * Нужно уворачиваться (прыгать или подкатывать)
 */
export class Mage {
    constructor(scene, sprite) {
        this.scene = scene;
        this.width = 60;
        this.height = 80;
        this.baseY = sprite.y;
        this.flyOffset = Math.random() * Math.PI * 2;

        // Используем существующий спрайт из obstacles
        this.sprite = sprite;
        this.sprite.body.setAllowGravity(false);

        this.throwTimer = 0;
        this.throwInterval = 1500 + Math.random() * 1000;
    }

    update(time, delta) {
        const y = this.baseY + Math.sin(time * 0.002 + this.flyOffset) * 40;
        this.sprite.y = y;

        // Бросаем снаряды
        this.throwTimer += delta;
        if (this.throwTimer >= this.throwInterval) {
            this.throwTimer = 0;
            this.throwPotion();
        }
    }

    throwPotion() {
        // Зелье летит ВЛЕВО — к Анне, и быстрее текущей скорости игры
        const potionSpeed = this.scene.speed * 1.5;
        const potion = this.scene.potions.create(
            this.sprite.x - 30,
            this.sprite.y + 20,
            'potion'
        );
        if (potion) {
            potion.body.setVelocityX(-potionSpeed); // Влево, к Анне, быстрее текущей скорости
            potion.body.setAllowGravity(false);
            potion.userData = { isPotion: true };
        }
    }

    isOffScreen() {
        return this.sprite.x < -100;
    }

    destroy() {
        this.sprite.destroy();
    }
}
