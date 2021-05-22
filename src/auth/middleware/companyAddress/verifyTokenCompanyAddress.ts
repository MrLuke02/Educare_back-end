import { Request, Response } from "express";
import { verifyToken } from "../../token.auth";
import { Erros } from "../../../env/status";
import { CompanyController } from "../../../controllers/CompanyController";
import { CompanyAddressController } from "../../../controllers/CompanyAddressController";

// classe para a verificação dos tokens
class VerifyTokenCompanyAddress {
  async verifyCreate(req: Request, res: Response, next: Function) {
    const { companyID } = req.body;

    if (!companyID) {
      return res.status(422).json({
        Message: Erros.ID_NOT_FOUND,
      });
    }

    let token;
    // armazenando o token retornado da função
    if (!req.headers.authorization) {
      return res.status(401).json({ Message: Erros.REQUIRED_TOKEN });
    } else {
      token = await verifyToken(req.headers.authorization.split(" ")[1], res);
    }

    const companyController = new CompanyController();

    const propsCompany = [companyID];

    const company = await companyController.readFromID(req, res, propsCompany);

    if (company !== res) {
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
        return res.status(401).json({ Message: Erros.INVALID_TOKEN });
      }
    }
  }

  async verifyUpdate(req: Request, res: Response, next: Function) {
    const { id, companyID } = req.body;

    if (!id || !companyID) {
      return res.status(422).json({
        Message: Erros.ID_NOT_FOUND,
      });
    }

    let token;
    // armazenando o token retornado da função
    if (!req.headers.authorization) {
      return res.status(401).json({ Message: Erros.REQUIRED_TOKEN });
    } else {
      token = await verifyToken(req.headers.authorization.split(" ")[1], res);
    }

    const companyController = new CompanyController();

    const propsCompany = [companyID];

    const company = await companyController.readFromID(req, res, propsCompany);

    if (company !== res) {
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
        return res.status(401).json({ Message: Erros.INVALID_TOKEN });
      }
    }
  }

  async verifyDelete(req: Request, res: Response, next: Function) {
    const { id } = req.params;

    if (!id) {
      return res.status(422).json({
        Message: Erros.ID_NOT_FOUND,
      });
    }

    const companyAddressController = new CompanyAddressController();

    const propsCompnayAddress = [id];

    const companyAddress = await companyAddressController.read(
      req,
      res,
      propsCompnayAddress
    );

    if (companyAddress !== res) {
      const companyController = new CompanyController();

      const propsCompany = [companyAddress["companyID"]];

      const company = await companyController.readFromID(
        req,
        res,
        propsCompany
      );

      if (company !== res) {
        let token;
        // armazenando o token retornado da função
        if (!req.headers.authorization) {
          return res.status(401).json({ Message: Erros.REQUIRED_TOKEN });
        } else {
          token = await verifyToken(
            req.headers.authorization.split(" ")[1],
            res
          );
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
          return res.status(401).json({ Message: Erros.INVALID_TOKEN });
        }
      }
    }
  }
}

export { VerifyTokenCompanyAddress };
