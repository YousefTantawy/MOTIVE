FROM node:24-slim AS base
WORKDIR /app
EXPOSE 5173

FROM base AS install
COPY package*.json .
RUN npm install

FROM install AS final
COPY . .
CMD ["npm", "run", "dev"]
