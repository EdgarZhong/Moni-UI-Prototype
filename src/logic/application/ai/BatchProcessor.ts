type StatusListener = (event: { status: string }) => void;

/**
 * 原型仓库的 AI 批处理器桩实现。
 * 它只提供设置页订阅状态所需的最小接口，不运行真实分类任务。
 */
export class BatchProcessor {
  private static instance: BatchProcessor | null = null;
  private readonly listeners = new Set<StatusListener>();

  static getInstance(): BatchProcessor {
    if (!BatchProcessor.instance) {
      BatchProcessor.instance = new BatchProcessor();
    }
    return BatchProcessor.instance;
  }

  on(eventName: 'status', listener: StatusListener): () => void {
    if (eventName !== 'status') {
      return () => undefined;
    }
    this.listeners.add(listener);
    listener({ status: 'idle' });
    return () => {
      this.listeners.delete(listener);
    };
  }

  emitStatus(status: string): void {
    this.listeners.forEach((listener) => listener({ status }));
  }
}
