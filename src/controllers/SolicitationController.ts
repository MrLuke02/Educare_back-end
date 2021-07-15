import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";

import { Message } from "../env/message";
import { SolicitationStatus } from "../env/solicitationStatus";
import { AppError } from "../errors/AppErrors";
import { SolicitationsRepository } from "../repositories/SolicitationRepository";
import * as validation from "../util/user/Validations";
import { UserController } from "./UserController";
import { UserRoleController } from "./UserRoleController";
import { StudentController } from "./StudentController";

class SolicitationController {
  // metodo assincrono para o cadastro de phones
  async create(req: Request, res: Response) {
    const { buffer: file, size } = req.file;

    const { userID } = req.body;

    if (!file) {
      throw new AppError(Message.REQUIRED_FIELD, 422);
    } else if (!userID) {
      throw new AppError(Message.USER_ID_NOT_FOUND, 422);
    } else if (size > 10 * 1024 * 1024) {
      throw new AppError(Message.FILE_TOO_LARGE, 422);
    }

    const userController = new UserController();

    const user = userController.readFromController(userID);

    if (!user) {
      throw new AppError(Message.USER_NOT_FOUND, 406);
    }

    const status = SolicitationStatus.SOLICITATION_PENDING;

    const solicitationsRepository = getCustomRepository(
      SolicitationsRepository
    );

    let solicitation = solicitationsRepository.create({
      status,
      file,
      userID,
    });

    solicitation = await solicitationsRepository.save(solicitation);

    return res.status(201).json({ Solicitation: solicitation });
  }

  async read(req: Request, res: Response) {
    const { id } = req.params;

    const solicitationsRepository = getCustomRepository(
      SolicitationsRepository
    );

    const solicitation = await solicitationsRepository.findOne({ id });

    if (!solicitation) {
      throw new AppError(Message.SOLICITATION_NOT_FOUND, 406);
    }

    return res.status(200).json({ Solicitation: solicitation });
  }

  async updateStatus(req: Request, res: Response) {
    const { id, status, admID } = req.body;

    if (!id) {
      throw new AppError(Message.ID_NOT_FOUND, 422);
    } else if (!admID) {
      throw new AppError(Message.ADM_ID_NOT_FOUND, 422);
    } else if (!status) {
      throw new AppError(Message.REQUIRED_FIELD, 422);
    } else if (!validation.verifyStatus(status, SolicitationStatus)) {
      throw new AppError(Message.SOLICITATION_STATUS_NOT_FOUND, 406);
    }

    const solicitationsRepository = getCustomRepository(
      SolicitationsRepository
    );

    let solicitation = await solicitationsRepository.findOne({ id });

    if (!solicitation) {
      throw new AppError(Message.SOLICITATION_NOT_FOUND, 406);
    }

    const userRoleController = new UserRoleController();

    const roles = await userRoleController.readFromUser(admID);

    if (roles.length === 0) {
      throw new AppError(Message.USER_ROLE_NOT_FOUND, 406);
    } else if (!roles.some((role) => role.type === "ADM")) {
      throw new AppError(Message.USER_IS_NOT_ADM, 422);
    }

    if (status === "SOLICITATION_ACCEPTED") {
      const studentController = new StudentController();
      studentController.createFromController(solicitation.userID);
    }

    await solicitationsRepository.update(id, {
      status: SolicitationStatus[status],
      admID,
    });

    solicitation = await solicitationsRepository.findOne({ id });

    return res.status(200).json({ Solicitation: solicitation });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const solicitationsRepository = getCustomRepository(
      SolicitationsRepository
    );

    await solicitationsRepository.delete({ id });

    return res.status(200).json({ Message: Message.SUCCESS });
  }

  async show(req: Request, res: Response) {
    const solicitationsRepository = getCustomRepository(
      SolicitationsRepository
    );

    const solicitations = await solicitationsRepository.find();

    if (solicitations.length === 0) {
      throw new AppError(Message.NOT_FOUND, 406);
    }

    return res.status(200).json({ Solicitations: solicitations });
  }
}

export { SolicitationController };
