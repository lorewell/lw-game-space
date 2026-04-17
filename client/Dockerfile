# 构建阶段
FROM node:20-alpine AS builder

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 复制依赖文件
COPY package*.json pnpm-lock.yaml* ./

# 使用 pnpm 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源码
COPY . .

# 构建生产版本
RUN pnpm build

# 生产阶段 - 使用 nginx
FROM nginx:alpine AS production

# 复制 nginx 配置
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

EXPOSE 8848

CMD ["nginx", "-g", "daemon off;"]
