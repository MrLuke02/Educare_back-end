import 'reflect-metadata';
import express from 'express';
import "./database";

const app = express(); //Inicia uma aplicação express





app.listen(3333, ()=> console.log("Server is runing!")); //Inicia o servidor da api na porta 3333

