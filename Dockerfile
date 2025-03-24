FROM node:alpine
WORKDIR /usr/src
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm run build
ENV HOST=0.0.0.0 NODE_ENV=production
ENV PORT=${PORT:-3000}
EXPOSE $PORT
CMD ["npm", "start"]
