# 1. Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only package.json and lock files first for better caching
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Install dependencies
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install; \
  else npm install; fi

# Copy the rest of the frontend source code
COPY . .

# Build the Next.js app
RUN npm run build

# 2. Production stage
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "start"]