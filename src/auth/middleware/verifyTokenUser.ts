import { Request, Response } from "express";
import { verifyToken } from "../token.auth";

// classe para a verificação de tokens do usuário
class VerifyTokenUser {
  // metodo para verificar o token enviado na rota de cadastro de usuários
  async verifyCreate(req: Request, res: Response, next: Function) {
    // verificando se foi enviado algum token
    if (req.headers.authorization.split(" ")[1] == "") {
      // caso não tenha sido enviado nenhum token avaça para o proximo middleware
      next();
    } else {
      // armazenando o token retornado da função
      const token = await verifyToken(
        req.headers.authorization.split(" ")[1],
        res
      );

      // verificando se o token é de um administrador
      if (token["isAdm"]) {
        // criando a variavel local isAdm, que permanece válida apenas durante a vida útil da solicitação
        res.locals.isAdm = token["isAdm"];
        // avança para o proximo middleware
        next();
      } else {
        // caso o token não seja de um administrador, retorna um json de error
        return res.status(400).json({ error: "Token inválido!" });
      }
    }
  }

  // metodo para verificar o token enviado na rota de deleção de usuários
  async verifyDelete(req: Request, res: Response, next: Function) {
    // armazenando o token retornado da função
    const token = await verifyToken(
      req.headers.authorization.split(" ")[1],
      res
    );

    // verifica se o token enviado pertence ao proprio usuário ou a um administrador
    if (token["sub"] == req.params.id || token["isAdm"] == true) {
      // avança para o proximo middleware
      next();
    } else {
      // caso o token não seja de um administrador ou do proprio usuário, retorna um json de error
      return res.status(400).json({ error: "Token inválido!" });
    }
  }

  // metodo para verificar o token enviado na rota de exibição de todos os usuários
  async verifyShow(req: Request, res: Response, next: Function) {
    // armazenando o token retornado da função
    const token = await verifyToken(
      req.headers.authorization.split(" ")[1],
      res
    );

    // verificando se o token é de um administrador
    if (token["isAdm"]) {
      // avança para o proximo middleware
      next();
    } else {
      // caso o token não seja de um administrador, retorna um json de error
      return res.status(400).json({ error: "Token inválido!" });
    }
  }

  // metodo para verificar o token enviado na rota de atualização de dados dos usuários
  async verifyUpdate(req: Request, res: Response, next: Function) {
    // armazenando o token retornado da função
    const token = await verifyToken(
      req.headers.authorization.split(" ")[1],
      res
    );

    // verifica se o token enviado pertence ao proprio usuário ou a um administrador
    if (token["sub"] == req.body.id || token["isAdm"] == true) {
      // criando a variavel local isAdm, que permanece válida apenas durante a vida útil da solicitação
      res.locals.isAdm = token["isAdm"];
      // avança para o proximo middleware
      next();
    } else {
      // caso o token não seja de um administrador ou do proprio usuário, retorna um json de error
      return res.status(400).json({ error: "Token inválido!" });
    }
  }
}

// exportando a classe VerifyTokenUser
export { VerifyTokenUser };
