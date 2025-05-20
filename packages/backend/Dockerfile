# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json files for workspace setup
COPY package.json .
COPY packages/backend/package.json ./packages/backend/
COPY package-lock.json .

# Install only production dependencies using workspace
RUN npm ci --workspace=backend --omit=dev

# Copy the application source
COPY . .

# Run stage
FROM node:20-alpine-slim

WORKDIR /app

# Copy node modules and source from build stage
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/packages/backend/node_modules /app/packages/backend/node_modules
COPY --from=build /app/packages/backend/src /app/packages/backend/src
COPY --from=build /app/config /app/config

# Set environment to production
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["node", "packages/backend/src/server.mjs"]
