import cors from "cors";
import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import "express-async-errors";
import "reflect-metadata";
import "./database";
import { AppError } from "./errors/AppErrors";
import * as routes from "./routes/routes";
import { routerMP } from "./routes/routesMP";

// Inicia uma aplicação express
const app = express();

// configurações do servidor
app.use(cors());
app.use(express.json() as RequestHandler);
app.use(
  "/api/v1",
  routes.routerOrder,
  routes.routerApiDocs,
  routes.routerUser,
  routes.routerRole,
  routes.routerPhone,
  routes.routerUserRole,
  routes.routerAddress,
  routes.routerCompany,
  routes.routerCategory,
  routes.routerCompanyAddress,
  routes.routerCompanyContact,
  routes.routerDocument,
  routes.routerSolicitation,
  routes.routerStudent,
  routes.routerToken,
  routes.routerStudentInterestArea,
  routes.routerUserInterestArea,
  routes.routerUserInterestAreaRelationUser,
  routes.routerAds,
  routes.routerEmployee,
  routes.routerPlan,
  routes.routerCompanyRelationPlan,
  routes.routerEmployeeOrder,
  routerMP
);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ Message: error.message });
  }
  console.log(error);

  return res.status(500).json({ Message: error.message });
});

// Inicia o servidor da api na porta 3333
app.listen(3333, () => console.log("Servidor Rodando!"));
