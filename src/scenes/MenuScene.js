/**
 * Главное меню
 */
import { scoreManager, chapterManager, saveManager } from '../main.js';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
        this.bgMusic = null;
        this.gameMusic = null;
    }

    create() {
        this.cameras.main.setBackgroundColor(0x87CEEB);

        // Запускаем музыку при первом взаимодействии (из-за политики браузера)
        this.bgMusic = this.sound.add('menu_music', { loop: true, volume: 0.5 });
        
        let menuMusicStarted = false;
        const startMenuMusic = () => {
            if (!menuMusicStarted && this.bgMusic && !this.bgMusic.isPlaying) {
                menuMusicStarted = true;
                this.bgMusic.play();
            }
        };
        
        // Запускаем музыку при наведении мыши (без клика)
        this.input.on('pointermove', startMenuMusic, this);
        
        // Также запускаем при нажатии клавиш (кроме пробел и enter, которые запускают игру)
        this.input.keyboard.on('keydown-TAB', startMenuMusic);

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

        this.add.text(640, 150, 'Анна', {
            fontSize: '72px', fontFamily: 'Georgia, serif',
            color: '#5D4037', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(640, 230, 'Сердце в бегах', {
            fontSize: '48px', fontFamily: 'Georgia, serif',
            color: '#FF7043', fontStyle: 'italic'
        }).setOrigin(0.5);

        this.createButton(640, 380, 'ИГРАТЬ', () => {
            this.startGame();
        });

        const highScore = saveManager.highScore;
        const totalCrystals = saveManager.getTotalCrystals();
        const bestChapter = chapterManager.chaptersUnlocked - 1;

        this.add.text(640, 500, `Рекорд: ${highScore}`, {
            fontSize: '24px', fontFamily: 'Georgia, serif', color: '#5D4037'
        }).setOrigin(0.5);

        this.add.text(640, 535, `Всего кристаллов: ${totalCrystals}`, {
            fontSize: '24px', fontFamily: 'Georgia, serif', color: '#5D4037'
        }).setOrigin(0.5);

        this.add.text(640, 570, `Достигнуто глав: ${bestChapter + 1}/5`, {
            fontSize: '24px', fontFamily: 'Georgia, serif', color: '#5D4037'
        }).setOrigin(0.5);

        this.add.text(640, 660, 'Пробел / Свайп ↑ — Прыжок  |  ↓ — Подкат  |  Shift / Двойной Тап — Невидимка (50 💎)', {
            fontSize: '18px', fontFamily: 'Georgia, serif', color: '#78909C'
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

    createButton(x, y, text, callback) {
        const bg = this.add.rectangle(x, y, 300, 70, 0xFF7043).setInteractive({ useHandCursor: true });
        const label = this.add.text(x, y, text, {
            fontSize: '32px', fontFamily: 'Georgia, serif',
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
        
        // Запускаем игровую музыку
        this.gameMusic = this.sound.add('game_music', { loop: true, volume: 0.6 });
        this.gameMusic.play();
        
        scoreManager.reset();
        chapterManager.reset();
        
        // Запускаем UIScene перед GameScene
        this.scene.start('UIScene');
        this.scene.start('GameScene');
    }
}