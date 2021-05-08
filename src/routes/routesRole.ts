import { Request, Response, Router } from "express";
import { verifyTokenRole } from "../auth/middleware/role/verifyTokenRole";
import { RoleController } from "../controllers/RoleController";

// criando um objeto de RoleController
const roleController = new RoleController();

const routerRole = Router();

// criando a rota de cadastro de Roles
routerRole.post("/role", verifyTokenRole, roleController.create);

// criando a rota de atualização de Roles
routerRole.put("/role", verifyTokenRole, roleController.update);

// criando a rota de listagem de todos as Roles
routerRole.get("/showRoles", verifyTokenRole, roleController.show);
// criando a rota de pesquisa da Role pelo id
routerRole.get("/role/:id", verifyTokenRole, roleController.read);

routerRole.get("/role", (req: Request, res: Response) => {
  return res.status(422).json({
    error: "Nenhum id foi passado!",
  });
});

// criando a rota de deleção de Roles
routerRole.delete("/role/:id", verifyTokenRole, roleController.delete);

routerRole.delete("/role", (req: Request, res: Response) => {
  return res.status(422).json({
    error: "Nenhum id foi passado!",
  });
});

// exportando o router
export { routerRole };
