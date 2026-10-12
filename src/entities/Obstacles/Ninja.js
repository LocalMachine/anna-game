/**
 * Ниндзя-Курьер — доставляет любовные письма с огромной скоростью
 * Появляется внезапно на разной высоте, затем ускоряется к Анне
 */
export class Ninja {
    constructor(scene, obstacle) {
        this.scene = scene;
        this.obstacle = obstacle;
        this.width = 50;
        this.height = 70;
        this.sprite = obstacle;
        
        // Начальная скорость (медленнее, чтобы создать эффект неожиданности)
        this.baseSpeed = scene.speed * 0.8;
        this.currentSpeed = this.baseSpeed;
        
        // Фаза ускорения
        this.hasAccelerated = false;
        this.accelerationTimer = 0;
        this.accelerationDelay = 1500 + Math.random() * 1000; // 1.5-2.5 секунды до ускорения
        this.accelerationFactor = 2.5; // Ускорение в 2.5 раза
        
        // Визуальные эффекты
        this.trailParticles = [];
        this.setupVisualEffects();
    }
    
    setupVisualEffects() {
        // Создаём частицы следа для эффекта скорости
        this.trailGroup = this.scene.add.group();
        
        // Анимация покачивания (ниндзя летит не прямо, а виляет)
        this.scene.tweens.add({
            targets: this.sprite,
            angle: 10,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    update(delta) {
        // Двигаем ниндзя
        this.sprite.body.setVelocityX(-this.currentSpeed);
        
        // Таймер до ускорения
        if (!this.hasAccelerated) {
            this.accelerationTimer += delta;
            
            // Предупреждение — ниндзя начинает вибрировать перед ускорением
            if (this.accelerationTimer > this.accelerationDelay * 0.7) {
                this.showWarningEffect();
            }
            
            // Момент ускорения!
            if (this.accelerationTimer >= this.accelerationDelay) {
                this.accelerate();
            }
        } else {
            // После ускорения — усиливаем визуальные эффекты
            this.updateTrailEffect();
        }
    }
    
    accelerate() {
        this.hasAccelerated = true;
        this.currentSpeed = this.baseSpeed * this.accelerationFactor;
        
        // Визуальный эффект ускорения
        this.speedBoostEffect();
        
        console.log('🥷 Ниндзя-курьер ускоряется!');
    }
    
    showWarningEffect() {
        // Ниндзя начинает мигать перед ускорением
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0.3,
            duration: 100,
            yoyo: true,
            repeat: 3
        });
    }
    
    speedBoostEffect() {
        // Резкое увеличение размера на момент ускорения
        this.scene.tweens.add({
            targets: this.sprite,
            scale_x: 1.3,
            scale_y: 0.8,
            duration: 200,
            yoyo: true,
            ease: 'Power2'
        });
        
        // Создаём частицы скорости
        this.createSpeedParticles();
    }
    
    createSpeedParticles() {
        // Создаём эффект частиц позади ниндзя
        for (let i = 0; i < 8; i++) {
            const particle = this.scene.add.rectangle(
                this.sprite.x - 30,
                this.sprite.y + (Math.random() - 0.5) * 40,
                4,
                4,
                0xFF5722,
                0.8
            );
            
            this.scene.tweens.add({
                targets: particle,
                x: particle.x - 100 - Math.random() * 50,
                alpha: 0,
                duration: 300 + Math.random() * 200,
                onComplete: () => particle.destroy()
            });
        }
    }
    
    updateTrailEffect() {
        // Продолжаем создавать частицы во время ускорения
        if (Math.random() < 0.3) {
            this.createSpeedParticles();
        }
    }

    isOffScreen() {
        return this.sprite.x < -100;
    }

    destroy() {
        // Очищаем частицы
        if (this.trailGroup) {
            this.trailGroup.clear(true, true);
        }
        this.sprite.destroy();
    }
}
