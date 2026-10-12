/**
 * Управление главами и прогрессией
 */
export class ChapterManager {
    constructor() {
        this.currentChapter = 0;
        this.chapters = [
            { name: 'Побег из дворца', location: 'Дворец', color: 0x87CEEB, duration: 30 },
            { name: 'Лес Шепчущих Роз', location: 'Лес', color: 0x4CAF50, duration: 40 },
            { name: 'Ярмарка Тщеславия', location: 'Город', color: 0xFF9800, duration: 45 },
            { name: 'Перевал Одиночества', location: 'Горы', color: 0x2D1B69, duration: 50 },
            { name: 'Сад Вечной Весны', location: 'Сад', color: 0xE91E63, duration: 60 }
        ];
        this.chapterTimer = 0;
        this.onChapterComplete = null;
        this.hasFinished = false; // Флаг для предотвращения повторного срабатывания финала
    }

    get currentChapterData() {
        return this.chapters[this.currentChapter];
    }

    get isLastChapter() {
        return this.currentChapter >= this.chapters.length - 1;
    }

    get chaptersUnlocked() {
        const saved = localStorage.getItem('anna_chapters_unlocked');
        return saved ? parseInt(saved) : 1;
    }

    set chaptersUnlocked(value) {
        localStorage.setItem('anna_chapters_unlocked', value.toString());
    }

    advanceChapter() {
        if (this.currentChapter < this.chapters.length - 1) {
            this.currentChapter++;
            this.chapterTimer = 0;

            // Разблокируем следующую главу
            const unlocked = this.chaptersUnlocked;
            if (this.currentChapter + 1 > unlocked) {
                this.chaptersUnlocked = this.currentChapter + 1;
            }

            this.game.events.emit('chapter-advance', this.currentChapterData);
        } else if (!this.hasFinished) {
            // Финал — срабатывает только один раз
            this.hasFinished = true;
            this.game.events.emit('chapter-finished');
        }
    }

    update(delta) {
        this.chapterTimer += delta;
        const chapterDuration = this.currentChapterData.duration * 1000;

        if (this.chapterTimer >= chapterDuration) {
            this.advanceChapter();
        }
    }

    reset() {
        this.currentChapter = 0;
        this.chapterTimer = 0;
        this.hasFinished = false;
    }

    getChapterBackground(chapterIndex) {
        const backgrounds = [
            // Глава 0 — Дворец
            { top: 0x4A3728, bottom: 0x8B7355, ground: 0x6B5B45 },
            // Глава 1 — Лес
            { top: 0x1B5E20, bottom: 0x4CAF50, ground: 0x33691E },
            // Глава 2 — Город
            { top: 0xFFB74D, bottom: 0xFF9800, ground: 0x795548 },
            // Глава 3 — Горы (ночь)
            { top: 0x1A0A2E, bottom: 0x2D1B69, ground: 0x37474F },
            // Глава 4 — Сад (финал)
            { top: 0xF8BBD0, bottom: 0xE91E63, ground: 0x66BB6A }
        ];
        return backgrounds[Math.min(chapterIndex, backgrounds.length - 1)];
    }

    getChapterProgress() {
        const chapterDuration = this.currentChapterData.duration * 1000;
        const progress = this.chapterTimer / chapterDuration;
        return Math.min(progress, 1); // Максимум 100%
    }
}
