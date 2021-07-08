import { Request, Response, Router } from "express";
import multer from "multer";
import { DocumentController } from "../controllers/DocumentController";
import { Status } from "../env/status";

const routerDocument = Router();
const documentController = new DocumentController();
// criando a rota de cadastro de usuários
routerDocument.post(
  "/document",
  multer().single("file"),
  documentController.create
);

routerDocument.put(
  "/document",
  multer().single("file"),
  documentController.update
);

routerDocument.get("/document/:id", documentController.read);
routerDocument.get("/document", (req: Request, res: Response) => {
  return res.status(422).json({
    Message: Status.ID_NOT_FOUND,
  });
});

routerDocument.get("/showDocuments", documentController.show);

routerDocument.get("/document", (req: Request, res: Response) => {
  return res.status(422).json({
    Message: Status.ID_NOT_FOUND,
  });
});

routerDocument.delete("/document/:id", documentController.delete);

routerDocument.delete("/document", (req: Request, res: Response) => {
  return res.status(422).json({
    Message: Status.ID_NOT_FOUND,
  });
});

// exportando o router
export { routerDocument };
