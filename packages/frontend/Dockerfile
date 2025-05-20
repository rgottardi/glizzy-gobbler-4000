# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json files for workspace setup
COPY package.json .
COPY packages/frontend/package.json ./packages/frontend/
COPY package-lock.json .

# Install dependencies using workspace
RUN npm ci --workspace=frontend

# Copy the rest of the application
COPY . .

# Build the React app
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build --workspace=frontend

# Serve stage
FROM nginx:alpine

# Copy the build output
COPY --from=build /app/packages/frontend/dist /usr/share/nginx/html

# Copy nginx.conf
COPY packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
