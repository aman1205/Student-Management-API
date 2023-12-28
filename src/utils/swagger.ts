import swaggerJSDoc from 'swagger-jsdoc';
import { version } from '../../package.json';

const options:swaggerJSDoc.Options= {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Student Management',
      version
    },
    components: {
      securitySchemes: {
       bearerAuth:{
        type:'http',
        scheme:"bearer",
        bearerFormat:"JWt"
       },
      },
    },
    security: [
      {
        bearerAuth:[] // This indicates that JWT authorization is required for protected routes.
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpecs = swaggerJSDoc(options);

export default swaggerSpecs;
