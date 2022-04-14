import { Request, Response } from "express";
import { getCustomRepository, IsNull, Not } from "typeorm";
import { Message } from "../env/message";
import { OrderStatus } from "../env/orderStaus";
import { AppError } from "../errors/AppErrors";
import { UserDTO } from "../models/DTOs/UserDTO";
import { OrdersRepository } from "../repositories/OrderRepository";
import { verifyStatus } from "../util/user/StatusValidation";
import { CategoryController } from "./CategoryController";
import { DocumentController } from "./DocumentController";
import { EmployeeOrderController } from "./EmployeeOrderController";
import { UserController } from "./UserController";
import { UserRoleController } from "./UserRoleController";

class OrderController {
  async create(req: Request, res: Response) {
    const docs = req.file;
    const { userID, categoryID, copyNumber, price, pageNumber } = req.body;
    let { isDelivery } = req.body;

    isDelivery = isDelivery === "true";

    const isEmpty = ["", NaN, undefined, null];

    if (
      !userID ||
      !categoryID ||
      (!copyNumber && copyNumber !== 0) ||
      (!price && price !== 0) ||
      (!pageNumber && pageNumber !== 0) ||
      isEmpty.includes(isDelivery)
    ) {
      throw new AppError(Message.REQUIRED_FIELD, 400);
    }

    const userController = new UserController();
    const documentController = new DocumentController();
    const categoryController = new CategoryController();

    const orderRepository = getCustomRepository(OrdersRepository);

    const user = await userController.readFromController(userID);
    const category = await categoryController.readFromController(categoryID);

    if (!user) {
      throw new AppError(Message.USER_NOT_FOUND, 404);
    } else if (!category) {
      throw new AppError(Message.CATEGORY_NOT_FOUND, 404);
    }

    const document = await documentController.createFromController(
      docs,
      pageNumber,
      category.id
    );

    const order = orderRepository.create({
      copyNumber,
      status: OrderStatus.ORDER_MADE,
      price,
      userID,
      isDelivery,
      categoryID,
      documentID: document.id,
    });

    const orderSaved = await orderRepository.save(order);

    return res.status(201).json({ Order: orderSaved });
  }

  async read(req: Request, res: Response) {
    const { id } = req.params;

    const orderRepository = getCustomRepository(OrdersRepository);

    const order_document_category = await orderRepository.find({
      where: { id },
      relations: ["category", "document"],
    });

    if (order_document_category.length === 0) {
      throw new AppError(Message.ORDER_NOT_FOUND, 404);
    }

    const order_document_categoryDTO = order_document_category.map(
      (order_document_category) => {
        const category = {
          id: order_document_category.category.id,
          name: order_document_category.category.name,
          colorful: order_document_category.category.colorful,
          price: order_document_category.category.price,
          description: order_document_category.category.description,
        };
        const document = {
          id: order_document_category.document.id,
          name: order_document_category.document.name,
          file: order_document_category.document.file,
        };

        return {
          ...order_document_category,
          category,
          document,
        };
      }
    );

    return res.status(200).json({ Order: order_document_categoryDTO[0] });
  }

  async update(req: Request, res: Response) {
    const { id } = req.body;

    const orderRepository = getCustomRepository(OrdersRepository);

    let order = await orderRepository.findOne({ id });

    if (!order) {
      throw new AppError(Message.ORDER_NOT_FOUND, 404);
    }

    if (order.status !== OrderStatus.ORDER_MADE) {
      throw new AppError(Message.UNAUTHORIZED, 403);
    }

    const {
      categoryID = order.categoryID,
      copyNumber = order.copyNumber,
      price = order.price,
      isDelivery = order.isDelivery,
    } = req.body;

    const categoryController = new CategoryController();
    const category = await categoryController.readFromController(categoryID);

    if (!category) {
      throw new AppError(Message.CATEGORY_NOT_FOUND, 404);
    }

    await orderRepository.update(id, {
      categoryID,
      copyNumber,
      price,
      isDelivery,
    });

    Object.assign(order, { categoryID, copyNumber, price, isDelivery });

    return res.status(200).json({ Order: order });
  }

