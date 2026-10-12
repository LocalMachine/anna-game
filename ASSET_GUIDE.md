# ASSET_GUIDE.md — Руководство по ассетам для «Анна: Сердце в бегах»

---

## Структура папок

```
GAME/
├── assets/
│   ├── sprites/            # Спрайты персонажей и объектов
│   ├── backgrounds/        # Фоны для каждой главы
│   ├── audio/
│   │   ├── music/          # Фоновая музыка
│   │   └── sfx/            # Звуковые эффекты
│   └── fonts/              # Шрифты (опционально)
├── src/
│   ├── scenes/
│   │   └── BootScene.js    # ← Здесь загружаются ассеты
│   └── ...
└── ...
```

---

## 1. Sprites (`assets/sprites/`)

### Анна (Anna)
**Файл:** `anna.png`
- **Размер:** 64×96 px
- **Формат:** PNG с прозрачностью
- **Анимация:** 4 кадра бега + 2 кадра прыжка + 1 кадр подката (можно в одном файле 7×64×96, или отдельные файлы)
- **Описание:** Спортивная принцесса в коралловом платье и ботинках, коричневые волосы

### Препятствия

| Файл | Размер | Описание |
|------|--------|----------|
| `baron.png` | 80×80 px | Барон-Толстяк в виде шара, монокль |
| `knight.png` | 60×100 px | Рыцарь в доспехах на колене со свитком |
| `mage.png` | 60×80 px | Маг в фиолетовой мантии на метле со зельем |
| `ninja.png` | 50×70 px | Ниндзя-Курьер в тёмной мантии с письмом |

### Предметы

| Файл | Размер | Описание |
|------|--------|----------|
| `crystal.png` | 24×30 px | Светящееся сердечко-кристалл (розово-золотой) |
| `crystal_glow.png` | 40×40 px | Эффект свечения для кристалла (отдельный слой) |

### UI-элементы

| Файл | Размер | Описание |
|------|--------|----------|
| `heart_full.png` | 24×24 px | Полное сердечко (жизнь) |
| `heart_empty.png` | 24×24 px | Пустое сердечко (потеряна жизнь) |
| `crystal_icon.png` | 20×20 px | Иконка кристалла для HUD |

---

## 2. Backgrounds (`assets/backgrounds/`)

### Формат
- **Разрешение:** 1280×720 px (полный экран) или 512×256 px (тайл для скроллинга)
- **Формат:** PNG
- **Рекомендация:** Использовать 2 тайла для каждого фона (для плавного скроллинга)

### Файлы

| Файл | Глава | Описание |
|------|-------|----------|
| `bg_palace_1.png` | Глава 1: Дворец | Тайл 1 — коридор с колоннами |
| `bg_palace_2.png` | Глава 1: Дворец | Тайл 2 — продолжение коридора |
| `bg_forest_1.png` | Глава 2: Лес | Тайл 1 — деревья, розы |
| `bg_forest_2.png` | Глава 2: Лес | Тайл 2 — густой лес |
| `bg_city_1.png` | Глава 3: Город | Тайл 1 — ярмарка, лавки |
| `bg_city_2.png` | Глава 3: Город | Тайл 2 — улица с домами |
| `bg_mountain_1.png` | Глава 4: Горы | Тайл 1 — скалы, туман |
| `bg_mountain_2.png` | Глава 4: Горы | Тайл 2 — перевал |
| `bg_garden.png` | Глава 5: Сад | Статичный фон — сад с сакурой |

### Цветовая палитра фонов

| Глава | Небо | Земля |
|-------|------|-------|
| Дворец | `#4A3728` | `#6B5B45` |
| Лес | `#1B5E20` | `#33691E` |
| Город | `#FFB74D` | `#795548` |
| Горы | `#1A0A2E` | `#37474F` |
| Сад | `#F8BBD0` | `#66BB6A` |

---

## 3. Audio (`assets/audio/`)

### Музыка (`assets/audio/music/`)

| Файл | Глава | Стиль | Длительность |
|------|-------|-------|--------------|
| `music_prologue.mp3` | Пролог | Комичная, мультяшная оркестровая | 1:30–2:00 |
| `music_palace.mp3` | Глава 1 | Тревожная, но весёлая, струнные+духовые | 2:00–3:00 |
| `music_forest.mp3` | Глава 2 | Мистическая, флейты, колокольчики | 2:00–3:00 |
| `music_city.mp3` | Глава 3 | Вальс, бальные мотивы, ироничная | 2:00–3:00 |
| `music_mountain.mp3` | Глава 4 | Напряжённая, низкие струнные, гул | 2:00–3:00 |
| `music_garden.mp3` | Финал | Нежная, пианино+скрипка, романтическая | 3:00–4:00 |
| `music_menu.mp3` | Меню | Спокойная, казуальная | 2:00–3:00 |

**Формат:** MP3 (128-192 kbps) или OGG

### Звуковые эффекты (`assets/audio/sfx/`)

| Файл | Событие | Описание |
|------|---------|----------|
| `sfx_jump.mp3` | Прыжок | Лёгкий «свист» вверх |
| `sfx_slide.mp3` | Подкат | Тихое «шуршание» |
| `sfx_crystal.mp3` | Сбор кристалла | Приятный «блип» |
| `sfx_hit.mp3` | Столкновение | Тупой «бам» + «оха» |
| `sfx_invincible.mp3` | Режим невидимости | Магический «шшш» + мерцание |
| `sfx_lose_life.mp3` | Потеря жизни | Падение тональности |
| `sfx_chapter.mp3` | Переход главы | Торжественный аккорд |
| `sfx_good_ending.mp3` | Хорошая концовка | Романтическая мелодия |
| `sfx_bad_ending.mp3` | Плохая концовка | Грустный аккорд |
| `sfx_menu_select.mp3` | Выбор в меню | Короткий «клик» |

