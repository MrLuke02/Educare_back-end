import { Router } from 'express';
import { UserController } from './controllers/UserController';
import { Request } from 'express';

const userController = new UserController();

const router = Router();

router.post("/user", userController.create);



router.get("/user", userController.read);



router.post("/userUpdate", userController.update);



router.delete("/user/:id", userController.delete);

export { router }