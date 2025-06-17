import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'WebTech Backend API',
            version: '1.0.0',
        }
    },
});
