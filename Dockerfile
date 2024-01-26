FROM node:21-slim

WORKDIR /app

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

COPY . .

RUN npm install

WORKDIR /app/apps/relay
CMD [ "npm", "run", "start" ]
EXPOSE 3069