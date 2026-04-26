import type {
  BillImportExecutionResult,
  BillImportOptions,
  BillImportProbeResult,
  EntryPageReadModel,
  HomeTransactionReadModel,
  MoniHomeReadModel,
  SettingsPageReadModel,
} from '@shared/types';
import type { ManualEntryInput } from '@logic/application/services/ManualEntryManager';

type Listener = () => void;

const ledgerOptions = [
  { id: '日常开销', name: '日常开销' },
  { id: '旅行基金', name: '旅行基金' },
];

const categoryDefinitions = [
  { key: '正餐', label: '正餐', description: '日常正餐支出，包含早餐、午餐和晚餐。' },
  { key: '零食', label: '零食', description: '饮品、小吃、甜品等非正餐食品。' },
  { key: '交通', label: '交通', description: '地铁、打车、公交、加油等出行费用。' },
  { key: '娱乐', label: '娱乐', description: '电影、游戏、演出和会员订阅。' },
  { key: '大餐', label: '大餐', description: '聚餐、宴请、高客单价餐饮。' },
  { key: '购物', label: '购物', description: '日用品、服饰、数码和网购消费。' },
  { key: '其他', label: '其他', description: '未落入显式标签的兜底支出。' },
];

const baseTransactions: HomeTransactionReadModel[] = [
  {
    id: 'mock-001',
    title: '杨国福麻辣烫',
    amount: 45,
    time: '18:10',
    sourceType: 'wechat',
    sourceLabel: '微信',
    paymentMethod: '微信支付',
    category: '正餐',
    userCategory: '正餐',
    aiCategory: '正餐',
    reasoning: '餐饮商户，正餐时段',
    userNote: null,
    remark: '晚饭',
    direction: 'out',
    isVerified: true,
    sequence: 0,
  },
  {
    id: 'mock-002',
    title: '滴滴出行',
    amount: 23,
    time: '16:30',
    sourceType: 'alipay',
    sourceLabel: '支付宝',
    paymentMethod: '支付宝',
    category: '交通',
    userCategory: null,
    aiCategory: '交通',
    reasoning: '出行平台',
    userNote: null,
    remark: null,
    direction: 'out',
    isVerified: false,
    sequence: 1,
  },
  {
    id: 'mock-003',
    title: '瑞幸咖啡',
    amount: 18,
    time: '14:20',
    sourceType: 'wechat',
    sourceLabel: '微信',
    paymentMethod: '微信支付',
    category: '零食',
    userCategory: '零食',
    aiCategory: '零食',
    reasoning: '咖啡饮品',
    userNote: null,
    remark: null,
    direction: 'out',
    isVerified: true,
    sequence: 0,
  },
  {
    id: 'mock-004',
    title: '益禾堂',
    amount: 12,
    time: '19:40',
    sourceType: 'wechat',
    sourceLabel: '微信',
    paymentMethod: '微信支付',
    category: null,
    userCategory: null,
    aiCategory: null,
    reasoning: null,
    userNote: null,
    remark: null,
    direction: 'out',
    isVerified: false,
    sequence: 0,
  },
];

let activeLedgerId = '日常开销';
let homeDateRange: { start: Date | null; end: Date | null } = { start: null, end: null };
let trendWindowOffset = 0;
let transactions = [...baseTransactions];
const listeners = new Set<Listener>();

function notify(): void {
  listeners.forEach((listener) => listener());
}

function currentLedger() {
  return ledgerOptions.find((ledger) => ledger.id === activeLedgerId) ?? ledgerOptions[0];
}

function makeHomeReadModel(): MoniHomeReadModel {
  const dailyItems = transactions;
  const yesterdayItems: HomeTransactionReadModel[] = [
    {
      ...transactions[0],
      id: 'mock-101',
      title: '海底捞火锅',
      amount: 180,
      time: '19:10',
      category: '大餐',
      userCategory: '大餐',
      aiCategory: '大餐',
      reasoning: '多人聚餐，高客单价',
      sequence: 0,
    },
    {
      ...transactions[1],
      id: 'mock-102',
      title: '地铁充值',
      amount: 50,
      time: '08:30',
      category: '交通',
      userCategory: '交通',
      aiCategory: '交通',
      reasoning: '公共交通',
      sequence: 0,
    },
  ];

  return {
    currentLedger: currentLedger(),
    availableLedgers: ledgerOptions,
    categoryDefinitions,
    dailyTransactionGroups: [
      { id: '2026-04-07', label: '今天', items: dailyItems },
      { id: '2026-04-06', label: '昨天', items: yesterdayItems },
    ],
    income: [{ date: '2026-04-03', amount: 5000 }],
    trendCard: {
      windowSize: 7,
      points: [120, 95, 180, 45, 210, 88, 156].map((amount, index) => ({
        key: `2026-04-${String(index + 1).padStart(2, '0')}`,
        label: `4/${index + 1}`,
        amount,
      })),
      windowStart: '2026-04-01',
      windowEnd: '2026-04-07',
      hasEarlierWindow: trendWindowOffset < 2,
      hasLaterWindow: trendWindowOffset > 0,
      windowOffset: trendWindowOffset,
    },
    hintCards: [
      {
        id: 'budget-nudge',
        type: 'budget_nudge',
        priority: 'medium',
        title: '距上次导入已 7 天',
        description: '导入新账单看看最近花了多少？',
        dismissible: true,
      },
    ],
    budget: {
      enabled: true,
      status: 'healthy',
      card: {
        periodLabel: '4月预算',
        budgetAmount: 5000,
        spentAmount: 3128,
        remainingAmount: 1872,
        remainingDays: 24,
        dailyAvailableAmount: 78,
        status: 'healthy',
        usageRatio: 0.62,
      },
    },
    unclassifiedCount: dailyItems.filter((item) => !item.userCategory && !item.aiCategory).length,
    availableCategories: categoryDefinitions.map((item) => item.key),
    aiEngineUiState: {
      status: 'idle',
      activeLedger: activeLedgerId,
      activeDate: null,
      activeDates: [],
      hasPendingInRange: false,
      hasPendingOutOfRange: false,
      pendingCount: 0,
      lastLearnedAt: null,
      lastLearningNotice: null,
    },
    extensions: {
      budget: { status: 'available', owner: 'agent3', notes: '原型 mock 已提供预算卡片状态。' },
      manualEntry: { status: 'available', owner: 'agent4', notes: '原型 mock 支持新增随手记。' },
      memory: { status: 'available', owner: 'agent5', notes: '原型 mock 支持设置页记忆状态。' },
    },
    dataRange: { min: '2026-04-01', max: '2026-04-07' },
    homeDateRange: {
      start: homeDateRange.start ? homeDateRange.start.toISOString().slice(0, 10) : null,
      end: homeDateRange.end ? homeDateRange.end.toISOString().slice(0, 10) : null,
    },
    isLoading: false,
  };
}