**Формат:** MP3 (64-128 kbps) или OGG

---

## 4. Fonts (`assets/fonts/`) — опционально

Если хотите использовать кастомный шрифт вместо Georgia:

| Файл | Назначение |
|------|-----------|
| `fairytale-bold.ttf` | Заголовки, кнопки |
| `fairytale-regular.ttf` | Основной текст |
| `fairytale-italic.ttf` | Диалоги, цитаты |

**Рекомендуемые бесплатные шрифты:**
- **Cinzel Decorative** — сказочный, элегантный (Google Fonts)
- **MedievalSharp** — средневековый стиль (Google Fonts)
- **Patrick Hand** — рукописный, дружелюбный (Google Fonts)

---

## 5. Как заменить placeholder-графику

### Шаг 1: Создайте папки
```bash
mkdir -p assets/sprites
mkdir -p assets/backgrounds
mkdir -p assets/audio/music
mkdir -p assets/audio/sfx
mkdir -p assets/fonts
```

### Шаг 2: Поместите файлы по путям из таблицы выше

### Шаг 3: Обновите BootScene.js

Найдите метод `generateAnnaTexture()` и замените создание через `make.graphics()` на загрузку из файла:

**Было:**
```javascript
generateAnnaTexture() {
    const cg = this.make.graphics({ x: 0, y: 0, add: false });
    cg.fillStyle(0xFF7043);
    cg.fillRect(10, 30, 44, 56);
    // ... много кода рисования ...
    cg.generateTexture('anna', 64, 96);
    cg.destroy();
}
```

**Стало:**
```javascript
preload() {
    this.load.image('anna', 'assets/sprites/anna.png');
    this.load.image('baron', 'assets/sprites/baron.png');
    this.load.image('knight', 'assets/sprites/knight.png');
    this.load.image('mage', 'assets/sprites/mage.png');
    this.load.image('ninja', 'assets/sprites/ninja.png');
    this.load.image('crystal', 'assets/sprites/crystal.png');
}

create() {
    // Удалите методы generate*Texture()
    // Phaser автоматически загрузит текстуры из файлов
}
```

### Шаг 4: Добавьте загрузку музыки и SFX

В `BootScene.preload()` добавьте:

```javascript
preload() {
    // ... загрузка спрайтов ...

    // Музыка
    this.load.audio('music_prologue', 'assets/audio/music/music_prologue.mp3');
    this.load.audio('music_palace', 'assets/audio/music/music_palace.mp3');
    this.load.audio('music_forest', 'assets/audio/music/music_forest.mp3');
    this.load.audio('music_city', 'assets/audio/music/music_city.mp3');
    this.load.audio('music_mountain', 'assets/audio/music/music_mountain.mp3');
    this.load.audio('music_garden', 'assets/audio/music/music_garden.mp3');
    this.load.audio('music_menu', 'assets/audio/music/music_menu.mp3');

    // SFX
    this.load.audio('sfx_jump', 'assets/audio/sfx/sfx_jump.mp3');
    this.load.audio('sfx_slide', 'assets/audio/sfx/sfx_slide.mp3');
    this.load.audio('sfx_crystal', 'assets/audio/sfx/sfx_crystal.mp3');
    this.load.audio('sfx_hit', 'assets/audio/sfx/sfx_hit.mp3');
    this.load.audio('sfx_invincible', 'assets/audio/sfx/sfx_invincible.mp3');
    this.load.audio('sfx_lose_life', 'assets/audio/sfx/sfx_lose_life.mp3');
    this.load.audio('sfx_chapter', 'assets/audio/sfx/sfx_chapter.mp3');
}
```

### Шаг 5: Используйте звуки в коде

В `Anna.jump()` замените placeholder на:

**Было:**
```javascript
if (this.scene.sounds && this.scene.sounds.jump) {
    this.scene.sounds.jump.play();
}
```

**Стало:**
```javascript
this.scene.sound.play('sfx_jump');
```

---

## 6. Быстрый старт без ассетов

Проект **полностью работает** без загрузки внешних файлов — вся графика генерируется программно через Phaser Graphics.

Чтобы запустить игру прямо сейчас:
```bash
npm install
npm run dev
```

Откройте `http://localhost:3000` — игра будет работать с placeholder-графикой.

Заменяйте placeholder на спрайты, когда будут готовы ассеты.

---

## 7. Где взять бесплатные ассеты

### Спрайты
- **OpenGameArt.org** — бесплатные игровые спрайты
- **itch.io/game-assets/free** — бесплатный игровой арт
- **Craftpix.net/free-game-assets** — часть бесплатно

### Музыка
- **Incompetech.com** (Kevin MacLeod) — бесплатная музыка с указанием авторства
- **YouTube Audio Library** — бесплатная музыка из библиотеки YouTube
- **FreeMusicArchive.org** — свободная музыка

### SFX
- **Freesound.org** — сообщество звуковых эффектов
- **Zapsplat.com** — часть бесплатно (с указанием авторства)
- **SFX from OpenGameArt.org**

### Шрифты
- **Google Fonts** — бесплатные шрифты
- **FontLibrary.org** — бесплатные игровые шрифты

---

*Файл создан: 2026-09-18*
