import { Request, Response } from "express";
import { verifyToken } from "../../token.auth";
import { Status } from "../../../env/status";
import { CompanyController } from "../../../controllers/CompanyController";

// classe para a verificação dos tokens
class VerifyTokenCompanyAddress {
  async verifyCreate(req: Request, res: Response, next: Function) {
    const { companyID } = req.body;

    if (!companyID) {
      return res.status(422).json({
        Message: Status.ID_NOT_FOUND,
      });
    }

    let token;
    // armazenando o token retornado da função
    if (!req.headers.authorization) {
      return res.status(401).json({ Message: Status.REQUIRED_TOKEN });
    } else {
      token = await verifyToken(req.headers.authorization.split(" ")[1], res);
    }

    const companyController = new CompanyController();

    const companyExists = await companyController.readCompanyFromID(companyID);

    if (!companyExists) {
      return res.status(422).json({
        Message: Status.INVALID_ID,
      });
    }

    // verifica se o token enviado pertence ao proprio usuário ou a um administrador
    if (
      (token["sub"] == companyExists["userID"] &&
        token["roles"].some((role: string) => role === "Company")) ||
      token["roles"].some((role: string) => role === "ADM")
    ) {
      // avança para o proximo middleware
      next();
    } else {
      // caso o token não seja de um administrador ou do proprio usuário, retorna um json de error
      return res.status(401).json({ Message: Status.INVALID_TOKEN });
    }
  }

  async verifyUpdate(req: Request, res: Response, next: Function) {
    const { id } = req.body;

    if (!id) {
      return res.status(422).json({
        Message: Status.ID_NOT_FOUND,
      });
    }

    let token;
    // armazenando o token retornado da função
    if (!req.headers.authorization) {
      return res.status(401).json({ Message: Status.REQUIRED_TOKEN });
    } else {
      token = await verifyToken(req.headers.authorization.split(" ")[1], res);
    }

    const companyController = new CompanyController();

    const company = await companyController.readFromAddress(id);

    if (!company) {
      return res.status(422).json({
        Message: Status.INVALID_ID,
      });
    }

    // verifica se o token enviado pertence ao proprio usuário ou a um administrador
    if (
      (token["sub"] == company["userID"] &&
        token["roles"].some((role: string) => role === "Company")) ||
      token["roles"].some((role: string) => role === "ADM")
    ) {
      // avança para o proximo middleware
      next();
    } else {
      // caso o token não seja de um administrador ou do proprio usuário, retorna um json de error
      return res.status(401).json({ Message: Status.INVALID_TOKEN });
    }
  }

  async verifyDelete(req: Request, res: Response, next: Function) {
    const { id } = req.params;

    if (!id) {
      return res.status(422).json({
        Message: Status.ID_NOT_FOUND,
      });
    }

    const companyController = new CompanyController();

    const company = await companyController.readFromAddress(id);

    if (!company) {
      return res.status(422).json({
        Message: Status.INVALID_ID,
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
      (token["sub"] == company["userID"] &&
        token["roles"].some((role: string) => role === "Company")) ||
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

export { VerifyTokenCompanyAddress };
