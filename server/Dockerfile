# 直接使用本地构建好的产物运行
FROM node:24-alpine

WORKDIR /app

# 复制本地构建产物
COPY dist ./dist
COPY node_modules ./node_modules
COPY package.json ./

EXPOSE 3000

CMD ["node", "dist/index.js"]
