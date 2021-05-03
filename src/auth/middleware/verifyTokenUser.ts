import { Request, Response } from "express";
import JWT from "jsonwebtoken";

// classe para a verificação de tokens do usuário
class VerifyTokenUser {
  // metodo para verificar o token enviado na rota de cadastro de usuários
  verifyCreate(req: Request, res: Response, next: Function) {
    // verificando se foi enviado algum token
    if (req.headers.authorization.split(" ")[1] == "") {
      // caso não tenha sido enviado nenhum token avaça para o proximo middleware
      next();
    } else {
      try {
        // caso tenha sido enviado um token, verifica se o token é válido
        const token = JWT.verify(
          req.headers.authorization.split(" ")[1],
          process.env.SECRET_KEY
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
      } catch (error) {
        // caso o token sejá inválido, retorna um json de error
        return res.status(400).json({ error: "Sessão expirada!" });
      }
    }
  }

  // metodo para verificar o token enviado na rota de deleção de usuários
  verifyDelete(req: Request, res: Response, next: Function) {
    try {
      // verifica se o token enviado é válido
      const token = JWT.verify(
        req.headers.authorization.split(" ")[1],
        process.env.SECRET_KEY
      );

      // verifica se o token enviado pertence ao proprio usuário ou a um administrador
      if (token["sub"] == req.params.id || token["isAdm"] == true) {
        // avança para o proximo middleware
        next();
      } else {
        // caso o token não seja de um administrador ou do proprio usuário, retorna um json de error
        return res.status(400).json({ error: "Token inválido!" });
      }
    } catch (error) {
      // caso o token sejá inválido, retorna um json de error
      return res.status(400).json({ error: "Sessão expirada!" });
    }
  }

  // metodo para verificar o token enviado na rota de exibição de todos os usuários
  verifyShow(req: Request, res: Response, next: Function) {
    try {
      // verifica se o token enviado é válido
      const token = JWT.verify(
        req.headers.authorization.split(" ")[1],
        process.env.SECRET_KEY
      );

      // verificando se o token é de um administrador
      if (token["isAdm"]) {
        // avança para o proximo middleware
        next();
      } else {
        // caso o token não seja de um administrador, retorna um json de error
        return res.status(400).json({ error: "Token inválido!" });
      }
    } catch (error) {
      // caso o token sejá inválido, retorna um json de error
      return res.status(400).json({ error: "Sessão expirada!" });
    }
  }

  // metodo para verificar o token enviado na rota de atualização de dados dos usuários
  verifyUpdate(req: Request, res: Response, next: Function) {
    try {
      // verifica se o token enviado é válido
      const token = JWT.verify(
        req.headers.authorization.split(" ")[1],
        process.env.SECRET_KEY
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
    } catch (error) {
      // caso o token sejá inválido, retorna um json de error
      return res.status(400).json({ error: "Sessão expirada!" });
    }
  }
}

// exportando a classe VerifyTokenUser
export { VerifyTokenUser };
