import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";

import { Message } from "../env/message";
import { OrderStatus } from "../env/orderStaus";
import { AppError } from "../errors/AppErrors";
import { CategoryController } from "./CategoryController";
import { DocumentController } from "./DocumentController";
import { UserDTO } from "../models/DTOs/UserDTO";
import { verifyStatus } from "../util/user/StatusValidation";
import { UserRoleController } from "./UserRoleController";
import { EmployeeController } from "./EmployeeController";
import { EmployeeOrderRepository } from "../repositories/EmployeeOrderRepository";

class EmployeeOrderController {
  async create(req: Request, res: Response) {
    const docs = req.file;
    const { userID, categoryID, copyNumber, price, pageNumber, companyID } =
      req.body;
    let { isDelivery } = req.body;

    isDelivery = isDelivery === "true";

    const isEmpty = ["", NaN, undefined, null];

    if (
      !userID ||
      !categoryID ||
      !companyID ||
      (!copyNumber && copyNumber !== 0) ||
      (!price && price !== 0) ||
      (!pageNumber && pageNumber !== 0) ||
      isEmpty.includes(isDelivery)
    ) {
      throw new AppError(Message.REQUIRED_FIELD, 400);
    }

    const documentController = new DocumentController();
    const categoryController = new CategoryController();
    const employeeController = new EmployeeController();

    const employeeOrderRepository = getCustomRepository(
      EmployeeOrderRepository
    );

    const category = await categoryController.readFromController(categoryID);
    const employee = await employeeController.readFromUserAndCompany(
      userID,
      companyID
    );

    if (!category) {
      throw new AppError(Message.USER_NOT_FOUND, 404);
    } else if (!employee) {
      throw new AppError(Message.UNAUTHORIZED, 403);
    }

    const document = await documentController.createFromController(
      docs,
      pageNumber,
      category.id
    );

    const employeeOrder = employeeOrderRepository.create({
      copyNumber,
      status: OrderStatus.ORDER_UNDER_ANALYSIS,
      price,
      userID,
      isDelivery,
      categoryID,
      documentID: document.id,
      companyID,
    });

    const employeeOrderSaved = await employeeOrderRepository.save(
      employeeOrder
    );

    return res.status(201).json({ EmployeeOrder: employeeOrderSaved });
  }

  async read(req: Request, res: Response) {
    const { id } = req.params;

    const employeeOrderRepository = getCustomRepository(
      EmployeeOrderRepository
    );

    const employeeOrder = await employeeOrderRepository.findOne({ id });

    if (!employeeOrder) {
      throw new AppError(Message.ORDER_NOT_FOUND, 404);
    }

    return res.status(200).json({ EmployeeOrder: employeeOrder });
  }

  async update(req: Request, res: Response) {
    const { id } = req.body;

    const employeeOrderRepository = getCustomRepository(
      EmployeeOrderRepository
    );

    let employeeOrder = await employeeOrderRepository.findOne({ id });

    if (!employeeOrder) {
      throw new AppError(Message.ORDER_NOT_FOUND, 404);
    }

    if (employeeOrder.status !== OrderStatus.ORDER_UNDER_ANALYSIS) {
      throw new AppError(Message.UNAUTHORIZED, 403);
    }

    const {
      categoryID = employeeOrder.categoryID,
      copyNumber = employeeOrder.copyNumber,
      price = employeeOrder.price,
      isDelivery = employeeOrder.isDelivery,
    } = req.body;

    const categoryController = new CategoryController();
    const category = await categoryController.readFromController(categoryID);

    if (!category) {
      throw new AppError(Message.CATEGORY_NOT_FOUND, 404);
    }

    await employeeOrderRepository.update(id, {
      categoryID,
      copyNumber,
      price,
      isDelivery,
    });

    Object.assign(employeeOrder, { categoryID, copyNumber, price, isDelivery });

    return res.status(200).json({ EmployeeOrder: employeeOrder });
  }

  async updateStatus(req: Request, res: Response) {
    const { id, statusKey } = req.body;

    if (!id || !statusKey) {
      throw new AppError(Message.REQUIRED_FIELD, 400);
    }

    const employeeOrderRepository = getCustomRepository(
      EmployeeOrderRepository
    );

    let employeeOrder = await employeeOrderRepository.findOne({ id });

    if (!employeeOrder) {
      throw new AppError(Message.ORDER_NOT_FOUND, 404);
    }

    if (
      employeeOrder.status === OrderStatus.ORDER_FINISHED ||
      employeeOrder.status === OrderStatus.ORDER_CANCELED ||
      employeeOrder.status === OrderStatus.ORDER_IN_DELIVERY
    ) {
      throw new AppError(Message.UNAUTHORIZED, 403);
    }

    if (!verifyStatus(statusKey, OrderStatus)) {
      throw new AppError(Message.ORDER_STATUS_NOT_FOUND, 404);
    }

    const userRoleController = new UserRoleController();

    const roles = await userRoleController.readFromUser(employeeOrder.userID);

    if (!roles.some((role) => role.type === "ADM")) {
      if (
        statusKey !== "ORDER_CANCEELD" ||
        employeeOrder.status !== OrderStatus.ORDER_UNDER_ANALYSIS
      ) {
        throw new AppError(Message.UNAUTHORIZED, 403);
      }
    }

    await employeeOrderRepository.update(id, {
      status: OrderStatus[statusKey],
    });

    Object.assign(employeeOrder, { statusKey });

    return res.status(200).json({ EmployeeOrder: employeeOrder });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const employeeOrderRepository = getCustomRepository(
      EmployeeOrderRepository
    );

    const employeeOrder = await employeeOrderRepository.findOne({ id });

    if (!employeeOrder) {
      throw new AppError(Message.ORDER_NOT_FOUND, 404);
    }

    if (employeeOrder.status !== OrderStatus.ORDER_UNDER_ANALYSIS) {
      throw new AppError(Message.UNAUTHORIZED, 403);
    }

    await employeeOrderRepository.delete({ id });

    return res.status(200).json({ Message: Message.SUCCESS });
  }

  async show(req: Request, res: Response) {
    const employeeOrderRepository = getCustomRepository(
      EmployeeOrderRepository
    );

    const employeeOrder = await employeeOrderRepository.find({
      relations: ["user"],
    });

    if (employeeOrder.length === 0) {
      throw new AppError(Message.NOT_FOUND, 404);
    }

    const ordersDTO = employeeOrder.map((order) => {
      const { userID, user, ...props } = order;

      let orderDTO = {};

      Object.assign(orderDTO, props);

      return {
        ...orderDTO,
        user: UserDTO.convertUserToDTO(user),
      };
    });

    return res.status(200).json({ EmployeeOrders: ordersDTO });
  }

  async readOrdersCompany(req: Request, res: Response) {
    const { companyID } = req.params;

    const employeeOrderRepository = getCustomRepository(
      EmployeeOrderRepository
    );

    const order_user = await employeeOrderRepository.find({
      // select -> o que quero de retorno
      // where -> condição
      // relations -> para trazer também as informações da tabela que se relaciona
      select: ["companyID"],
      where: { companyID: companyID },
      relations: ["user"],
    });

    if (order_user.length === 0) {
      throw new AppError(Message.NOT_FOUND, 404);
    }

    const ordersDTO = order_user.map((order) => {
      const { userID, user, ...props } = order;

      let orderDTO = {};

      Object.assign(orderDTO, props);

      return {
        ...orderDTO,
        user: UserDTO.convertUserToDTO(user),
      };
    });

    return res.status(200).json({ CompanyHistoric: ordersDTO });
  }
}

export { EmployeeOrderController };
