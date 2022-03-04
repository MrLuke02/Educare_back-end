import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { Message } from "../env/message";
import { AppError } from "../errors/AppErrors";
import { UserDTO } from "../models/DTOs/UserDTO";
import { EmployeesRepository } from "../repositories/UserRepository copy";
import * as validation from "../util/user/Validations";
import { RoleController } from "./RoleController";
import { UserController } from "./UserController";
import { UserRoleController } from "./UserRoleController";
import { PhoneController } from "./PhoneController";

class EmployeeController {
  // metodo assincrono para o cadastro de usuários
  async create(req: Request, res: Response) {
    // capturando e armazenando os dados do corpo da requisição
    const { occupation, email, companyID } = req.body;

    // verificando se não foi passado um dos campos
    if (!occupation || !email || !companyID) {
      // retornando um json de erro personalizado
      throw new AppError(Message.REQUIRED_FIELD, 400);
    }

    // verificando se o email não é valido
    if (!validation.validationEmail(email)) {
      // retornando um json de erro personalizado
      throw new AppError(Message.INVALID_EMAIL, 400);
      // verificando se a senha não é valida
    }

    const userController = new UserController();

    const user = await userController.readFromEmail(email);

    if (!user) {
      throw new AppError(Message.USER_NOT_FOUND, 406);
    }

    // pegando o repositorio customizado/personalizado
    const employeeRepository = getCustomRepository(EmployeesRepository);

    // pesquisando um usuário pelo email
    const employeeAlreadyExists = await employeeRepository.findOne({
      userID: user.id,
      companyID,
    });

    // verificando se já existe um usuário com o email enviado
    if (employeeAlreadyExists) {
      // retornando uma resposta em json
      throw new AppError(Message.EMPLOYEE_ALREADY_EXIST, 409);
    }

    // criando o employee
    const employee = employeeRepository.create({
      occupation,
      userID: user.id,
      companyID,
    });

    // tipo padrão de usuário
    const type = "Employee";

    const roleController = new RoleController();

    const role = await roleController.readFromType(type);

    if (!role) {
      throw new AppError(Message.ROLE_NOT_FOUND, 404);
    }
    // savando o usuário criado a cima
    const employeeSaved = await employeeRepository.save(employee);

    // instanciando o UserRoleController
    const userRoleController = new UserRoleController();

    // criando e salvando a userRole
    await userRoleController.createFromController(user.id, role.id);

    // retornando o DTO do usuario salvo
    return res.status(201).json({ Employee: employeeSaved });
  }

  // metodo assincrono para a autenticação de usuários
  async read(req: Request, res: Response) {
    const { id } = req.params;

    const employeeRepository = getCustomRepository(EmployeesRepository);

    const employee = await employeeRepository.findOne({ id });

    if (!employee) {
      throw new AppError(Message.EMPLOYEE_NOT_FOUND, 404);
    }

    return res.status(200).json({ Employee: employee });
  }

  async readFromID(id: string) {
    const employeeRepository = getCustomRepository(EmployeesRepository);

    const employee = await employeeRepository.findOne({ id });

    return employee;
  }

  // metodo assincrono para a atualização de usuários
  async update(req: Request, res: Response) {
    // capturando e armazenando o id do corpo da requisição
    const { id, occupation } = req.body;

    // pegando o repositorio customizado/personalizado
    const employeesRepository = getCustomRepository(EmployeesRepository);

    // pesquisando um usuário pelo id
    let employee = await employeesRepository.findOne({ id });

    if (!id || !occupation) {
      throw new AppError(Message.REQUIRED_FIELD, 400);
    }

    await employeesRepository.update(id, { occupation });

    Object.assign(employee, {
      occupation,
    });

    // retornando o DTO do usuario salvo
    return res.status(200).json({ Employee: employee });
  }

  // metodo assincrono para a deleção de usuários
  async delete(req: Request, res: Response) {
    // capturando e armazenando o id do usuário do parametro do URL
    const { id } = req.params;

    // pegando o repositorio customizado/personalizado
    const employeeRepository = getCustomRepository(EmployeesRepository);

    // pesquisando o usuário pelo id
    const employeeExist = await employeeRepository.findOne({
      id,
    });

    // verificanddo se existe um usuário com o id enviado
    if (!employeeExist) {
      // retornando uma resposta em json
      throw new AppError(Message.EMPLOYEE_NOT_FOUND, 404);
    }

    // deletando o usuário a partir do id
    employeeRepository.delete({ id });

    // retornando um json de sucesso
    return res.status(200).json({
      Message: Message.SUCCESS,
    });
  }

  // metodo assincrono para o retorno de todos os usuários cadastrados no DB
  async show(req: Request, res: Response) {
    // pegando o repositorio customizado/personalizado
    const employeeRepository = getCustomRepository(EmployeesRepository);

    // pesquisando todos os usuários do DB
    const employees = await employeeRepository.find();

    // verificando se o DB possui usuários cadastrados
    if (employees.length === 0) {
      // retornando uma resposta em json
      throw new AppError(Message.NOT_FOUND, 404);
    }

    // retornando os usuários encontrados no DB
    return res.status(200).json({ Employees: employees });
  }

  async readFromUserAndCompany(userID: string, companyID: string) {
    // pegando o repositorio customizado/personalizado
    const employeeRepository = getCustomRepository(EmployeesRepository);

    const employee = await employeeRepository.findOne({ userID, companyID });

    return employee;
  }

  async readUserFromCompanyID(req: Request, res: Response) {
    const { companyID } = req.params;

    const employeeRepository = getCustomRepository(EmployeesRepository);

    const employees_user = await employeeRepository.find({
      // select -> o que quero de retorno
      // where -> condição
      // relations -> para trazer também as informações da tabela que se relaciona
      where: { companyID },
      relations: ["user"],
    });

    if (employees_user.length === 0) {
      throw new AppError(Message.EMPLOYEE_NOT_FOUND, 404);
    }

    const phoneController = new PhoneController();

    let employees_userDTO = [];

    for (const employee_user of employees_user) {
      const { occupation, user } = employee_user;

      const phones = await phoneController.readFromUser(user.id);

      employees_userDTO.push({
        occupation,
        phones,
        ...UserDTO.convertUserToDTO(user),
      });
    }

    return res.status(200).json({ Employees: employees_userDTO });
  }
}

// exportando a classe
export { EmployeeController };
