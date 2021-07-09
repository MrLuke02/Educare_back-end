import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { Message } from "../env/message";
import { AppError } from "../errors/AppErrors";
import { OrdersRepository } from "../repositories/OrderRepository";
import { CategoryController } from "./CategoryController";
import { DocumentController } from "./DocumentController";
import { UserController } from "./UserController";

class OrderController {
  async create(req: Request, res: Response) {
    const docs = req.file;
    const { userID, categoryID, copyNumber, price, pageNumber } = req.body;
    const status = "Criado";

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

    return res.status(201).json({ Order: orderSaved });
  }

  async read(req: Request, res: Response) {
    const { id } = req.params;

    const orderRepository = getCustomRepository(OrdersRepository);

    const order = await orderRepository.findOne({ id });

    if (!order) {
      throw new AppError(Message.ORDER_NOT_FOUND, 406);
    }

    return res.status(200).json({ Order: order });
  }

  async update(req: Request, res: Response) {
    const { id } = req.body;

    if (!id) {
      throw new AppError(Message.ID_NOT_FOUND, 422);
    }

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

    return res.status(200).json({ Order: order });
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

    return res.status(200).json({ Orders: orders });
  }
}

export { OrderController };
