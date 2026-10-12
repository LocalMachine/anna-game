import { InputManager } from './systems/InputManager.js';
import { ScoreManager } from './systems/ScoreManager.js';
import { ChapterManager } from './systems/ChapterManager.js';
import { SaveManager } from './systems/SaveManager.js';
import { BootScene } from './scenes/BootScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { UIScene } from './scenes/UIScene.js';
import { EndingScene } from './scenes/EndingScene.js';

const CONFIG = {
    width: 1280,
    height: 720,
    backgroundColor: '#87CEEB',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1200 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1280,
        height: 720,
        // Адаптация под мобильные устройства
        expandParent: true,
        roundPixels: 1
    },
    render: {
        antialias: true,
        pixelArt: false,
        roundPixels: 1
    }
};

export let inputManager, scoreManager, chapterManager, saveManager;

const game = new Phaser.Game({
    ...CONFIG,
    scene: [BootScene, MenuScene, GameScene, UIScene, EndingScene],
    parent: 'game'
});

// Инициализация систем после создания игры
inputManager = new InputManager(game);
scoreManager = new ScoreManager();
scoreManager.game = game;
chapterManager = new ChapterManager();
chapterManager.game = game;
saveManager = new SaveManager();

// Проверка ориентации устройства
function checkOrientation() {
    const warning = document.getElementById('orientation-warning');
    const isMobileDevice = window.innerWidth <= 768;
    
    if (isMobileDevice && window.innerHeight > window.innerWidth) {
        // Вертикальная ориентация на мобильном
        warning.classList.add('show');
    } else {
        warning.classList.remove('show');
    }
}

// Проверяем при загрузке и при изменении размера
window.addEventListener('load', checkOrientation);
window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', () => {
    setTimeout(checkOrientation, 100); // Небольшая задержка для стабилизации
});
