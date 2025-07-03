import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'WebTech Streetcats API',
            version: '1.0.0',
        }
    },
    apis: ['./src/routes/*'],
});
