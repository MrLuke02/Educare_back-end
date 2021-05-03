import cors from "cors";
import express from "express";
import "reflect-metadata";
import "./database";
import { routerUser } from "./routes/routes";

// Inicia uma aplicação express
const app = express();

// configurações do servidor
app.use(cors());
app.use(express.json());
app.use(routerUser);

// Inicia o servidor da api na porta 3333
app.listen(3333, () => console.log("Servidor Rodando!"));
