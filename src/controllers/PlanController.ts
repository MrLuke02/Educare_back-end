import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { Message } from "../env/message";
import { AppError } from "../errors/AppErrors";
import { PlansRepository } from "../repositories/PlanRepository";

class PlanController {
  async create(req: Request, res: Response) {
    const { name, description, price, colorful, limiteCopies, excessValue } =
      req.body;

    const isNullable = [null, undefined];

    if (
      !name ||
      !description ||
      isNullable.includes(colorful) ||
      (!price && price !== 0) ||
      (!limiteCopies && limiteCopies !== 0) ||
      (!excessValue && excessValue !== 0)
    ) {
      throw new AppError(Message.REQUIRED_FIELD, 400);
    }

    const plansRepository = getCustomRepository(PlansRepository);

    const planExist = await plansRepository.findOne({ name });

    if (planExist) {
      // retornando uma resposta de erro em json
      throw new AppError(Message.PLAN_ALREADY_EXIST, 409);
    }

    const plan = plansRepository.create({
      name,
      description,
      price,
      colorful,
      limiteCopies,
      excessValue,
    });

    const planSaved = await plansRepository.save(plan);

    return res.status(201).json({
      Plan: planSaved,
    });
  }

  async read(req: Request, res: Response) {
    const { id } = req.params;

    const plansRepositories = getCustomRepository(PlansRepository);

    const plan = await plansRepositories.findOne({ id });

    if (!plan) {
      throw new AppError(Message.PLAN_NOT_FOUND, 404);
    }

    return res.status(200).json({ Plan: plan });
  }

  async readFromController(id: string) {
    const plansRepositories = getCustomRepository(PlansRepository);

    const plan = await plansRepositories.findOne({ id });

    return plan;
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
    const plansRepository = getCustomRepository(PlansRepository);

    // pesquisando uma role pelo id
    let plan = await plansRepository.findOne(id);

    // verificando se a role não existe
    if (!plan) {
      // retornando uma resposta de erro em json
      throw new AppError(Message.PLAN_NOT_FOUND, 404);
    }

    // capturando o tipo de role passado no corpo da requisição, caso não seja passado nada, pega o valor que ja está cadastrado na role
    const {
      name = plan.name,
      description = plan.description,
      price = plan.price,
      colorful = plan.colorful,
      limiteCopies = plan.limiteCopies,
      excessValue = plan.excessValue,
    } = req.body;

    if (name !== plan.name) {
      const nameExists = await plansRepository.findOne({ name });

      if (nameExists) {
        // retornando uma resposta de erro em json
        throw new AppError(Message.PLAN_ALREADY_EXIST, 409);
      }
    }

    // atualizando a role a partir do id
    await plansRepository.update(id, {
      name,
      description,
      price,
      colorful,
      limiteCopies,
      excessValue,
    });

    Object.assign(plan, {
      name,
      description,
      price,
      colorful,
      limiteCopies,
      excessValue,
    });

    // retornando o DTO da role atualizada
    return res.status(200).json({ Plan: plan });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const plansRepository = getCustomRepository(PlansRepository);

    const plan = await plansRepository.findOne(id);

    if (!plan) {
      throw new AppError(Message.PLAN_NOT_FOUND, 404);
    }

    await plansRepository.delete(id);

    return res.status(200).json({ Message: Message.SUCCESS });
  }

  async show(req: Request, res: Response) {
    const plansRepository = getCustomRepository(PlansRepository);

    const plans = await plansRepository.find();

    if (plans.length === 0) {
      throw new AppError(Message.NOT_FOUND, 404);
    }

    return res.status(200).json({ Plans: plans });
  }
}

export { PlanController };
