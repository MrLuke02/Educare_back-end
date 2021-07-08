import cors from "cors";
import express from "express";
import "reflect-metadata";
import "./database";
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
  routes.routerDocument
);

// Inicia o servidor da api na porta 3333
app.listen(3333, () => console.log("Servidor Rodando!"));
