/**
 * 原型固定运行在浏览器环境，因此 Capacitor 平台检测始终返回 false。
 */
export const Capacitor = {
  isNativePlatform(): boolean {
    return false;
  },
};
