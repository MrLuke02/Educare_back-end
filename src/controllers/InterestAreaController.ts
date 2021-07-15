import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";

import { Message } from "../env/message";
import { AppError } from "../errors/AppErrors";
import { DocumentDTO } from "../models/DTOs/DocumentDTO";
import { InterestAreaRepository } from "../repositories/InterestAreaRepository";
import { CategoryController } from "./CategoryController";

class InterestAreaController {
  async create(req: Request, res: Response) {
    let { interestArea } = req.body;

    if (!interestArea) {
      throw new AppError(Message.REQUIRED_FIELD, 422);
    }

    const interestAreaRepository = getCustomRepository(InterestAreaRepository);

    const interestAreaAlreadyExists = await interestAreaRepository.findOne({
      interestArea,
    });

    if (interestAreaAlreadyExists) {
      throw new AppError(Message.INTEREST_AREA_ALREADY_EXIST, 409);
    }

    const interestAreaSaved = interestAreaRepository.create({
      interestArea,
    });

    interestArea = await interestAreaRepository.save(interestAreaSaved);

    return res.status(201).json({ InterestArea: interestArea });
  }

  async read(req: Request, res: Response) {
    const { id } = req.params;

    const interestAreaRepository = getCustomRepository(InterestAreaRepository);

    const interestArea = await interestAreaRepository.findOne({ id });

    if (!interestArea) {
      throw new AppError(Message.INTEREST_AREA_NOT_FOUND, 406);
    }

    return res.status(201).json({ InterestArea: interestArea });
  }

  async readFromController(id: string) {
    const interestAreaRepository = getCustomRepository(InterestAreaRepository);

    const interestArea = await interestAreaRepository.findOne({ id });

    if (!interestArea) {
      throw new AppError(Message.INTEREST_AREA_NOT_FOUND, 406);
    }

    return interestArea;
  }

  async update(req: Request, res: Response) {
    const { id } = req.body;

    const interestAreaRepository = getCustomRepository(InterestAreaRepository);

    const interestAreaExists = await interestAreaRepository.findOne({ id });

    if (!interestAreaExists) {
      throw new AppError(Message.INTEREST_AREA_NOT_FOUND, 406);
    }

    const { interestArea = interestAreaExists.interestArea } = req.body;

    if (interestArea !== interestAreaExists.interestArea) {
      const interestAreaAlreadyExists = await interestAreaRepository.findOne({
        interestArea,
      });

      if (interestAreaAlreadyExists) {
        throw new AppError(Message.INTEREST_AREA_ALREADY_EXIST, 409);
      }
    }

    await interestAreaRepository.update(id, {
      interestArea,
    });

    const interestAreaUpdated = await interestAreaRepository.findOne({ id });

    return res.status(200).json({ InterestArea: interestAreaUpdated });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const interestAreaRepository = getCustomRepository(InterestAreaRepository);

    let interestArea = await interestAreaRepository.findOne({ id });

    if (!interestArea) {
      throw new AppError(Message.INTEREST_AREA_NOT_FOUND, 406);
    }

    await interestAreaRepository.delete({ id });

    return res.status(201).json({ Message: Message.SUCCESS });
  }

  async show(req: Request, res: Response) {
    const interestAreaRepository = getCustomRepository(InterestAreaRepository);

    let interestAreas = await interestAreaRepository.find();

    if (interestAreas.length === 0) {
      throw new AppError(Message.NOT_FOUND, 406);
    }

    return res.status(201).json({ InterestAreas: interestAreas });
  }
}

export { InterestAreaController };
