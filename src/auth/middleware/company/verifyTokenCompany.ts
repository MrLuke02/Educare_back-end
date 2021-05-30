import { Request, Response } from "express";
import { CompanyAddressController } from "../../../controllers/CompanyAddressController";
import { CompanyContactController } from "../../../controllers/CompanyContactController";
import { CompanyController } from "../../../controllers/CompanyController";
import { Status } from "../../../env/status";
import { verifyToken } from "../../token.auth";

// classe para a verificação dos tokens
class VerifyTokenCompany {
  // metodo para verificar o token enviado na rota de atualização de dados dos usuários
  async verifyADMCompany(req: Request, res: Response, next: Function) {
    let companyID;

    if (req.body.companyID) {
      companyID = req.body.companyID;
    } else {
      companyID = req.params.companyID;
    }

    if (!companyID) {
      return res.status(422).json({
        Message: Status.ID_NOT_FOUND,
      });
    }

    const companyController = new CompanyController();

    const company = await companyController.readCompanyFromID(companyID);

    if (!company) {
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
    }

    let token;
    // armazenando o token retornado da função
    if (!req.headers.authorization) {
      return res.status(401).json({ Message: Status.REQUIRED_TOKEN });
    } else {
      token = await verifyToken(req.headers.authorization.split(" ")[1], res);
    }

    // verifica se o token enviado pertence ao proprio usuário ou a um administrador
    if (
      token["sub"] == company.userID ||
      token["roles"].some((role: string) => role === "ADM")
    ) {
      // avança para o proximo middleware
      next();
    } else {
      // caso o token não seja de um administrador ou do proprio usuário, retorna um json de error
      return res.status(401).json({ Message: Status.INVALID_TOKEN });
    }
  }

  async verifyADMCompanyByAddressID(
    req: Request,
    res: Response,
    next: Function
  ) {
    let id;
    if (!req.body.id) {
      id = req.params.id;
    } else {
      id = req.body.id;
    }

    if (!id) {
      return res.status(422).json({
        Message: Status.ID_NOT_FOUND,
      });
    }

    const companyAddressController = new CompanyAddressController();

    const company = await companyAddressController.readFromAddress(id);

    if (!company) {
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
    }

    let token;
    // armazenando o token retornado da função
    if (!req.headers.authorization) {
      return res.status(401).json({ Message: Status.REQUIRED_TOKEN });
    } else {
      token = await verifyToken(req.headers.authorization.split(" ")[1], res);
    }

    // verifica se o token enviado pertence ao proprio usuário ou a um administrador
    if (
      token["sub"] == company.userID ||
      token["roles"].some((role: string) => role === "ADM")
    ) {
      // avança para o proximo middleware
      next();
    } else {
      // caso o token não seja de um administrador ou do proprio usuário, retorna um json de error
      return res.status(401).json({ Message: Status.INVALID_TOKEN });
    }
  }

  async verifyADMCompanyByContactID(
    req: Request,
    res: Response,
    next: Function
  ) {
    let id;
    if (!req.body.id) {
      id = req.params.id;
    } else {
      id = req.body.id;
    }

    if (!id) {
      return res.status(422).json({
        Message: Status.ID_NOT_FOUND,
      });
    }

    const companyContactController = new CompanyContactController();

    const company = await companyContactController.readFromContact(id);

    if (!company) {
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
    }

    let token;
    // armazenando o token retornado da função
    if (!req.headers.authorization) {
      return res.status(401).json({ Message: Status.REQUIRED_TOKEN });
    } else {
      token = await verifyToken(req.headers.authorization.split(" ")[1], res);
    }

    // verifica se o token enviado pertence ao proprio usuário ou a um administrador
    if (
      token["sub"] == company.userID ||
      token["roles"].some((role: string) => role === "ADM")
    ) {
      // avança para o proximo middleware
      next();
    } else {
      // caso o token não seja de um administrador ou do proprio usuário, retorna um json de error
      return res.status(401).json({ Message: Status.INVALID_TOKEN });
    }
  }
}

export { VerifyTokenCompany };
