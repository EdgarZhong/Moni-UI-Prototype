export interface KeyboardListenerHandle {
  remove(): Promise<void>;
}

/**
 * 原型仓库的键盘插件 mock。
 * 页面仍使用浏览器 visualViewport 逻辑判断软键盘，不连接原生插件。
 */
export const Keyboard = {
  async addListener(): Promise<KeyboardListenerHandle> {
    return {
      async remove() {
        // 原型环境没有需要释放的原生监听器。
      },
    };
  },
};
