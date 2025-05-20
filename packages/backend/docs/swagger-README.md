# Glizzy Gobbler 4000 API Documentation

## Overview

This directory contains the API documentation setup using Swagger UI. The documentation provides a user-friendly interface to explore and test the API endpoints.

## Accessing the Documentation

The Swagger UI documentation is available at:

```
http://localhost:5000/api-docs
```

When the server is running, you can access this URL in your browser to see the API documentation.

## Features

- Interactive API documentation
- Request/response examples
- Authentication documentation
- Model schemas
- Test endpoints directly from the UI

## Structure

The Swagger documentation is configured in multiple files:

1. `swagger.config.mjs` - Main configuration file that sets up the OpenAPI specification
2. JSDoc comments in route files (e.g., `auth.routes.mjs`) - Documents individual endpoints
3. JSDoc comments in controller files - Provides additional endpoint documentation
4. Model schemas defined in the Swagger configuration

## Adding Documentation for New Endpoints

When adding new endpoints to the API, follow these steps to ensure they are properly documented:

1. Add JSDoc comments above the route definition in your route file:

```javascript
/**
 * @swagger
 * /api/your-endpoint:
 *   get:
 *     tags: [YourTag]
 *     summary: Short description
 *     description: Detailed description
 *     parameters:
 *       - name: paramName
 *         in: query
 *         description: Parameter description
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success response description
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/YourSchema'
 */
router.get('/your-endpoint', yourController);
```

2. Add JSDoc comments in your controller file for additional context:

```javascript
/**
 * Controller description
 * @route GET /api/your-endpoint
 * @access Public|Private
 */
export const yourController = (req, res) => { ... };
```

3. If needed, add new schemas to the `swagger.config.mjs` file under the `components.schemas` section.

## Authentication

The API uses JWT tokens stored in HttpOnly cookies for authentication. The Swagger UI is configured to support this authentication method. To test protected endpoints:

1. First, login using the `/api/auth/login` endpoint
2. The API will set the authentication cookie automatically
3. Then, you can test protected endpoints that require authentication

## Development

When modifying the Swagger configuration:

1. Update the `swagger.config.mjs` file for global changes
2. Make sure all route files use consistent JSDoc comments
3. Keep model schemas up to date in the Swagger configuration
4. Test the documentation by accessing the Swagger UI after changes