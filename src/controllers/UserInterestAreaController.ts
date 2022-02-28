import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";

import { Message } from "../env/message";
import { AppError } from "../errors/AppErrors";
import { UserInterestAreaRepository } from "../repositories/UserInterestAreaRepository";

class UserInterestAreaController {
  async create(req: Request, res: Response) {
    const { userInterestArea } = req.body;

    if (!userInterestArea) {
      throw new AppError(Message.REQUIRED_FIELD, 400);
    }

    const userInterestAreaRepository = getCustomRepository(
      UserInterestAreaRepository
    );

    const userInterestAreaAlreadyExist =
      await userInterestAreaRepository.findOne({
        userInterestArea: userInterestArea,
      });

    if (userInterestAreaAlreadyExist) {
      throw new AppError(Message.INTEREST_AREA_ALREADY_EXIST, 409);
    }

    let userInterestAreaSaved = userInterestAreaRepository.create({
      userInterestArea: userInterestArea,
    });

    userInterestAreaSaved = await userInterestAreaRepository.save(
      userInterestAreaSaved
    );

    return res.status(201).json({ UserInterestArea: userInterestAreaSaved });
  }

  async read(req: Request, res: Response) {
    const { id } = req.params;

    const userInterestAreaRepository = getCustomRepository(
      UserInterestAreaRepository
    );

    const userInterestArea = await userInterestAreaRepository.findOne({
      id,
    });

    if (!userInterestArea) {
      throw new AppError(Message.INTEREST_AREA_NOT_FOUND, 404);
    }

    return res.status(200).json({ UserInterestArea: userInterestArea });
  }

  async update(req: Request, res: Response) {
    const { id } = req.body;

    if (!id) {
      throw new AppError(Message.ID_NOT_FOUND, 400);
    }

    const userInterestAreaRepository = getCustomRepository(
      UserInterestAreaRepository
    );

    let userInterestAreaExists = await userInterestAreaRepository.findOne({
      id,
    });

    if (!userInterestAreaExists) {
      throw new AppError(Message.INTEREST_AREA_NOT_FOUND, 404);
    }

    const { userInterestArea = userInterestAreaExists.userInterestArea } =
      req.body;

    await userInterestAreaRepository.update(id, { userInterestArea });

    Object.assign(userInterestAreaExists, {
      userInterestArea,
    });

    return res.status(200).json({ UserInterestArea: userInterestAreaExists });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const userInterestAreaRepository = getCustomRepository(
      UserInterestAreaRepository
    );

    const userInterestArea = await userInterestAreaRepository.findOne({
      id,
    });

    if (!userInterestArea) {
      throw new AppError(Message.INTEREST_AREA_NOT_FOUND, 404);
    }

    await userInterestAreaRepository.delete({ id });

    return res.status(200).json({ Message: Message.SUCCESS });
  }

  async show(req: Request, res: Response) {
    const userInterestAreaRepository = getCustomRepository(
      UserInterestAreaRepository
    );

    const userInterestArea = await userInterestAreaRepository.find();

    if (userInterestArea.length === 0) {
      throw new AppError(Message.NOT_FOUND, 404);
    }

    return res.status(200).json({ UserInterestArea: userInterestArea });
  }

  async readFromUserInterestArea(userInterestArea: string) {
    const userInterestAreaRepository = getCustomRepository(
      UserInterestAreaRepository
    );

    const userInterestAreaExist = await userInterestAreaRepository.findOne({
      userInterestArea,
    });

    if (!userInterestAreaExist) {
      throw new AppError(Message.INTEREST_AREA_NOT_FOUND, 404);
    }

    return userInterestAreaExist;
  }

  async readFromController(userInterestAreaID: string) {
    const userInterestAreaRepository = getCustomRepository(
      UserInterestAreaRepository
    );

    const userInterestAreaExist = await userInterestAreaRepository.findOne({
      id: userInterestAreaID,
    });

    return userInterestAreaExist;
  }
}

export { UserInterestAreaController };
