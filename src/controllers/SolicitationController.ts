import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { Message } from "../env/message";
import { SolicitationStatus } from "../env/solicitationStatus";
import { AppError } from "../errors/AppErrors";
import { SolicitationsRepository } from "../repositories/SolicitationRepository";
import { verifyExpiredStudent } from "../services/verifyExpiredStudent";
import * as validation from "../util/user/Validations";
import { RoleController } from "./RoleController";
import { StudentController } from "./StudentController";
import { StudentInterestAreaController } from "./StudentInterestAreaController";
import { UserController } from "./UserController";
import { UserRoleController } from "./UserRoleController";

class SolicitationController {
  // metodo assincrono para o cadastro de phones
  async create(req: Request, res: Response) {
    const { buffer: file, size } = req.file;

    const { userID, course, institution, studentInterestAreaID } = req.body;

    if (!file) {
      throw new AppError(Message.REQUIRED_FIELD, 400);
    } else if (!userID || !course || !institution || !studentInterestAreaID) {
      throw new AppError(Message.REQUIRED_FIELD, 400);
    } else if (size > 10 * 1024 * 1024) {
      throw new AppError(Message.FILE_TOO_LARGE, 400);
    }

    const userController = new UserController();

    const user = await userController.readFromController(userID);

    if (!user) {
      throw new AppError(Message.USER_NOT_FOUND, 404);
    }

    const studentInterestAreaController = new StudentInterestAreaController();

    await studentInterestAreaController.readFromStudentInterestAreaID(
      studentInterestAreaID
    );

    const status = SolicitationStatus.SOLICITATION_PENDING;

    const solicitationsRepository = getCustomRepository(
      SolicitationsRepository
    );

    const solicitationAlreadyExist = await solicitationsRepository.find({
      where: { userID },
      order: { createdAt: "DESC" },
      take: 1,
    });

    let solicitation = solicitationsRepository.create({
      status,
      file,
      userID,
      course,
      institution,
      studentInterestAreaID,
    });

    if (solicitationAlreadyExist.length > 0) {
      if (
        solicitationAlreadyExist[0].status ===
        SolicitationStatus.SOLICITATION_PENDING
      ) {
        throw new AppError(Message.USER_HAVE_SOLICITATION_PENDING, 409);
      } else if (
        solicitationAlreadyExist[0].status ===
        SolicitationStatus.SOLICITATION_ACCEPTED
      ) {
        const studentController = new StudentController();

        if (!(await studentController.readFromUserID(userID))) {
          throw new AppError(Message.USER_ALREADY_IS_STUDENT, 409);
        }

        solicitation = await solicitationsRepository.save(solicitation);
      } else if (
        solicitationAlreadyExist[0].status ===
        SolicitationStatus.SOLICITATION_DENIED
      ) {
        solicitation = await solicitationsRepository.save(solicitation);
      }
    } else {
      solicitation = await solicitationsRepository.save(solicitation);
    }

    return res.status(201).json({ Solicitation: solicitation });
  }

  async read(req: Request, res: Response) {
    const { id } = req.params;

    const solicitationsRepository = getCustomRepository(
      SolicitationsRepository
    );

    const solicitation = await solicitationsRepository.findOne({ id });

    if (!solicitation) {
      throw new AppError(Message.SOLICITATION_NOT_FOUND, 404);
    }

    return res.status(200).json({ Solicitation: solicitation });
  }

  async updateStatus(req: Request, res: Response) {
    const { id, status, admID } = req.body;

    if (!id) {
      throw new AppError(Message.ID_NOT_FOUND, 400);
    } else if (!admID) {
      throw new AppError(Message.ADM_ID_NOT_FOUND, 400);
    } else if (!status) {
      throw new AppError(Message.REQUIRED_FIELD, 400);
    } else if (!validation.verifyStatus(status, SolicitationStatus)) {
      throw new AppError(Message.SOLICITATION_STATUS_NOT_FOUND, 404);
    }

    const solicitationsRepository = getCustomRepository(
      SolicitationsRepository
    );

    let solicitation = await solicitationsRepository.findOne({ id });

    if (!solicitation) {
      throw new AppError(Message.SOLICITATION_NOT_FOUND, 404);
    } else if (
      solicitation.status !== SolicitationStatus.SOLICITATION_PENDING
    ) {
      throw new AppError(Message.UNAUTHORIZED, 403);
    }

    const userRoleController = new UserRoleController();

    const roles = await userRoleController.readFromUser(admID);

    if (roles.length === 0) {
      throw new AppError(Message.USER_ROLE_NOT_FOUND, 404);
    }

    if (status === "SOLICITATION_ACCEPTED") {
      const studentController = new StudentController();

      // tipo padrão de usuário
      const type = "Student";

      const roleController = new RoleController();

      const role = await roleController.readFromType(type);

      if (!role) {
        throw new AppError(Message.ROLE_NOT_FOUND, 404);
      }

      await verifyExpiredStudent(solicitation.userID);

      const student = await studentController.createFromController(
        solicitation.userID,
        solicitation.course,
        solicitation.institution,
        solicitation.studentInterestAreaID
      );

      // instanciando o UserRoleController
      const userRoleController = new UserRoleController();

      // criando e salvando a userRole
      await userRoleController.createFromController(student.userID, role.id);
    }

    await solicitationsRepository.update(id, {
      status: SolicitationStatus[status],
      admID,
    });

    Object.assign(solicitation, {
      status: SolicitationStatus[status],
      admID,
    });

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
      throw new AppError(Message.NOT_FOUND, 404);
    }

    return res.status(200).json({ Solicitations: solicitations });
  }

  async readFromUserID(userID: string) {
    const solicitationRepository = getCustomRepository(SolicitationsRepository);

    const solicitations = await solicitationRepository.find({ userID });

    return solicitations;
  }

  async readFromSolicitation(solicitationID: string) {
    const solicitationRepository = getCustomRepository(SolicitationsRepository);

    const solicitation_user = await solicitationRepository.find({
      // select -> o que quero de retorno
      // where -> condição
      // relations -> para trazer também as informações da tabela que se relaciona
      select: ["id"],
      where: { id: solicitationID },
      relations: ["user"],
    });

    const user = solicitation_user.map((solicitation) => {
      return solicitation.user;
    });

    return user[0];
  }
}

export { SolicitationController };
