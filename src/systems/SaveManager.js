/**
 * Сохранение прогресса через LocalStorage
 */
export class SaveManager {
    get highScore() {
        return parseInt(localStorage.getItem('anna_highscore') || '0');
    }

    set highScore(value) {
        if (value > this.highScore) {
            localStorage.setItem('anna_highscore', value.toString());
        }
    }

    get bestChapter() {
        return parseInt(localStorage.getItem('anna_best_chapter') || '0');
    }

    set bestChapter(value) {
        localStorage.setItem('anna_best_chapter', value.toString());
    }

    getTotalCrystals() {
        return parseInt(localStorage.getItem('anna_total_crystals') || '0');
    }

    addTotalCrystals(count) {
        const total = this.getTotalCrystals() + count;
        localStorage.setItem('anna_total_crystals', total.toString());
    }

    saveRun(crystals, score, chapter) {
        this.highScore = Math.max(this.highScore, score);
        this.bestChapter = Math.max(this.bestChapter, chapter);
        this.addTotalCrystals(crystals);
    }

    reset() {
        // Не сбрасываем при новой игре, только при сбросе прогресса
        // localStorage.clear();
    }

    clearAll() {
        localStorage.removeItem('anna_highscore');
        localStorage.removeItem('anna_best_chapter');
        localStorage.removeItem('anna_total_crystals');
        localStorage.removeItem('anna_chapters_unlocked');
    }
}
