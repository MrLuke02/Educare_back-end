import { Request, Response } from "express";
import { verifyToken } from "../../token.auth";
import { Erros } from "../../../env/status";
import { CompanyController } from "../../../controllers/CompanyController";

// classe para a verificação dos tokens
class VerifyTokenCompany {
  // metodo para verificar o token enviado na rota de atualização de dados dos usuários
  async verifyCreate(req: Request, res: Response, next: Function) {
    const { userID } = req.body;

    if (!userID) {
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

    // verifica se o token enviado pertence ao proprio usuário ou a um administrador
    if (
      // token["sub"] == req.body.userID ||
      token["roles"].some((role: string) => role === "ADM")
    ) {
      // avança para o proximo middleware
      next();
    } else {
      // caso o token não seja de um administrador ou do proprio usuário, retorna um json de error
      return res.status(401).json({ Message: Erros.INVALID_TOKEN });
    }
  }

  async verifyUpdate(req: Request, res: Response, next: Function) {
    const { id, userID } = req.body;

    if (!id || !userID) {
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

    // verifica se o token enviado pertence ao proprio usuário ou a um administrador
    if (
      (token["sub"] == req.body.userID &&
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

  async verifyDelete(req: Request, res: Response, next: Function) {
    const { id } = req.params;

    if (!id) {
      return res.status(422).json({
        Message: Erros.ID_NOT_FOUND,
      });
    }

    const companyController = new CompanyController();

    const propsCompany = [id];

    const company = await companyController.readFromID(req, res, propsCompany);

    if (company !== res) {
      let token;
      // armazenando o token retornado da função
      if (!req.headers.authorization) {
        return res.status(401).json({ Message: Erros.REQUIRED_TOKEN });
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
        return res.status(401).json({ Message: Erros.INVALID_TOKEN });
      }
    }
  }
}

export { VerifyTokenCompany };
