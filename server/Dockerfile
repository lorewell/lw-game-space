FROM node:20-alpine

# 1. 安装 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 2. 复制依赖清单
# 必须包含 pnpm-lock.yaml，否则 pnpm 无法确保依赖版本一致
COPY package.json pnpm-lock.yaml* ./

# 3. 安装生产环境依赖
# --frozen-lockfile: 确保不更新 lock 文件，提高构建可靠性
# --prod: 只安装 dependencies 中的包，不安装 devDependencies
RUN pnpm install --frozen-lockfile --prod

# 4. 复制本地构建好的 dist
COPY dist ./dist

# 5. 如果你的代码里用了 dotenv，记得确保 .env 文件也被复制或通过环境变量传入
# COPY .env ./

EXPOSE 3000

CMD ["node", "dist/index.js"]