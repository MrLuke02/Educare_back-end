import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";

import { Message } from "../env/message";
import { AppError } from "../errors/AppErrors";
import { CoursesRepository } from "../repositories/CourseRepository";

class CourseController {
  async create(req: Request, res: Response) {
    const { course } = req.body;

    if (!course) {
      throw new AppError(Message.REQUIRED_FIELD, 422);
    }

    const courseRepository = getCustomRepository(CoursesRepository);

    const courseAlreadyExist = await courseRepository.findOne({ course });

    if (courseAlreadyExist) {
      throw new AppError(Message.COURSE_ALREADY_EXIST, 409);
    }

    let courseSaved = courseRepository.create({ course });

    courseSaved = await courseRepository.save(courseSaved);

    return res.status(201).json({ Course: courseSaved });
  }

  async read(req: Request, res: Response) {
    const { id } = req.params;

    const coursesRepository = getCustomRepository(CoursesRepository);

    const course = await coursesRepository.findOne({ id });

    if (!course) {
      throw new AppError(Message.COURSE_NOT_FOUND, 406);
    }

    return res.status(200).json({ Course: course });
  }

  async update(req: Request, res: Response) {
    const { id } = req.body;

    if (!id) {
      throw new AppError(Message.ID_NOT_FOUND, 422);
    }

    const courseRepository = getCustomRepository(CoursesRepository);

    let courseExists = await courseRepository.findOne({ id });

    if (!courseExists) {
      throw new AppError(Message.COURSE_NOT_FOUND, 406);
    }

    const { course = courseExists.course } = req.body;

    await courseRepository.update(id, { course });

    courseExists = await courseRepository.findOne({ id: id });

    return res.status(200).json({ Course: courseExists });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const coursesRepository = getCustomRepository(CoursesRepository);

    const course = await coursesRepository.findOne({ id });

    if (!course) {
      throw new AppError(Message.COURSE_NOT_FOUND, 406);
    }

    await coursesRepository.delete({ id });

    return res.status(200).json({ Message: Message.SUCCESS });
  }

  async show(req: Request, res: Response) {
    const coursesRepository = getCustomRepository(CoursesRepository);

    const courses = await coursesRepository.find();

    if (courses.length < 0) {
      throw new AppError(Message.NOT_FOUND, 406);
    }

    return res.status(200).json({ Courses: courses });
  }

  async readFromCourse(course: string) {
    const coursesRepository = getCustomRepository(CoursesRepository);

    const courseExist = await coursesRepository.findOne({ course });

    if (!courseExist) {
      throw new AppError(Message.COURSE_NOT_FOUND, 406);
    }

    return courseExist;
  }
}

export { CourseController };
