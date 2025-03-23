FROM node:22-alpine  

WORKDIR /usr/src/app  

RUN apk add --no-cache git && npm install -g pnpm  

COPY package.json pnpm-lock.yaml ./  
RUN pnpm install  

COPY . .  

ENV APP_ENV=${APP_ENV:-development}  

EXPOSE 4000  

CMD ["sh", "-c", "if [ \"$APP_ENV\" = 'production' ]; then pnpm build && pnpm start; else pnpm dev; fi"]
