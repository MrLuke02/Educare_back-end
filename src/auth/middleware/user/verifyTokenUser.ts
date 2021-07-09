import { NextFunction, Request, Response } from "express";
import { AddressController } from "../../../controllers/AddressController";
import { OrderController } from "../../../controllers/OrderController";
import { PhoneController } from "../../../controllers/PhoneController";
import { Message } from "../../../env/message";
import { AppError } from "../../../errors/AppErrors";
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
      throw new AppError(Message.ID_NOT_FOUND, 422);
    }

    // armazenando o token retornado da função
    if (!req.headers.authorization) {
      throw new AppError(Message.REQUIRED_TOKEN, 401);
    } else {
      const token = await verifyToken(req.headers.authorization.split(" ")[1]);

      // verifica se o token enviado pertence ao proprio usuário ou a um administrador
      if (token.sub === userID || token.roles.includes("ADM")) {
        // avança para o proximo middleware
        next();
      } else {
        // caso o token não seja de um administrador ou do proprio usuário, retorna um json de error
        throw new AppError(Message.INVALID_TOKEN, 401);
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
      throw new AppError(Message.ID_NOT_FOUND, 422);
    }

    const addressController = new AddressController();

    const address = await addressController.readFromID(id);

    if (!address) {
      throw new AppError(Message.ADDRESS_NOT_FOUND, 406);
    }

    // armazenando o token retornado da função
    if (!req.headers.authorization) {
      throw new AppError(Message.REQUIRED_TOKEN, 401);
    } else {
      const token = await verifyToken(req.headers.authorization.split(" ")[1]);
      // verifica se o token enviado pertence ao proprio usuário ou a um administrador
      if (token.sub === address.userID || token.roles.includes("ADM")) {
        // avança para o proximo middleware
        next();
      } else {
        // caso o token não seja de um administrador ou do proprio usuário, retorna um json de error
        throw new AppError(Message.INVALID_TOKEN, 401);
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
      throw new AppError(Message.ID_NOT_FOUND, 422);
    }

    const phoneController = new PhoneController();

    const phone = await phoneController.readFromId(id);

    if (!phone) {
      throw new AppError(Message.PHONE_NOT_FOUND, 406);
    }

    // armazenando o token retornado da função
    if (!req.headers.authorization) {
      throw new AppError(Message.REQUIRED_TOKEN, 401);
    } else {
      const token = await verifyToken(req.headers.authorization.split(" ")[1]);

      // verifica se o token enviado pertence ao proprio usuário ou a um administrador
      if (token.sub === phone.userID || token.roles.includes("ADM")) {
        // avança para o proximo middleware
        next();
      } else {
        // caso o token não seja de um administrador ou do proprio usuário, retorna um json de error
        throw new AppError(Message.INVALID_TOKEN, 401);
      }
    }
  }

  async verifyADMUserByOrderID(
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
      throw new AppError(Message.ID_NOT_FOUND, 422);
    }

    const orderController = new OrderController();

    const user = await orderController.readFromOrder(id);

    if (!user) {
      throw new AppError(Message.USER_NOT_FOUND, 406);
    }

    // armazenando o token retornado da função
    if (!req.headers.authorization) {
      throw new AppError(Message.REQUIRED_TOKEN, 401);
    } else {
      const token = await verifyToken(req.headers.authorization.split(" ")[1]);

      // verifica se o token enviado pertence ao proprio usuário ou a um administrador
      if (token.sub === user.id || token.roles.includes("ADM")) {
        // avança para o proximo middleware
        next();
      } else {
        // caso o token não seja de um administrador ou do proprio usuário, retorna um json de error
      }
    }
  }

  // função para a verificação dos tokens
  async verifyTokenADM(req: Request, res: Response, next: NextFunction) {
    // armazenando o token retornado da função
    if (!req.headers.authorization) {
      throw new AppError(Message.REQUIRED_TOKEN, 401);
    } else {
      const token = await verifyToken(req.headers.authorization.split(" ")[1]);

      // verificando se o token é de um administrador
      if (token.roles.includes("ADM")) {
        // avança para o proximo middleware
        next();
      } else {
        // caso o token não seja de um administrador, retorna um json de error
        throw new AppError(Message.INVALID_TOKEN, 401);
      }
    }
  }

  // função para a verificação dos tokens
  async verifyTokenAuth(req: Request, res: Response, next: NextFunction) {
    // armazenando o token retornado da função
    if (!req.headers.authorization) {
      throw new AppError(Message.REQUIRED_TOKEN, 401);
    } else {
      await verifyToken(req.headers.authorization.split(" ")[1]);
    }
    next();
  }
}

// exportando a classe VerifyTokenUser
export { VerifyTokenUser };
