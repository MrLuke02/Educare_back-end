import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { Status } from "../env/status";
import { Document } from "../models/Document";
import { CategoriesRepository } from "../repositories/CategoryRepository";
import { OrdersRepository } from "../repositories/OrderRepository";
import { validationNumber } from "../util/user/NumberValidation";
import { CategoryController } from "./CategoryController";
import { DocumentController } from "./DocumentController";
import { UserController } from "./UserController";

class OrderController {
  async create(req: Request, res: Response) {
    const docs = req.file;
    const { userID, categoryID, copyNumber, price, pageNumber } = req.body;
    const status = "Criado";

    const copyNumberConverted = validationNumber(copyNumber);
    const pageNumberConverted = validationNumber(pageNumber);
    const priceConverted = validationNumber(price);

    if (
      (!priceConverted && priceConverted !== 0) ||
      (!pageNumberConverted && pageNumberConverted !== 0) ||
      (!copyNumberConverted && copyNumberConverted !== 0)
    ) {
      return res.status(422).json({ Message: Status.INVALID_DATA });
    } else if (!userID || !categoryID || !copyNumber || !price || !pageNumber) {
      return res.status(422).json({ Message: Status.REQUIRED_FIELD });
    }

    const userController = new UserController();
    const documentController = new DocumentController();
    const categoryController = new CategoryController();

    const orderRepository = getCustomRepository(OrdersRepository);

    const user = await userController.readFromController(userID);
    const category = await categoryController.readFromController(categoryID);

    if (!user || !category) {
      return res.status(406).json({ Message: Status.NOT_FOUND });
    }

    let document: Document;
    try {
      document = await documentController.createFromController(
        docs,
        pageNumberConverted,
        category.id
      );
    } catch (error) {
      return res.status(422).json({ Message: error.message });
    }

    const order = orderRepository.create({
      copyNumber: copyNumberConverted,
      status,
      price: priceConverted,
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
      return res.status(406).json({ Message: Status.NOT_FOUND });
    }

    return res.status(200).json({ Order: order });
  }

  async update(req: Request, res: Response) {
    const { id } = req.body;

    const orderRepository = getCustomRepository(OrdersRepository);

    let order = await orderRepository.findOne({ id });

    if (!order) {
      return res.status(406).json({ Message: Status.NOT_FOUND });
    }

    const {
      categoryID = order.categoryID,
      copyNumber = order.copyNumber,
      price = order.price,
    } = req.body;

    const copyNumberConverted = validationNumber(copyNumber);
    const priceConverted = validationNumber(price);

    if (
      (!priceConverted && priceConverted !== 0) ||
      (!copyNumberConverted && copyNumberConverted !== 0)
    ) {
      return res.status(422).json({ Message: Status.INVALID_DATA });
    }

    const categoryController = new CategoryController();
    const category = await categoryController.readFromController(categoryID);

    if (!category) {
      return res.status(406).json({ Message: Status.NOT_FOUND });
    }

    await orderRepository.update(id, {
      categoryID,
      copyNumber: copyNumberConverted,
      price: priceConverted,
    });

    order = await orderRepository.findOne({ id });

    return res.status(200).json({ Order: order });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const orderRepository = getCustomRepository(OrdersRepository);

    const order = await orderRepository.findOne({ id });

    if (!order) {
      return res.status(406).json({ Message: Status.NOT_FOUND });
    }

    await orderRepository.delete({ id });

    return res.status(200).json({ Message: Status.SUCCESS });
  }

  async show(req: Request, res: Response) {
    const orderRepository = getCustomRepository(OrdersRepository);

    const orders = await orderRepository.find();

    if (!orders) {
      return res.status(406).json({ Message: Status.NOT_FOUND });
    }

    return res.status(200).json({ Orders: orders });
  }
}

export { OrderController };
