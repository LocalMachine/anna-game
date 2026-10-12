/**
 * Заглушка для звуков (SFX)
 * Замените на реальные звуки, указав пути в ASSET_GUIDE.md
 * 
 * Пути для замены:
 * - sfx/jump.mp3 — звук прыжка Анны
 * - sfx/slide.mp3 — звук подката
 * - sfx/crystal.mp3 — звук сбора кристалла
 * - sfx/hit.mp3 — звук получения урона
 * - sfx/chapter-advance.mp3 — звук перехода между главами
 * - music/bg.mp3 — фоновая музыка
 */
export class SoundStub {
    constructor(scene) {
        this.scene = scene;
        this.enabled = true;
    }

    play(key) {
        if (!this.enabled) return;
        // Placeholder: в консоль вместо реального звука
        console.log(`🔊 [SFX] Playing: ${key}`);
        
        // TODO: Заменить на реальный звук:
        // if (this.scene.sound) {
        //     this.scene.sound.play(key);
        // }
    }

    playMusic(key, { loop = true, volume = 0.5 } = {}) {
        if (!this.enabled) return;
        console.log(`🎵 [MUSIC] Playing: ${key} (loop: ${loop}, vol: ${volume})`);
        
        // TODO: Заменить на реальную музыку:
        // if (this.scene.sound) {
        //     this.scene.sound.play(key, { loop, volume });
        // }
    }

    stop(key) {
        console.log(`🔇 [SFX] Stopping: ${key}`);
        // TODO: this.scene.sound.stop(key);
    }

    setVolume(volume) {
        this.volume = volume;
        console.log(`🔊 Volume set to: ${volume}`);
    }
}
