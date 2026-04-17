# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package*.json pnpm-lock.yaml* ./

# 安装依赖（使用 pnpm 如果有 lock 文件，否则用 npm）
RUN npm install

# 复制源码
COPY tsconfig.json ./
COPY src/ ./src/

# 编译 TypeScript
RUN npm run build

# 生产阶段
FROM node:20-alpine AS production

WORKDIR /app

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# 复制编译产物
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000

# 暴露端口
EXPOSE 3000

# 切换到非 root 用户
USER nodejs

# 启动命令
CMD ["node", "dist/index.js"]
