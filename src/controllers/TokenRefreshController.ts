import dayjs from "dayjs";
import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { createToken, verifyToken } from "../auth/token/token.auth";

import { Message } from "../env/message";
import { AppError } from "../errors/AppErrors";

import { TokenRefreshRepository } from "../repositories/TokenRefreshRepository";
import { UserController } from "./UserController";
import { UserRoleController } from "./UserRoleController";

class TokenRefreshController {
  async create(req: Request, res: Response) {
    const { id, userID } = req.body;

    if (!id) {
      throw new AppError(Message.ID_NOT_FOUND, 422);
    }
    const tokenRefreshRepository = getCustomRepository(TokenRefreshRepository);

    const tokenRefresh = await tokenRefreshRepository.findOne({ id, userID });

    if (!tokenRefresh) {
      throw new AppError(Message.TOKEN_REFRESH_NOT_FOUND, 406);
    }

    const refreshTokenExpired = dayjs().isAfter(
      dayjs.unix(tokenRefresh.expiresIn)
    );

    if (refreshTokenExpired) {
      const userController = new UserController();

      const user = await userController.readFromController(userID);

      const userRoleController = new UserRoleController();

      const roles = await userRoleController.readFromUser(userID);

      const typeRoles = roles.map((role) => {
        return role.type;
      });

      const payload = {
        iss: "Educare_api",
        nameUser: user.name,
        sub: userID,
        roles: typeRoles,
      };

      const token = await createToken(payload, "1h");

      const tokenDecrypted = await verifyToken(token);

      const expiresIn = tokenDecrypted.exp;

      const refreshToken = tokenRefreshRepository.create({
        userID: userID,
        expiresIn,
      });

      await tokenRefreshRepository.delete({ userID });

      const tokenSaved = await tokenRefreshRepository.save(refreshToken);

      return res.status(201).json({
        Token: token,
        TokenRefreshID: tokenSaved.id,
      });
    }

    return res.status(204).json();
  }

  async validation(req: Request, res: Response) {
    const { token } = req.body;

    const newToken = await verifyToken(token);

    const userController = new UserController();

    const user = userController.readFromController(newToken.sub);

    return res.status(200).json({ User: user });
  }

  async createFromController(userID: string, expiresIn: number) {
    const tokenRefreshRepository = getCustomRepository(TokenRefreshRepository);

    let tokenRefresh = tokenRefreshRepository.create({
      userID,
      expiresIn,
    });

    tokenRefresh = await tokenRefreshRepository.save(tokenRefresh);

    return tokenRefresh;
  }

  async deleteFromController(userID: string) {
    const tokenRefreshRepository = getCustomRepository(TokenRefreshRepository);

    await tokenRefreshRepository.delete({ userID });
  }
}

export { TokenRefreshController };
