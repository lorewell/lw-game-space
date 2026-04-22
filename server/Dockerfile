FROM node:24-alpine

WORKDIR /app

# 复制本地构建产物
COPY dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]
