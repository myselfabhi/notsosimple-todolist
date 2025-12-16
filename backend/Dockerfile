# Step 1: Choose base image
# node:24-alpine = Node.js v24 on Alpine Linux (small, secure)
# alpine = minimal Linux distro (~5MB vs ~200MB for full Debian)
FROM node:24-alpine

# Step 2: Set working directory inside container
# All commands run from this path
WORKDIR /app

# Step 3: Copy dependency files first (layer caching optimization)
# Docker caches layers. If package.json hasn't changed, 
# it reuses the cached "npm install" layer
COPY package.json package-lock.json ./

# Step 4: Install dependencies
# npm ci = clean install (faster, reproducible, uses package-lock.json)
# --only=production = skip devDependencies (if you had any)
RUN npm ci

# Step 5: Copy application code
# This happens AFTER npm install for better caching
# If code changes but deps don't, Docker reuses the npm install layer
COPY . .

# Step 6: Expose port (documentation, doesn't actually publish)
# Your app runs on 3001
EXPOSE 3001

# Step 7: Set environment to production
ENV NODE_ENV=production

# Step 8: Run the application
# CMD = default command when container starts
# Use array form for proper signal handling
CMD ["node", "server.js"]

