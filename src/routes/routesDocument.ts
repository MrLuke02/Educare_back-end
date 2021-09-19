import { Router } from "express";
import multer from "multer";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { DocumentController } from "../controllers/DocumentController";

const routerDocument = Router();
const documentController = new DocumentController();
const verifyTokenUser = new VerifyTokenUser();

// criando a rota de cadastro de usuários
routerDocument.post(
  "/document",
  multer().single("file"),
  verifyTokenUser.verifyTokenADM,
  documentController.create
);

routerDocument.put(
  "/document",
  multer().single("file"),
  verifyTokenUser.verifyTokenADM,
  documentController.update
);

routerDocument.get(
  "/document/:id",
  verifyTokenUser.verifyTokenADM,
  documentController.read
);

routerDocument.get(
  "/showDocuments",
  verifyTokenUser.verifyTokenADM,
  documentController.show
);

routerDocument.delete(
  "/document/:id",
  verifyTokenUser.verifyTokenADM,
  documentController.delete
);

// exportando o router
export { routerDocument };
