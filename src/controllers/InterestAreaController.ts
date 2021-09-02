import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";

import { Message } from "../env/message";
import { AppError } from "../errors/AppErrors";
import { InterestAreaRepository } from "../repositories/InterestAreaRepository";

class InterestAreaController {
  async create(req: Request, res: Response) {
    const { interestArea } = req.body;

    if (!interestArea) {
      throw new AppError(Message.REQUIRED_FIELD, 422);
    }

    const interestAreaRepository = getCustomRepository(InterestAreaRepository);

    const interestAreaAlreadyExist = await interestAreaRepository.findOne({
      interestArea,
    });

    if (interestAreaAlreadyExist) {
      throw new AppError(Message.INTEREST_AREA_ALREADY_EXIST, 409);
    }

    let interestAreaSaved = interestAreaRepository.create({ interestArea });

    interestAreaSaved = await interestAreaRepository.save(interestAreaSaved);

    return res.status(201).json({ InterestArea: interestAreaSaved });
  }

  async read(req: Request, res: Response) {
    const { id } = req.params;

    const interestAreaRepository = getCustomRepository(InterestAreaRepository);

    const interestArea = await interestAreaRepository.findOne({ id });

    if (!interestArea) {
      throw new AppError(Message.INTEREST_AREA_NOT_FOUND, 406);
    }

    return res.status(200).json({ InterestArea: interestArea });
  }

  async update(req: Request, res: Response) {
    const { id } = req.body;

    if (!id) {
      throw new AppError(Message.ID_NOT_FOUND, 422);
    }

    const interestAreaRepository = getCustomRepository(InterestAreaRepository);

    let interestAreaExists = await interestAreaRepository.findOne({ id });

    if (!interestAreaExists) {
      throw new AppError(Message.INTEREST_AREA_NOT_FOUND, 406);
    }

    const { interestArea = interestAreaExists.interestArea } = req.body;

    await interestAreaRepository.update(id, { interestArea });

    interestAreaExists = await interestAreaRepository.findOne({ id: id });

    return res.status(200).json({ InterestArea: interestAreaExists });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const interestAreaRepository = getCustomRepository(InterestAreaRepository);

    const interestArea = await interestAreaRepository.findOne({ id });

    if (!interestArea) {
      throw new AppError(Message.INTEREST_AREA_NOT_FOUND, 406);
    }

    await interestAreaRepository.delete({ id });

    return res.status(200).json({ Message: Message.SUCCESS });
  }

  async show(req: Request, res: Response) {
    const interestAreaRepository = getCustomRepository(InterestAreaRepository);

    const interestArea = await interestAreaRepository.find();

    if (interestArea.length < 0) {
      throw new AppError(Message.NOT_FOUND, 406);
    }

    return res.status(200).json({ InterestArea: interestArea });
  }

  async readFromInterestArea(interestArea: string) {
    const interestAreaRepository = getCustomRepository(InterestAreaRepository);

    const interestAreaExist = await interestAreaRepository.findOne({
      interestArea,
    });

    if (!interestAreaExist) {
      throw new AppError(Message.INTEREST_AREA_NOT_FOUND, 406);
    }

    return interestAreaExist;
  }
}

export { InterestAreaController };
