import { Request, Response, Router } from "express";
import multer from "multer";
import { DocumentController } from "../controllers/DocumentController";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { Message } from "../env/message";
import { AppError } from "../errors/AppErrors";

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
routerDocument.get("/document", (req: Request, res: Response) => {
  throw new AppError(Message.ID_NOT_FOUND, 422);
});

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

routerDocument.delete("/document", (req: Request, res: Response) => {
  throw new AppError(Message.ID_NOT_FOUND, 422);
});

// exportando o router
export { routerDocument };
