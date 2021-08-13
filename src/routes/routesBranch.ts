import { Router } from "express";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { BranchController } from "../controllers/BranchController";

const branchController = new BranchController();
const verifyTokenUser = new VerifyTokenUser();

const routerBranch = Router();

routerBranch.post(
  "/branch",
  verifyTokenUser.verifyTokenADM,
  branchController.create
);

routerBranch.put(
  "/branch",
  verifyTokenUser.verifyTokenADM,
  branchController.update
);

routerBranch.get(
  "/branch/:id",
  verifyTokenUser.verifyTokenADM,
  branchController.read
);

routerBranch.delete(
  "/branch/:id",
  verifyTokenUser.verifyTokenADM,
  branchController.delete
);

routerBranch.get(
  "/showBranches",
  verifyTokenUser.verifyTokenADM,
  branchController.show
);

export { routerBranch };
