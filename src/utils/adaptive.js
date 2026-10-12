/**
 * Утилита для адаптивных размеров на мобильных устройствах
 */

export function isMobile() {
    return window.innerWidth <= 1024 || window.innerHeight <= 768;
}

export function isPortrait() {
    return window.innerHeight > window.innerWidth;
}

export function getScaleFactor() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Базовые размеры игры
    const baseWidth = 1280;
    const baseHeight = 720;
    
    // Рассчитываем масштаб
    const scaleX = screenWidth / baseWidth;
    const scaleY = screenHeight / baseHeight;
    
    // Используем минимальный масштаб для сохранения пропорций
    return Math.min(scaleX, scaleY);
}

export function getAdaptiveFontSize(baseSize) {
    const isMobileDevice = isMobile();
    const scaleFactor = getScaleFactor();
    
    // Рассчитываем видимый размер шрифта после масштабирования
    const visibleSize = baseSize * scaleFactor;
    
    // Мягкая адаптация
    let multiplier = 1;
    
    if (visibleSize < 10) {
        multiplier = 1.8;
    } else if (visibleSize < 14) {
        multiplier = 1.4;
    } else if (visibleSize < 18) {
        multiplier = 1.2;
    }
    
    if (isMobileDevice) {
        multiplier *= 1.05;
    }
    
    const adjustedSize = Math.round(baseSize * multiplier);
    
    const minSize = isMobileDevice ? 16 : 14;
    const maxSize = isMobileDevice ? 44 : 64;
    
    return Math.min(Math.max(adjustedSize, minSize), maxSize);
}

export function getAdaptiveButtonSize(baseWidth, baseHeight) {
    const scaleFactor = getScaleFactor();
    const isMobileDevice = isMobile();
    
    // Для мобильных увеличиваем кнопки для удобства нажатия
    const mobileMultiplier = isMobileDevice ? 1.4 : 1;
    
    return {
        width: Math.max(Math.round(baseWidth * mobileMultiplier), 220),
        height: Math.max(Math.round(baseHeight * mobileMultiplier), 60)
    };
}

export function getAdaptivePosition(baseX, baseY) {
    const scaleFactor = getScaleFactor();
    return {
        x: Math.round(baseX * scaleFactor),
        y: Math.round(baseY * scaleFactor)
    };
}
