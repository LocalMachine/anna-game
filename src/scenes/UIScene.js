/**
 * HUD — отображение жизней, кристаллов, очков, шкалы свободы
 */
import { getAdaptiveFontSize, isMobile } from '../utils/adaptive.js';

export class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
    }

    init(data) {
        this.launchData = data || {};
    }

    create() {
        this.livesLabel = null;
        this.crystalsLabel = null;
        this.scoreLabel = null;
        this.freedomBar = null;
        this.freedomLabel = null;
        this.chapterLabel = null;
        this.chapterNumberLabel = null;
        this.invincibleIndicator = null;
        this.settingsBtn = null;
        this.pauseOverlay = null;
        this.pauseMenuBg = null;
        this.pauseTitle = null;
        this.pauseContinueBtn = null;
        this.pauseMenuBtn = null;
        this.isPaused = false;

        // Адаптивные размеры для мобильных
        this.isMobileDevice = isMobile();

        this.drawHUD();
        this.createSettingsButton();

        // Применяем данные, если были переданы при запуске
        if (Object.keys(this.launchData).length > 0) {
            this.updateUI(this.launchData);
        }
    }

    drawHUD() {
        // Адаптивные размеры
        const hudHeight = this.isMobileDevice ? 46 : 62;
        const livesSize = getAdaptiveFontSize(this.isMobileDevice ? 20 : 30);
        const crystalSize = getAdaptiveFontSize(this.isMobileDevice ? 18 : 26);
        const scoreSize = getAdaptiveFontSize(this.isMobileDevice ? 18 : 26);
        const chapterSize = getAdaptiveFontSize(this.isMobileDevice ? 16 : 24);
        const invincibleSize = getAdaptiveFontSize(this.isMobileDevice ? 20 : 30);
        const chapterTitleSize = getAdaptiveFontSize(this.isMobileDevice ? 18 : 26);

        // Фон HUD (верхняя панель)
        this.hudBg = this.add.graphics();
        this.hudBg.fillStyle(0x1E1E2E, 0.85);
        this.hudBg.fillRect(0, 0, 1280, hudHeight);

        // Жизни (сердечки)
        this.livesLabel = this.add.text(20, 8, '❤️ ❤️ ❤️', {
            fontSize: `${livesSize}px`,
            fontFamily: 'Georgia, serif'
        });

        // Кристаллы
        this.crystalsLabel = this.add.text(200, 8, '💎 0', {
            fontSize: `${crystalSize}px`,
            fontFamily: 'Georgia, serif',
            color: '#FFD54F'
        });

        // Очки
        this.scoreLabel = this.add.text(450, 8, 'Очки: 0', {
            fontSize: `${scoreSize}px`,
            fontFamily: 'Georgia, serif',
            color: '#FFFFFF'
        });

        // Шкала главы (правая сторона)
        this.chapterBar = this.add.graphics();
        const chapterX = this.isMobileDevice ? 880 : 950;
        const chapterNumberX = this.isMobileDevice ? 970 : 1020;
        this.chapterLabel = this.add.text(chapterX, 10, 'Глава:', {
            fontSize: `${chapterSize}px`,
            fontFamily: 'Georgia, serif',
            color: '#B39DDB'
        });
        
        // Номер текущей главы
        this.chapterNumberLabel = this.add.text(chapterNumberX, 10, ' 1', {
            fontSize: `${chapterSize}px`,
            fontFamily: 'Georgia, serif',
            color: '#FFFFFF',
            fontStyle: 'bold'
        });
        
        // Устанавливаем начальное значение
        this.chapterNumberLabel.text = ' 1';

        // Индикатор невидимости
        this.invincibleIndicator = this.add.text(640, 80, '', {
            fontSize: `${invincibleSize}px`,
            fontFamily: 'Georgia, serif',
            color: '#B39DDB',
            fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0);

        // Название главы (центр сверху)
        this.chapterLabel = this.add.text(640, 30, '', {
            fontSize: `${chapterTitleSize}px`,
            fontFamily: 'Georgia, serif',
            color: '#FFFFFF',
            fontStyle: 'italic'
        }).setOrigin(0.5).setAlpha(0);
    }

    createSettingsButton() {
        // Кнопка настроек (шестерёнка)
        const settingsSize = getAdaptiveFontSize(28);
        this.settingsBtn = this.add.text(1240, 30, '⚙️', {
            fontSize: `${settingsSize}px`,
            fontFamily: 'Georgia, serif'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this.settingsBtn.on('pointerdown', () => {
            if (!this.isPaused) {
                this.showPauseMenu();
            }
        });

        this.settingsBtn.on('pointerover', () => {
            this.settingsBtn.setScale(1.1);
        });

        this.settingsBtn.on('pointerout', () => {
            this.settingsBtn.setScale(1);
        });
    }

    showPauseMenu() {
        this.isPaused = true;

        // Затемнение фона
        this.pauseOverlay = this.add.graphics();
        this.pauseOverlay.fillStyle(0x000000, 0.7);
        this.pauseOverlay.fillRect(0, 0, 1280, 720);
        this.pauseOverlay.setDepth(100);

        // Фон меню
        this.pauseMenuBg = this.add.graphics();
        this.pauseMenuBg.fillStyle(0x1E1E2E, 0.95);
        this.pauseMenuBg.fillRoundedRect(440, 200, 400, 280, 20);
        this.pauseMenuBg.setDepth(101);

        // Заголовок
        this.pauseTitle = this.add.text(640, 240, 'Пауза', {
            fontSize: `${getAdaptiveFontSize(40)}px`,
            fontFamily: 'Georgia, serif',
            color: '#FFFFFF'
        }).setOrigin(0.5).setDepth(102);

        // Кнопка "Продолжить"
        this.pauseContinueBtn = this.add.text(640, 330, '▶️ Продолжить', {
            fontSize: `${getAdaptiveFontSize(28)}px`,
            fontFamily: 'Georgia, serif',
            color: '#4CAF50'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(102);

        this.pauseContinueBtn.on('pointerdown', () => {
            this.hidePauseMenu();
        });

        this.pauseContinueBtn.on('pointerover', () => {
            this.pauseContinueBtn.setScale(1.05);
        });

        this.pauseContinueBtn.on('pointerout', () => {
            this.pauseContinueBtn.setScale(1);
        });
        // Кнопка "Вернуться в меню"
        this.pauseMenuBtn = this.add.text(640, 430, '🏠 Вернуться в меню', {
            fontSize: `${getAdaptiveFontSize(28)}px`,
            fontFamily: 'Georgia, serif',
            color: '#FF5722'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(102);

        this.pauseMenuBtn.on('pointerdown', () => {
            this.returnToMenu();
        });

        this.pauseMenuBtn.on('pointerover', () => {
            this.pauseMenuBtn.setScale(1.05);
        });

        this.pauseMenuBtn.on('pointerout', () => {
            this.pauseMenuBtn.setScale(1);
        });

        // Останавливаем игру
        this.scene.get('GameScene').pauseGame();
    }

    hidePauseMenu() {
        this.isPaused = false;

        // Удаляем все элементы меню
        if (this.pauseOverlay) { this.pauseOverlay.destroy(); this.pauseOverlay = null; }
        if (this.pauseMenuBg) { this.pauseMenuBg.destroy(); this.pauseMenuBg = null; }
        if (this.pauseTitle) { this.pauseTitle.destroy(); this.pauseTitle = null; }
        if (this.pauseContinueBtn) { this.pauseContinueBtn.destroy(); this.pauseContinueBtn = null; }
        if (this.pauseMenuBtn) { this.pauseMenuBtn.destroy(); this.pauseMenuBtn = null; }

        // Восстанавливаем игру
        this.scene.get('GameScene').resumeGame();
    }

    returnToMenu() {
        this.hidePauseMenu();
        
        // Останавливаем игровую музыку ПЕРЕД остановкой сцены
        this.sound.stopByKey('game_music');
        
        this.scene.stop('GameScene');
        this.scene.stop('EndingScene');
        this.scene.stop('UIScene');
        
        // Сбрасываем менеджеры и перезапускаем меню
        import('../main.js').then(({ scoreManager, chapterManager }) => {
            scoreManager.reset();
            chapterManager.reset();
            this.scene.start('MenuScene');
        });
    }

    updateUI(data) {
        // Если labels ещё не созданы, выходим
        if (!this.livesLabel || !this.crystalsLabel || !this.scoreLabel) {
            return;
        }
        
        // Жизни
        const hearts = [];
        for (let i = 0; i < 3; i++) {
            hearts.push(i < data.lives ? '❤️' : '🖤');
        }
        this.livesLabel.text = hearts.join(' ');

        // Кристаллы
        this.crystalsLabel.text = `💎 ${data.crystals}`;

        // Очки
        this.scoreLabel.text = `Очки: ${data.score}`;

        // Шкала главы
        this.chapterBar.clear();
        const barX = 1070;
        const barY = 18;
        const barWidth = 120;
        const barHeight = 16;
        const percent = data.chapterProgress || 0;

        this.chapterBar.fillStyle(0x37474F);
        this.chapterBar.fillRect(barX, barY, barWidth, barHeight);

        if (percent > 0) {
            const color = percent >= 1 ? 0x4CAF50 : 0x4FC3F7;
            this.chapterBar.fillStyle(color);
            this.chapterBar.fillRect(barX, barY, barWidth * percent, barHeight);
        }

        this.chapterBar.lineStyle(2, 0xFFFFFF, 0.3);
        this.chapterBar.strokeRect(barX, barY, barWidth, barHeight);
        
        // Обновляем номер главы
        if (data.chapterIndex) {
            this.chapterNumberLabel.text = ` ${data.chapterIndex}`;
        }

        // Индикатор невидимости
        if (data.invincible) {
            this.invincibleIndicator.text = '✨ НЕВИДИМОСТЬ ✨';
            this.invincibleIndicator.setAlpha(1);
        } else {
            this.invincibleIndicator.setAlpha(0);
        }

        // Название главы
        if (data.chapterName) {
            this.chapterLabel.text = `Глава: ${data.chapterIndex} - ${data.chapterName}`;
            this.chapterLabel.setAlpha(1);

            this.time.delayedCall(3000, () => {
                this.chapterLabel.setAlpha(0);
            });
        }
    }

    // Вызывается из GameScene
    updateHUD(data) {
        this.updateUI(data);
    }

    updateChapterDisplay(data) {
        this.updateUI(data);
    }
}