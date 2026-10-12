/**
 * Подсчёт очков и кристаллов
 */
export class ScoreManager {
    constructor() {
        this.crystals = 0;
        this.score = 0;
        this.freedomMeter = 0;
        this.freedomMeterMax = 50; // кристаллов для заполнения шкалы
        this.invincible = false;
        this.invincibleDuration = 8000; // 8 секунд
        this.invincibleTimer = null;
    }

    addCrystal() {
        this.crystals++;
        this.score += 100;
        this.freedomMeter++;
    }

    activateInvincibility() {
        this.invincible = true;
        this.freedomMeter = 0;
        this.game.events.emit('invincibility-start');

        if (this.invincibleTimer) clearTimeout(this.invincibleTimer);
        this.invincibleTimer = setTimeout(() => {
            this.invincible = false;
            this.game.events.emit('invincibility-end');
        }, this.invincibleDuration);
    }

    loseLife(obstacle) {
        if (!this.invincible) {
            this.game.events.emit('player-hit', { obstacle });
            return true;
        }
        return false;
    }

    reset() {
        this.crystals = 0;
        this.score = 0;
        this.freedomMeter = 0;
        this.invincible = false;
        if (this.invincibleTimer) clearTimeout(this.invincibleTimer);
    }

    isChapterComplete(chapterIndex) {
        const chapterTargets = [200, 350, 500, 700, 1000];
        return this.crystals >= chapterTargets[chapterIndex] ||
               (chapterIndex >= 4 && this.crystals >= 1000);
    }

    getFreedomPercent() {
        return Math.min(100, (this.freedomMeter / this.freedomMeterMax) * 100);
    }
}
