export const swaggerDocument = {
  swagger: '2.0',
  info: {
    description: 'My bank API description',
    version: '1.0.0',
    title: 'Swagger MyBankAPI',
  },
  host: 'localhost:3000',
  tags: [
    {
      name: 'account',
      description: 'Account Manager',
    },
  ],
  paths: {
    '/account': {
      get: {
        tags: ['account'],
        summary: 'Find account by ID',
        description: 'Get existing account description',
        produces: ['application/json'],
        responses: {
          200: {
            description: 'successful operation',
            schema: {
              type: 'array',
              items: {
                $ref: '#/definitions/account',
              },
            },
          },
          400: {
            description: 'Invalid ID supplied',
          },
        },
      },
      post: {
        tags: ['account'],
        summary: 'create a new account',
        description: 'create a new account with the recrived parameters',
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'Account object',
            required: true,
            schema: {
              $ref: '#/definitions/account',
            },
          },
        ],
        responses: {
          200: {
            description: 'Account created',
          },
          400: {
            description: 'Error occurred',
          },
        },
      },
    },
  },
  definitions: {
    account: {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
          example: 2,
        },
        name: {
          type: 'string',
          example: 'joao silveira',
        },
        Balance: {
          type: 'integer',
          example: 54564848,
        },
      },
    },
  },
  externalDocs: {
    description: 'Find out more about Swagger',
    url: 'http://swagger.io',
  },
};
