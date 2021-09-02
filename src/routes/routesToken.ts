import { Router } from "express";
import { TokenRefreshController } from "../controllers/TokenRefreshController";

const tokenRefreshController = new TokenRefreshController();

const routerToken = Router();

// criando a rota de cadastro de Roles
routerToken.post("/validationToken", tokenRefreshController.validation);

routerToken.post("/tokenRefresh", tokenRefreshController.create);

// exportando o router
export { routerToken };
