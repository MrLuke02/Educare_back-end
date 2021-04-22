import "reflect-metadata";
import express from "express";
import "./database";
import { router } from "./routes";
import Cors from "cors";

const app = express(); // Inicia uma aplicação express

app.use(Cors());
app.use(express.json());
app.use(router);

app.listen(3331, () => console.log("Server is runing!")); // Inicia o servidor da api na porta 3333
