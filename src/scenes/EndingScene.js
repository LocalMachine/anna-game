/**
 * Сцена концовок
 * Хорошая: Анна и суженый уезжают в BMW кабриолете в закат
 * Плохая: Анна возвращается на скучный бал
 */
import { getAdaptiveFontSize, getAdaptiveButtonSize, isMobile } from '../utils/adaptive.js';

export class EndingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EndingScene' });
    }

    shutdown() {
        // Останавливаем всю музыку при уничтожении сцены
        this.sound.stopByKey('victory_music');
        this.sound.stopByKey('gameover_music');
    }

    create(data) {
        this.isGoodEnding = data.isGoodEnding;
        this.crystals = data.crystals;
        this.score = data.score;
        this.chapter = data.chapter;

        // Адаптивные размеры для мобильных
        this.isMobileDevice = isMobile();

        if (this.isGoodEnding) {
            this.showGoodEnding();
        } else {
            this.showBadEnding();
        }
    }

    showGoodEnding() {
        // Запускаем музыку победы
        this.victoryMusic = this.sound.add('victory_music', { loop: true, volume: 0.6 });
        this.victoryMusic.play();
        
        let annaSprite, groomSprite, carGroup;
        let hearts = [];

        // === Фон: закат ===
        const sky = this.add.graphics();
        sky.fillGradientStyle(0xFF6F00, 0xFF6F00, 0xE91E63, 0xE91E63, 1);
        sky.fillRect(0, 0, 1280, 720);

        sky.fillStyle(0xFFD54F);
        sky.fillCircle(640, 350, 80);
        sky.fillStyle(0xFFECB3, 0.5);
        sky.fillCircle(640, 350, 100);

        sky.fillStyle(0x455A64);
        sky.fillRect(0, 550, 1280, 170);

        sky.fillStyle(0xFFFFFF);
        for (let x = 0; x < 1280; x += 80) {
            sky.fillRect(x, 630, 40, 4);
        }

        sky.fillStyle(0xFFB74D, 0.3);
        sky.fillCircle(200, 150, 60);
        sky.fillCircle(250, 140, 50);
        sky.fillCircle(300, 150, 60);

        // Адаптивные размеры
        const titleSize = getAdaptiveFontSize(44);
        const text1Size = getAdaptiveFontSize(26);
        const buttonSize = getAdaptiveButtonSize(350, 60);

        // === Заголовок ===
        const titleText = this.add.text(640, 120, 'Игра пройдена!', {
            fontSize: `${titleSize}px`, fontFamily: 'Georgia, serif', color: '#FFFFFF',
            fontStyle: 'bold', stroke: '#000000', strokeThickness: 6
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({ targets: titleText, alpha: 1, duration: 1500, delay: 3000 });

        // === Анна ===
        annaSprite = this.add.sprite(200, 480, 'anna').setScale(1.5);
        annaSprite.setAlpha(0);
        this.tweens.add({ targets: annaSprite, alpha: 1, duration: 1000, delay: 5000 });

        const text1 = this.add.text(640, 220, 'Анна встретила своего суженого', {
            fontSize: `${text1Size}px`, fontFamily: 'Georgia, serif', color: '#FFFFFF',
            stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5).setAlpha(0);
        this.tweens.add({
            targets: text1, alpha: 1, duration: 1000, delay: 6000,
            onComplete: () => {
                this.time.delayedCall(2000, () => {
                    this.tweens.add({ targets: text1, alpha: 0, duration: 800 });
                });
            }
        });

                // === Суженый — красивый молодой человек в костюме ===
        const gc = this.make.graphics({ x: 0, y: 0, add: false });

        // === ВОЛОСЫ (чёлка, уложенные) ===
        gc.fillStyle(0x3E2723);
        gc.fillCircle(32, 14, 16);
        gc.fillRect(16, 14, 32, 10);
        gc.fillStyle(0x4E342E);
        gc.fillCircle(22, 12, 8);
        gc.fillCircle(32, 10, 9);
        gc.fillCircle(42, 12, 8);

        // === ГОЛОВА ===
        gc.fillStyle(0xFFCCBC);
        gc.fillCircle(32, 22, 16);

        // === ГЛАЗА (выразительные) ===
        gc.fillStyle(0xFFFFFF);
        gc.fillCircle(25, 20, 5);
        gc.fillCircle(39, 20, 5);
        gc.fillStyle(0x1A237E);
        gc.fillCircle(25, 20, 3);
        gc.fillCircle(39, 20, 3);
        gc.fillStyle(0x000000);
        gc.fillCircle(25, 20, 1.5);
        gc.fillCircle(39, 20, 1.5);
        gc.fillStyle(0xFFFFFF);
        gc.fillCircle(26, 19, 1);
        gc.fillCircle(40, 19, 1);

        // === БРОВИ (подчёркивают красоту) ===
        gc.lineStyle(2, 0x3E2723);
        gc.beginPath();
        gc.arc(25, 15, 5, Math.PI + 0.3, -0.3);
        gc.strokePath();
        gc.beginPath();
        gc.arc(39, 15, 5, Math.PI + 0.3, -0.3);
        gc.strokePath();

        // === НОС ===
        gc.fillStyle(0xFFCCBC);
        gc.fillCircle(32, 26, 2);

        // === УЛЫБКА (уверенная, красивая) ===
        gc.lineStyle(2, 0x5D4037);
        gc.beginPath();
        gc.arc(32, 28, 6, 0.2, Math.PI - 0.2);
        gc.strokePath();

        // === УШИ ===
        gc.fillStyle(0xFFCCBC);
        gc.fillCircle(16, 22, 4);
        gc.fillCircle(48, 22, 4);

        // === ШЕЯ ===
        gc.fillStyle(0xFFCCBC);
        gc.fillRect(26, 36, 12, 6);

        // === КОСТЮМ (элегантный тёмно-синий) ===
        gc.fillStyle(0x1A237E);
        gc.fillRect(10, 42, 44, 30);

        // === ВОРОТНИК (белая рубашка) ===
        gc.fillStyle(0xFFFFFF);
        gc.beginPath();
        gc.moveTo(24, 42);
        gc.lineTo(32, 52);
        gc.lineTo(40, 42);
        gc.closePath();
        gc.fillPath();

        // === ГАЛСТУК (красный) ===
        gc.fillStyle(0xC62828);
        gc.beginPath();
        gc.moveTo(30, 48);
        gc.lineTo(34, 48);
        gc.lineTo(35, 62);
        gc.lineTo(32, 66);
        gc.lineTo(29, 62);
        gc.closePath();
        gc.fillPath();

        // === РУКИ (на бёдрах, уверенная поза) ===
        gc.fillStyle(0x1A237E);
        gc.fillRect(2, 44, 10, 20);
        gc.fillRect(52, 44, 10, 20);
        gc.fillStyle(0xFFCCBC);
        gc.fillCircle(7, 66, 4);
        gc.fillCircle(57, 66, 4);

        // === БРЮКИ ===
        gc.fillStyle(0x263238);
        gc.fillRect(14, 72, 14, 24);
        gc.fillRect(36, 72, 14, 24);

        // === БОТИНКИ (чёрные, лакированные) ===
        gc.fillStyle(0x212121);
        gc.fillRect(12, 92, 16, 6);
        gc.fillRect(36, 92, 16, 6);
        gc.fillStyle(0x424242);
        gc.fillRect(14, 92, 12, 2);
        gc.fillRect(38, 92, 12, 2);

        gc.generateTexture('groom', 64, 100);
        gc.destroy();

        groomSprite = this.add.sprite(1080, 480, 'groom').setScale(1.5);
        groomSprite.setAlpha(0);
        this.tweens.add({ targets: groomSprite, alpha: 1, duration: 1000, delay: 7000 });

        const text2Size = getAdaptiveFontSize(26);
        const text2 = this.add.text(640, 300, 'Они подходят друг к другу', {
            fontSize: `${text2Size}px`, fontFamily: 'Georgia, serif', color: '#FFFFFF',
            stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5).setAlpha(0);
        this.tweens.add({
            targets: text2, alpha: 1, duration: 1000, delay: 8000,
            onComplete: () => {
                this.time.delayedCall(2000, () => {
                    this.tweens.add({ targets: text2, alpha: 0, duration: 800 });
                });
            }
        });

        // === Подходят и обнимаются ===
        this.tweens.add({ targets: annaSprite, x: 600, duration: 2000, delay: 9000, ease: 'Power2' });
        this.tweens.add({ targets: groomSprite, x: 680, duration: 2000, delay: 9000, ease: 'Power2' });

        const text3Size = getAdaptiveFontSize(28);
        const text3 = this.add.text(640, 380, 'Обнимаются...', {
            fontSize: `${text3Size}px`, fontFamily: 'Georgia, serif', color: '#FFD54F',
            stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5).setAlpha(0);
        this.tweens.add({
            targets: text3, alpha: 1, duration: 1000, delay: 11000,
            onComplete: () => {
                this.time.delayedCall(2500, () => {
                    this.tweens.add({ targets: text3, alpha: 0, duration: 800 });
                });
            }
        });

        // === Сердечки (исчезают) ===
        const heartSize = getAdaptiveFontSize(28);
        this.time.delayedCall(11500, () => {
            for (let i = 0; i < 5; i++) {
                const heart = this.add.text(640, 350, '❤️', { fontSize: `${heartSize}px` }).setAlpha(0);
                hearts.push(heart);
                this.tweens.add({
                    targets: heart, x: 640 + (Math.random() - 0.5) * 100,
                    y: 300 - Math.random() * 100, alpha: 1, scale: 1.5,
                    duration: 1500, delay: i * 200, ease: 'Power2',
                    onComplete: () => {
                        this.time.delayedCall(2000, () => {
                            this.tweens.add({ targets: heart, alpha: 0, duration: 800, onComplete: () => heart.destroy() });
                        });
                    }
                });
            }
        });

        // === BMW кабриолет ===
        carGroup = this.add.group();

        const carBody = this.add.graphics();
        carBody.fillStyle(0x1A237E);
        carBody.fillRoundedRect(800, 480, 200, 50, 10);
        carBody.fillStyle(0x283593);
        carBody.fillRoundedRect(830, 450, 140, 40, 8);
        carBody.fillStyle(0x87CEEB, 0.6);
        carBody.fillRoundedRect(840, 455, 50, 30, 5);
        carBody.fillRoundedRect(900, 455, 50, 30, 5);
        carBody.fillStyle(0x212121);
        carBody.fillCircle(840, 530, 20);
        carBody.fillCircle(960, 530, 20);
        carBody.fillStyle(0x757575);
        carBody.fillCircle(840, 530, 10);
        carBody.fillCircle(960, 530, 10);
        carBody.fillStyle(0xFFD54F);
        carBody.fillCircle(800, 500, 8);
        carBody.fillStyle(0xFF5722);
        carBody.fillCircle(1000, 500, 8);
        carBody.setAlpha(0);
        carGroup.add(carBody);

        const bmwLogo = this.add.graphics();
        bmwLogo.fillStyle(0xFFFFFF);
        bmwLogo.fillCircle(900, 490, 12);
        bmwLogo.lineStyle(2, 0x0000FF);
        bmwLogo.strokeCircle(900, 490, 12);
        bmwLogo.lineStyle(2, 0x000000);
        bmwLogo.beginPath();
        bmwLogo.moveTo(888, 490); bmwLogo.lineTo(912, 490);
        bmwLogo.moveTo(900, 478); bmwLogo.lineTo(900, 502);
        bmwLogo.strokePath();
        bmwLogo.setAlpha(0);
        carGroup.add(bmwLogo);

        this.tweens.add({ targets: carGroup.getChildren(), alpha: 1, duration: 1000, delay: 12000 });

        const text4Size = getAdaptiveFontSize(26);
        const text4 = this.add.text(640, 440, 'Запрыгивают в машину и уезжают в счастливую жизнь', {
            fontSize: `${text4Size}px`, fontFamily: 'Georgia, serif', color: '#FFFFFF',
            stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5).setAlpha(0);
        this.tweens.add({
            targets: text4, alpha: 1, duration: 1000, delay: 13000,
            onComplete: () => {
                this.time.delayedCall(2000, () => {
                    this.tweens.add({ targets: text4, alpha: 0, duration: 800 });
                });
            }
        });

        // === Машина уезжает с персонажами ===
        this.time.delayedCall(14000, () => {
            // Персонажи "садятся" в машину — двигаются к центру машины и исчезают
            this.tweens.add({
                targets: annaSprite,
                x: 880,
                scale: 0.4,
                alpha: 0,
                duration: 1500,
                ease: 'Power2'
            });

            this.tweens.add({
                targets: groomSprite,
                x: 920,
                scale: 0.4,
                alpha: 0,
                duration: 1500,
                ease: 'Power2'
            });

            // Машина уезжает — анимируем каждый объект внутри группы отдельно
            const carChildren = carGroup.getChildren();
            carChildren.forEach(child => {
                this.tweens.add({
                    targets: child,
                    x: 1600,
                    duration: 12000,
                    ease: 'Power2'
                });
            });

            // Уничтожаем группу после анимации
            this.time.delayedCall(13000, () => {
                carGroup.destroy();
            });

            const text5 = this.add.text(640, 500, 'Их история только начиналась...', {
                fontSize: `${text1Size}px`, fontFamily: 'Georgia, serif', color: '#FFD54F',
                stroke: '#000000', strokeThickness: 4
            }).setOrigin(0.5).setAlpha(0);
            this.tweens.add({ targets: text5, alpha: 1, duration: 1500, delay: 11000 });

            const finalTextSize = getAdaptiveFontSize(this.isMobileDevice ? 32 : 48);
            const finalText = this.add.text(640, 580, '✨ КОНЕЦ ✨', {
                fontSize: `${finalTextSize}px`, fontFamily: 'Georgia, serif', color: '#FFFFFF',
                fontStyle: 'bold', stroke: '#000000', strokeThickness: 6
            }).setOrigin(0.5).setAlpha(0);
            this.tweens.add({ targets: finalText, alpha: 1, duration: 2000, delay: 14000 });

            this.time.delayedCall(16000, () => {
                this.createButton(640, 680, 'В МЕНЮ', buttonSize, () => {
                    // Останавливаем музыку концовки
                    this.sound.stopByKey('victory_music');
                    // Останавливаем игровую музыку ПЕРЕД остановкой сцены
                    this.sound.stopByKey('game_music');
                    
                    this.scene.stop('GameScene');
                    this.scene.stop('UIScene');
                    
                    import('../main.js').then(({ scoreManager, chapterManager }) => {
                        scoreManager.reset();
                        chapterManager.reset();
                        this.scene.start('MenuScene');
                    });
                    
                    this.time.delayedCall(100, () => {
                        this.destroy(true);
                    });
                });
            });
        });
    }


    showBadEnding() {
        // Останавливаем игровую музыку
        this.sound.stopByKey('game_music');
        
        // Запускаем музыку проигрыша (1 раз, без повтора)
        this.gameoverMusic = this.sound.add('gameover_music', { loop: false, volume: 0.5 });
        this.gameoverMusic.play();
        
        // === ФОН: БАЛЬНЫЙ ЗАЛ ===
        const bg = this.add.graphics();
        
        // Стены — тёмно-бордовые с золотым оттенком
        bg.fillGradientStyle(0x4A0000, 0x4A0000, 0x2D0000, 0x2D0000, 1);
        bg.fillRect(0, 0, 1280, 720);
        
        // Потолок (арочный)
        bg.fillStyle(0x1A0000);
        bg.fillCircle(640, 0, 800);
        bg.fillRect(0, 0, 1280, 200);
        
        // Золотые декорации на потолке
        bg.lineStyle(3, 0xFFD700, 0.4);
        bg.beginPath();
        bg.moveTo(0, 50); bg.lineTo(1280, 50);
        bg.strokePath();
        
        // === ЛЮСТРА ===
        const chandelier = this.add.graphics();
        chandelier.fillStyle(0xFFD700);
        chandelier.fillCircle(640, 80, 15);
        chandelier.lineStyle(2, 0xFFD700);
        chandelier.beginPath();
        chandelier.moveTo(640, 95);
        chandelier.lineTo(640, 140);
        chandelier.strokePath();
        
        // Подвески люстры
        for (let i = -2; i <= 2; i++) {
            const x = 640 + i * 40;
            chandelier.fillStyle(0xFFD700);
            chandelier.fillCircle(x, 140, 8);
            chandelier.fillStyle(0xFFFF00, 0.8);
            chandelier.fillCircle(x, 140, 4);
            chandelier.lineStyle(1, 0xFFD700);
            chandelier.beginPath();
            chandelier.moveTo(640, 95);
            chandelier.lineTo(x, 140);
            chandelier.strokePath();
        }
        
        // === КОЛОННЫ ===
        for (let i = 0; i < 4; i++) {
            const x = 150 + i * 320;
            const column = this.add.graphics();
            
            // Основная колонна
            column.fillStyle(0x8B7355);
            column.fillRect(x - 20, 150, 40, 500);
            
            // База колонны
            column.fillStyle(0xA0826D);
            column.fillRect(x - 25, 620, 50, 40);
            column.fillRect(x - 25, 150, 50, 20);
            
            // Золотые кольца
            column.lineStyle(3, 0xFFD700, 0.6);
            column.beginPath();
            column.moveTo(x - 22, 200);
            column.lineTo(x + 22, 200);
            column.strokePath();
            column.beginPath();
            column.moveTo(x - 22, 600);
            column.lineTo(x + 22, 600);
            column.strokePath();
        }
        
        // === КРАСНЫЙ КОВЕР ===
        const carpet = this.add.graphics();
        carpet.fillStyle(0x8B0000);
        carpet.fillRoundedRect(440, 400, 400, 300, 10);
        
        // Золотая окантовка ковра
        carpet.lineStyle(4, 0xFFD700, 0.7);
        carpet.strokeRoundedRect(440, 400, 400, 300, 10);
        
        // Узор на ковре
        carpet.lineStyle(2, 0xFFD700, 0.3);
        carpet.beginPath();
        carpet.moveTo(500, 420);
        carpet.lineTo(500, 680);
        carpet.moveTo(780, 420);
        carpet.lineTo(780, 680);
        carpet.strokePath();
        
        // === ТРОН ===
        const throne = this.add.graphics();
        
        // Основание трона
        throne.fillStyle(0x8B0000);
        throne.fillRoundedRect(560, 300, 160, 180, 15);
        
        // Спинка трона (высокая)
        throne.fillStyle(0xA00000);
        throne.fillRoundedRect(570, 220, 140, 100, 10);
        
        // Золотая окантовка трона
        throne.lineStyle(4, 0xFFD700, 0.8);
        throne.strokeRoundedRect(560, 300, 160, 180, 15);
        throne.strokeRoundedRect(570, 220, 140, 100, 10);
        
        // Корона на троне
        throne.fillStyle(0xFFD700);
        throne.beginPath();
        throne.moveTo(600, 220);
        throne.lineTo(610, 190);
        throne.lineTo(625, 210);
        throne.lineTo(640, 185);
        throne.lineTo(655, 210);
        throne.lineTo(670, 190);
        throne.lineTo(680, 220);
        throne.closePath();
        throne.fillPath();
        
        // Подушка на троне
        throne.fillStyle(0x6B0000);
        throne.fillRoundedRect(580, 440, 120, 30, 8);
        
        // === КОРОЛЬ НА ТРОНЕ ===
        const king = this.add.graphics();
        
        // Тело короля (мантия)
        king.fillStyle(0x4B0082);
        king.fillRoundedRect(600, 280, 80, 140, 10);
        
        // Золотая отделка мантии
        king.lineStyle(3, 0xFFD700);
        king.beginPath();
        king.moveTo(640, 290);
        king.lineTo(640, 420);
        king.strokePath();
        
        // Голова короля
        king.fillStyle(0xFFCCBC);
        king.fillCircle(640, 260, 30);
        
        // Борода (используем arc для дуги)
        king.fillStyle(0x8B4513);
        king.beginPath();
        king.moveTo(620, 275);
        // Рисуем дугу для бороды
        king.arc(640, 275, 25, Math.PI * 0.1, Math.PI * 0.9);
        king.lineTo(660, 275);
        king.closePath();
        king.fillPath();
        
        // Глаза (строгие)
        king.fillStyle(0xFFFFFF);
        king.fillCircle(628, 255, 6);
        king.fillCircle(652, 255, 6);
        king.fillStyle(0x8B0000);
        king.fillCircle(628, 255, 3);
        king.fillCircle(652, 255, 3);
        
        // Корона
        king.fillStyle(0xFFD700);
        king.beginPath();
        king.moveTo(615, 240);
        king.lineTo(615, 220);
        king.lineTo(625, 230);
        king.lineTo(640, 210);
        king.lineTo(655, 230);
        king.lineTo(665, 220);
        king.lineTo(665, 240);
        king.closePath();
        king.fillPath();
        
        // Камни на короне
        king.fillStyle(0xFF0000);
        king.fillCircle(640, 225, 4);
        king.fillStyle(0x0000FF);
        king.fillCircle(625, 228, 3);
        king.fillCircle(655, 228, 3);
        
        // Руки на подлокотниках
        king.fillStyle(0x4B0082);
        king.fillRoundedRect(585, 310, 25, 50, 5);
        king.fillRoundedRect(670, 310, 25, 50, 5);
        
        // Кисть рук
        king.fillStyle(0xFFCCBC);
        king.fillCircle(590, 365, 8);
        king.fillCircle(675, 365, 8);
        
        // Скипетр в правой руке
        king.lineStyle(4, 0xFFD700);
        king.beginPath();
        king.moveTo(685, 280);
        king.lineTo(685, 400);
        king.strokePath();
        
        // Шар на скипетре
        king.fillStyle(0xFF0000);
        king.fillCircle(685, 275, 10);
        king.fillStyle(0xFFFF00, 0.6);
        king.fillCircle(685, 275, 5);
        
        // Адаптивные размеры
        const badTitleSize = getAdaptiveFontSize(34);
        const dialogueSize = getAdaptiveFontSize(20);
        const buttonSize = getAdaptiveButtonSize(350, 60);

        // === АННА ВХОДИТ В ЗАЛ ===
        const anna = this.add.sprite(200, 500, 'anna').setScale(1.5);
        anna.setAlpha(0);
        
        // === АНИМАЦИЯ: Анна подходит к трону ===
        this.time.delayedCall(300, () => {
            this.tweens.add({
                targets: anna,
                x: 640,
                alpha: 1,
                duration: 2000,
                ease: 'Power2'
            });
        });
        
        // Диалоги (последовательно, последний не исчезает)
        const dialogues = [
            { text: 'Анна входит в зал...', startDelay: 1200, duration: 500, hide: true },
            { text: 'Король ждёт её с трона', startDelay: 2500, duration: 400, hide: true },
            { text: '«Очередной скучный бал...»', startDelay: 4500, duration: 800, hide: true },
        ];
        
        dialogues.forEach((d) => {
            const label = this.add.text(640, 560, d.text, {
                fontSize: `${dialogueSize}px`,
                fontFamily: 'Georgia, serif',
                color: '#FFFFFF',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5).setAlpha(0);
            
            // Появление текста
            this.time.delayedCall(d.startDelay, () => {
                this.tweens.add({
                    targets: label,
                    alpha: 1,
                    duration: 400
                });
                
                // Исчезновение текста (если нужно)
                if (d.hide) {
                    const hideDelay = d.startDelay + d.duration - 400;
                    this.time.delayedCall(hideDelay, () => {
                        this.tweens.add({
                            targets: label,
                            alpha: 0,
                            duration: 300
                        });
                    });
                }
            });
        });
        
        // === КНОПКА ===
        this.time.delayedCall(7000, () => {
            this.createButton(640, 650, 'В МЕНЮ', buttonSize, () => {
                // Останавливаем музыку проигрыша
                this.sound.stopByKey('gameover_music');
                // Останавливаем игровую музыку ПЕРЕД остановкой сцены
                this.sound.stopByKey('game_music');
                
                // Останавливаем все сцены
                this.scene.stop('GameScene');
                this.scene.stop('UIScene');
                
                this.scene.start('MenuScene');
                
                // Уничтожаем саму EndingScene
                this.time.delayedCall(100, () => {
                    this.destroy(true);
                });
            });
        });
    }

    createButton(x, y, text, size, callback) {
        const bgSize = size || { width: 350, height: 60 };
        const bg = this.add.rectangle(x, y, bgSize.width, bgSize.height, 0xFF7043).setInteractive({ useHandCursor: true });
        const labelSize = getAdaptiveFontSize(bgSize.height * 0.4);
        const label = this.add.text(x, y, text, {
            fontSize: `${labelSize}px`, fontFamily: 'Georgia, serif', color: '#FFFFFF', fontStyle: 'bold'
        }).setOrigin(0.5);

        bg.on('pointerover', () => bg.setFillStyle(0xFF8A65));
        bg.on('pointerout', () => bg.setFillStyle(0xFF7043));
        bg.on('pointerdown', () => {
            if (this.particleEvent) this.particleEvent.remove();
            
            // Вызываем переданный callback
            if (callback) {
                callback();
            }
        });

        return this.add.group([bg, label]);
    }
}