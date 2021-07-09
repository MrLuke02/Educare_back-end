import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { Message } from "../env/message";
import { OrderStatus, verifyStatus } from "../env/orderStatus";
import { AppError } from "../errors/AppErrors";
import { OrderDTO } from "../models/DTOs/OrderDTO";
import { OrdersRepository } from "../repositories/OrderRepository";
import { CategoryController } from "./CategoryController";
import { DocumentController } from "./DocumentController";
import { UserController } from "./UserController";

class OrderController {
  async create(req: Request, res: Response) {
    const docs = req.file;
    const { userID, categoryID, copyNumber, price, pageNumber } = req.body;
    const status = OrderStatus.ORDER_CREATED;

    if (
      !userID ||
      !categoryID ||
      (!copyNumber && copyNumber !== 0) ||
      (!price && price !== 0) ||
      (!pageNumber && pageNumber !== 0)
    ) {
      throw new AppError(Message.REQUIRED_FIELD, 422);
    }

    const userController = new UserController();
    const documentController = new DocumentController();
    const categoryController = new CategoryController();

    const orderRepository = getCustomRepository(OrdersRepository);

    const user = await userController.readFromController(userID);
    const category = await categoryController.readFromController(categoryID);

    if (!user) {
      throw new AppError(Message.USER_NOT_FOUND, 406);
    } else if (!category) {
      throw new AppError(Message.CATEGORY_NOT_FOUND, 406);
    }

    const document = await documentController.createFromController(
      docs,
      pageNumber,
      category.id
    );

    const order = orderRepository.create({
      copyNumber,
      status,
      price,
      userID,
      categoryID,
      documentID: document.id,
    });

    const orderSaved = await orderRepository.save(order);

    return res
      .status(201)
      .json({ Order: OrderDTO.convertOrderToDTO(orderSaved) });
  }

  async read(req: Request, res: Response) {
    const { id } = req.params;

    const orderRepository = getCustomRepository(OrdersRepository);

    const order = await orderRepository.findOne({ id });

    if (!order) {
      throw new AppError(Message.ORDER_NOT_FOUND, 406);
    }

    return res.status(200).json({ Order: OrderDTO.convertOrderToDTO(order) });
  }

  async update(req: Request, res: Response) {
    const { id } = req.body;

    const orderRepository = getCustomRepository(OrdersRepository);

    let order = await orderRepository.findOne({ id });

    if (!order) {
      throw new AppError(Message.ORDER_NOT_FOUND, 406);
    }

    const {
      categoryID = order.categoryID,
      copyNumber = order.copyNumber,
      price = order.price,
    } = req.body;

    const categoryController = new CategoryController();
    const category = await categoryController.readFromController(categoryID);

    if (!category) {
      throw new AppError(Message.CATEGORY_NOT_FOUND, 406);
    }

    await orderRepository.update(id, {
      categoryID,
      copyNumber,
      price,
    });

    order = await orderRepository.findOne({ id });

    return res.status(200).json({ Order: OrderDTO.convertOrderToDTO(order) });
  }

  async updateStatus(req: Request, res: Response) {
    const { id, status } = req.body;

    if (!id || !status) {
      throw new AppError(Message.REQUIRED_FIELD, 422);
    }

    const orderRepository = getCustomRepository(OrdersRepository);

    let order = await orderRepository.findOne({ id });

    if (!order) {
      throw new AppError(Message.ORDER_NOT_FOUND, 406);
    }

    if (!verifyStatus(status)) {
      throw new AppError(Message.ORDER_STATUS_NOT_FOUND, 406);
    }

    await orderRepository.update(id, { status: OrderStatus[status] });

    order = await orderRepository.findOne({ id });

    return res.status(200).json({ Order: OrderDTO.convertOrderToDTO(order) });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const orderRepository = getCustomRepository(OrdersRepository);

    const order = await orderRepository.findOne({ id });

    if (!order) {
      throw new AppError(Message.ORDER_NOT_FOUND, 406);
    }

    await orderRepository.delete({ id });

    return res.status(200).json({ Message: Message.SUCCESS });
  }

  async show(req: Request, res: Response) {
    const orderRepository = getCustomRepository(OrdersRepository);

    const orders = await orderRepository.find();

    if (!orders) {
      throw new AppError(Message.NOT_FOUND, 406);
    }

    const ordersDTO = orders.map((order) => {
      return OrderDTO.convertOrderToDTO(order);
    });

    return res.status(200).json({ Orders: ordersDTO });
  }

  async readFromOrder(orderID: string) {
    const orderRepository = getCustomRepository(OrdersRepository);

    const order_user = await orderRepository.find({
      // select -> o que quero de retorno
      // where -> condição
      // relations -> para trazer também as informações da tabela que se relaciona
      select: ["id"],
      where: { id: orderID },
      relations: ["user"],
    });

    const user = order_user.map((company) => {
      return company.user;
    });

    return user[0];
  }

  async readOrdersUser(userID: string) {
    const orderRepository = getCustomRepository(OrdersRepository);

    const orders = await orderRepository.find({ userID });

    let ordersDTO = [];

    if (orders.length > 0) {
      ordersDTO = orders.map((order) => {
        return OrderDTO.convertOrderToDTO(order);
      });
    }

    return ordersDTO;
  }
}

export { OrderController };
