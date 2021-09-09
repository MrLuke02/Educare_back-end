import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";

import { Message } from "../env/message";
import { AppError } from "../errors/AppErrors";
import { UserInterestAreaRelationUserRepository } from "../repositories/UserInterestAreaRelationUserRepository";
import { UserController } from "./UserController";
import { UserInterestAreaController } from "./UserInterestAreaController";

class UserInterestAreaRelationUserController {
  // metodo assincrono para a criação de user_roles
  async create(req: Request, res: Response) {
    // capturando e armazenando os valores do corpo da requisição
    const { userID, userInterestAreaIDList } = req.body;

    if (!userID || userInterestAreaIDList.length === 0) {
      throw new AppError(Message.REQUIRED_FIELD, 422);
    }

    const userController = new UserController();

    const user = await userController.readFromController(userID);

    if (!user) {
      throw new AppError(Message.USER_NOT_FOUND, 406);
    }

    const userInterestAreaController = new UserInterestAreaController();

    // pegando o repositorio customizado/personalizado
    const userInterestAreaRelationUserRepository = getCustomRepository(
      UserInterestAreaRelationUserRepository
    );

    let userInterestAreaList = [];

    for (const userInterestAreaID of userInterestAreaIDList) {
      const userInterestArea =
        await userInterestAreaController.readFromController(userInterestAreaID);

      if (!userInterestArea) {
        return res.status(406).json({
          Message: Message.INTEREST_AREA_NOT_FOUND,
          AffectedObject: userInterestAreaID,
        });
      }

      const userInterestAreaRelationUserExist =
        await userInterestAreaRelationUserRepository.findOne({
          userID,
          userInterestAreaID,
        });

      // verificanddo se já existe a userRole
      if (userInterestAreaRelationUserExist) {
        return res.status(409).json({
          Message: Message.INTEREST_AREA_ALREADY_EXIST,
          AffectedObject: userInterestAreaID,
        });
      }

      // criando a userRole
      const userInterestAreaRelationUser =
        userInterestAreaRelationUserRepository.create({
          userID,
          userInterestAreaID,
        });

      // salvando a userRole
      const userInterestAreaRelationUserSaved =
        await userInterestAreaRelationUserRepository.save(
          userInterestAreaRelationUser
        );

      userInterestAreaList.push(userInterestAreaRelationUserSaved);
    }

    // retornando a userRole
    return res.status(201).json({
      UserInterestAreaList: userInterestAreaList,
    });
  }

  // metodo assincrono para a pesquisa de userRoles pelo id
  async read(req: Request, res: Response) {
    // capturando e armazenando o id da role do parametro do URL
    const { id } = req.params;

    // pegando o repositorio customizado/personalizado
    const userInterestAreaRelationUserRepository = getCustomRepository(
      UserInterestAreaRelationUserRepository
    );

    // pesquisando uma userRole pelo id
    const userInterestAreaRelationUser =
      await userInterestAreaRelationUserRepository.findOne(id);

    // verificando se a userRole não existe
    if (!userInterestAreaRelationUser) {
      // retornando uma resposta de erro em json
      throw new AppError(Message.INTEREST_AREA_NOT_FOUND, 406);
    }

    // retornando a userRole pesquisada
    return res
      .status(200)
      .json({ UserInterestAreaRelationUser: userInterestAreaRelationUser });
  }

  // metodo assincrono para a deleção de userRoles
  async delete(req: Request, res: Response) {
    // capturando e armazenando o id da userRole do parametro do URL
    let { id } = req.params;

    // pegando o repositorio customizado/personalizado
    const userInterestAreaRelationUserRepository = getCustomRepository(
      UserInterestAreaRelationUserRepository
    );

    // pesquisando uma userRole pelo id
    const userInterestAreaRelationUser =
      await userInterestAreaRelationUserRepository.findOne({ id });

    // verificando se a userRole não existe
    if (!userInterestAreaRelationUser) {
      // retornando uma resposta de erro em json
      throw new AppError(Message.INTEREST_AREA_NOT_FOUND, 406);
    }

    // deletando a userRole a partir do id
    await userInterestAreaRelationUserRepository.delete({ id });

    // retornando um json de sucesso
    return res.status(200).json({ Message: Message.SUCCESS });
  }

  // metodo assincrono para a listagem de todas as userRoles
  async show(req: Request, res: Response) {
    // pegando o repositorio customizado/personalizado
    const userInterestAreaRelationUserRepository = getCustomRepository(
      UserInterestAreaRelationUserRepository
    );

    // deletando rodas as userRoles do DB
    const userInterestAreaRelationUser =
      await userInterestAreaRelationUserRepository.find();

    // verificando se o DB possui userRoles cadastradas
    if (userInterestAreaRelationUser.length === 0) {
      // retornando uma resposta de erro em json
      throw new AppError(Message.NOT_FOUND, 406);
    }

    // retornando as userRoles encontradas no DB
    return res
      .status(200)
      .json({ UserInterestAreaRelationUser: userInterestAreaRelationUser });
  }

  async readFromUser(userID: string) {
    // pegando o repositorio customizado/personalizado
    const userInterestAreaRelationUserRepository = getCustomRepository(
      UserInterestAreaRelationUserRepository
    );

    // pesquisando userRole e role pelo id do usuário
    const user_userInterestArea =
      await userInterestAreaRelationUserRepository.find({
        // select -> o que quero de retorno
        // where -> condição
        // relations -> para trazer também as informações da tabela que se relaciona
        select: ["id"],
        where: { userID },
        relations: ["userInterestArea"],
      });

    // retornando a userRole pesquisada
    return user_userInterestArea;
  }
}

// exportando a classe
export { UserInterestAreaRelationUserController };