function makeEntryReadModel(): EntryPageReadModel {
  return {
    currentLedger: currentLedger(),
    availableLedgers: ledgerOptions,
    categoryDefinitions,
    recentReferences: transactions.slice(0, 2).map((item) => ({
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
  return {
    aiConfig: {
      provider: 'deepseek',
      hasApiKey: true,
      baseUrl: 'https://api.deepseek.com',
      candidateModels: ['deepseek-chat', 'deepseek-reasoner'],
      activeModel: 'deepseek-chat',
      maxTokens: 4096,
      temperature: 0.3,
      enableThinking: false,
    },
    selfDescription: '我是西工大学生，和女朋友一起生活，正餐只统计双人用餐。',
    ledgers: ledgerOptions.map((ledger, index) => ({ ...ledger, isDefault: index === 0 })),
    activeLedgerId,
    tags: categoryDefinitions.map((item) => ({
      key: item.key,
      description: item.description,
      isSystem: item.key === '其他',
    })),
    memoryItems: [
      '正餐只统计双人用餐。',
      '单笔餐饮超过 70 元视为大餐。',
      '同一餐点时段已有正餐，后续小吃归零食。',
    ],
    snapshots: [
      { id: '2026-04-08_14-30-00-000', trigger: 'ai_learn', summary: '学习：新增 3 条偏好规则', isCurrent: true },
      { id: '2026-04-07_09-15-00-000', trigger: 'user_edit', summary: '用户手动编辑', isCurrent: false },
    ],
    exampleLibrarySummary: { delta: 3, total: 18 },
    learningConfig: { autoLearn: true, learningThreshold: 5, compressionThreshold: 30 },
    budgetConfig: {
      monthlyTotal: 5000,
      categoryBudgets: { 正餐: 1500, 零食: 400, 交通: 500, 娱乐: 600, 大餐: 900 },
    },
    ledgerTransactions: transactions.map((item) => ({
      id: item.id,
      date: '2026-04-07',
      title: item.title,
      amount: item.amount,
      category: item.userCategory ?? item.aiCategory ?? '其他',
      isVerified: item.isVerified,
    })),
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
    transactions = transactions.map((item) =>
      item.id === transactionId
        ? { ...item, userCategory: category, category, reasoning, isVerified: true }
        : item,
    );
    notify();
  },

  updateUserReasoning(transactionId: string, note: string): void {
    transactions = transactions.map((item) => (item.id === transactionId ? { ...item, userNote: note } : item));
    notify();
  },

  updateTransactionRemark(transactionId: string, note: string): void {
    transactions = transactions.map((item) => (item.id === transactionId ? { ...item, remark: note } : item));
    notify();
  },

  setTransactionVerification(transactionId: string, isVerified: boolean): void {
    transactions = transactions.map((item) => (item.id === transactionId ? { ...item, isVerified } : item));
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
    transactions = [
      {
        id,
        title: input.subject ?? input.category,
        amount: input.amount,
        time: input.date?.slice(11, 16) || '现在',
        sourceType: 'manual',
        sourceLabel: '手动',
        paymentMethod: '手动记录',
        category: input.category,
        userCategory: input.category,
        aiCategory: null,
        reasoning: input.description ?? null,
        userNote: input.description ?? null,
        remark: input.description ?? null,
        direction: input.direction,
        isVerified: true,
        sequence: 0,
      },
      ...transactions,
    ];
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
        files: [{ originalName: 'alipay-bill.zip', detectedKind: 'archive', requiresPassword: true }],
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
  async createLedger(name: string): Promise<boolean> { ledgerOptions.push({ id: name, name }); notify(); return true; },
  async renameLedger(id: string, newName: string): Promise<boolean> {
    const ledger = ledgerOptions.find((item) => item.id === id);
    if (!ledger) return false;
    ledger.name = newName;
    notify();
    return true;
  },
  async deleteLedger(id: string): Promise<boolean> {
    const index = ledgerOptions.findIndex((item) => item.id === id);
    if (index <= 0) return false;
    ledgerOptions.splice(index, 1);
    activeLedgerId = ledgerOptions[0].id;
    notify();
    return true;
  },
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
  setFilter(): void {
    notify();
  },
  async importRawData(): Promise<void> {
    notify();
  },
  async importParsedData(): Promise<void> {
    notify();
  },
  async reloadLedgerMemory(): Promise<void> {
    notify();
  },
};
