/**
 * 与主仓库随手记 service 对齐的输入协议。
 * 原型 mock facade 按同一签名接收数据，迁移时无需改表现层调用方式。
 */
export interface ManualEntryInput {
  readonly amount: number;
  readonly category: string;
  readonly direction: 'in' | 'out';
  readonly subject?: string;
  readonly description?: string;
  readonly date?: string;
}
