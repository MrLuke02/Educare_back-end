import { DefaultToken, NextFunction, Request, Response } from "express";
import { AddressController } from "../../../controllers/AddressController";
import { PhoneController } from "../../../controllers/PhoneController";
import { Status } from "../../../env/status";
import { verifyToken } from "../../token/token.auth";

// classe para a verificação dos tokens
class VerifyTokenUser {
  // metodo para verificar o token enviado na rota de atualização de dados dos usuários
  async verifyADMUser(req: Request, res: Response, next: NextFunction) {
    let userID: string;
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

    let token: DefaultToken;
    // armazenando o token retornado da função
    if (!req.headers.authorization) {
      return res.status(401).json({ Message: Status.REQUIRED_TOKEN });
    } else {
      try {
        token = await verifyToken(req.headers.authorization.split(" ")[1]);

        // verifica se o token enviado pertence ao proprio usuário ou a um administrador
        if (
          token.sub == userID ||
          token.roles.some((role: string) => role === "ADM")
        ) {
          // avança para o proximo middleware
          next();
        } else {
          // caso o token não seja de um administrador ou do proprio usuário, retorna um json de error
          return res.status(401).json({ Message: Status.INVALID_TOKEN });
        }
      } catch (error) {
        res.status(error.Status).json({ Message: error.Message });
      }
    }
  }

  async verifyADMUserByAddressID(
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

    let token: DefaultToken;
    // armazenando o token retornado da função
    if (!req.headers.authorization) {
      return res.status(401).json({ Message: Status.REQUIRED_TOKEN });
    } else {
      try {
        token = await verifyToken(req.headers.authorization.split(" ")[1]);
        // verifica se o token enviado pertence ao proprio usuário ou a um administrador
        if (
          token.sub == address.userID ||
          token.roles.some((role: string) => role === "ADM")
        ) {
          // avança para o proximo middleware
          next();
        } else {
          // caso o token não seja de um administrador ou do proprio usuário, retorna um json de error
          return res.status(401).json({ Message: Status.INVALID_TOKEN });
        }
      } catch (error) {
        res.status(error.Status).json({ Message: error.Message });
      }
    }
  }

  async verifyADMUserByPhoneID(
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

    let token: DefaultToken;
    // armazenando o token retornado da função
    if (!req.headers.authorization) {
      return res.status(401).json({ Message: Status.REQUIRED_TOKEN });
    } else {
      try {
        token = await verifyToken(req.headers.authorization.split(" ")[1]);

        // verifica se o token enviado pertence ao proprio usuário ou a um administrador
        if (
          token.sub == phone.userID ||
          token.roles.some((role: string) => role === "ADM")
        ) {
          // avança para o proximo middleware
          next();
        } else {
          // caso o token não seja de um administrador ou do proprio usuário, retorna um json de error
          return res.status(401).json({ Message: Status.INVALID_TOKEN });
        }
      } catch (error) {
        res.status(error.Status).json({ Message: error.Message });
      }
    }
  }

  // função para a verificação dos tokens
  async verifyTokenADM(req: Request, res: Response, next: NextFunction) {
    let token: DefaultToken;
    // armazenando o token retornado da função
    if (!req.headers.authorization) {
      return res.status(401).json({ Message: Status.REQUIRED_TOKEN });
    } else {
      try {
        token = await verifyToken(req.headers.authorization.split(" ")[1]);

        // verificando se o token é de um administrador
        if (token.roles.some((role: string) => role === "ADM")) {
          // avança para o proximo middleware
          next();
        } else {
          // caso o token não seja de um administrador, retorna um json de error
          return res.status(401).json({ Message: Status.INVALID_TOKEN });
        }
      } catch (error) {
        res.status(error.Status).json({ Message: error.Message });
      }
    }
  }

  // função para a verificação dos tokens
  async verifyTokenAuth(req: Request, res: Response, next: NextFunction) {
    // armazenando o token retornado da função
    if (!req.headers.authorization) {
      return res.status(401).json({ Message: Status.REQUIRED_TOKEN });
    } else {
      try {
        await verifyToken(req.headers.authorization.split(" ")[1]);
      } catch (error) {
        res.status(error.Status).json({ Message: error.Message });
      }
    }
    next();
  }
}

// exportando a classe VerifyTokenUser
export { VerifyTokenUser };
