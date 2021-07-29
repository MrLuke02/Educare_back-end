import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";

import { Message } from "../env/message";
import { AppError } from "../errors/AppErrors";
import { OrderStatusRepository } from "../repositories/OrderStatusRepository";

class OrderStatusController {
  async create(req: Request, res: Response) {
    const { key, status } = req.body;

    if (!key || !status) {
      throw new AppError(Message.REQUIRED_FIELD, 422);
    }

    const orderStatusRepository = getCustomRepository(OrderStatusRepository);

    const orderStatusExist = await orderStatusRepository.findOne({ key });

    if (orderStatusExist) {
      // retornando uma resposta de erro em json
      throw new AppError(Message.ORDER_STATUS_ALREADY_EXIST, 409);
    }

    const orderStatus = orderStatusRepository.create({
      key,
      status,
    });

    const orderStatusSaved = await orderStatusRepository.save(orderStatus);

    return res.status(201).json({
      OrderStatus: orderStatusSaved,
    });
  }

  async read(req: Request, res: Response) {
    const { id } = req.params;

    const orderStatusRepository = getCustomRepository(OrderStatusRepository);

    const orderStatus = await orderStatusRepository.findOne({ id });

    if (!orderStatus) {
      throw new AppError(Message.ORDER_STATUS_NOT_FOUND, 406);
    }

    return res.status(200).json({ OrderStatus: orderStatus });
  }

  async update(req: Request, res: Response) {
    // capturando e armazenando o id da role do corpo da requisição
    const { id } = req.body;

    // verificando se o id da role não foi passada
    if (!id) {
      // retornando um json de erro personalizado
      throw new AppError(Message.ID_NOT_FOUND, 422);
    }

    // pegando o repositorio customizado/personalizado
    const orderStatusRepository = getCustomRepository(OrderStatusRepository);

    // pesquisando uma role pelo id
    let orderStatus = await orderStatusRepository.findOne({ id });

    // verificando se a role não existe
    if (!orderStatus) {
      // retornando uma resposta de erro em json
      throw new AppError(Message.ORDER_STATUS_NOT_FOUND, 406);
    }

    // capturando o tipo de role passado no corpo da requisição, caso não seja passado nada, pega o valor que ja está cadastrado na role
    const { key = orderStatus.key, status = orderStatus.status } = req.body;

    if (key !== orderStatus.key) {
      const keyExist = await orderStatusRepository.findOne({ key });

      if (keyExist) {
        // retornando uma resposta de erro em json
        throw new AppError(Message.CATEGORY_ALREADY_EXIST, 409);
      }
    }

    // atualizando a role a partir do id
    await orderStatusRepository.update(id, {
      key,
      status,
    });

    // pesquisando a role pelo id
    orderStatus = await orderStatusRepository.findOne({ key });

    // retornando o DTO da role atualizada
    return res.status(200).json({ OrderStatus: orderStatus });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const orderStatusRepository = getCustomRepository(OrderStatusRepository);

    const orderStatus = await orderStatusRepository.findOne(id);

    if (!orderStatus) {
      throw new AppError(Message.ORDER_STATUS_NOT_FOUND, 406);
    }

    await orderStatusRepository.delete(id);

    return res.status(200).json({ Message: Message.SUCCESS });
  }

  async show(req: Request, res: Response) {
    const orderStatusRepository = getCustomRepository(OrderStatusRepository);

    const orderStatus = await orderStatusRepository.find();

    if (orderStatus.length === 0) {
      throw new AppError(Message.NOT_FOUND, 406);
    }

    return res.status(200).json({ OrderStatus: orderStatus });
  }

  async readFromController(key: string) {
    // pegando o repositorio customizado/personalizado
    const orderStatusRepository = getCustomRepository(OrderStatusRepository);

    const orderStatus = await orderStatusRepository.findOne({ key });

    if (!orderStatus) {
      throw new AppError(Message.ORDER_STATUS_NOT_FOUND, 406);
    }

    return orderStatus;
  }
}

export { OrderStatusController };
