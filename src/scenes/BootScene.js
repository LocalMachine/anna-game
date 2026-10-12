/**
 * Загрузка ресурсов и создание детализированной placeholder-графики
 */
export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Загружаем фоновую музыку для главного меню
        this.load.audio('menu_music', 'assets/audio/Love Oranges - Elixir.mp3');
        // Загружаем игровую музыку
        this.load.audio('game_music', 'assets/audio/Neon Husky - Detached HEAD Pursuit.mp3');
        // Загружаем музыку для хорошей концовки
        this.load.audio('victory_music', 'assets/audio/Macan - Asphalt 8.mp3');
        // Загружаем музыку для плохой концовки
        this.load.audio('gameover_music', 'assets/audio/game-over-trombone-1940.wav');
        // Загружаем звук подбора кристалла
        this.load.audio('crystal_sound', 'assets/audio/get cristal.mp3');
        // Загружаем звук получения урона
        this.load.audio('hit_sound', 'assets/audio/death-sound.mp3');
        // Загружаем звук удара
        this.load.audio('punch_sound', 'assets/audio/punch.mp3');
        // Загружаем звук невидимости
        this.load.audio('invisibility_sound', 'assets/audio/invisability.mp3');
    }

    create() {
        // Создаём placeholder-текстуры для физики
        const size = 1;
        const bg = this.make.graphics({ x: 0, y: 0, add: false });
        bg.fillStyle(0xFFFFFF);
        bg.fillRect(0, 0, size, size);
        bg.generateTexture('blank', size, size);
        bg.destroy();

        // Генерируем текстуру для Анны
        this.generateAnnaTexture();

        // Генерируем текстуры для препятствий
        this.generateObstacleTextures();

        // Генерируем текстуру для кристаллов
        this.generateCrystalTexture();

        // Генерируем UI-текстуры
        this.generateUITextures();

        // Генерируем текстуру для зелья мага
        this.generatePotionTexture();

        // Переход в меню
        this.time.delayedCall(500, () => {
            this.scene.start('MenuScene');
        });
    }

    generateAnnaTexture() {
        const cg = this.make.graphics({ x: 0, y: 0, add: false });

        // === ВОЛОСЫ (длинная шевелюра до пояса) ===
        // Задняя часть волос
        cg.fillStyle(0x5D4037);
        cg.fillCircle(32, 16, 16);
        cg.fillRect(18, 16, 28, 50);
        cg.fillCircle(18, 50, 10);
        cg.fillCircle(46, 50, 10);
        
        // Блестки на волосах
        cg.fillStyle(0x8D6E63, 0.5);
        cg.fillCircle(28, 20, 4);
        cg.fillCircle(36, 18, 3);
        cg.fillCircle(24, 30, 3);

        // === ШЕЯ ===
        cg.fillStyle(0xFFCCBC);
        cg.fillRect(28, 28, 8, 8);

        // === БЛУЗКА (корсет) ===
        cg.fillStyle(0xDC2600);
        cg.fillRect(18, 34, 28, 22);
        
        // Воротник V-образный
        cg.fillStyle(0xFFCCBC);
        cg.beginPath();
        cg.moveTo(24, 34);
        cg.lineTo(32, 44);
        cg.lineTo(40, 34);
        cg.closePath();
        cg.fillPath();
        
        // Блестки на корсете
        cg.fillStyle(0xFF8080, 0.4);
        cg.fillCircle(28, 40, 3);
        cg.fillCircle(36, 42, 2);

        // === ЮБКА (бальная, расклешённая) ===
        cg.fillStyle(0xDC2600);
        cg.beginPath();
        cg.moveTo(18, 54);
        cg.lineTo(8, 90);
        cg.lineTo(56, 90);
        cg.lineTo(46, 54);
        cg.closePath();
        cg.fillPath();
        
        // Складки на юбке
        cg.fillStyle(0xFF4444, 0.4);
        cg.fillRect(24, 54, 4, 36);
        cg.fillRect(36, 54, 4, 36);
        
        // Подол юбки (более светлый)
        cg.fillStyle(0xFF6644);
        cg.fillRect(12, 84, 40, 6);
        
        // Блестки на юбке
        cg.fillStyle(0xFFFFFF, 0.3);
        cg.fillCircle(20, 70, 2);
        cg.fillCircle(44, 75, 2);
        cg.fillCircle(32, 80, 2);

        // === РУКИ ===
        cg.fillStyle(0xFFCCBC);
        // Левая рука
        cg.fillRect(10, 36, 8, 28);
        cg.fillCircle(14, 66, 4);
        // Правая рука
        cg.fillRect(46, 36, 8, 28);
        cg.fillCircle(50, 66, 4);
        
        // Браслеты
        cg.fillStyle(0xFFD700);
        cg.fillRect(10, 58, 8, 3);
        cg.fillRect(46, 58, 8, 3);

        // === ГОЛОВА ===
        cg.fillStyle(0xFFCCBC);
        cg.fillCircle(32, 20, 14);

        // === УШИ ===
        cg.fillStyle(0xFFCCBC);
        cg.fillCircle(18, 20, 4);
        cg.fillCircle(46, 20, 4);
        
        // Серьги
        cg.fillStyle(0xFFD700);
        cg.fillCircle(18, 25, 2);
        cg.fillCircle(46, 25, 2);

        // === ГЛАЗА (большие, выразительные) ===
        // Белки
        cg.fillStyle(0xFFFFFF);
        cg.fillCircle(25, 18, 5);
        cg.fillCircle(39, 18, 5);
        // Радужка
        cg.fillStyle(0x4FC3F7);
        cg.fillCircle(25, 18, 3);
        cg.fillCircle(39, 18, 3);
        // Зрачки
        cg.fillStyle(0x1A237E);
        cg.fillCircle(25, 18, 1.5);
        cg.fillCircle(39, 18, 1.5);
        // Блики
        cg.fillStyle(0xFFFFFF);
        cg.fillCircle(26, 17, 1.5);
        cg.fillCircle(40, 17, 1.5);

        // === УЛЫБКА (красивая) ===
        cg.fillStyle(0xFF8A80);
        cg.beginPath();
        cg.arc(32, 25, 4, 0.2, Math.PI - 0.2);
        cg.fillPath();
        cg.fillStyle(0xFF5252);
        cg.beginPath();
        cg.arc(32, 26, 3, 0.3, Math.PI - 0.3);
        cg.fillPath();

        // === РУМЯНЕЦ ===
        cg.fillStyle(0xFF8A80, 0.4);
        cg.fillCircle(20, 22, 3);
        cg.fillCircle(44, 22, 3);

        // === ЧЕЛКА (боковая) ===
        cg.fillStyle(0x4E342E);
        cg.fillCircle(26, 12, 7);
        cg.fillCircle(34, 10, 8);
        cg.fillCircle(42, 12, 6);
        cg.fillCircle(22, 16, 5);
        cg.fillCircle(30, 14, 6);
        
        // Блестки на челке
        cg.fillStyle(0x8D6E63, 0.4);
        cg.fillCircle(30, 12, 3);
        cg.fillCircle(38, 11, 2);

        // === КОРОНКА (золотая с камнями) ===
        cg.fillStyle(0xFFD700);
        cg.beginPath();
        cg.moveTo(22, 10);
        cg.lineTo(20, 2);
        cg.lineTo(26, 6);
        cg.lineTo(32, 0);
        cg.lineTo(38, 6);
        cg.lineTo(44, 2);
        cg.lineTo(42, 10);
        cg.closePath();
        cg.fillPath();
        
        // Окантовка короны
        cg.lineStyle(1, 0xFFA000);
        cg.beginPath();
        cg.moveTo(22, 10);
        cg.lineTo(20, 2);
        cg.lineTo(26, 6);
        cg.lineTo(32, 0);
        cg.lineTo(38, 6);
        cg.lineTo(44, 2);
        cg.lineTo(42, 10);
        cg.closePath();
        cg.strokePath();
        
        // Камни на короне
        cg.fillStyle(0xE91E63);
        cg.fillCircle(32, 6, 2);
        cg.fillStyle(0x4FC3F7);
        cg.fillCircle(26, 5, 1.5);
        cg.fillCircle(38, 5, 1.5);
        cg.fillStyle(0xFFFFFF);
        cg.fillCircle(32, 4, 1);

        // === БОТИНКИ (туфельки на каблуке) ===
        cg.fillStyle(0xFFD700);
        // Левый ботинок
        cg.fillRect(18, 88, 12, 8);
        cg.fillRect(20, 84, 8, 6);
        // Правый ботинок
        cg.fillRect(34, 88, 12, 8);
        cg.fillRect(36, 84, 8, 6);
        
        // Каблуки
        cg.fillStyle(0xFFA000);
        cg.fillRect(22, 82, 3, 4);
        cg.fillRect(38, 82, 3, 4);
        
        // Блестки на туфельках
        cg.fillStyle(0xFFFF80, 0.5);
        cg.fillCircle(22, 86, 1.5);
        cg.fillCircle(38, 86, 1.5);

        cg.generateTexture('anna', 64, 96);
        cg.destroy();
        
        // === ТЕКСТУРА ДЛЯ БЛЕСКА ПЛАТЬЯ ===
        const shine = this.make.graphics({ x: 0, y: 0, add: false });
        
        // Блестки на платье (только область юбки и корсета)
        // Верхние блики (корсет)
        shine.fillStyle(0xFFFFFF, 0.8);
        shine.fillCircle(24, 38, 2);
        shine.fillCircle(36, 42, 1.5);
        
        // Блики на юбке
        shine.fillStyle(0xFFFFFF, 0.6);
        shine.fillCircle(20, 65, 2.5);
        shine.fillCircle(44, 72, 2);
        shine.fillCircle(32, 80, 2);
        shine.fillCircle(16, 78, 1.5);
        shine.fillCircle(48, 68, 1.5);
        
        // Маленькие искры
        shine.fillStyle(0xFFFF80, 0.9);
        shine.fillCircle(28, 60, 1.5);
        shine.fillCircle(38, 75, 1);
        shine.fillCircle(24, 82, 1);
        
        // Большие мягкие блики
        shine.fillStyle(0xFFFFFF, 0.3);
        shine.fillCircle(22, 70, 4);
        shine.fillCircle(42, 76, 3);
        shine.fillCircle(32, 84, 3);
        
        shine.generateTexture('anna_shine', 64, 96);
        shine.destroy();
    }

        generateObstacleTextures() {
        // БАРОН
        let cg = this.make.graphics({ x: 0, y: 0, add: false });
        cg.fillStyle(0x78909C);
        cg.fillCircle(40, 45, 35);
        cg.fillStyle(0x90A4AE);
        cg.fillCircle(40, 42, 28);
        cg.fillStyle(0xB0BEC5);
        cg.fillCircle(40, 50, 18);
        cg.fillStyle(0xFFCCBC);
        cg.fillCircle(40, 18, 16);
        cg.fillStyle(0xFFFFFF);
        cg.fillCircle(33, 16, 5);
        cg.fillCircle(47, 16, 5);
        cg.fillStyle(0x000000);
        cg.fillCircle(33, 16, 2);
        cg.fillCircle(47, 16, 2);
        cg.lineStyle(2, 0xFFD54F);
        cg.strokeCircle(47, 16, 7);
        cg.fillStyle(0xE1BEE7, 0.3);
        cg.fillCircle(47, 16, 6);
        cg.lineStyle(2, 0x000000);
        cg.beginPath();
        cg.arc(40, 22, 6, 0.2, Math.PI - 0.2);
        cg.strokePath();
        cg.fillStyle(0x546E7A);
        cg.fillRect(25, 72, 12, 8);
        cg.fillRect(43, 72, 12, 8);
        cg.generateTexture('baron', 80, 80);
        cg.destroy();

        // РЫЦАРЬ
        cg = this.make.graphics({ x: 0, y: 0, add: false });
        cg.fillStyle(0x78909C);
        cg.fillRect(12, 35, 36, 45);
        cg.fillStyle(0x90A4AE);
        cg.fillCircle(12, 35, 10);
        cg.fillCircle(48, 35, 10);
        cg.fillStyle(0x607D8B);
        cg.fillRect(18, 8, 24, 30);
        cg.fillStyle(0x37474F);
        cg.fillRect(22, 15, 16, 10);
        cg.fillStyle(0xFF5252);
        cg.fillCircle(26, 20, 2);
        cg.fillCircle(34, 20, 2);
        cg.fillStyle(0xFF7043);
        cg.fillRect(30, -5, 4, 18);
        cg.fillStyle(0xB0BEC5);
        cg.fillRect(50, 25, 4, 40);
        cg.fillStyle(0x5D4037);
        cg.fillRect(48, 60, 8, 8);
        cg.fillStyle(0x42A5F5);
        cg.fillCircle(8, 50, 10);
        cg.fillStyle(0xFFFFFF);
        cg.fillRect(6, 45, 4, 10);
        cg.fillRect(3, 48, 10, 4);
        cg.fillStyle(0x546E7A);
        cg.fillRect(16, 75, 10, 25);
        cg.fillRect(34, 75, 10, 25);
        cg.fillStyle(0x37474F);
        cg.fillRect(14, 95, 14, 5);
        cg.fillRect(32, 95, 14, 5);
        cg.generateTexture('knight', 60, 100);
        cg.destroy();

        // МАГ
        cg = this.make.graphics({ x: 0, y: 0, add: false });
        cg.fillStyle(0x5D4037);
        cg.fillRect(-5, 55, 50, 6);
        cg.fillStyle(0x8D6E63);
        cg.beginPath();
        cg.moveTo(-5, 58);
        cg.lineTo(-25, 75);
        cg.lineTo(-15, 75);
        cg.lineTo(0, 58);
        cg.closePath();
        cg.fillPath();
        cg.fillStyle(0x6A1B9A);
        cg.fillRect(12, 30, 36, 40);
        cg.fillRect(8, 65, 44, 15);
        cg.fillStyle(0xFFCCBC);
        cg.fillCircle(30, 24, 12);
        cg.fillStyle(0xE0E0E0);
        cg.beginPath();
        cg.moveTo(22, 30);
        cg.lineTo(30, 45);
        cg.lineTo(38, 30);
        cg.closePath();
        cg.fillPath();
        cg.fillStyle(0x000000);
        cg.fillCircle(26, 22, 2);
        cg.fillCircle(34, 22, 2);
        cg.fillStyle(0x6A1B9A);
        cg.fillTriangle(12, 15, 48, 15, 30, -8);
        cg.fillStyle(0x00E676);
        cg.fillCircle(8, 45, 5);
        cg.fillStyle(0x69F0AE, 0.3);
        cg.fillCircle(8, 45, 7);
        cg.fillStyle(0xFFD54F);
        cg.fillCircle(52, 35, 2);
        cg.fillCircle(55, 42, 1);
        cg.fillCircle(48, 48, 1);
        cg.generateTexture('mage', 60, 80);
        cg.destroy();

        // НИНДЗЯ
        cg = this.make.graphics({ x: 0, y: 0, add: false });
        cg.fillStyle(0x212121);
        cg.fillRect(8, 22, 34, 40);
        cg.fillStyle(0xFF5252);
        cg.fillRect(8, 45, 34, 4);
        cg.fillStyle(0x212121);
        cg.fillCircle(25, 16, 14);
        cg.fillStyle(0xFFCCBC);
        cg.fillRect(18, 12, 14, 8);
        cg.fillStyle(0x000000);
        cg.fillCircle(22, 15, 2);
        cg.fillCircle(28, 15, 2);
        cg.fillStyle(0xFF5252);
        cg.fillRect(14, 8, 22, 3);
        cg.fillStyle(0xFFECB3);
        cg.fillRect(42, 30, 12, 16);
        cg.fillStyle(0xFF5252);
        cg.fillCircle(48, 38, 3);
        cg.fillStyle(0x1A1A1A);
        cg.fillRect(12, 60, 10, 10);
        cg.fillRect(28, 60, 10, 10);
        cg.fillStyle(0x5D4037);
        cg.fillRect(10, 68, 14, 4);
        cg.fillRect(26, 68, 14, 4);
        cg.generateTexture('ninja', 50, 70);
        cg.destroy();
    }

            generateCrystalTexture() {
        const cg = this.make.graphics({ x: 0, y: 0, add: false });

        // Свечение вокруг кристалла
        cg.fillStyle(0x4FC3F7, 0.15);
        cg.fillCircle(12, 15, 20);
        cg.fillStyle(0x4FC3F7, 0.25);
        cg.fillCircle(12, 15, 16);

        // Основной кристалл — ромбовидная форма
        cg.fillStyle(0x0288D1);
        cg.beginPath();
        cg.moveTo(12, 2);   // верх
        cg.lineTo(22, 15); // право
        cg.lineTo(12, 28); // низ
        cg.lineTo(2, 15);  // лево
        cg.closePath();
        cg.fillPath();

        // Средняя грань (светлее)
        cg.fillStyle(0x4FC3F7);
        cg.beginPath();
        cg.moveTo(12, 5);
        cg.lineTo(19, 15);
        cg.lineTo(12, 25);
        cg.lineTo(5, 15);
        cg.closePath();
        cg.fillPath();

        // Верхняя грань (самая светлая)
        cg.fillStyle(0xB3E5FC);
        cg.beginPath();
        cg.moveTo(12, 5);
        cg.lineTo(16, 12);
        cg.lineTo(12, 15);
        cg.lineTo(8, 12);
        cg.closePath();
        cg.fillPath();

        // Блики на кристалле
        cg.fillStyle(0xFFFFFF, 0.7);
        cg.fillCircle(9, 10, 2);
        cg.fillCircle(14, 11, 1.5);

        // Тень снизу
        cg.fillStyle(0x01579B, 0.3);
        cg.beginPath();
        cg.moveTo(12, 25);
        cg.lineTo(19, 15);
        cg.lineTo(12, 28);
        cg.lineTo(5, 15);
        cg.closePath();
        cg.fillPath();

        cg.generateTexture('crystal', 24, 30);
        cg.destroy();
    }

        generateUITextures() {
        let cg = this.make.graphics({ x: 0, y: 0, add: false });

        // ПОЛНОЕ СЕРДЦЕ
        cg.fillStyle(0xF44336);
        cg.fillCircle(8, 12, 6);
        cg.fillCircle(16, 12, 6);
        cg.fillCircle(8, 18, 5);
        cg.fillCircle(16, 18, 5);
        cg.fillCircle(12, 16, 6);
        cg.fillCircle(12, 22, 4);
        cg.fillStyle(0xFF8A80, 0.4);
        cg.fillCircle(6, 14, 2);
        cg.generateTexture('heart_full', 24, 24);
        cg.destroy();

        // ПУСТОЕ СЕРДЦЕ
        cg = this.make.graphics({ x: 0, y: 0, add: false });
        cg.lineStyle(2, 0xF44336);
        cg.fillCircle(8, 12, 6);
        cg.fillCircle(16, 12, 6);
        cg.fillCircle(8, 18, 5);
        cg.fillCircle(16, 18, 5);
        cg.fillCircle(12, 16, 6);
        cg.fillCircle(12, 22, 4);
        // Очищаем центр
        cg.fillStyle(0x000000, 0);
        cg.fillCircle(12, 16, 4);
        cg.generateTexture('heart_empty', 24, 24);
        cg.destroy();

        // ИКОНКА КРИСТАЛЛА
        cg = this.make.graphics({ x: 0, y: 0, add: false });
        cg.fillStyle(0xFFD54F);
        cg.fillCircle(10, 8, 5);
        cg.fillCircle(10, 14, 5);
        cg.fillCircle(6, 11, 4);
        cg.fillCircle(14, 11, 4);
        cg.fillStyle(0xFFFFFF, 0.5);
        cg.fillCircle(8, 8, 1);
        cg.generateTexture('crystal_icon', 20, 20);
        cg.destroy();
    }

    generatePotionTexture() {
        const cg = this.make.graphics({ x: 0, y: 0, add: false });

        // Свечение зелья
        cg.fillStyle(0xE91E63, 0.15);
        cg.fillCircle(12, 15, 20);
        cg.fillStyle(0xE91E63, 0.25);
        cg.fillCircle(12, 15, 15);

        // Бутылочка — тело
        cg.fillStyle(0xE91E63);
        cg.fillCircle(12, 18, 10);

        // Горлышко
        cg.fillStyle(0xAD1457);
        cg.fillRect(9, 4, 6, 12);

        // Пробка
        cg.fillStyle(0x5D4037);
        cg.fillRect(8, 0, 8, 6);

        // Блики
        cg.fillStyle(0xF8BBD0, 0.6);
        cg.fillCircle(8, 14, 3);
        cg.fillCircle(15, 20, 2);

        // Сердечко на бутылочке
        cg.fillStyle(0xFFFFFF);
        cg.fillCircle(9, 17, 2);
        cg.fillCircle(15, 17, 2);
        cg.fillCircle(12, 20, 2.5);

        cg.generateTexture('potion', 24, 30);
        cg.destroy();
    }
}