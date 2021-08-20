import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import "reflect-metadata";
import "./database";
import { AppError } from "./errors/AppErrors";
import * as routes from "./routes/routes";

// Inicia uma aplicação express
const app = express();

// configurações do servidor
app.use(cors());
app.use(express.json());
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
  routes.routerInterestArea,
  routes.routerStudent,
  routes.routerToken,
  routes.routerOrderStatus,
  routes.routerCourse
);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ Message: error.message });
  }

  return res
    .status(500)
    .json({ Message: `Erro interno do servidor ${error.message}` });
});

// Inicia o servidor da api na porta 3333
app.listen(3333, () => console.log("Servidor Rodando!"));
