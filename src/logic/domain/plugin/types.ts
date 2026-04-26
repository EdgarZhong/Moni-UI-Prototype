/**
 * 原型仓库中的仲裁来源类型只服务类型检查。
 * 真实仲裁器属于主仓库业务层，不在原型运行时加载。
 */
export type ProposalSource = 'USER' | 'RULE_ENGINE' | 'AI_AGENT';
