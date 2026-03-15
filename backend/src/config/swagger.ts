import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Akkor Hôtel',
      version: '1.0.0',
      description:
        'API pour la plateforme de réservation Akkor Hôtel - gérer les utilisateurs, les hôtels et les réservations',
      contact: {
        name: 'Support Akkor Hôtel',
      },
    },
    servers: [
      {
        url: '/api', 
        description: 'Serveur API',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Utilisateur: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            email: { type: 'string', example: 'user@example.com' },
            pseudo: { type: 'string', example: 'johndoe' },
            role: {
              type: 'string',
              enum: ['user', 'employee', 'admin'],
              example: 'user',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Hotel: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Grand Plaza Hotel' },
            location: { type: 'string', example: 'Paris, France' },
            description: {
              type: 'string',
              example: 'Un hôtel de luxe au cœur de Paris',
            },
            picture_list: {
              type: 'array',
              items: { type: 'string' },
              example: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Reservation: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            userId: { type: 'integer', example: 1 },
            hotelId: { type: 'integer', example: 1 },
            checkIn: { type: 'string', format: 'date-time' },
            checkOut: { type: 'string', format: 'date-time' },
            guests: { type: 'integer', example: 2 },
            status: {
              type: 'string',
              enum: ['confirmed', 'cancelled', 'pending'],
              example: 'pending',
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    paths: {
      '/auth/register': {
        post: {
          tags: ['Authentification'],
          summary: 'Enregistrer un nouvel utilisateur',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'pseudo', 'password'],
                  properties: {
                    email: {
                      type: 'string',
                      format: 'email',
                      example: 'user@example.com',
                    },
                    pseudo: {
                      type: 'string',
                      minLength: 2,
                      example: 'johndoe',
                    },
                    password: {
                      type: 'string',
                      minLength: 6,
                      example: 'password123',
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Utilisateur créé avec succès',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      user: { $ref: '#/components/schemas/Utilisateur' },
                      token: { type: 'string' },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Erreur de validation',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
            409: { description: 'Email déjà enregistré' },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Authentification'],
          summary: 'Connexion utilisateur',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: {
                      type: 'string',
                      format: 'email',
                      example: 'user@example.com',
                    },
                    password: { type: 'string', example: 'password123' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Connexion réussie',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      user: { $ref: '#/components/schemas/Utilisateur' },
                      token: { type: 'string' },
                    },
                  },
                },
              },
            },
            401: { description: 'Identifiants invalides' },
          },
        },
      },
      '/users/me': {
        get: {
          tags: ['Utilisateurs'],
          summary: 'Obtenir le profil utilisateur actuel',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Profil utilisateur actuel',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      user: { $ref: '#/components/schemas/Utilisateur' },
                    },
                  },
                },
              },
            },
            401: { description: 'Authentification requise' },
          },
        },
      },
      '/users': {
        get: {
          tags: ['Utilisateurs'],
          summary: 'Lister tous les utilisateurs (employé/admin uniquement)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Liste des utilisateurs',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      users: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Utilisateur' },
                      },
                    },
                  },
                },
              },
            },
            403: { description: 'Permissions insuffisantes' },
          },
        },
      },
      '/users/{id}': {
        get: {
          tags: ['Utilisateurs'],
          summary: 'Obtenir l\'utilisateur par ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: {
              description: 'Données de l\'utilisateur',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      user: { $ref: '#/components/schemas/Utilisateur' },
                    },
                  },
                },
              },
            },
            403: { description: 'Vous ne pouvez pas voir les profils d\'autres utilisateurs' },
            404: { description: 'Utilisateur non trouvé' },
          },
        },
        put: {
          tags: ['Utilisateurs'],
          summary: 'Mettre à jour l\'utilisateur',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', format: 'email' },
                    pseudo: { type: 'string' },
                    password: { type: 'string' },
                    role: {
                      type: 'string',
                      enum: ['user', 'employee', 'admin'],
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Utilisateur mis à jour' },
            403: { description: 'Permissions insuffisantes' },
            404: { description: 'Utilisateur non trouvé' },
          },
        },
        delete: {
          tags: ['Utilisateurs'],
          summary: 'Supprimer l\'utilisateur (soi-même uniquement)',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: { description: 'Utilisateur supprimé' },
            403: { description: 'Vous ne pouvez supprimer que votre propre compte' },
          },
        },
      },
      '/hotels': {
        get: {
          tags: ['Hôtels'],
          summary: 'Lister tous les hôtels (public)',
          parameters: [
            {
              name: 'sortBy',
              in: 'query',
              schema: {
                type: 'string',
                enum: ['name', 'location', 'createdAt'],
              },
            },
            {
              name: 'order',
              in: 'query',
              schema: { type: 'string', enum: ['asc', 'desc'] },
            },
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer', default: 10 },
            },
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', default: 1 },
            },
            { name: 'name', in: 'query', schema: { type: 'string' } },
            { name: 'location', in: 'query', schema: { type: 'string' } },
          ],
          responses: {
            200: {
              description: 'Liste des hôtels avec pagination',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      hotels: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Hotel' },
                      },
                      pagination: {
                        type: 'object',
                        properties: {
                          total: { type: 'integer' },
                          page: { type: 'integer' },
                          limit: { type: 'integer' },
                          totalPages: { type: 'integer' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Hôtels'],
          summary: 'Créer un hôtel (admin uniquement)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'location', 'description'],
                  properties: {
                    name: { type: 'string' },
                    location: { type: 'string' },
                    description: { type: 'string' },
                    picture_list: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Hôtel créé' },
            400: { description: 'Erreur de validation' },
            403: { description: 'Admin uniquement' },
          },
        },
      },
      '/hotels/{id}': {
        get: {
          tags: ['Hôtels'],
          summary: 'Obtenir l\'hôtel par ID (public)',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: {
              description: 'Données de l\'hôtel',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      hotel: { $ref: '#/components/schemas/Hotel' },
                    },
                  },
                },
              },
            },
            404: { description: 'Hôtel non trouvé' },
          },
        },
        put: {
          tags: ['Hôtels'],
          summary: 'Mettre à jour l\'hôtel (admin uniquement)',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    location: { type: 'string' },
                    description: { type: 'string' },
                    picture_list: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Hôtel mis à jour' },
            403: { description: 'Admin uniquement' },
            404: { description: 'Hôtel non trouvé' },
          },
        },
        delete: {
          tags: ['Hôtels'],
          summary: 'Supprimer l\'hôtel (admin uniquement)',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: { description: 'Hôtel supprimé' },
            403: { description: 'Admin uniquement' },
            404: { description: 'Hôtel non trouvé' },
          },
        },
      },
      '/bookings': {
        get: {
          tags: ['Réservations'],
          summary: 'Obtenir mes réservations',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Réservations de l\'utilisateur',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      bookings: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Reservation' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Réservations'],
          summary: 'Créer une réservation',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['hotelId', 'checkIn', 'checkOut', 'guests'],
                  properties: {
                    hotelId: { type: 'string' },
                    checkIn: { type: 'string', format: 'date-time' },
                    checkOut: { type: 'string', format: 'date-time' },
                    guests: { type: 'integer', minimum: 1 },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Réservation créée' },
            400: { description: 'Erreur de validation' },
            404: { description: 'Hôtel non trouvé' },
          },
        },
      },
      '/bookings/search': {
        get: {
          tags: ['Réservations'],
          summary: 'Rechercher les réservations (admin uniquement)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'email', in: 'query', schema: { type: 'string' } },
            { name: 'name', in: 'query', schema: { type: 'string' } },
            { name: 'userId', in: 'query', schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'Réservations correspondantes' },
            403: { description: 'Admin uniquement' },
          },
        },
      },
      '/bookings/{id}': {
        get: {
          tags: ['Réservations'],
          summary: 'Obtenir la réservation par ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: { description: 'Données de la réservation' },
            403: { description: 'Vous ne pouvez voir que vos propres réservations' },
            404: { description: 'Réservation non trouvée' },
          },
        },
        put: {
          tags: ['Réservations'],
          summary: 'Mettre à jour la réservation',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    checkIn: { type: 'string', format: 'date-time' },
                    checkOut: { type: 'string', format: 'date-time' },
                    guests: { type: 'integer' },
                    status: {
                      type: 'string',
                      enum: ['confirmed', 'cancelled', 'pending'],
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Réservation mise à jour' },
            403: { description: 'Vous ne pouvez mettre à jour que vos propres réservations' },
            404: { description: 'Réservation non trouvée' },
          },
        },
        delete: {
          tags: ['Réservations'],
          summary: 'Supprimer la réservation',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: { description: 'Réservation supprimée' },
            403: { description: 'Vous ne pouvez supprimer que vos propres réservations' },
            404: { description: 'Réservation non trouvée' },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
