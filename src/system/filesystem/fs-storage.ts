/**
 * 原型仓库只需要这些类型满足 copied shared types 的编译依赖。
 * 这里不实现任何真实文件系统能力，避免原型运行时误接主仓库持久化层。
 */
export interface StorageHandle {
  readonly kind: 'file';
  readonly name: string;
}

export interface StorageDirHandle {
  readonly kind: 'directory';
  readonly name: string;
}
