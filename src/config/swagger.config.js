import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "../docs/swagger.doc.js";

export const swaggerSetup = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
