import { Router } from "express";
import { VerifyTokenCompany } from "../auth/middleware/company/verifyTokenCompany";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { SchoolController } from "../controllers/SchoolController";

// criando um objeto de RoleController
const schoolController = new SchoolController();
const verifyTokenCompany = new VerifyTokenCompany();
const verifyTokenUser = new VerifyTokenUser();

const routerSchool = Router();

routerSchool.post(
  "/school",
  // verifyTokenUser.verifyTokenADM,
  schoolController.create
);

routerSchool.put(
  "/school",
  // verifyTokenCompany.verifyADMCompany,
  schoolController.update
);

routerSchool.get(
  "/schoolByCnpj",
  // verifyTokenUser.verifyTokenAuth,
  schoolController.read
);

routerSchool.get(
  "/school/:schoolID",
  // verifyTokenCompany.verifyADMCompany,
  schoolController.readFromID
);

// routerSchool.get(
//   "/schoolAll/:schoolID",
//   verifyTokenUser.verifyTokenAuth,
//   schoolController.readAllFromCompany
// );

// criando a rota de pesquisa da Role pelo id
// routerSchool.get(
//   "/schoolAddress/:schoolID",
//   verifyTokenCompany.verifyADMCompany,
//   schoolController.readCompanyAddress
// );

// routerSchool.get(
//   "/schoolContact/:schoolID",
//   verifyTokenCompany.verifyADMCompany,
//   schoolController.readCompanyContact
// );

routerSchool.get(
  "/showSchools",
  // verifyTokenUser.verifyTokenAuth,
  schoolController.show
);

routerSchool.delete(
  "/school/:schoolID",
  // verifyTokenCompany.verifyADMCompany,
  schoolController.delete
);

export { routerSchool };
