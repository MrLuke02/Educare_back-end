import dayjs from "dayjs";
import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { Message } from "../env/message";
import { AppError } from "../errors/AppErrors";
import { CompanyRelationPlansRepository } from "../repositories/CompanyRelationPlanRepository";
import { CompanyController } from "./CompanyController";
import { PlanController } from "./PlanController";

class CompanyRelationPlanController {
  async create(req: Request, res: Response) {
    const { companyID, planID } = req.body;

    if (!companyID || !planID) {
      throw new AppError(Message.REQUIRED_FIELD, 400);
    }

    const companyRelationPlansRepository = getCustomRepository(
      CompanyRelationPlansRepository
    );

    const plansController = new PlanController();
    const planExist = await plansController.readFromController(planID);

    if (!planExist) {
      throw new AppError(Message.PLAN_NOT_FOUND, 404);
    }

    const companyController = new CompanyController();
    const companyExist = await companyController.readCompanyFromID(companyID);

    if (!companyExist) {
      throw new AppError(Message.COMPANY_NOT_FOUND, 404);
    }

    const companyRelationPlanExist = await companyRelationPlansRepository.find({
      where: { companyID },
      order: { createdAt: "DESC" },
      take: 1,
    });

    if (
      companyRelationPlanExist.length > 0 &&
      !dayjs().isAfter(dayjs.unix(companyRelationPlanExist[0].expiresIn))
    ) {
      throw new AppError(Message.COMPANY_RELATIONS_PLAN_ALREADY_EXIST, 409);
    }

    const companyRelationPlan = companyRelationPlansRepository.create({
      planID,
      companyID,
      expiresIn: dayjs().add(planExist.durationInDays, "day").unix(),
    });

    const planSaved = await companyRelationPlansRepository.save(
      companyRelationPlan
    );

    return res.status(201).json({
      CompanyRelationPlan: planSaved,
    });
  }

  async read(req: Request, res: Response) {
    const { id } = req.params;

    const companyRelationPlansRepository = getCustomRepository(
      CompanyRelationPlansRepository
    );

    const companyRelationPlan = await companyRelationPlansRepository.find({
      where: { id },
      order: { createdAt: "DESC" },
      take: 1,
    });

    if (!companyRelationPlan) {
      throw new AppError(Message.COMPANY_RELATIONS_PLAN_NOT_FOUND, 404);
    }

    return res.status(200).json({ CompanyRelationPlan: companyRelationPlan });
  }

  async readFromController(id: string) {
    const companyRelationPlansRepository = getCustomRepository(
      CompanyRelationPlansRepository
    );

    const companyRelationPlanExits = await companyRelationPlansRepository.find({
      // select -> o que quero de retorno
      // where -> condição
      // relations -> para trazer também as informações da tabela que se relaciona
      select: ["id"],
      where: { id },
      relations: ["company"],
    });

    const company = companyRelationPlanExits.map((company) => {
      return company.company;
    });

    return company[0];
  }

  async readCompanyID(companyID: string) {
    const companyRelationPlansRepository = getCustomRepository(
      CompanyRelationPlansRepository
    );

    const companyRelationPlanExits = await companyRelationPlansRepository.find({
      where: { companyID },
      order: { createdAt: "DESC" },
      take: 1,
    });

    if (companyRelationPlanExits.length === 0) {
      throw new AppError(Message.COMPANY_RELATIONS_PLAN_NOT_FOUND, 404);
    } else if (
      dayjs().isAfter(dayjs.unix(companyRelationPlanExits[0].expiresIn))
    ) {
      throw new AppError(Message.UNAUTHORIZED, 403);
    }

    return companyRelationPlanExits[0];
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const companyRelationPlansRepository = getCustomRepository(
      CompanyRelationPlansRepository
    );

    const companyRelationPlanExist =
      await companyRelationPlansRepository.findOne(id);

    if (!companyRelationPlanExist) {
      throw new AppError(Message.COMPANY_RELATIONS_PLAN_NOT_FOUND, 404);
    }

    await companyRelationPlansRepository.delete(id);

    return res.status(200).json({ Message: Message.SUCCESS });
  }

  async show(req: Request, res: Response) {
    const companyRelationPlansRepository = getCustomRepository(
      CompanyRelationPlansRepository
    );

    const companyRelationPlans = await companyRelationPlansRepository.find();

    if (companyRelationPlans.length === 0) {
      throw new AppError(Message.NOT_FOUND, 404);
    }

    return res.status(200).json({ CompanyRelationPlans: companyRelationPlans });
  }
}

export { CompanyRelationPlanController };
