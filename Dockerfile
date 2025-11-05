# Multi-stage build for NestJS application

# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN yarn install

# Copy source code
COPY . .

# Build the application
RUN yarn build --skipLibCheck

# Stage 2: Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package.json ./

# Install only production dependencies
RUN npm install 

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Expose the port
EXPOSE 3000

# Set NODE_ENV to production
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/main"]

