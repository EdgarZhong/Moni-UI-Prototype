import type {
  BillImportExecutionResult,
  BillImportOptions,
  BillImportProbeResult,
  EntryPageReadModel,
  MoniHomeReadModel,
  SettingsPageReadModel,
} from '@shared/types';
import type { ManualEntryInput } from '@logic/application/services/ManualEntryManager';
import { mockHomeReadModel } from './fixtures/homeReadModel';

type Listener = () => void;
type AutoLearningEvent = {
  phase: 'triggered' | 'skipped' | 'completed' | 'failed';
  ledgerName: string;
};

/**
 * 原型仓库的 facade mock 必须和主仓库 facade 签名对齐。
 * 组件层继续以“真实 service wrapper”的方式调用数据，不知道自己消费的是 mock。
 */
const listeners = new Set<Listener>();
const autoLearningListeners = new Set<(event: AutoLearningEvent) => void>();

let homeReadModel: MoniHomeReadModel = structuredClone(mockHomeReadModel);
let activeLedgerId = homeReadModel.currentLedger.id;
let homeDateRange: { start: Date | null; end: Date | null } = {
  start: homeReadModel.homeDateRange.start ? new Date(`${homeReadModel.homeDateRange.start}T00:00:00`) : null,
  end: homeReadModel.homeDateRange.end ? new Date(`${homeReadModel.homeDateRange.end}T00:00:00`) : null,
};
let trendWindowOffset = homeReadModel.trendCard.windowOffset;

function notify(): void {
  listeners.forEach((listener) => listener());
}

function currentLedger() {
  return homeReadModel.availableLedgers.find((ledger) => ledger.id === activeLedgerId) ?? homeReadModel.currentLedger;
}

function toIsoDate(value: Date | null): string | null {
  return value ? value.toISOString().slice(0, 10) : null;
}

function makeHomeReadModel(): MoniHomeReadModel {
  return {
    ...structuredClone(homeReadModel),
    currentLedger: currentLedger(),
    homeDateRange: {
      start: toIsoDate(homeDateRange.start),
      end: toIsoDate(homeDateRange.end),
    },
    trendCard: {
      ...homeReadModel.trendCard,
      windowOffset: trendWindowOffset,
    },
  };
}

function makeEntryReadModel(): EntryPageReadModel {
  const latestItems = homeReadModel.dailyTransactionGroups[0]?.items ?? [];
  return {
    currentLedger: currentLedger(),
    availableLedgers: homeReadModel.availableLedgers,
    categoryDefinitions: homeReadModel.categoryDefinitions,
    recentReferences: latestItems.slice(0, 2).map((item) => ({
      id: item.id,
      title: item.title,
      amount: item.amount,
      category: item.userCategory ?? item.aiCategory,
      direction: item.direction,
    })),
    isLoading: false,
  };
}

function makeSettingsReadModel(): SettingsPageReadModel {
  const userTags = homeReadModel.categoryDefinitions.filter((item) => item.key !== '其他');
  return {
    aiConfig: {
      provider: 'siliconflow',
      hasApiKey: true,
      baseUrl: 'https://api.siliconflow.cn/v1',
      candidateModels: [
        'deepseek-ai/DeepSeek-V3.2',
        'deepseek-ai/DeepSeek-V3',
        'deepseek-ai/DeepSeek-R1',
        'moonshotai/Kimi-K2-Instruct',
      ],
      activeModel: 'deepseek-ai/DeepSeek-V3.2',
      maxTokens: 4096,
      temperature: 0.3,
      enableThinking: false,
    },
    selfDescription: '我是西工大学生，和女朋友一起生活，正餐只统计双人用餐。',
    ledgers: homeReadModel.availableLedgers.map((ledger, index) => ({ ...ledger, isDefault: index === 0 })),
    activeLedgerId,
    tags: [
      ...userTags.map((item) => ({
        key: item.key,
        description: item.description,
        isSystem: false,
      })),
      {
        key: '其他',
        description: '其他未分类支出',
        isSystem: true,
      },
    ],
    memoryItems: [
      '正餐只统计双人用餐。',
      '单笔餐饮超过 70 元视为大餐。',
      '同一餐点时段已有正餐，后续小吃归零食。',
      '西北工业大学食堂一卡通消费优先归正餐。',
      '唐久便利店小额消费通常归零食。',
    ],
    snapshots: [
      { id: '2026-04-08_14-30-00-000', trigger: 'ai_learn', summary: '学习：新增 3 条偏好规则', isCurrent: true },
      { id: '2026-04-07_09-15-00-000', trigger: 'user_edit', summary: '用户手动编辑', isCurrent: false },
    ],
    exampleLibrarySummary: { delta: 3, total: 18 },
    learningConfig: { autoLearn: true, learningThreshold: 5, compressionThreshold: 30 },
    budgetConfig: {
      monthlyTotal: homeReadModel.budget.card?.budgetAmount ?? 3000,
      categoryBudgets: { 正餐: 1200, 零食: 300, 交通: 400, 娱乐: 300, 大餐: 500 },
    },
    ledgerTransactions: homeReadModel.dailyTransactionGroups.flatMap((group) =>
      group.items.map((item) => ({
        id: item.id,
        date: group.id,
        title: item.title,
        amount: item.amount,
        category: item.userCategory ?? item.aiCategory ?? '其他',
        isVerified: item.isVerified,
      })),
    ),
  };
}

