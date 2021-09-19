import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";

import { Message } from "../env/message";
import { AppError } from "../errors/AppErrors";
import { StudentInterestAreaRepository } from "../repositories/StudentInterestAreaRepository";

class StudentInterestAreaController {
  async create(req: Request, res: Response) {
    const { studentInterestArea } = req.body;

    if (!studentInterestArea) {
      throw new AppError(Message.REQUIRED_FIELD, 400);
    }

    const studentInterestAreaRepository = getCustomRepository(
      StudentInterestAreaRepository
    );

    const studentInterestAreaAlreadyExist =
      await studentInterestAreaRepository.findOne({
        studentInterestArea,
      });

    if (studentInterestAreaAlreadyExist) {
      throw new AppError(Message.INTEREST_AREA_ALREADY_EXIST, 409);
    }

    let studentInterestAreaSaved = studentInterestAreaRepository.create({
      studentInterestArea,
    });

    studentInterestAreaSaved = await studentInterestAreaRepository.save(
      studentInterestAreaSaved
    );

    return res
      .status(201)
      .json({ StudentInterestArea: studentInterestAreaSaved });
  }

  async read(req: Request, res: Response) {
    const { id } = req.params;

    const studentInterestAreaRepository = getCustomRepository(
      StudentInterestAreaRepository
    );

    const studentInterestArea = await studentInterestAreaRepository.findOne({
      id,
    });

    if (!studentInterestArea) {
      throw new AppError(Message.INTEREST_AREA_NOT_FOUND, 404);
    }

    return res.status(200).json({ StudentInterestArea: studentInterestArea });
  }

  async update(req: Request, res: Response) {
    const { id } = req.body;

    if (!id) {
      throw new AppError(Message.ID_NOT_FOUND, 400);
    }

    const studentInterestAreaRepository = getCustomRepository(
      StudentInterestAreaRepository
    );

    let studentInterestAreaExists = await studentInterestAreaRepository.findOne(
      { id }
    );

    if (!studentInterestAreaExists) {
      throw new AppError(Message.INTEREST_AREA_NOT_FOUND, 404);
    }

    const {
      studentInterestArea = studentInterestAreaExists.studentInterestArea,
    } = req.body;

    await studentInterestAreaRepository.update(id, { studentInterestArea });

    studentInterestAreaExists = await studentInterestAreaRepository.findOne({
      id: id,
    });

    return res
      .status(200)
      .json({ StudentInterestArea: studentInterestAreaExists });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const studentInterestAreaRepository = getCustomRepository(
      StudentInterestAreaRepository
    );

    const studentInterestArea = await studentInterestAreaRepository.findOne({
      id,
    });

    if (!studentInterestArea) {
      throw new AppError(Message.INTEREST_AREA_NOT_FOUND, 404);
    }

    await studentInterestAreaRepository.delete({ id });

    return res.status(200).json({ Message: Message.SUCCESS });
  }

  async show(req: Request, res: Response) {
    const studentInterestAreaRepository = getCustomRepository(
      StudentInterestAreaRepository
    );

    const studentInterestArea = await studentInterestAreaRepository.find();

    if (studentInterestArea.length === 0) {
      throw new AppError(Message.NOT_FOUND, 404);
    }

    return res.status(200).json({ StudentInterestArea: studentInterestArea });
  }

  async readFromStudentInterestAreaID(studentInterestAreaID: string) {
    const studentInterestAreaRepository = getCustomRepository(
      StudentInterestAreaRepository
    );

    const studentInterestAreaExist =
      await studentInterestAreaRepository.findOne({
        id: studentInterestAreaID,
      });

    if (!studentInterestAreaExist) {
      throw new AppError(Message.INTEREST_AREA_NOT_FOUND, 404);
    }

    return studentInterestAreaExist;
  }
}

export { StudentInterestAreaController };
