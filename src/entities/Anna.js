/**
 * Главный персонаж — Анна
 */
export class Anna {
    constructor(scene, x, y) {
        this.scene = scene;

        this.sprite = scene.physics.add.sprite(x, y, 'anna');
        this.sprite.setDepth(1);
        this.sprite.body.setBounce(0);
        this.sprite.body.setGravityY(1200);
        this.sprite.body.setVelocityX(0);
        this.sprite.body.setCollideWorldBounds(false);
        this.sprite.body.setSize(64, 96);
        this.sprite.body.setOffset(0, 0);

        // === БЛЕСК ПЛАТЬЯ ===
        console.log('👗 Создаем блеск платья');
        this.shineSprite = this.scene.add.sprite(0, 0, 'anna_shine');
        this.shineSprite.setOrigin(0.5, 0.5);
        this.shineSprite.setDepth(2);
        this.shineSprite.alpha = 0;
        console.log('✨ Блеск создан:', this.shineSprite);

        // Запускаем анимацию блеска сразу
        this.startShineAnimation();

        this.height = 96;
        this.width = 64;
        this.isJumping = false;
        this.isSliding = false;
        this.slideTimer = 0;
        this.hitCooldown = 0;
        this.jumpCooldown = 0;
        this.shineTween = null;

        this.userData = { hit: false };
    }

    jump() {
        if (!this.isJumping && !this.isSliding && this.jumpCooldown <= 0) {
            this.sprite.body.setVelocityY(-650);
            this.isJumping = true;
            this.jumpCooldown = 150;
        }
    }

    slide() {
        if (!this.isSliding) {
            this.isSliding = true;
            this.slideTimer = this.scene.time.now + 600;
            
            // Отключаем гравитацию и перемещаем к земле
            this.sprite.body.allowGravity = false;
            this.sprite.body.setVelocityY(0);
            
            // Перемещаем спрайт на уровень земли (почти внизу экрана)
            const slideY = this.scene.groundY - 15; // 660 - 15 = 645
            this.sprite.setPosition(this.sprite.x, slideY);
            
            // Хитбокс: 70x30, смещение (35, 5) — хитбокс ниже для надёжного пересечения с бароном
            this.sprite.body.setSize(70, 30);
            this.sprite.body.setOffset(35, 5);
            
            // Вращаем спрайт — Анна ложится
            this.sprite.setRotation(Math.PI / 2);
        }
    }

    update(time, delta) {
        // Синхронизация позиции блеска со спрайтом Анны
        this.shineSprite.setPosition(this.sprite.x, this.sprite.y);

        // Ограничение: Анна не может бежать дальше 426px
        if (this.sprite.x > 426) {
            this.sprite.x = 426;
        }

        // Ограничение: Анна не может прыгнуть выше хедера (верх экрана)
        const minJumpY = 60; // y позиция верха хедера (60px)
        if (this.sprite.y < minJumpY) {
            this.sprite.y = minJumpY;
            this.sprite.body.setVelocityY(0);
            this.isJumping = false;
        }

        // Выход из подката
        if (this.isSliding && time > this.slideTimer) {
            this.isSliding = false;
            this.sprite.body.allowGravity = true; // Включаем гравитацию обратно
            // Возвращаем Анну на нормальную позицию
            const normalY = this.scene.groundY - this.height;
            this.sprite.setPosition(this.sprite.x, normalY);
            this.sprite.body.setSize(this.width, this.height);
            this.sprite.body.setOffset(0, 0);
            this.sprite.body.setVelocityY(0);
            // Возвращаем Анну в вертикальное положение
            this.sprite.setRotation(0);
        }

        // Обновление состояния невидимости
        const scoreManager = this.scene.scoreManager;
        if (scoreManager && scoreManager.invincible) {
            this.sprite.alpha = 0.4 + Math.sin(this.scene.time.now * 0.01) * 0.3;
        } else {
            this.sprite.alpha = 1;
        }

        // Кулдаун после получения урона
        if (this.hitCooldown > 0) {
            this.hitCooldown -= delta;
            this.sprite.alpha = (Math.floor(this.hitCooldown / 100) % 2 === 0) ? 1 : 0.3;
        }

        // Кулдаун прыжка
        if (this.jumpCooldown > 0) {
            this.jumpCooldown -= delta;
        }

        // Гравитация — сброс прыжка при приземлении
        if (this.isJumping && this.sprite.body.velocity.y >= 0) {
            this.isJumping = false;
        }
    }

    startShineAnimation() {
        // Уничтожаем старый твиф если есть
        if (this.shineTween) {
            this.shineTween.destroy();
        }

        console.log('🌟 Запускаем анимацию блеска');
        
        // Блеск появляется и исчезает
        this.shineTween = this.scene.tweens.add({
            targets: this.shineSprite,
            alpha: 0.8,
            duration: 500,
            ease: 'Power2',
            yoyo: true,
            repeat: -1,
            delay: 0
        });
        
        console.log('✨ Анимация блеска запущена:', this.shineTween);
    }

    takeHit() {
        this.hitCooldown = 1000;
        this.sprite.body.setVelocityX(-100);
    }

    destroy() {
        this.sprite.destroy();
        if (this.shineTween) {
            this.shineTween.destroy();
        }
        this.shineSprite.destroy();
    }
}