  async updateStatus(req: Request, res: Response) {
    const { id, statusKey } = req.body;

    if (!id || !statusKey) {
      throw new AppError(Message.REQUIRED_FIELD, 400);
    }

    const orderRepository = getCustomRepository(OrdersRepository);

    let order = await orderRepository.findOne({ id });

    if (!order) {
      throw new AppError(Message.ORDER_NOT_FOUND, 404);
    }

    if (
      order.status === OrderStatus.ORDER_FINISHED ||
      order.status === OrderStatus.ORDER_CANCELED ||
      order.status === OrderStatus.ORDER_IN_DELIVERY
    ) {
      throw new AppError(Message.UNAUTHORIZED, 403);
    }

    if (!verifyStatus(statusKey, OrderStatus)) {
      throw new AppError(Message.ORDER_STATUS_NOT_FOUND, 404);
    }

    const userRoleController = new UserRoleController();

    const roles = await userRoleController.readFromUser(order.userID);

    if (!roles.some((role) => role.type === "ADM")) {
      if (
        statusKey !== "ORDER_CANCELED" ||
        order.status !== OrderStatus.ORDER_MADE
      ) {
        throw new AppError(Message.UNAUTHORIZED, 403);
      }
    }

    await orderRepository.update(id, { status: OrderStatus[statusKey] });

    Object.assign(order, { statusKey });

    return res.status(200).json({ Order: order });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const orderRepository = getCustomRepository(OrdersRepository);

    const order = await orderRepository.findOne({ id });

    if (!order) {
      throw new AppError(Message.ORDER_NOT_FOUND, 404);
    }

    if (order.status !== OrderStatus.ORDER_MADE) {
      throw new AppError(Message.UNAUTHORIZED, 403);
    }

    await orderRepository.delete({ id });

    return res.status(200).json({ Message: Message.SUCCESS });
  }

  async show(req: Request, res: Response) {
    const { name, status, email } = req.query;
    const orderRepository = getCustomRepository(OrdersRepository);

    const orders = await orderRepository.find({
      relations: ["user"],
      where: { status: status || Not(IsNull()) },
    });

    const employeeOrderController = new EmployeeOrderController();

    const employeeOrders = await employeeOrderController.showFromController(
      status as string
    );

    if (orders.length === 0 && employeeOrders.length === 0) {
      throw new AppError(Message.NOT_FOUND, 404);
    }

    const ordersDTO = orders.map((order) => {
      const { userID, user, ...props } = order;

      let orderDTO = {};

      Object.assign(orderDTO, props);

      return {
        ...orderDTO,
        user: UserDTO.convertUserToDTO(user),
      };
    });

    let ordersAllDTO = [...ordersDTO, ...employeeOrders];

    if (name) {
      ordersAllDTO = ordersAllDTO.filter((order) =>
        order.user.name.includes(name as string)
      );

      if (ordersAllDTO.length === 0) {
        throw new AppError(Message.NOT_FOUND, 404);
      }
    } else if (email) {
      ordersAllDTO = ordersAllDTO.filter((order) =>
        order.user.email.includes(email as string)
      );

      if (ordersAllDTO.length === 0) {
        throw new AppError(Message.NOT_FOUND, 404);
      }
    }

    return res.status(200).json({ Orders: ordersAllDTO });
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

    const user = order_user.map((order) => {
      return UserDTO.convertUserToDTO(order.user);
    });

    return user[0];
  }

  async readOrdersUser(userID: string) {
    const orderRepository = getCustomRepository(OrdersRepository);

    const order_user = await orderRepository.find({
      // select -> o que quero de retorno
      // where -> condição
      // relations -> para trazer também as informações da tabela que se relaciona
      where: { userID },
      relations: ["user"],
    });

    const order_userDTO = order_user.map((order) => {
      const { userID, user, ...props } = order;

      let orderDTO = {};

      Object.assign(orderDTO, props);

      return {
        ...orderDTO,
        user: UserDTO.convertUserToDTO(user),
      };
    });

    return order_userDTO;
  }
}

export { OrderController };
