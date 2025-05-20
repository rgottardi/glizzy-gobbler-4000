# Docker Setup for Glizzy Gobbler 4000

This project includes comprehensive Docker configurations for both development and production environments.

## Quick Start

### Development Environment

To start the development environment with hot-reloading:

```bash
# Create a .env file from the example
cp .env.example .env

# Start the development environment
docker-compose -f docker-compose.dev.yml up
```

This will start:
- Frontend at http://localhost:3000 (with hot-reloading)
- Backend at http://localhost:5000 (with auto-restart)
- MongoDB at localhost:27017
- MongoDB Express (web admin) at http://localhost:8081

### Production Environment

To start the production environment:

```bash
# Create a .env file from the example (adjust values for production)
cp .env.example .env

# Start the production environment
docker-compose up -d
```

This will start:
- Frontend at http://localhost:3000 (optimized build served via Nginx)
- Backend at http://localhost:5000 (production mode)
- MongoDB at localhost:27017

## Configuration

### Environment Variables

The Docker setup uses environment variables defined in the `.env` file. Here are the key variables:

- `PORT`: The port on which the backend server runs (default: 5000)
- `DOCKER_FRONTEND_PORT`: The external port for the frontend (default: 3000)
- `DOCKER_BACKEND_PORT`: The external port for the backend (default: 5000)
- `DOCKER_MONGO_PORT`: The external port for MongoDB (default: 27017)
- `VITE_API_BASE_URL`: The URL the frontend uses to connect to the backend API (default: http://localhost:5000/api)
- `NODE_ENV`: The environment mode (development/production)

## Docker Components

### Frontend

#### Development (Dockerfile.dev)
- Uses Node.js Alpine image
- Mounts the frontend source directory for real-time changes
- Uses Vite for fast hot module replacement
- Preserves node_modules in a named volume for performance

#### Production (Dockerfile)
- Multi-stage build process
- Builds the React application with Vite
- Serves the static files using Nginx
- Optimized for production with minimal image size

### Backend

#### Development (Dockerfile.dev)
- Uses Node.js Alpine image
- Mounts the backend source directory for real-time changes
- Uses Nodemon to automatically restart on file changes
- Preserves node_modules in a named volume for performance

#### Production (Dockerfile)
- Multi-stage build process
- Installs only production dependencies
- Uses a slim Node.js image for the final stage
- Optimized for security and performance

### MongoDB

- Uses the official MongoDB image
- Persists data in a named volume
- Includes initialization scripts for database setup
- Creates default collections and indexes

### MongoDB Express (Development Only)

- Web-based MongoDB admin interface
- Only included in the development environment
- Provides a GUI for database management

## Volume Management

The Docker setup uses several named volumes:

- `mongo-data`: Persists MongoDB data between container restarts
- `node_modules_frontend`: Stores frontend dependencies (dev environment)
- `node_modules_backend`: Stores backend dependencies (dev environment)

## Networking

All services are connected via a Docker bridge network named `app-network`, allowing services to communicate using their service names as hostnames.

## Development vs Production

### Development Features
- Source code hot-reloading
- Full development dependencies
- MongoDB Express admin interface
- Debugging capabilities
- Source maps for frontend

### Production Features
- Multi-stage builds for minimal image size
- Optimized static assets
- Nginx for frontend serving
- Only production dependencies installed
- Automatic container restarts on failure

## Customization

You can customize the Docker setup by:

1. Modifying the Dockerfiles for specific requirements
2. Adjusting environment variables in the `.env` file
3. Adding additional services to the docker-compose files
4. Configuring the Nginx settings for the frontend

## Troubleshooting

### Common Issues

1. **Port conflicts**: If you have services already running on the default ports, either stop those services or change the port mappings in the docker-compose files.

2. **Permission issues**: If you encounter permission problems with mounted volumes, check the permissions of the directories being mounted.

3. **Container connectivity**: If services can't connect to each other, verify that they're all on the same Docker network.

4. **Hot-reloading not working**: Ensure that the volume mounts are correctly specified and that the development server is properly configured.

### Logs

To view logs for running containers:

```bash
# All containers
docker-compose logs

# Specific service
docker-compose logs frontend

# Follow logs in real-time
docker-compose logs -f backend
```

## Performance Optimizations

- Named volumes for `node_modules` improve build and startup times
- Multi-stage builds reduce final image sizes
- Frontend static files are served by Nginx for optimal performance
- Container health checks ensure services are running correctly