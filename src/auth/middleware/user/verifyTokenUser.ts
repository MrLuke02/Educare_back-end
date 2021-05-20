import { Request, Response } from "express";
import { verifyToken } from "../../token.auth";
import { Erros } from "../../../env/status";

// classe para a verificação dos tokens
class VerifyTokenUser {
  // metodo para verificar o token enviado na rota de deleção de usuários
  async verifyDelete(req: Request, res: Response, next: Function) {
    const id = req.params.id;

    if (!id) {
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
      token["sub"] == req.params.id ||
      token["roles"].some((role: string) => role === "ADM")
    ) {
      // avança para o proximo middleware
      next();
    } else {
      // caso o token não seja de um administrador ou do proprio usuário, retorna um json de error
      return res.status(401).json({ Message: Erros.INVALID_TOKEN });
    }
  }

  // metodo para verificar o token enviado na rota de exibição de todos os usuários
  async verifyShow(req: Request, res: Response, next: Function) {
    let token;
    // armazenando o token retornado da função
    if (!req.headers.authorization) {
      return res.status(401).json({ Message: Erros.REQUIRED_TOKEN });
    } else {
      token = await verifyToken(req.headers.authorization.split(" ")[1], res);
    }

    // verificando se o token é de um administrador
    if (token["roles"].some((role: string) => role === "ADM")) {
      // avança para o proximo middleware
      next();
    } else {
      // caso o token não seja de um administrador, retorna um json de error
      return res.status(401).json({ Message: Erros.INVALID_TOKEN });
    }
  }

  // metodo para verificar o token enviado na rota de atualização de dados dos usuários
  async verifyUpdate(req: Request, res: Response, next: Function) {
    const { id } = req.body;

    if (!id) {
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
      token["sub"] == req.body.id ||
      token["roles"].some((role: string) => role === "ADM")
    ) {
      // avança para o proximo middleware
      next();
    } else {
      // caso o token não seja de um administrador ou do proprio usuário, retorna um json de error
      return res.status(401).json({ Message: Erros.INVALID_TOKEN });
    }
  }

  // função para a verificação dos tokens
  async verifyTokenADM(req: Request, res: Response, next: Function) {
    let token;
    // armazenando o token retornado da função
    if (!req.headers.authorization) {
      return res.status(401).json({ Message: Erros.REQUIRED_TOKEN });
    } else {
      token = await verifyToken(req.headers.authorization.split(" ")[1], res);
    }

    // verificando se o token é de um administrador
    if (token["roles"].some((role: string) => role === "ADM")) {
      // avança para o proximo middleware
      next();
    } else {
      // caso o token não seja de um administrador, retorna um json de error
      return res.status(401).json({ Message: Erros.INVALID_TOKEN });
    }
  }

  // função para a verificação dos tokens
  async verifyTokenAuth(req: Request, res: Response, next: Function) {
    // armazenando o token retornado da função
    if (!req.headers.authorization) {
      return res.status(401).json({ Message: Erros.REQUIRED_TOKEN });
    } else {
      await verifyToken(req.headers.authorization.split(" ")[1], res);
    }

    next();
  }
}

// exportando a classe VerifyTokenUser
export { VerifyTokenUser };
