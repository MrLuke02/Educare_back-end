import { Request, Response } from "express";
import { verifyToken } from "../../token.auth";
import { Status } from "../../../env/status";
import { AddressController } from "../../../controllers/AddressController";
import { PhoneController } from "../../../controllers/PhoneController";

// classe para a verificação dos tokens
class VerifyTokenUser {
  // metodo para verificar o token enviado na rota de atualização de dados dos usuários
  async verifyADMUser(req: Request, res: Response, next: Function) {
    let userID;
    if (!req.body.userID) {
      userID = req.params.userID;
    } else {
      userID = req.body.userID;
    }

    if (!userID) {
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

    // verifica se o token enviado pertence ao proprio usuário ou a um administrador
    if (
      token["sub"] == userID ||
      token["roles"].some((role: string) => role === "ADM")
    ) {
      // avança para o proximo middleware
      next();
    } else {
      // caso o token não seja de um administrador ou do proprio usuário, retorna um json de error
      return res.status(401).json({ Message: Status.INVALID_TOKEN });
    }
  }

  async verifyADMUserByAddressID(req: Request, res: Response, next: Function) {
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

    const addressController = new AddressController();

    const address = await addressController.readFromID(id);

    if (!address) {
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
      token["sub"] == address.userID ||
      token["roles"].some((role: string) => role === "ADM")
    ) {
      // avança para o proximo middleware
      next();
    } else {
      // caso o token não seja de um administrador ou do proprio usuário, retorna um json de error
      return res.status(401).json({ Message: Status.INVALID_TOKEN });
    }
  }

  async verifyADMUserByPhoneID(req: Request, res: Response, next: Function) {
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

    const phoneController = new PhoneController();

    const phone = await phoneController.readFromId(id);

    if (!phone) {
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
      token["sub"] == phone.userID ||
      token["roles"].some((role: string) => role === "ADM")
    ) {
      // avança para o proximo middleware
      next();
    } else {
      // caso o token não seja de um administrador ou do proprio usuário, retorna um json de error
      return res.status(401).json({ Message: Status.INVALID_TOKEN });
    }
  }

  // função para a verificação dos tokens
  async verifyTokenADM(req: Request, res: Response, next: Function) {
    let token;
    // armazenando o token retornado da função
    if (!req.headers.authorization) {
      return res.status(401).json({ Message: Status.REQUIRED_TOKEN });
    } else {
      token = await verifyToken(req.headers.authorization.split(" ")[1], res);
    }

    // verificando se o token é de um administrador
    if (token["roles"].some((role: string) => role === "ADM")) {
      // avança para o proximo middleware
      next();
    } else {
      // caso o token não seja de um administrador, retorna um json de error
      return res.status(401).json({ Message: Status.INVALID_TOKEN });
    }
  }

  // função para a verificação dos tokens
  async verifyTokenAuth(req: Request, res: Response, next: Function) {
    // armazenando o token retornado da função
    if (!req.headers.authorization) {
      return res.status(401).json({ Message: Status.REQUIRED_TOKEN });
    } else {
      await verifyToken(req.headers.authorization.split(" ")[1], res);
    }
    next();
  }
}

// exportando a classe VerifyTokenUser
export { VerifyTokenUser };
