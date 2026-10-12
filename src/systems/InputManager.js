/**
 * Управление: клавиатура + тач/свайпы
 */
export class InputManager {
    constructor(game) {
        this.game = game;
        this._touchStartY = 0;
        this._isJumping = false;
        this._isSliding = false;
        this._pointerHandlers = [];
        // Для двойного тапа
        this._lastTapTime = 0;
        this._doubleTapThreshold = 300; // мс
    }

    init(scene) {
        this.scene = scene;
        this.keyboard = scene.input.keyboard;
        
        if (!this.keyboard) {
            console.warn('❌ Keyboard not available');
            return;
        }

        // Создаём ключи через addKey
        this.spaceKey = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.downKey = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.shiftKey = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        // КЛЮЧЕВОЕ: фиксируем состояние клавиш ПРЯМО СЕЙЧАС.
        // Если SPACE зажата при переходе с меню — помечаем как "уже нажата".
        // Тогда первый update() увидит wasDown=true и НЕ вызовет triggerJump().
        this._wasKeyDown = {
            space: this.spaceKey.isDown,
            down: this.downKey.isDown,
            shift: this.shiftKey.isDown
        };

        // Touch events — используем touchstart/touchend для надёжности
        const touchStartHandler = (e) => {
            if (e.touches.length > 0) {
                this._touchStartY = e.touches[0].clientY;
            }
        };
        document.addEventListener('touchstart', touchStartHandler, { passive: true });
        this._pointerHandlers.push({ removeAllListeners: () => {} });

        const touchEndHandler = (e) => {
            if (e.changedTouches.length > 0) {
                const endY = e.changedTouches[0].clientY;
                const deltaY = endY - this._touchStartY;
                const threshold = 30;
                const now = Date.now();

                if (Math.abs(deltaY) > threshold) {
                    if (deltaY < 0) {
                        this.triggerJump();
                    } else {
                        this.triggerSlide();
                    }
                } else {
                    // Проверяем двойной тап
                    if (now - this._lastTapTime < this._doubleTapThreshold) {
                        this.triggerDoubleTap();
                        this._lastTapTime = 0; // Сбрасываем
                    } else {
                        this._lastTapTime = now;
                        this.triggerAction();
                    }
                }
            }
        };
        document.addEventListener('touchend', touchEndHandler, { passive: true });
        this._pointerHandlers.push({ removeAllListeners: () => {} });
        
        // Сохраняем обработчики для удаления
        this._touchHandlers = { touchStartHandler, touchEndHandler };
    }

    /**
     * Вызывается каждый кадр из GameScene.update().
     * Срабатывает ТОЛЬКО при реальном нажатии (отпущена → нажата).
     * Игнорирует клавиши, которые были зажаты при старте сцены.
     */
    update() {
        if (!this.keyboard) return;

        // SPACE
        const spaceDown = this.spaceKey && this.spaceKey.isDown;
        if (spaceDown && !this._wasKeyDown.space) {
            this._wasKeyDown.space = true;
            this.triggerJump();
        } else if (!spaceDown) {
            this._wasKeyDown.space = false;
        }

        // DOWN
        const downDown = this.downKey && this.downKey.isDown;
        if (downDown && !this._wasKeyDown.down) {
            this._wasKeyDown.down = true;
            console.log('⬇️ DOWN key pressed, triggering slide');
            this.triggerSlide();
        } else if (!downDown) {
            this._wasKeyDown.down = false;
        }

        // SHIFT — невидимка
        const shiftDown = this.shiftKey && this.shiftKey.isDown;
        if (shiftDown && !this._wasKeyDown.shift) {
            this._wasKeyDown.shift = true;
            this.triggerDoubleTap();
        } else if (!shiftDown) {
            this._wasKeyDown.shift = false;
        }
    }

    destroy() {
        if (this._pointerHandlers) {
            this._pointerHandlers.forEach(h => h.removeAllListeners());
            this._pointerHandlers = [];
        }
        // Удаляем touch-обработчики
        if (this._touchHandlers) {
            document.removeEventListener('touchstart', this._touchHandlers.touchStartHandler);
            document.removeEventListener('touchend', this._touchHandlers.touchEndHandler);
        }
    }
    
    triggerJump() {
        if (!this._isJumping) {
            this._isJumping = true;
            this.scene.game.events.emit('player-jump');
            setTimeout(() => { this._isJumping = false; }, 300);
        }
    }

    triggerSlide() {
        console.log('🔥 triggerSlide called');
        console.log('scene:', this.scene, 'game:', this.scene.game);
        // Используем EventBus Phaser.Game
        if (this.scene.game.events) {
            this.scene.game.events.emit('player-slide');
        } else {
            console.warn('❌ game.events not available');
        }
        setTimeout(() => { this._isSliding = false; }, 600);
    }

    triggerAction() {
        this.scene.game.events.emit('player-action');
    }

    triggerDoubleTap() {
        console.log('👻 triggerDoubleTap called');
        this.scene.game.events.emit('player-double-tap');
    }
}
