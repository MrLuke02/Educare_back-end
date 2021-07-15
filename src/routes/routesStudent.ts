import { Router } from "express";

import { StudentController } from "../controllers/StudentController";

const studentController = new StudentController();

const routerStudent = Router();

routerStudent.get("/student/:id", studentController.read);

routerStudent.put("/student", studentController.update);

routerStudent.get("/showStudents", studentController.show);

routerStudent.delete("/student/:id", studentController.delete);

export { routerStudent };
