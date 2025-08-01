# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the Next.js application with standalone output
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy standalone build output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Change ownership to the non-root user
RUN chown -R nextjs:nodejs ./
USER nextjs

# Expose the port
EXPOSE 3000

# Set environment variables
ENV PORT=3000

# Increase Node.js heap size to improve startup stability
ENV NODE_OPTIONS="--max-old-space-size=1024"

# Start the application
CMD ["node", "server.js"]
