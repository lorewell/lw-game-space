# 构建阶段
FROM node:20-alpine AS builder

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 定义构建参数
ARG VITE_API_BASE_URL
ARG VITE_WS_URL

# 设置为环境变量供 Vite 使用
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_WS_URL=${VITE_WS_URL}

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
