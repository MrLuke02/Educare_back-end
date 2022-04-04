import { NextFunction, Request, Response } from "express";
import { CompanyAddressController } from "../../../controllers/CompanyAddressController";
import { CompanyContactController } from "../../../controllers/CompanyContactController";
import { CompanyController } from "../../../controllers/CompanyController";
import { CompanyRelationPlanController } from "../../../controllers/CompanyRelationPlanController";
import { Message } from "../../../env/message";
import { AppError } from "../../../errors/AppErrors";
import { verifyToken } from "../../token/token.auth";

// classe para a verificação dos tokens
class VerifyTokenCompany {
  // metodo para verificar o token enviado na rota de atualização de dados dos usuários
  async verifyADMCompany(req: Request, res: Response, next: NextFunction) {
    let companyID: string;

    if (req.body.companyID) {
      companyID = req.body.companyID;
    } else {
      companyID = req.params.companyID;
    }

    if (!companyID) {
      throw new AppError(Message.ID_NOT_FOUND, 400);
    }

    const companyController = new CompanyController();

    const company = await companyController.readCompanyFromID(companyID);

    if (!company) {
      throw new AppError(Message.COMPANY_NOT_FOUND, 404);
    }

    // armazenando o token retornado da função
    if (!req.headers.authorization) {
      throw new AppError(Message.REQUIRED_TOKEN, 401);
    } else {
      const token = await verifyToken(req.headers.authorization.split(" ")[1]);

      // verifica se o token enviado pertence ao proprio usuário ou a um administrador
      if (token.sub === company.userID || token.roles.includes("ADM")) {
        // avança para o proximo middleware
        next();
      } else {
        // caso o token não seja de um administrador ou do proprio usuário, retorna um json de error
        throw new AppError(Message.INVALID_TOKEN, 403);
      }
    }
  }

  async verifyADMCompanyByCompanyRelationPlanID(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const id = req.params.id;

    if (!id) {
      throw new AppError(Message.ID_NOT_FOUND, 400);
    }

    const companyRelationPlanController = new CompanyRelationPlanController();

    const company = await companyRelationPlanController.readFromController(id);

    if (!company) {
      throw new AppError(Message.COMPANY_NOT_FOUND, 404);
    }

    // armazenando o token retornado da função
    if (!req.headers.authorization) {
      throw new AppError(Message.REQUIRED_TOKEN, 401);
    } else {
      const token = await verifyToken(req.headers.authorization.split(" ")[1]);

      // verifica se o token enviado pertence ao proprio usuário ou a um administrador
      if (token.sub === company.userID || token.roles.includes("ADM")) {
        // avança para o proximo middleware
        next();
      } else {
        throw new AppError(Message.INVALID_TOKEN, 403);
        // caso o token não seja de um administrador ou do proprio usuário, retorna um json de error
      }
    }
  }

  async verifyADMCompanyByAddressID(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let id: string;
    if (!req.body.id) {
      id = req.params.id;
    } else {
      id = req.body.id;
    }

    if (!id) {
      throw new AppError(Message.ID_NOT_FOUND, 400);
    }

    const companyAddressController = new CompanyAddressController();

    const company = await companyAddressController.readFromAddress(id);

    if (!company) {
      throw new AppError(Message.COMPANY_NOT_FOUND, 404);
    }

    // armazenando o token retornado da função
    if (!req.headers.authorization) {
      throw new AppError(Message.REQUIRED_TOKEN, 401);
    } else {
      const token = await verifyToken(req.headers.authorization.split(" ")[1]);

      // verifica se o token enviado pertence ao proprio usuário ou a um administrador
      if (token.sub === company.userID || token.roles.includes("ADM")) {
        // avança para o proximo middleware
        next();
      } else {
        throw new AppError(Message.INVALID_TOKEN, 403);
        // caso o token não seja de um administrador ou do proprio usuário, retorna um json de error
      }
    }
  }

  async verifyADMCompanyByContactID(
    req: Request,
    res: Response,
    next: Function
  ) {
    let id: string;
    if (!req.body.id) {
      id = req.params.id;
    } else {
      id = req.body.id;
    }

    if (!id) {
      throw new AppError(Message.ID_NOT_FOUND, 400);
    }

    const companyContactController = new CompanyContactController();

    const company = await companyContactController.readFromContact(id);

    if (!company) {
      throw new AppError(Message.COMPANY_NOT_FOUND, 404);
    }

    // armazenando o token retornado da função
    if (!req.headers.authorization) {
      throw new AppError(Message.REQUIRED_TOKEN, 401);
    } else {
      const token = await verifyToken(req.headers.authorization.split(" ")[1]);

      // verifica se o token enviado pertence ao proprio usuário ou a um administrador
      if (token.sub === company.userID || token.roles.includes("ADM")) {
        // avança para o proximo middleware
        next();
      } else {
        // caso o token não seja de um administrador ou do proprio usuário, retorna um json de error
        throw new AppError(Message.INVALID_TOKEN, 403);
      }
    }
  }
}

export { VerifyTokenCompany };
