import { Router } from "express";
import { UserController } from "./controllers/UserController";

const userController = new UserController();

const router = Router();

// criando a rota de cadastro de usuários
router.post("/user", userController.create);
// criando a rota de atualização de usuários
router.post("/userUpdate", userController.update);

// criando a rota de autenticação de usuários
router.get("/user", userController.read);

// criando a rota de deleção de usuários
router.delete("/user/:id", userController.delete);

// exportando o router
export { router };
