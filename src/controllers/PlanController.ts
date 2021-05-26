import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { Status } from "../env/status";
import { PlansRepository } from "../repositories/PlanRepository";
import { PlanResponseDTO } from "../models/DTO/plan/PlanResponseDTO";

class PlanController {
  async create(req: Request, res: Response) {
    const { name, description, value } = req.body;

    if (!name || !description || !value) {
      return res.status(422).json({
        Message: Status.REQUIRED_FIELD,
      });
    } else if (typeof value === "string") {
      return res.status(422).json({
        Message: Status.INVALID_DATA,
      });
    }

    const plansRepository = getCustomRepository(PlansRepository);

    const plan = plansRepository.create({
      name,
      description,
      value,
    });

    const planSaved = await plansRepository.save(plan);

    return res
      .status(201)
      .json({ plan: PlanResponseDTO.responsePlanDTO(planSaved) });
  }

  async read(req: Request, res: Response) {
    const { id } = req.params;

    const plansRepository = getCustomRepository(PlansRepository);

    const plan = await plansRepository.findOne({ id });

    if (!plan) {
      return res.status(409).json({
        Message: Status.NOT_FOUND,
      });
    }

    return res
      .status(200)
      .json({ plan: PlanResponseDTO.responsePlanDTO(plan) });
  }

  async update(req: Request, res: Response) {
    // capturando e armazenando o id da role do corpo da requisição
    const { id } = req.body;

    // verificando se o id da role não foi passada
    if (!id) {
      // retornando um json de erro personalizado
      return res.status(422).json({
        Message: Status.ID_NOT_FOUND,
      });
    }

    // pegando o repositorio customizado/personalizado
    const plansRepository = getCustomRepository(PlansRepository);

    // pesquisando uma role pelo id
    let plan = await plansRepository.findOne(id);

    // verificando se a role não existe
    if (!plan) {
      // retornando uma resposta de erro em json
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
    }

    // capturando o tipo de role passado no corpo da requisição, caso não seja passado nada, pega o valor que ja está cadastrado na role
    const {
      name = plan.name,
      description = plan.description,
      value = plan.value,
    } = req.body;

    // atualizando a role a partir do id
    await plansRepository.update(id, {
      name,
      description,
      value,
    });

    // pesquisando a role pelo id
    plan = await plansRepository.findOne(id);

    // retornando o DTO da role atualizada
    return res
      .status(200)
      .json({ plan: PlanResponseDTO.responsePlanDTO(plan) });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const plansRepository = getCustomRepository(PlansRepository);

    const plan = await plansRepository.findOne(id);

    if (!plan) {
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
    }

    await plansRepository.delete(id);

    return res.status(200).json({ Message: Status.SUCCESS });
  }

  async show(req: Request, res: Response) {
    const plansRepository = getCustomRepository(PlansRepository);

    const plans = await plansRepository.find();

    if (plans.length === 0) {
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
    }

    const plansDTO = plans.map((plan) => {
      return PlanResponseDTO.responsePlanDTO(plan);
    });

    return res.status(200).json({ plans: plansDTO });
  }
}

export { PlanController };
