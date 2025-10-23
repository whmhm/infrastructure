# 开发模式（所有应用）
pnpm dev

# 只启动 web 应用
pnpm dev --filter @my-monorepo/web

# 构建所有包
pnpm build

# 类型检查
pnpm type-check

# 清理
pnpm clean

# 添加依赖到特定包
pnpm add axios --filter @my-monorepo/web
pnpm add -D @types/node --filter @my-monorepo/api-client