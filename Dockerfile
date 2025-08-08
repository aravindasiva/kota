FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY apps/kota-api/package*.json ./

# Install dependencies including dev dependencies for building
RUN npm install

# Copy source code and tsconfig
COPY apps/kota-api/src ./src
COPY apps/kota-api/tsconfig.json ./

# Create a simple tsconfig if it doesn't exist
RUN if [ ! -f tsconfig.json ]; then \
    echo '{ \
      "compilerOptions": { \
        "target": "es2016", \
        "module": "commonjs", \
        "outDir": "./dist", \
        "esModuleInterop": true, \
        "forceConsistentCasingInFileNames": true, \
        "strict": false, \
        "skipLibCheck": true \
      }, \
      "include": ["src/**/*"] \
    }' > tsconfig.json; \
    fi

# Build the TypeScript code
RUN npx tsc --skipLibCheck

# Remove dev dependencies for smaller image
RUN npm prune --production

# Expose the port
EXPOSE 10000

# Start the application
CMD ["node", "dist/index.js"]