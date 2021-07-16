import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";

import { Message } from "../env/message";
import { AppError } from "../errors/AppErrors";
import { StudentsRepository } from "../repositories/StudentRepository";
import { UserController } from "./UserController";
import { InterestAreaController } from "./InterestAreaController";
import dayjs from "dayjs";

class StudentController {
  // metodo assincrono para o cadastro de phones
  async createFromController(userID: string) {
    const userController = new UserController();

    const user = await userController.readFromController(userID);

    if (!user) {
      throw new AppError(Message.USER_NOT_FOUND, 406);
    }

    const studentRepository = getCustomRepository(StudentsRepository);

    const expiresIn = dayjs().add(2, "minute").unix();

    let student = studentRepository.create({
      userID,
      expiresIn,
    });

    student = await studentRepository.save(student);

    return student;
  }

  async update(req: Request, res: Response) {
    const { id } = req.body;

    if (!id) {
      throw new AppError(Message.ID_NOT_FOUND, 422);
    }

    const studentRepository = getCustomRepository(StudentsRepository);

    let student = await studentRepository.findOne({ id });

    if (!student) {
      throw new AppError(Message.STUDENT_NOT_FOUND, 406);
    }

    const { interestArea } = req.body;

    const interestAreaController = new InterestAreaController();

    const newInterestArea = await interestAreaController.readFromInterestArea(
      interestArea
    );

    await studentRepository.update(id, { interestAreaID: newInterestArea.id });

    student = await studentRepository.findOne({ id });

    return res.status(200).json({ Student: student });
  }

  async read(req: Request, res: Response) {
    const { id } = req.params;

    const studentRepository = getCustomRepository(StudentsRepository);

    const student = await studentRepository.findOne({ id });

    if (!student) {
      throw new AppError(Message.STUDENT_NOT_FOUND, 406);
    }

    const isExpired = dayjs().isAfter(dayjs.unix(student.expiresIn));

    const newStudent = {
      ...student,
      isExpired,
    };

    return res.status(200).json({ Student: newStudent });
  }

  async readFromUserID(userID: string) {
    const studentRepository = getCustomRepository(StudentsRepository);

    const student = await studentRepository.find({
      where: { userID },
      order: { createdAt: "DESC" },
      take: 1,
    });

    if (student.length > 0) {
      if (dayjs().isAfter(dayjs.unix(student[0].expiresIn))) {
        return true;
      }
      return false;
    }
    return true;
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const studentRepository = getCustomRepository(StudentsRepository);

    const student = await studentRepository.findOne({ id });

    if (!student) {
      throw new AppError(Message.STUDENT_NOT_FOUND, 406);
    }

    await studentRepository.delete({ id });

    return res.status(200).json({ Message: Message.SUCCESS });
  }

  async show(req: Request, res: Response) {
    const studentRepository = getCustomRepository(StudentsRepository);

    const students = await studentRepository.find();

    if (students.length === 0) {
      throw new AppError(Message.NOT_FOUND, 406);
    }

    const newStudents = students.map((student) => {
      const isExpired = dayjs().isAfter(dayjs.unix(student.expiresIn));
      return {
        ...student,
        isExpired,
      };
    });

    return res.status(200).json({ Student: newStudents });
  }
}

export { StudentController };
