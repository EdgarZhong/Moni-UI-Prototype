/**
 * 原型仓库的触感反馈空实现。
 * 保留与主仓库一致的函数名，让 UI 代码可以原样复制，但不接入 Capacitor。
 */
export function triggerImpact(_level?: 'light' | 'medium' | 'heavy'): void {
  // 浏览器原型不触发真实设备触感。
}
