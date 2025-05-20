/**
 * Swagger Configuration
 * 
 * This file configures the Swagger UI interface and the OpenAPI specification
 * for the API documentation.
 */
import swaggerJSDoc from 'swagger-jsdoc';
import { PORT } from '../../../config/backend.config.mjs';

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Glizzy Gobbler 4000 API',
    version: '0.1.0',
    description: 'A multi-tenant MERN application API with role-based access control',
    contact: {
      name: 'API Support',
      email: 'support@example.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: `http://localhost:${PORT}/api`,
      description: 'Development server'
    }
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'token'
      }
    },
    responses: {
      UnauthorizedError: {
        description: 'Access token is missing or invalid',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Unauthorized - Not authenticated'
                }
              }
            }
          }
        }
      },
      ForbiddenError: {
        description: 'User does not have permission for this action',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Forbidden - Insufficient permissions'
                }
              }
            }
          }
        }
      },
      ServerError: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Server error'
                },
                stack: {
                  type: 'string',
                  example: 'Error stack trace (only in development)'
                }
              }
            }
          }
        }
      }
    },
    schemas: {
      User: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          _id: {
            type: 'string',
            description: 'User ID (auto-generated)',
            example: '60d0fe4f5311236168a109ca'
          },
          username: {
            type: 'string',
            description: 'User username',
            example: 'johndoe'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
            example: 'john.doe@example.com'
          },
          password: {
            type: 'string',
            format: 'password',
            description: 'User password (hashed)',
            example: 'password123'
          },
          isSystemAdmin: {
            type: 'boolean',
            description: 'Whether the user has system admin privileges',
            example: false
          },
          tenantRoles: {
            type: 'array',
            description: 'Roles assigned to the user per tenant',
            items: {
              type: 'object',
              properties: {
                tenantId: {
                  type: 'string',
                  description: 'ID of the tenant',
                  example: '60d0fe4f5311236168a109cb'
                },
                role: {
                  type: 'string',
                  enum: ['admin', 'author', 'user'],
                  description: 'Role within the tenant',
                  example: 'admin'
                }
              }
            }
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Date user was created',
            example: '2021-06-21T12:00:00Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Date user was last updated',
            example: '2021-06-21T12:00:00Z'
          },
          lastLogin: {
            type: 'string',
            format: 'date-time',
            description: 'Date user last logged in',
            example: '2021-06-21T12:00:00Z'
          }
        }
      },
      UserResponse: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'User ID',
            example: '60d0fe4f5311236168a109ca'
          },
          username: {
            type: 'string',
            description: 'User username',
            example: 'johndoe'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
            example: 'john.doe@example.com'
          },
          isSystemAdmin: {
            type: 'boolean',
            description: 'Whether the user has system admin privileges',
            example: false
          }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
            example: 'john.doe@example.com'
          },
          password: {
            type: 'string',
            format: 'password',
            description: 'User password',
            example: 'password123'
          }
        }
      },
      RegisterRequest: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          username: {
            type: 'string',
            description: 'User username',
            example: 'johndoe'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
            example: 'john.doe@example.com'
          },
          password: {
            type: 'string',
            format: 'password',
            description: 'User password',
            example: 'password123'
          }
        }
      },
      Tenant: {
        type: 'object',
        required: ['name'],
        properties: {
          _id: {
            type: 'string',
            description: 'Tenant ID (auto-generated)',
            example: '60d0fe4f5311236168a109cb'
          },
          name: {
            type: 'string',
            description: 'Tenant name',
            example: 'Acme Corporation'
          },
          slug: {
            type: 'string',
            description: 'URL-friendly tenant identifier',
            example: 'acme-corporation'
          },
          description: {
            type: 'string',
            description: 'Tenant description',
            example: 'A multinational corporation providing various products and services'
          },
          status: {
            type: 'string',
            enum: ['active', 'inactive', 'suspended'],
            description: 'Tenant status',
            example: 'active'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Date tenant was created',
            example: '2021-06-21T12:00:00Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Date tenant was last updated',
            example: '2021-06-21T12:00:00Z'
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Error message',
            example: 'An error occurred'
          }
        }
      }
    }
  },
  tags: [
    {
      name: 'Auth',
      description: 'Authentication operations'
    },
    {
      name: 'Users',
      description: 'User management operations'
    },
    {
      name: 'Tenants',
      description: 'Tenant management operations'
    }
  ]
};

// Options for the swagger docs
const options = {
  // Import swaggerDefinitions
  swaggerDefinition,
  // Path to the API docs
  apis: [
    './src/routes/*.mjs',
    './src/controllers/*.mjs',
    './src/models/*.mjs'
  ],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;