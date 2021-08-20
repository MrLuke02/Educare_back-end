import { Router } from "express";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { CourseController } from "../controllers/CourseController";

const courseController = new CourseController();
const verifyTokenUser = new VerifyTokenUser();

const routerCourse = Router();

routerCourse.post(
  "/course",
  verifyTokenUser.verifyTokenADM,
  courseController.create
);

routerCourse.put(
  "/course",
  verifyTokenUser.verifyTokenADM,
  courseController.update
);

routerCourse.get(
  "/course/:id",
  verifyTokenUser.verifyTokenADM,
  courseController.read
);

routerCourse.delete(
  "/course/:id",
  verifyTokenUser.verifyTokenADM,
  courseController.delete
);

routerCourse.get(
  "/showCourses",
  verifyTokenUser.verifyTokenADM,
  courseController.show
);

export { routerCourse };
