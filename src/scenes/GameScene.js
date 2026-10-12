/**
 * Основная сцена раннера
 */
import { scoreManager, chapterManager, inputManager, saveManager } from '../main.js';
import { Anna } from '../entities/Anna.js';
import { Baron } from '../entities/Obstacles/Baron.js';
import { Knight } from '../entities/Obstacles/Knight.js';
import { Mage } from '../entities/Obstacles/Mage.js';
import { Ninja } from '../entities/Obstacles/Ninja.js';
import { Crystal } from '../entities/Collectibles/Crystal.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.gameMusic = null;
        this.invisibilityMusic = null;
    }

    shutdown() {
        // Останавливаем всю музыку при завершении сцены
        this.sound.stopByKey('game_music');
        this.sound.stopByKey('invisibility_sound');
        
        if (this.inputManager) {
            this.inputManager.destroy();
        }
        if (this.obstacleCollisionHandler) {
            this.obstacleCollisionHandler.destroy();
            this.obstacleCollisionHandler = null;
        }
        // Очищаем экземпляры магов и ниндзя
        this.mageInstances = [];
        this.ninjaInstances = [];
    }

    create() {
        // 1. Create physics groups FIRST
        this.obstacles = this.physics.add.group();
        // Очистка флагов при старте
        this.obstacles.children.each((child) => {
            if (child && child.userData) {
                child.userData.hit = false;
            }
        });

        this.crystals = this.physics.add.group();        
        this.potions = this.physics.add.group();
        
        // 2. Now we can clear them if needed (though new groups are empty)
        // Очистка групп препятствий и кристаллов
        this.obstacles.clear(true, true);
        this.crystals.clear(true, true);
        this.potions.clear(true, true);

        // 3. Reset variables
        this.backgrounds = [];
        this.ground = null;
        this.groundY = 600;
        this.lastChapter = 0;
        this.speed = 200;
        this.spawnerTimer = 0;
        this.crystalSpawnTimer = 0;
        this.isRunning = true;
        this.lives = 3;
        this.chapterTransitionActive = false;
        this.chapterTransitionTimer = 0;
        this.chapterTransitionEnded = false;
        this.isSpawningPaused = false;
        this.chapterTransitionOverlay = null;
        this.chapterTitleText = null;
        this.obstacleCollisionHandler = null;
        this.mageInstances = [];
        this.ninjaInstances = [];

        // 4. Apply systems
        // Применяем данные из систем
        scoreManager.reset();
        this.scoreManager = scoreManager;
        this.chapterManager = chapterManager;
        this.inputManager = inputManager;

        // 5. Setup ground (земля ДО создания Анны)
        this.setupGround();

        // 5b. Setup background (небо и декорации)
        this.setupBackground();

        // 6. Init input
        // Инициализация ввода (передаём текущую сцену)
        this.inputManager.init(this);

        // 7. Create Anna — ставим на землю (земля верх на y=600, Анна ноги на y=600)
        this.anna = new Anna(this, 426, 504);
        this.anna.userData.hit = false;

        // 8. Collisions — настраиваем ПОСЛЕ создания земли и Анны
        // Коллизия с землёй
        this.physics.add.collider(this.anna.sprite, this.ground);

        // Placeholder для звуков (замените на реальные в будущем)
        this.anna.sounds = {
            jump: { play: () => {} },
            slide: { play: () => {} }
        };

        // Подписка на события ввода
        this.game.events.on('player-jump', () => {
            console.log('🦘 player-jump event received');
            this.anna.jump();
        });
        this.game.events.on('player-slide', () => {
            console.log('🛝 player-slide event received, anna:', this.anna);
            this.anna.slide();
        });

        // Подписка на события сбора кристаллов
        this.game.events.on('crystal-collected', () => {
            this.scoreManager.addCrystal();
        });

        // Подписка на получение урона
        this.game.events.on('player-hit', (data) => this.handleHit(data));

        // Подписка на невидимость
        this.game.events.on('invincibility-start', () => {
            console.log('✨ Режим невидимости активирован!');
            // Останавливаем игровую музыку и включаем звук невидимости
            this.sound.stopByKey('game_music');
            this.invisibilityMusic = this.sound.add('invisibility_sound', { loop: true, volume: 0.4 });
            this.invisibilityMusic.play();
        });
        
        // Подписка на окончание невидимости
        this.game.events.on('invincibility-end', () => {
            console.log('👻 Режим невидимости закончился!');
            // Останавливаем звук невидимости и возобновляем игровую музыку
            if (this.invisibilityMusic) {
                this.invisibilityMusic.stop();
                this.invisibilityMusic = null;
            }
            this.sound.play('game_music');
        });

        // Подписка на двойной тап для активации невидимки
        this.game.events.on('player-double-tap', () => {
            console.log('👻 player-double-tap received, crystals:', this.scoreManager.crystals, 'invincible:', this.scoreManager.invincible);
            if (this.scoreManager.crystals >= 50 && !this.scoreManager.invincible) {
                this.scoreManager.crystals -= 50;
                this.scoreManager.activateInvincibility();
                this.updateHUD();
                console.log('✨ Невидимка активирована!');
            } else {
                console.warn('⚠️ Невидимка не активирована: crystals < 50 или уже активна');
            }
        });

        // Подписка на завершение последней главы
        this.game.events.on('chapter-finished', () => {
            console.log('🎉 Последняя глава пройдена! Запуск концовки...');
            this.onChapterFinished();
        });

        // Удаляем старую коллизию если есть
        if (this.obstacleCollisionHandler) {
            this.obstacleCollisionHandler.destroy();
            this.obstacleCollisionHandler = null;
        }

        // Коллизии препятствий
        this.obstacleCollisionHandler = this.physics.add.collider(this.anna.sprite, this.obstacles, (player, obstacle) => {
            if (obstacle.userData.hit) return;
            if (!this.anna.userData.hit && !this.chapterTransitionActive) {
                obstacle.userData.hit = true;
                
                // Если Анна невидима — ударяем монстра звуком punch
                if (this.scoreManager.invincible) {
                    this.sound.play('punch_sound');
                } else {
                    // Если не невидима — получаем урон (звук death-sound играет в handleHit)
                    this.scoreManager.loseLife(obstacle);
                }
            }
        }, null, this);

        // Сбор кристаллов
        this.physics.add.overlap(this.anna.sprite, this.crystals, (player, crystal) => {
            if (!crystal.userData.collected) {
                crystal.userData.collected = true;
                this.scoreManager.addCrystal();
                this.updateHUD();
                console.log('💎 crystals:', this.scoreManager.crystals);
                
                // Звук подбора кристалла
                this.sound.play('crystal_sound');
                
                // Удаляем кристалл из группы и уничтожаем
                this.crystals.remove(crystal);
                crystal.destroy();
            }
        });

        // Коллизия со зельями
        this.physics.add.collider(this.anna.sprite, this.potions, (player, potion) => {
            if (!potion.userData.hit) {
                potion.userData.hit = true;
                this.scoreManager.loseLife(potion);
            }
        });

        // Обновление HUD
        this.updateHUD();
        this.updateChapterDisplay();

        // Запускаем игровую музыку
        this.gameMusic = this.sound.add('game_music', { loop: true, volume: 0.6 });
        this.gameMusic.play();

        // Таймер увеличения скорости
        this.speedUpTimer = 0;
        this.hudUpdateTimer = 0;

        // Показываем название первой главы
        this.time.delayedCall(1000, () => {
            this.showChapterTitle();
        });
    }

    setupBackground() {
        const bgColors = this.chapterManager.getChapterBackground(
            this.chapterManager.currentChapter
        );
        this.cameras.main.setBackgroundColor(bgColors.top);

        for (let i = this.backgrounds.length - 1; i >= 0; i--) {
            const bg = this.backgrounds[i];
            if (bg && bg.active) {
                this.children.remove(bg);
                bg.destroy();
            }
        }
        this.backgrounds = [];

        const sky = this.add.graphics();
        sky.fillGradientStyle(bgColors.top, bgColors.top, bgColors.bottom, bgColors.bottom, 1);
        sky.fillRect(0, 0, 1280, 720);
        sky.setDepth(-2);

        for (let i = 0; i < 2; i++) {
            const bg = this.add.graphics();
            this.drawBackgroundDecorations(bg, 1280, i * 1280);
            bg.setDepth(-1);
            this.backgrounds.push(bg);
        }
    }

    setupGround() {
        if (this.ground) {
            this.ground.destroy();
        }

        this.ground = this.add.rectangle(640, 660, 2560, 120, 0x6B5B45);
        this.physics.add.existing(this.ground);
        this.ground.body.allowGravity = false;
        this.ground.body.immovable = true;
        this.ground.setDepth(1);
    }

    drawBackgroundDecorations(bg, width, offsetX) {
    const chapter = this.chapterManager.currentChapter;

    if (chapter === 0) {
        for (let x = 80; x < width; x += 180) {
            bg.fillStyle(0x5D4E3D, 0.3);
            bg.fillRect(x + 3 + offsetX, 360, 30, 240);
            bg.fillRect(x - 5 + offsetX, 580, 40, 20);
            bg.fillRect(x + offsetX, 360, 30, 220);
            bg.fillRect(x - 8 + offsetX, 350, 46, 18);
            bg.fillRect(x + 5 + offsetX, 370, 4, 200);
            bg.fillRect(x + 21 + offsetX, 370, 4, 200);
        }
        for (let x = 190; x < width; x += 300) {
            bg.fillStyle(0xFFD54F, 0.3);
            bg.fillCircle(x + offsetX, 400, 12);
            bg.lineStyle(2, 0xFFD54F, 0.3);
            bg.strokeCircle(x + offsetX, 400, 12);
        }
    } else if (chapter === 1) {
        for (let x = 30; x < width; x += 140) {
            bg.fillStyle(0x4E342E);
            bg.fillRect(x + 22 + offsetX, 480, 16, 120);
            bg.fillRect(x + 10 + offsetX, 590, 40, 8);
            bg.fillCircle(x + 30 + offsetX, 450, 50);
            bg.fillCircle(x + 20 + offsetX, 470, 40);
            bg.fillCircle(x + 45 + offsetX, 475, 35);
            bg.fillCircle(x + 25 + offsetX, 440, 30);
            bg.fillCircle(x + 40 + offsetX, 455, 25);
            bg.fillCircle(x + 18 + offsetX, 435, 12);
            bg.fillCircle(x + 38 + offsetX, 448, 10);
        }
        // Розы
        for (let x = 60; x < width; x += 180) {
            // Стебель
            bg.fillStyle(0x2E7D32);
            bg.fillRect(x + 18 + offsetX, 560, 4, 40);
            // Листья
            bg.fillStyle(0x388E3C);
            bg.fillEllipse(x + 12 + offsetX, 580, 10, 6);
            bg.fillEllipse(x + 24 + offsetX, 570, 10, 6);
            // Шипы
            bg.fillStyle(0x1B5E20);
            bg.fillTriangle(x + 16 + offsetX, 575, x + 14 + offsetX, 573, x + 16 + offsetX, 577);
            bg.fillTriangle(x + 22 + offsetX, 565, x + 24 + offsetX, 563, x + 22 + offsetX, 567);
            // Роза (красная)
            bg.fillStyle(0xE53935);
            bg.fillCircle(x + 20 + offsetX, 555, 10);
            bg.fillStyle(0xEF5350);
            bg.fillCircle(x + 18 + offsetX, 553, 7);
            bg.fillStyle(0xFFCDD2);
            bg.fillCircle(x + 17 + offsetX, 552, 3);
            // Лепестки
            bg.fillStyle(0xE53935);
            bg.fillCircle(x + 15 + offsetX, 550, 5);
            bg.fillCircle(x + 25 + offsetX, 550, 5);
            bg.fillCircle(x + 20 + offsetX, 548, 5);
        }
    } else if (chapter === 2) {
        // === ЯРМАРКА ТЩЕСЛАВИЯ — красивые дома с деталями ===
        for (let x = -20; x < width; x += 130) {
            const h = 160 + Math.abs(Math.sin(x * 0.01)) * 100;
            const w = 90 + Math.abs(Math.cos(x * 0.02)) * 25;
            const baseY = this.groundY;
            
            // Основной цвет дома (разные для каждого)
            const colors = [0xD7CCC8, 0xBCAAA4, 0xFFECB3, 0xFFCCBC, 0xE1BEE7, 0xC5CAE9];
            const mainColor = colors[Math.floor(Math.abs(Math.sin(x * 0.1)) * colors.length)];
            const roofColor = [0xE53935, 0x1E88E5, 0x43A047, 0xFDD835, 0x8E24AA, 0xF4511E][Math.floor(Math.abs(Math.sin(x * 0.07)) * 6)];
            const doorColor = 0x5D4037;
            
            // Стена дома
            bg.fillStyle(mainColor);
            bg.fillRect(x + offsetX, baseY - h, w, h);
            
            // Тень на стене (объём)
            bg.fillStyle(0x000000, 0.1);
            bg.fillRect(x + w - 15 + offsetX, baseY - h, 15, h);
            
            // Карниз (верхняя часть)
            bg.fillStyle(roofColor);
            bg.fillRect(x - 5 + offsetX, baseY - h - 10, w + 10, 15);
            
            // Крыша (треугольная)
            bg.fillStyle(roofColor);
            bg.beginPath();
            bg.moveTo(x - 10 + offsetX, baseY - h - 10);
            bg.lineTo(x + w / 2 + offsetX, baseY - h - 50);
            bg.lineTo(x + w + 10 + offsetX, baseY - h - 10);
            bg.closePath();
            bg.fillPath();
            
            // Дымовая труба
            bg.fillStyle(0x795548);
            bg.fillRect(x + w - 20 + offsetX, baseY - h - 45, 12, 35);
            bg.fillStyle(0x424242, 0.3);
            bg.fillCircle(x + w - 14 + offsetX, baseY - h - 55, 6);
            bg.fillCircle(x + w - 18 + offsetX, baseY - h - 65, 8);
            
            // Дверь
            bg.fillStyle(doorColor);
            bg.fillRect(x + w / 2 - 8 + offsetX, baseY - 40, 16, 40);
            bg.fillStyle(0xFFD700);
            bg.fillCircle(x + w / 2 + 4 + offsetX, baseY - 20, 2);
            
            // Окна (светлые с переплётом)
            bg.fillStyle(0xFFECB3);
            const cols = Math.floor((w - 20) / 35);
            for (let c = 0; c < Math.max(cols, 1); c++) {
                for (let r = 0; r < Math.floor((h - 60) / 50); r++) {
                    const wx = x + 12 + c * 35 + offsetX;
                    const wy = baseY - h + 25 + r * 50;
                    
                    // Рама окна
                    bg.fillStyle(0xFFECB3);
                    bg.fillRect(wx, wy, 18, 22);
                    
                    // Переплёт вертикальный
                    bg.fillStyle(doorColor);
                    bg.fillRect(wx + 8, wy, 2, 22);
                    
                    // Переплёт горизонтальный
                    bg.fillRect(wx, wy + 10, 18, 2);
                    
                    // Блик в окне
                    bg.fillStyle(0xFFFFFF, 0.3);
                    bg.fillRect(wx + 2, wy + 2, 6, 8);
                }
            }
            
            // Балкон (для высоких домов)
            if (h > 220) {
                bg.fillStyle(0x795548);
                bg.fillRect(x + 10 + offsetX, baseY - h + 80, w - 20, 5);
                
                // Перила балкона
                bg.fillStyle(0x5D4037);
                for (let p = 0; p < w - 25; p += 8) {
                    bg.fillRect(x + 12 + p + offsetX, baseY - h + 65, 2, 15);
                }
                bg.fillRect(x + 10 + offsetX, baseY - h + 65, w - 20, 2);
            }
        }
        
        // Флаги и вывески на домах
        for (let x = 0; x < width; x += 260) {
            const flagColors = [0xE53935, 0x1E88E5, 0xFDD835, 0x43A047, 0x8E24AA];
            const flagColor = flagColors[Math.floor(Math.abs(Math.sin(x * 0.05)) * flagColors.length)];
            
            // Шест
            bg.fillStyle(0x757575);
            bg.fillRect(x + 30 + offsetX, this.groundY - 200, 3, 60);
            
            // Флаг
            bg.fillStyle(flagColor);
            bg.beginPath();
            bg.moveTo(x + 33 + offsetX, this.groundY - 200);
            bg.lineTo(x + 60 + offsetX, this.groundY - 190);
            bg.lineTo(x + 33 + offsetX, this.groundY - 180);
            bg.closePath();
            bg.fillPath();
        }
    } else if (chapter === 3) {
        bg.fillStyle(0x455A64);
        bg.fillTriangle(50 + offsetX, this.groundY, 250 + offsetX, 300, 500 + offsetX, this.groundY);
        bg.fillTriangle(190 + offsetX, 320, 250 + offsetX, 300, 310 + offsetX, 320);
        bg.fillTriangle(400 + offsetX, this.groundY, 650 + offsetX, 250, 900 + offsetX, this.groundY);
        bg.fillTriangle(580 + offsetX, 275, 650 + offsetX, 250, 720 + offsetX, 275);
        bg.fillTriangle(800 + offsetX, this.groundY, 1000 + offsetX, 320, 1200 + offsetX, this.groundY);
        bg.fillTriangle(950 + offsetX, 340, 1000 + offsetX, 320, 1050 + offsetX, 340);
        for (let x = 0; x < width; x += 60) {
            bg.fillStyle(0xB0BEC5, 0.15);
            bg.fillCircle(x + 30 + offsetX, this.groundY - 80, 50);
        }
    } else if (chapter === 4) {
        for (let x = 50; x < width; x += 300) {
            bg.fillStyle(0x5D4037);
            bg.fillRect(x + 15 + offsetX, 400, 10, 200);
            bg.fillRect(x + 5 + offsetX, 420, 30, 4);
            bg.fillRect(x + 10 + offsetX, 380, 25, 4);
            bg.fillCircle(x + 20 + offsetX, 370, 45);
            bg.fillCircle(x + 10 + offsetX, 390, 35);
            bg.fillCircle(x + 35 + offsetX, 385, 30);
            bg.fillCircle(x + 15 + offsetX, 365, 25);
            bg.fillCircle(x + 30 + offsetX, 375, 20);
            bg.fillCircle(x - 10 + offsetX, 420, 3);
            bg.fillCircle(x + 40 + offsetX, 440, 2);
            bg.fillCircle(x + 5 + offsetX, 460, 3);
        }
        for (let x = 40; x < width; x += 70) {
            bg.fillStyle(0x4CAF50);
            bg.fillRect(x + 8 + offsetX, 570, 4, 30);
            for (let p = 0; p < 5; p++) {
                const angle = (p / 5) * Math.PI * 2;
                bg.fillCircle(x + 10 + Math.cos(angle) * 6 + offsetX, 568 + Math.sin(angle) * 6, 4);
            }
            bg.fillCircle(x + 10 + offsetX, 568, 3);
        }
        for (let i = 0; i < 6; i++) {
            const bx = 100 + i * 200;
            const by = 350 + Math.sin(i * 2) * 50;
            bg.fillStyle([0xFF80AB, 0xEA80FC, 0xB388FF, 0x82B1FF, 0x80D8FF, 0x84FFFF][i]);
            bg.fillCircle(bx + offsetX, by, 4);
            bg.fillCircle(bx - 5 + offsetX, by - 3, 4);
            bg.fillCircle(bx + 5 + offsetX, by - 3, 4);
        }
    }
}

    update(time, delta) {
        if (!this.isRunning) return;

        // Проверяем нажатия клавиш (JustDown — один раз за нажатие)
        this.inputManager.update();

        // Движение фона с бесшовным повторением
        const moveAmount = this.speed * (delta / 1000);
        this.backgrounds.forEach((bg) => {
            if (bg && bg.active) {
                bg.x -= moveAmount;
            }
        });
        
        // Бесшовное повторение — когда копия уходит за -1280, возвращаем её за вторую копию
        for (let i = 0; i < this.backgrounds.length; i++) {
            const bg = this.backgrounds[i];
            if (bg && bg.active && bg.x <= -1280) {
                const maxX = Math.max(...this.backgrounds.map(b => b.active ? b.x : -Infinity));
                bg.x = maxX + 1280;
            }
        }

        // Обновление главы
        this.chapterManager.update(delta);
        
        // Проверка смены главы
        if (this.chapterManager.currentChapter !== this.lastChapter && !this.chapterTransitionActive) {
            this.lastChapter = this.chapterManager.currentChapter;
            this.startChapterTransition();
        }
        
        // Обработка перехода главы
        if (this.chapterTransitionActive) {
            this.chapterTransitionTimer += delta;
            if (this.chapterTransitionTimer >= 3000 && !this.chapterTransitionEnded) {
                this.endChapterTransition();
            }
        }
        
        // Движение Анны вперёд
        this.anna.sprite.body.setVelocityX(this.speed);        

        // Увеличение скорости
        this.speedUpTimer += delta;
        if (this.speedUpTimer >= 15000) {
        this.speedUpTimer = 0;
        this.hudUpdateTimer = 0;
            this.speed = Math.min(this.speed + 15, 600);
        }

        // Спавн препятствий (останавливается при показе названия главы)
        if (!this.isSpawningPaused) {
            this.spawnerTimer += delta;
            const spawnInterval = Math.max(1000, 2500 - this.chapterManager.currentChapter * 300);
            if (this.spawnerTimer >= spawnInterval) {
                this.spawnerTimer = 0;
                this.spawnObstacle();
            }
        }

        // Спавн кристаллов (тоже останавливается)
        if (!this.isSpawningPaused) {
            this.crystalSpawnTimer += delta;
            if (this.crystalSpawnTimer >= 800) {
                this.crystalSpawnTimer = 0;
                this.spawnCrystal();
            }
        }

        // Синхронизация graphic с физическими телами
        this.syncPhysics();

        // Очистка объектов за экраном
        this.cleanupObjects();

        // Обновление Анны
        this.anna.update(time, delta);

        // Пассивный набор очков (за расстояние — замедленно)
        this.scoreManager.score += Math.floor(this.speed * (delta / 1000) * 0.5);

        // Обновление HUD каждые 100мс
        this.hudUpdateTimer += delta;
        if (this.hudUpdateTimer >= 100) {
            this.hudUpdateTimer = 0;
            this.updateHUD();
        }
    }

    /**
     * Синхронизирует позицию graphic с физическим телом объекта
     * Критично: препятствия и кристаллы имеют physics body, но graphic — отдельный объект
     */
        syncPhysics() {
        // Mage летает волнообразно и бросает зелья
        this.mageInstances.forEach(mage => {
            if (mage.sprite && mage.sprite.active) {
                mage.update(this.time.now, 16);
            }
        });

        // Ниндзя-курьер ускоряется к Анне
        this.ninjaInstances.forEach(ninja => {
            if (ninja.sprite && ninja.sprite.active) {
                ninja.update(16);
            }
        });

        // Кристаллы парят
        this.crystals.children.each((sprite) => {
            if (sprite && sprite.active && sprite.userData.isCrystal) {
                // Анимация пульсации
                const time = this.time.now;
                const pulse = 1 + Math.sin(time * 0.005) * 0.15;
                sprite.setScale(pulse);
            }
        });
    }

    spawnObstacle() {
        const chapter = this.chapterManager.currentChapter;
        const y = this.groundY - 80;
        const knightY = this.groundY - 120; // Рыцари выше — можно проскользнуть под ними
        const baronY = this.groundY - 40; // Барон ниже — касается земли
        let obstacle;
        const rand = Math.random();

        if (chapter === 0) {
            obstacle = this.obstacles.create(1350, baronY, 'baron');
        } else if (chapter === 1) {
            if (rand < 0.5) {
                obstacle = this.obstacles.create(1350, baronY, 'baron');
            } else {
                obstacle = this.obstacles.create(1350, knightY, 'knight');
            }
        } else if (chapter === 2) {
            if (rand < 0.35) {
                obstacle = this.obstacles.create(1350, baronY, 'baron');
            } else if (rand < 0.7) {
                obstacle = this.obstacles.create(1350, knightY, 'knight');
            } else {
                // Маг на случайной высоте
                const mageY = this.groundY - 200 - Math.random() * 200;
                obstacle = this.obstacles.create(1350, mageY, 'mage');
            }
        } else if (chapter === 3) {
            if (rand < 0.25) {
                obstacle = this.obstacles.create(1350, baronY, 'baron');
            } else if (rand < 0.5) {
                obstacle = this.obstacles.create(1350, knightY, 'knight');
            } else {
                // Маг на случайной высоте
                const mageY = this.groundY - 200 - Math.random() * 200;
                obstacle = this.obstacles.create(1350, mageY, 'mage');
            }
        } else {
            // Последняя глава — больше ниндзя-курьеров на всей высоте
            if (rand < 0.15) {
                obstacle = this.obstacles.create(1350, baronY, 'baron');
            } else if (rand < 0.30) {
                obstacle = this.obstacles.create(1350, knightY, 'knight');
            } else if (rand < 0.45) {
                // Маг на случайной высоте
                const mageY = this.groundY - 200 - Math.random() * 200;
                obstacle = this.obstacles.create(1350, mageY, 'mage');
            } else {
                // Ниндзя-курьер на ВСЕЙ высоте игровой зоны (от земли до потолка)
                const ninjaY = this.groundY - 80 - Math.random() * 450;
                obstacle = this.obstacles.create(1350, ninjaY, 'ninja');
            }
        }

        if (obstacle) {
            obstacle.body.setVelocityX(-this.speed);
            obstacle.body.setAllowGravity(false);
            obstacle.body.setBounce(0);
            obstacle.userData = { isObstacle: true, hit: false };
            
            // Создаём экземпляр мага если это маг
            if (obstacle.texture.key === 'mage') {
                const mage = new Mage(this, obstacle);
                this.mageInstances.push(mage);
            }
            
            // Создаём экземпляр ниндзя если это ниндзя
            if (obstacle.texture.key === 'ninja') {
                const ninja = new Ninja(this, obstacle);
                this.ninjaInstances.push(ninja);
            }
        }
    }

    spawnCrystal() {
        const heightVariation = Math.random();
        let y;

        if (heightVariation < 0.4) {
            y = this.groundY - 24;
        } else if (heightVariation < 0.8) {
            y = this.groundY - 200 - Math.random() * 80;
        } else {
            y = this.groundY - 320 - Math.random() * 50;
        }

        const crystal = this.crystals.create(1350, y, 'crystal');
        crystal.body.allowGravity = false;
        crystal.body.setVelocityX(-this.speed);
        crystal.body.setBounce(0);
        crystal.userData = { isCrystal: true, collected: false }; // <-- Сброс
    }

    cleanupObjects() {
        // Препятствия
        this.obstacles.children.each((graphic) => {
            if (graphic && graphic.active) {
                const parent = graphic.userData.parent;
                if (parent && parent.isOffScreen()) {
                    // Начисляем очки за уклонение
                    this.scoreManager.score += 5;
                    parent.destroy();
                    graphic.destroy();
                }
            }
        });

        // Очищаем магов которые улетели
        this.mageInstances = this.mageInstances.filter(mage => {
            if (mage.sprite && mage.sprite.active && mage.sprite.x < -100) {
                // Начисляем очки за уклонение от мага
                this.scoreManager.score += 5;
                mage.sprite.destroy();
                return false;
            }
            return true;
        });

        // Очищаем ниндзя которые улетели
        this.ninjaInstances = this.ninjaInstances.filter(ninja => {
            if (ninja.sprite && ninja.sprite.active && ninja.sprite.x < -100) {
                // Начисляем очки за уклонение от ниндзя
                this.scoreManager.score += 5;
                ninja.sprite.destroy();
                return false;
            }
            return true;
        });

        // Кристаллы
        this.crystals.children.each((graphic) => {
            if (graphic && graphic.active) {
                const parent = graphic.userData.parent;
                if (parent && (parent.isOffScreen() || parent.collected)) {
                    if (!parent.collected) parent.destroy();
                    graphic.destroy();
                }
            }
        });

        // Снаряды — удаляем улетевшие и подбитые
        this.potions.children.each((potion) => {
            if (potion && potion.active) {
                if (potion.x < -100 || potion.userData.hit) {
                    this.potions.remove(potion);
                    potion.destroy();
                }
            }
        });
    }

    handleHit(data) {
        if (this.lives <= 0) return;
        if (this.anna.userData.hit) return; // Уже обрабатываем удар
        
        this.anna.userData.hit = true;
        this.lives--;
        this.updateHUD();

        // Звук получения урона
        this.sound.play('hit_sound');

        this.cameras.main.flash(300, 255, 0, 0);
        this.speed = Math.max(150, this.speed - 50);
        this.anna.takeHit();
        
        // Уничтожаем препятствие
        if (data && data.obstacle) {
            data.obstacle.destroy();
        }

        if (this.lives <= 0) {
            this.gameOver();
        }

        this.time.delayedCall(1000, () => {
            this.anna.userData.hit = false;
        });
    }

    gameOver() {
        this.isRunning = false;

        // Сохранение результата
        saveManager.saveRun(
            this.scoreManager.crystals,
            this.scoreManager.score,
            this.chapterManager.currentChapter
        );

        // Проверка концовки
        const isGoodEnding = this.scoreManager.crystals >= 1000;

        // Останавливаем все сцены перед переходом к концовке
        this.scene.stop('UIScene');
        this.scene.stop('GameScene');

        // Переход к концовке
        this.scene.start('EndingScene', {
            isGoodEnding,
            crystals: this.scoreManager.crystals,
            score: this.scoreManager.score,
            chapter: this.chapterManager.currentChapter
        });
    }

        /**
     * Вызывается когда последняя глава пройдена
     */
    onChapterFinished() {
        if (!this.isRunning) return;
        this.isRunning = false;

        saveManager.saveRun(
            this.scoreManager.crystals,
            this.scoreManager.score,
            this.chapterManager.currentChapter
        );

        // Если дошёл до последней главы — это всегда хорошая концовка!
        const isGoodEnding = true;

        console.log('🏁 Финал! Кристаллы:', this.scoreManager.crystals, 'Очки:', this.scoreManager.score);

        this.scene.stop('UIScene');
        this.scene.stop('GameScene');

        this.scene.start('EndingScene', {
            isGoodEnding,
            crystals: this.scoreManager.crystals,
            score: this.scoreManager.score,
            chapter: this.chapterManager.currentChapter
        });
    }

    updateHUD() {
        const uiScene = this.scene.get('UIScene');
        console.log('updateHUD called, uiScene:', uiScene);
        if (uiScene) {
            uiScene.updateHUD({
                lives: this.lives,
                crystals: this.scoreManager.crystals,
                score: this.scoreManager.score,
                chapterProgress: this.chapterManager.getChapterProgress(),
                chapterIndex: this.chapterManager.currentChapter + 1,
                invincible: this.scoreManager.invincible
            });
        }
    }

    updateChapterDisplay() {
        const data = this.chapterManager.currentChapterData;
        const uiScene = this.scene.get('UIScene');
        if (uiScene && uiScene.active) {
            uiScene.updateChapterDisplay({
                chapterName: data.name,
                chapterIndex: this.chapterManager.currentChapter + 1
            });
        }
    }

    showChapterTitle() {
        // Показываем название главы
        const chapterData = this.chapterManager.currentChapterData;
        this.chapterTitleText = this.add.text(640, 300, `Глава ${this.chapterManager.currentChapter + 1}\n${chapterData.name}`, {
            fontSize: '48px',
            fontFamily: 'Georgia, serif',
            color: '#FFFFFF',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5).setDepth(101);
        
        // Анимация появления текста
        this.chapterTitleText.setScale(0.5);
        this.chapterTitleText.setAlpha(0);
        this.tweens.add({
            targets: this.chapterTitleText,
            scale: 1,
            alpha: 1,
            duration: 600,
            ease: 'Back.easeOut'
        });
        
        // Скрываем через 2 секунды
        this.time.delayedCall(2000, () => {
            if (this.chapterTitleText) {
                this.tweens.add({
                    targets: this.chapterTitleText,
                    alpha: 0,
                    scale: 1.2,
                    duration: 500,
                    ease: 'Power2',
                    onComplete: () => {
                        this.chapterTitleText.destroy();
                        this.chapterTitleText = null;
                    }
                });
            }
        });
    }

    startChapterTransition() {
        this.chapterTransitionActive = true;
        this.chapterTransitionTimer = 0;
        this.chapterTransitionEnded = false;
        
        // Останавливаем спавн, но не игру
        this.isSpawningPaused = true;
        
        // Создаем оверлей для затухания
        this.chapterTransitionOverlay = this.add.graphics();
        this.chapterTransitionOverlay.fillStyle(0x000000, 0);
        this.chapterTransitionOverlay.fillRect(0, 0, 1280, 720);
        this.chapterTransitionOverlay.setDepth(100);
        
        // Анимация появления оверлея (затухание)
        this.tweens.add({
            targets: this.chapterTransitionOverlay,
            alpha: 0.7,
            duration: 800,
            ease: 'Power2'
        });
        
        // Показываем название главы
        const chapterData = this.chapterManager.currentChapterData;
        this.chapterTitleText = this.add.text(640, 300, `Глава ${this.chapterManager.currentChapter + 1}\n${chapterData.name}`, {
            fontSize: '48px',
            fontFamily: 'Georgia, serif',
            color: '#FFFFFF',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5).setDepth(101);
        
        // Анимация появления текста
        this.chapterTitleText.setScale(0.5);
        this.chapterTitleText.setAlpha(0);
        this.tweens.add({
            targets: this.chapterTitleText,
            scale: 1,
            alpha: 1,
            duration: 600,
            ease: 'Back.easeOut',
            delay: 400
        });
        
        // Через 1.5 секунды сменяем фон
        this.time.delayedCall(1500, () => {
            this.setupBackground();
        });
    }

    endChapterTransition() {
        // Если уже завершили, выходим
        if (this.chapterTransitionEnded) return;
        this.chapterTransitionEnded = true;
        
        // Анимация исчезновения оверлея
        if (this.chapterTransitionOverlay) {
            this.tweens.add({
                targets: this.chapterTransitionOverlay,
                alpha: 0,
                duration: 800,
                ease: 'Power2',
                onComplete: () => {
                    this.chapterTransitionOverlay.destroy();
                    this.chapterTransitionOverlay = null;
                }
            });
        }
        
        // Анимация исчезновения текста
        if (this.chapterTitleText) {
            this.tweens.add({
                targets: this.chapterTitleText,
                alpha: 0,
                scale: 1.2,
                duration: 500,
                ease: 'Power2',
                onComplete: () => {
                    this.chapterTitleText.destroy();
                    this.chapterTitleText = null;
                }
            });
        }
        
        // Возобновляем спавн
        this.time.delayedCall(800, () => {
            this.isSpawningPaused = false;
            this.chapterTransitionActive = false;
            this.chapterTransitionTimer = 0;
            this.chapterTransitionEnded = false;
        });
    }

    pauseGame() {
        this.scene.pause();
    }

    resumeGame() {
        this.scene.resume();
    }

    destroy() {
        // Очищаем обработчики ввода
        if (this.inputManager) {
            this.inputManager.destroy();
        }
    }
}
