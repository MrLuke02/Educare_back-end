import { Router } from "express";
import multer from "multer";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { AdsController } from "../controllers/AdsController";

// criando um objeto de RoleController
const adsController = new AdsController();
const verifyTokenUser = new VerifyTokenUser();

const routerAds = Router();

// criando a rota de cadastro de Roles
routerAds.post(
  "/ad",
  multer().single("file"),
  verifyTokenUser.verifyTokenADM,
  adsController.create
);

// criando a rota de atualização de Roles
routerAds.put(
  "/ad",
  multer().single("file"),
  verifyTokenUser.verifyTokenADM,
  adsController.update
);

// criando a rota de listagem de todos as Roles
routerAds.get("/showAds", verifyTokenUser.verifyTokenADM, adsController.show);
// criando a rota de pesquisa da Role pelo id
routerAds.get("/ad/:id", verifyTokenUser.verifyTokenADM, adsController.read);

// criando a rota de deleção de Roles
routerAds.delete(
  "/ad/:id",
  verifyTokenUser.verifyTokenADM,
  adsController.delete
);

// exportando o router
export { routerAds };
