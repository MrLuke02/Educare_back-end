import { Router } from "express";
import { UserController } from "./controllers/UserController";

// instanciando UserController
const userController = new UserController();

const router = Router();

// definindo a rota de criação/cadastro de usuário
router.post("/user", userController.create);
// definindo a rota de atualização/edição de usuário
router.post("/userUpdate", userController.update);

// definindo a rota de login de usuário
router.get("/user", userController.read);

// definindo a rota de deleção de usuário
router.delete("/user/:id", userController.delete);

export { router };