export const appFacade = {
  async init(): Promise<void> {
    // 原型没有真实初始化流程，保留 Promise 签名对齐主仓库 facade。
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  subscribeAutoLearningEvents(listener: (event: AutoLearningEvent) => void): () => void {
    autoLearningListeners.add(listener);
    return () => {
      autoLearningListeners.delete(listener);
    };
  },

  async getMoniHomeReadModel(options?: { trendWindowOffset?: number; homeDateRange?: { start: Date | null; end: Date | null } }): Promise<MoniHomeReadModel> {
    trendWindowOffset = options?.trendWindowOffset ?? trendWindowOffset;
    homeDateRange = options?.homeDateRange ?? homeDateRange;
    return makeHomeReadModel();
  },

  async getEntryPageReadModel(): Promise<EntryPageReadModel> {
    return makeEntryReadModel();
  },

  async getSettingsPageReadModel(): Promise<SettingsPageReadModel> {
    return makeSettingsReadModel();
  },

  async switchLedger(ledgerId: string): Promise<boolean> {
    activeLedgerId = ledgerId;
    notify();
    return true;
  },

  setDateRange(range: { start: Date | null; end: Date | null }): void {
    homeDateRange = range;
    notify();
  },

  updateTransactionCategory(transactionId: string, category: string, reasoning = '原型手动修正'): void {
    homeReadModel = {
      ...homeReadModel,
      dailyTransactionGroups: homeReadModel.dailyTransactionGroups.map((group) => ({
        ...group,
        items: group.items.map((item) =>
          item.id === transactionId
            ? { ...item, category, userCategory: category, reasoning, isVerified: true }
            : item,
        ),
      })),
    };
    notify();
  },

  updateUserReasoning(transactionId: string, note: string): void {
    homeReadModel = {
      ...homeReadModel,
      dailyTransactionGroups: homeReadModel.dailyTransactionGroups.map((group) => ({
        ...group,
        items: group.items.map((item) => (item.id === transactionId ? { ...item, userNote: note } : item)),
      })),
    };
    notify();
  },

  updateTransactionRemark(transactionId: string, note: string): void {
    homeReadModel = {
      ...homeReadModel,
      dailyTransactionGroups: homeReadModel.dailyTransactionGroups.map((group) => ({
        ...group,
        items: group.items.map((item) => (item.id === transactionId ? { ...item, remark: note } : item)),
      })),
    };
    notify();
  },

  setTransactionVerification(transactionId: string, isVerified: boolean): void {
    homeReadModel = {
      ...homeReadModel,
      dailyTransactionGroups: homeReadModel.dailyTransactionGroups.map((group) => ({
        ...group,
        items: group.items.map((item) => (item.id === transactionId ? { ...item, isVerified } : item)),
      })),
    };
    notify();
  },

  async startAiProcessing(): Promise<void> {
    notify();
  },

  stopAiProcessing(): void {
    notify();
  },

  async addManualEntry(input: ManualEntryInput): Promise<string> {
    const id = `manual-${Date.now()}`;
    const latestGroup = homeReadModel.dailyTransactionGroups[0];
    if (latestGroup) {
      latestGroup.items.unshift({
        id,
        title: input.subject ?? input.category,
        amount: input.amount,
        time: input.date?.slice(11, 16) || '现在',
        sourceType: 'manual',
        sourceLabel: '随手记',
        paymentMethod: '',
        category: input.category,
        userCategory: input.category,
        aiCategory: null,
        reasoning: input.description ?? null,
        userNote: input.description ?? null,
        remark: input.description ?? null,
        direction: input.direction,
        isVerified: true,
        sequence: 0,
      });
    }
    notify();
    return id;
  },

  async probeBillImportFiles(_files: File[], options: BillImportOptions): Promise<BillImportProbeResult> {
    if (options.expectedSource === 'alipay' && options.password !== '123456') {
      return {
        status: 'password_required',
        message: '支付宝压缩包需要 6 位数字密码',
        expectedSource: options.expectedSource,
        passwordState: options.password ? 'invalid' : 'missing',
        files: [{ originalName: '支付宝交易明细(20260413-20260424).zip', detectedKind: 'archive', requiresPassword: true }],
      };
    }

    return {
      status: 'ready',
      message: '账单文件可导入',
      expectedSource: options.expectedSource,
      transactionCount: options.expectedSource === 'wechat' ? 73 : 37,
      sourceBreakdown: { wechat: options.expectedSource === 'wechat' ? 73 : 0, alipay: options.expectedSource === 'alipay' ? 37 : 0 },
      files: [{ originalName: `${options.expectedSource ?? 'unknown'}-bill.csv`, detectedKind: 'csv' }],
    };
  },

  async importBillFiles(_files: File[], options: BillImportOptions): Promise<BillImportExecutionResult> {
    const source = options.expectedSource ?? 'wechat';
    const importedCount = source === 'wechat' ? 73 : 37;
    return {
      ledgerName: currentLedger().name,
      importedCount,
      transactionIds: Array.from({ length: importedCount }, (_, index) => `${source}-${index}`),
      files: [{ originalName: `${source}-bill.csv`, detectedKind: 'csv' }],
      sourceBreakdown: { wechat: source === 'wechat' ? importedCount : 0, alipay: source === 'alipay' ? importedCount : 0 },
    };
  },

  async testConnection(): Promise<boolean> { return true; },
  async createLedger(_name: string): Promise<boolean> { notify(); return true; },
  async renameLedger(_id: string, _newName: string): Promise<boolean> { notify(); return true; },
  async deleteLedger(_id: string): Promise<boolean> { notify(); return true; },
  async updateProvider(_provider: string): Promise<void> { notify(); },
  async updateApiKey(_provider: string, _key: string): Promise<void> { notify(); },
  async updateBaseUrl(_url: string): Promise<void> { notify(); },
  async updateActiveModel(_model: string): Promise<void> { notify(); },
  async updateMaxTokens(_value: number): Promise<void> { notify(); },
  async updateTemperature(_value: number): Promise<void> { notify(); },
  async updateEnableThinking(_enabled: boolean): Promise<void> { notify(); },
  async saveSelfDescription(_text: string): Promise<void> { notify(); },
  async createTag(_name: string, _desc: string): Promise<void> { notify(); },
  async renameTag(_oldKey: string, _newKey: string): Promise<void> { notify(); },
  async updateTagDescription(_key: string, _desc: string): Promise<void> { notify(); },
  async deleteTag(_key: string): Promise<void> { notify(); },
  async updateMemoryItems(_items: string[]): Promise<void> { notify(); },
  async triggerImmediateLearning(): Promise<boolean> { notify(); return true; },
  async rollbackMemorySnapshot(_snapshotId: string): Promise<boolean> { notify(); return true; },
  async deleteMemorySnapshot(_snapshotId: string): Promise<boolean> { notify(); return true; },
  async updateLearningThreshold(_value: number): Promise<void> { notify(); },
  async toggleAutoLearn(_enabled: boolean): Promise<void> { notify(); },
  async updateCompressionThreshold(_value: number): Promise<void> { notify(); },
  async updateMonthlyBudget(_amount: number): Promise<void> { notify(); },
  async updateCategoryBudget(_tag: string, _amount: number): Promise<void> { notify(); },
  async triggerFullReclassification(): Promise<void> { notify(); },

  getLedgerState() { return null; },
  setFilter(): void { notify(); },
  async importRawData(): Promise<void> { notify(); },
  async importParsedData(): Promise<void> { notify(); },
  async reloadLedgerMemory(): Promise<void> { notify(); },
};
