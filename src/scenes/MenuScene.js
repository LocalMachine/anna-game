/**
 * Главное меню
 */
import { scoreManager, chapterManager, saveManager } from '../main.js';
import { getAdaptiveFontSize, getAdaptiveButtonSize, isMobile } from '../utils/adaptive.js';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
        this.bgMusic = null;
        this.gameMusic = null;
    }

    create() {
        this.cameras.main.setBackgroundColor(0x87CEEB);

        // Останавливаем старую музыку при входе в меню
        this.sound.stopByKey('menu_music');
        
        // Запускаем музыку меню
        this.bgMusic = this.sound.add('menu_music', { loop: true, volume: 0.5 });
        
        // Гарантированно запускаем музыку через небольшую задержку
        this.time.delayedCall(200, () => {
            if (this.bgMusic && !this.bgMusic.isPlaying) {
                this.bgMusic.play();
            }
        });

        for (let i = 0; i < 15; i++) {
            const heart = this.add.graphics();
            const x = Math.random() * 1280;
            const y = Math.random() * 720;
            const size = 8 + Math.random() * 16;
            heart.fillStyle(0xFF8A65, 0.2);
            heart.fillCircle(x, y, size);

            this.tweens.add({
                targets: heart,
                alpha: 0.05,
                y: y - 20,
                duration: 2000 + Math.random() * 2000,
                yoyo: true,
                repeat: -1
            });
        }

        // Адаптивные размеры
        const titleSize = getAdaptiveFontSize(52);
        const subtitleSize = getAdaptiveFontSize(34);
        const buttonSize = getAdaptiveButtonSize(300, 70);
        const infoSize = getAdaptiveFontSize(20);
        const controlsSize = getAdaptiveFontSize(16);

        this.add.text(640, 150, 'Анна', {
            fontSize: `${titleSize}px`, fontFamily: 'Georgia, serif',
            color: '#5D4037', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(640, 230, 'Сердце в бегах', {
            fontSize: `${subtitleSize}px`, fontFamily: 'Georgia, serif',
            color: '#FF7043', fontStyle: 'italic'
        }).setOrigin(0.5);

        this.createButton(640, 380, 'ИГРАТЬ', buttonSize, () => {
            this.startGame();
        });

        const highScore = saveManager.highScore;
        const totalCrystals = saveManager.getTotalCrystals();
        const bestChapter = chapterManager.chaptersUnlocked - 1;

        this.add.text(640, 500, `Рекорд: ${highScore}`, {
            fontSize: `${infoSize}px`, fontFamily: 'Georgia, serif', color: '#5D4037'
        }).setOrigin(0.5);

        this.add.text(640, 535, `Всего кристаллов: ${totalCrystals}`, {
            fontSize: `${infoSize}px`, fontFamily: 'Georgia, serif', color: '#5D4037'
        }).setOrigin(0.5);

        this.add.text(640, 570, `Достигнуто глав: ${bestChapter + 1}/5`, {
            fontSize: `${infoSize}px`, fontFamily: 'Georgia, serif', color: '#5D4037'
        }).setOrigin(0.5);

        this.add.text(640, 660, 'Пробел / Свайп ↑ — Прыжок  |  ↓ — Подкат  |  Shift / Двойной Тап — Невидимка (50 💎)', {
            fontSize: `${controlsSize}px`, fontFamily: 'Georgia, serif', color: '#78909C'
        }).setOrigin(0.5);

        this.input.keyboard.on('keydown-SPACE', () => this.startGame());
        this.input.keyboard.on('keydown-ENTER', () => this.startGame());
    }

    shutdown() {
        // Останавливаем обе музыки при уходе с главного меню
        this.sound.stopByKey('menu_music');
        this.sound.stopByKey('game_music');
        this.bgMusic = null;
        this.gameMusic = null;
    }

    createButton(x, y, text, size, callback) {
        const bg = this.add.rectangle(x, y, size.width, size.height, 0xFF7043).setInteractive({ useHandCursor: true });
        const labelSize = getAdaptiveFontSize(size.height * 0.45);
        const label = this.add.text(x, y, text, {
            fontSize: `${labelSize}px`, fontFamily: 'Georgia, serif',
            color: '#FFFFFF', fontStyle: 'bold'
        }).setOrigin(0.5);

        bg.on('pointerover', () => bg.setFillStyle(0xFF8A65));
        bg.on('pointerout', () => bg.setFillStyle(0xFF7043));
        bg.on('pointerdown', () => {
            bg.setFillStyle(0xE64A19);
            callback();
        });
    }

    startGame() {
        // Останавливаем музыку меню
        this.sound.stopByKey('menu_music');
        
        // НЕ запускаем игровую музыку здесь — она запустится в GameScene
        // this.gameMusic = this.sound.add('game_music', { loop: true, volume: 0.6 });
        // this.gameMusic.play();
        
        scoreManager.reset();
        chapterManager.reset();
        
        // Запускаем UIScene перед GameScene
        this.scene.start('UIScene');
        this.scene.start('GameScene');
    }
}
