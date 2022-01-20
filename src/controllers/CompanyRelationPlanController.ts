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

    if (companyID || planID) {
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

    const companyRelationPlanExist =
      await companyRelationPlansRepository.findOne({
        planID,
        companyID,
      });

    if (!dayjs().isAfter(dayjs.unix(companyRelationPlanExist?.expiresIn))) {
      throw new AppError(Message.COMPANY_RELATIONS_PLAN_ALREADY_EXIST, 409);
    }

    const companyRelationPlan = companyRelationPlansRepository.create({
      planID,
      companyID,
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

  async update(req: Request, res: Response) {
    // capturando e armazenando o id da role do corpo da requisição
    const { id } = req.body;

    // verificando se o id da role não foi passada
    if (!id) {
      // retornando um json de erro personalizado
      throw new AppError(Message.ID_NOT_FOUND, 400);
    }

    // pegando o repositorio customizado/personalizado
    const companyRelationPlansRepository = getCustomRepository(
      CompanyRelationPlansRepository
    );

    // pesquisando uma role pelo id
    let companyRelationPlanExits = await companyRelationPlansRepository.findOne(
      id
    );

    // verificando se a role não existe
    if (!companyRelationPlanExits) {
      // retornando uma resposta de erro em json
      throw new AppError(Message.COMPANY_RELATIONS_PLAN_NOT_FOUND, 404);
    }

    // capturando o tipo de role passado no corpo da requisição, caso não seja passado nada, pega o valor que ja está cadastrado na role
    const { usedLimit = companyRelationPlanExits.usedLimit } = req.body;

    // atualizando a role a partir do id
    await companyRelationPlansRepository.update(id, {
      usedLimit,
    });

    Object.assign(companyRelationPlanExits, {
      usedLimit,
    });

    // retornando o DTO da role atualizada
    return res
      .status(200)
      .json({ CompanyRelationPlan: companyRelationPlanExits });
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
