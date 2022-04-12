import { Request, Response } from "express";
import { getCustomRepository, IsNull, Not } from "typeorm";
import { Message } from "../env/message";
import { OrderStatus } from "../env/orderStaus";
import { AppError } from "../errors/AppErrors";
import { UserDTO } from "../models/DTOs/UserDTO";
import { EmployeeOrderRepository } from "../repositories/EmployeeOrderRepository";
import { verifyStatus } from "../util/user/StatusValidation";
import { CompanyController } from "./CompanyController";
import { CompanyRelationPlanController } from "./CompanyRelationPlanController";
import { DocumentController } from "./DocumentController";
import { EmployeeController } from "./EmployeeController";
import { UserRoleController } from "./UserRoleController";

class EmployeeOrderController {
  async create(req: Request, res: Response) {
    const docs = req.file;
    const { userID, copyNumber, pageNumber, companyID } = req.body;
    let { isDelivery } = req.body;

    isDelivery = isDelivery === "true";

    const isEmpty = ["", NaN, undefined, null];

    if (
      !userID ||
      !companyID ||
      (!copyNumber && copyNumber !== 0) ||
      (!pageNumber && pageNumber !== 0) ||
      isEmpty.includes(isDelivery)
    ) {
      throw new AppError(Message.REQUIRED_FIELD, 400);
    }

    const documentController = new DocumentController();
    const employeeController = new EmployeeController();
    const companyController = new CompanyController();
    const companyRelationPlanController = new CompanyRelationPlanController();

    const employeeOrderRepository = getCustomRepository(
      EmployeeOrderRepository
    );

    const employee = await employeeController.readFromUserAndCompany(
      userID,
      companyID
    );

    const company = await companyController.readCompanyFromID(companyID);

    if (!employee && company.userID !== userID) {
      throw new AppError(Message.UNAUTHORIZED, 403);
    }

    await companyRelationPlanController.readCompanyID(companyID);

    const document = await documentController.createFromOrderEmployee(
      docs,
      pageNumber
    );

    const employeeOrder = employeeOrderRepository.create({
      copyNumber,
      status: OrderStatus.ORDER_MADE,
      userID,
      isDelivery,
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

    const orderRepository = getCustomRepository(EmployeeOrderRepository);

    const order_document = await orderRepository.find({
      where: { id },
      relations: ["document"],
    });

    if (order_document.length === 0) {
      throw new AppError(Message.ORDER_NOT_FOUND, 404);
    }

    const order_documentDTO = order_document.map((order_document) => {
      const document = {
        id: order_document.document.id,
        name: order_document.document.name,
        file: order_document.document.file,
      };

      return {
        ...order_document,
        document,
      };
    });

    return res.status(200).json({ Order: order_documentDTO[0] });
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

    if (employeeOrder.status !== OrderStatus.ORDER_MADE) {
      throw new AppError(Message.UNAUTHORIZED, 403);
    }

    const {
      copyNumber = employeeOrder.copyNumber,
      isDelivery = employeeOrder.isDelivery,
    } = req.body;

    await employeeOrderRepository.update(id, {
      copyNumber,
      isDelivery,
    });

    Object.assign(employeeOrder, { copyNumber, isDelivery });

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
        employeeOrder.status !== OrderStatus.ORDER_MADE
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

    if (employeeOrder.status !== OrderStatus.ORDER_MADE) {
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

  async showFromController() {
    const employeeOrderRepository = getCustomRepository(
      EmployeeOrderRepository
    );

    const employeeOrder = await employeeOrderRepository.find({
      relations: ["user"],
      where: { status: "Pedido realizado!" || Not(IsNull()) },
    });

    const ordersDTO = employeeOrder.map((order) => {
      const { userID, user, ...props } = order;

      let orderDTO = {};

      Object.assign(orderDTO, props);

      return {
        ...orderDTO,
        user: UserDTO.convertUserToDTO(user),
      };
    });

    return ordersDTO;
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
      where: { companyID },
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

  async readOrdersByUserID(req: Request, res: Response) {
    const { userID, companyID } = req.params;

    const employeeOrderRepository = getCustomRepository(
      EmployeeOrderRepository
    );

    const order_user = await employeeOrderRepository.find({
      // select -> o que quero de retorno
      // where -> condição
      // relations -> para trazer também as informações da tabela que se relaciona
      where: { userID, companyID },
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

    return res.status(200).json({ Orders: ordersDTO });
  }
}

export { EmployeeOrderController };
