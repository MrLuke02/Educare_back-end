import { Router } from "express";
import swaggerUI from "swagger-ui-express";
import swaggerApiDocs from "../../Swagger/swagger.json";

const routerApiDocs = Router();

routerApiDocs.use("/api-educare", swaggerUI.serve);
routerApiDocs.get("/api-educare", swaggerUI.setup(swaggerApiDocs));

export { routerApiDocs };
