const fs = require('fs');
const openapiPath = 'docs/openapi.json';
const postmanPath = 'docs/Kizuna_Fit_Identity_API.postman_collection.json';

// UPDATE OPENAPI
const openapi = JSON.parse(fs.readFileSync(openapiPath, 'utf8'));

openapi.paths['/api/v1/identity/google'] = {
  post: {
    summary: 'Authenticate with Google',
    description: 'Login or register using a Google ID Token',
    tags: ['Auth'],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              idToken: { type: 'string' }
            },
            required: ['idToken']
          }
        }
      }
    },
    responses: {
      '200': {
        description: 'Successfully authenticated',
        headers: {
          'Set-Cookie': {
            description: 'kizunafit_rt=...; HttpOnly; Secure; SameSite=Strict',
            schema: { type: 'string' }
          }
        },
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: true },
                data: {
                  type: 'object',
                  properties: {
                    accessToken: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      },
      '400': { description: 'Bad Request' },
      '401': { description: 'Unauthorized' }
    }
  }
};

fs.writeFileSync(openapiPath, JSON.stringify(openapi, null, 2));

// UPDATE POSTMAN
const postman = JSON.parse(fs.readFileSync(postmanPath, 'utf8'));

// Find Auth folder
const authFolder = postman.item.find(i => i.name === 'Auth');
if (authFolder) {
  authFolder.item.push({
    name: 'Google Login',
    request: {
      method: 'POST',
      header: [
        { key: 'Content-Type', value: 'application/json' }
      ],
      body: {
        mode: 'raw',
        raw: '{\n    "idToken": "eyJhbGciOiJ..."\n}'
      },
      url: {
        raw: '{{baseUrl}}/api/v1/identity/google',
        host: ['{{baseUrl}}'],
        path: ['api', 'v1', 'identity', 'google']
      }
    },
    response: []
  });
}

fs.writeFileSync(postmanPath, JSON.stringify(postman, null, 2));

console.log('Docs updated');
