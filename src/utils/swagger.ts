import { Express } from "express";
import { Request, Response } from "express-serve-static-core";
import { version } from "../../package.json";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Quizzzee API Documentation",
            version,
            description: '_**"Quizzzee is a fun and nice name after all :DDD"**_   _[Quizzzee Github](https://github.com/Sawconed/Quizzzee-Server)_',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ],
        servers: [
            {
                url: "http://localhost:8080/"
            }
        ],
        tags: [
            {
                name: "Commons"
            },
            {
                name: "Users"
            },
            {
                name: "Admins"
            },
            {
                name: "Quizzzy"
            },
            {
                name: "Quizzz"
            },
            {
                name: "Report"
            }
        ]
    },
    apis: ["src/utils/docs/*.ts", "src/models/*.ts"]
};

const swaggerSpec = swaggerJsDoc(options);

export const swaggerDocs = (app: Express, port: string | 8080) => {
    // Swagger page
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Docs in Json format
    app.get("/docs-json", (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });

    console.log(`Swagger Docs: http://localhost:${port}/docs 📚`);
}

export default swaggerDocs;