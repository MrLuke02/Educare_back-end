import "reflect-metadata";
import express from "express";
import "./database";
import { router } from "./routes";
import cors from "cors";

// Inicia uma aplicação express
const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

// Inicia o servidor da api na porta 3333
app.listen(3333, () => console.log("Servidor Rodando!"));
