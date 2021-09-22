import { Request, Response } from "express";
import md5 from "md5";
import { getCustomRepository } from "typeorm";
import { createToken, verifyToken } from "../auth/token/token.auth";
import { Message } from "../env/message";
import { AppError } from "../errors/AppErrors";
import { UserDTO } from "../models/DTOs/UserDTO";
import { UsersRepository } from "../repositories/UserRepository";
import { verifyExpiredStudent } from "../services/verifyExpiredStudent";
import * as validation from "../util/user/Validations";
import { AddressController } from "./AddressController";
import { CompanyController } from "./CompanyController";
import { OrderController } from "./OrderController";
import { PhoneController } from "./PhoneController";
import { RoleController } from "./RoleController";
import { SolicitationController } from "./SolicitationController";
import { TokenRefreshController } from "./TokenRefreshController";
import { UserInterestAreaRelationUserController } from "./UserInterestAreaRelationUserController";
import { UserRoleController } from "./UserRoleController";

class UserController {
  // metodo assincrono para o cadastro de usuários
  async create(req: Request, res: Response) {
    // capturando e armazenando os dados do corpo da requisição
    const { name, email, password, phoneNumber } = req.body;

    // verificando se não foi passado um dos campos
    if (!name || !email || !password || !phoneNumber) {
      // retornando um json de erro personalizado
      throw new AppError(Message.REQUIRED_FIELD, 400);
    }

    // verificando se o email não é valido
    if (!validation.validationEmail(email)) {
      // retornando um json de erro personalizado
      throw new AppError(Message.INVALID_EMAIL, 400);
      // verificando se a senha não é valida
    } else if (!validation.validationPassword(password)) {
      // retornando um json de erro personalizado
      throw new AppError(Message.INVALID_PASSWORD, 400);
    } else if (!validation.validationPhone(phoneNumber)) {
      // retornando um json de erro personalizado
      throw new AppError(Message.INVALID_PHONE, 400);
    }

    // tranformando a senha em hash
    const passwordCrypted = md5(password);

    // pegando o repositorio customizado/personalizado
    const usersRepository = getCustomRepository(UsersRepository);

    // pesquisando um usuário pelo email
    const userAlreadyExists = await usersRepository.findOne({ email });

    // verificanddo se já existe um usuário com o email enviado
    if (userAlreadyExists) {
      // retornando uma resposta em json
      throw new AppError(Message.EMAIL_ALREADY_EXIST, 409);
    }

    // criando o usuário
    const user = usersRepository.create({
      name,
      email,
      password: passwordCrypted,
    });

    const phoneController = new PhoneController();

    const phoneExist = await phoneController.readFromNumber(phoneNumber);

    // verificanddo se já existe um phone com o numero enviado
    if (phoneExist) {
      // retornando uma resposta de erro em json
      throw new AppError(Message.PHONE_ALREADY_EXIST, 409);
    }

    // tipo padrão de usuário
    const type = "User";

    const roleController = new RoleController();

    const role = await roleController.readFromType(type);

    if (!role) {
      throw new AppError(Message.ROLE_NOT_FOUND, 404);
    }
    // savando o usuário criado a cima
    const userSaved = await usersRepository.save(user);

    // instanciando o UserRoleController
    const userRoleController = new UserRoleController();

    // criando e salvando a userRole
    await userRoleController.createFromController(userSaved.id, role.id);

    const phoneDTO = await phoneController.createFromController(
      phoneNumber,
      user.id
    );

    const userDTO = {
      ...UserDTO.convertUserToDTO(userSaved),
      Phones: [phoneDTO],
      Roles: [role.type],
    };

    // retornando o DTO do usuario salvo
    return res.status(201).json({ User: userDTO });
  }

  // metodo assincrono para a autenticação de usuários
  async read(req: Request, res: Response) {
    // capturando e armazenando os dados do corpo da requisição
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(Message.REQUIRED_FIELD, 400);
    }

    // tranformando a senha em hash
    const passwordCrypted = md5(password);

    // pegando o repositorio customizado/personalizado
    const usersRepository = getCustomRepository(UsersRepository);

    // pesquisando um usuário pelo email e senha
    const user = await usersRepository.findOne({
      email,
      password: passwordCrypted,
    });

    // verificanddo se existe um usuário com o email e senha enviados
    if (!user) {
      throw new AppError(Message.USER_NOT_FOUND, 404);
    }

    await verifyExpiredStudent(user.id);

    const userRoleController = new UserRoleController();

    const rolesDTO = await userRoleController.readFromUser(user.id);

    if (rolesDTO.length === 0) {
      throw new AppError(Message.ROLE_NOT_FOUND, 404);
    }

    const rolesTypes = rolesDTO.map((roleDTO) => {
      return roleDTO.type;
    });

    // criando o objeto playload, que será passado para a função generate
    const payload = {
      iss: "Educare_api",
      nameUser: user.name,
      sub: user.id,
      roles: rolesTypes,
    };

    const token = await createToken(payload, "1h");

    const tokenRefreshController = new TokenRefreshController();

    await tokenRefreshController.deleteFromController(user.id);

    const tokenDecrypted = await verifyToken(token);

    const expiresIn = tokenDecrypted.exp;

    const tokenRefresh = await tokenRefreshController.createFromController(
      user.id,
      expiresIn
    );

    // retornando o token criado
    return res.status(200).json({
      Token: token,
      User: UserDTO.convertUserToDTO(user),
      TokenRefreshID: tokenRefresh.id,
    });
  }

  // metodo assincrono para a atualização de usuários
  async update(req: Request, res: Response) {
    // capturando e armazenando o id do corpo da requisição
    const { userID } = req.body;

    // pegando o repositorio customizado/personalizado
    const usersRepository = getCustomRepository(UsersRepository);

    // pesquisando um usuário pelo id
    let user = await usersRepository.findOne({ id: userID });

    // verificanddo se existe um usuário com o id enviado
    if (!user) {
      // retornando uma resposta em json
      throw new AppError(Message.USER_NOT_FOUND, 404);
    }

    // capturando e armazenando os dados do corpo da requisição, caso não seja passado algum dado, a constante receberá o atributo do usuário pesquisado
    const {
      name = user.name,
      email = user.email,
      password = user.password,
    } = req.body;

    // verificando se o email é valido
    if (!validation.validationEmail(email)) {
      // retornando um json de erro personalizado
      throw new AppError(Message.INVALID_EMAIL, 400);
      // verificando se a senha foi passada e se é valida
    } else if (!validation.validationPassword(password)) {
      // retornando um json de erro personalizado
      throw new AppError(Message.INVALID_PASSWORD, 400);
    }

    // verificando se o email passado e igual ao do usuário
    if (!(user.email === email)) {
      // pesquisando um usuário por email, caso o email passado não seja o mesmo do usuário
      const emailExists = await usersRepository.findOne({ email });
      if (emailExists) {
        // se encontrar algo retorna um json de erro
        throw new AppError(Message.EMAIL_ALREADY_EXIST, 409);
      }
    }

    // tranformando a senha em hash
    const passwordCrypted = md5(password);

    // atualizando o usuário a partir do id
    await usersRepository.update(userID, {
      name,
      email,
      password: passwordCrypted,
    });

    Object.assign(user, {
      name,
      email,
      password: passwordCrypted,
    });

    const userSave = UserDTO.convertUserToDTO(user);

    // retornando o DTO do usuario salvo
    return res.status(201).json({ User: userSave });
  }

  // metodo assincrono para a deleção de usuários
  async delete(req: Request, res: Response) {
    // capturando e armazenando o id do usuário do parametro do URL
    const { userID } = req.params;

    // pegando o repositorio customizado/personalizado
    const usersRepository = getCustomRepository(UsersRepository);

    // pesquisando o usuário pelo id
    const userExist = await usersRepository.findOne({
      id: userID,
    });

    // verificanddo se existe um usuário com o id enviado
    if (!userExist) {
      // retornando uma resposta em json
      throw new AppError(Message.ROLE_NOT_FOUND, 404);
    }

    // deletando o usuário a partir do id
    usersRepository.delete({ id: userID });

    // retornando um json de sucesso
    return res.status(200).json({
      Message: Message.SUCCESS,
    });
  }

  // metodo assincrono para o retorno de todos os usuários cadastrados no DB
  async showUsers(req: Request, res: Response) {
    // pegando o repositorio customizado/personalizado
    const usersRepository = getCustomRepository(UsersRepository);

    // pesquisando todos os usuários do DB
    const users = await usersRepository.find();

    // verificando se o DB possui usuários cadastrados
    if (users.length === 0) {
      // retornando uma resposta em json
      throw new AppError(Message.NOT_FOUND, 404);
    }

    const userRoleController = new UserRoleController();
    const phoneController = new PhoneController();

    const usersDTO = [];

    for (const user of users) {
      const rolesDTO = await userRoleController.readFromUser(user.id);
      const phonesDTO = await phoneController.readFromUser(user.id);

      let userDTO = UserDTO.convertUserToDTO(user) as Object;

      userDTO = {
        ...userDTO,
        Phones: phonesDTO.length === 0 ? Message.PHONE_NOT_FOUND : phonesDTO,
        Roles: rolesDTO.length === 0 ? Message.ROLE_NOT_FOUND : rolesDTO,
      };

      usersDTO.push(userDTO);
    }

    // retornando os usuários encontrados no DB
    return res.status(200).json({ users: usersDTO });
  }

  async readFromController(id: string) {
    // pegando o repositorio customizado/personalizado
    const usersRepository = getCustomRepository(UsersRepository);

    // pesquisando um usuário pelo email e senha
    const user = await usersRepository.findOne({
      id,
    });

    return user;
  }

  async readFromEmail(email: string) {
    // pegando o repositorio customizado/personalizado
    const usersRepository = getCustomRepository(UsersRepository);

    // pesquisando um usuário pelo email e senha
    const user = await usersRepository.findOne({
      email,
    });

    return user;
  }

  async readAddressFromUser(req: Request, res: Response) {
    const { userID } = req.params;

    const addressController = new AddressController();

    const addressDTO = await addressController.readFromUser(userID);

    if (!addressDTO) {
      throw new AppError(Message.ADDRESS_NOT_FOUND, 404);
    }

    return res.status(200).json({ Address: addressDTO });
  }

  async readPhonesFromUser(req: Request, res: Response) {
    const { userID } = req.params;

    const phoneController = new PhoneController();

    const phonesDTO = await phoneController.readFromUser(userID);

    if (phonesDTO.length === 0) {
      throw new AppError(Message.NOT_FOUND, 404);
    }

    return res.status(200).json({ Phones: phonesDTO });
  }

  async readCompaniesFromUser(req: Request, res: Response) {
    const { userID } = req.params;

    const companyController = new CompanyController();

    const companiesDTO = await companyController.readCompaniesUser(userID);

    if (companiesDTO.length === 0) {
      throw new AppError(Message.NOT_FOUND, 404);
    }

    return res.status(200).json({ Companies: companiesDTO });
  }

  async readOrdersFromUser(req: Request, res: Response) {
    const { userID } = req.params;

    const orderController = new OrderController();

    const ordersDTO = await orderController.readOrdersUser(userID);

    if (ordersDTO.length === 0) {
      throw new AppError(Message.NOT_FOUND, 404);
    }

    return res.status(200).json({ Orders: ordersDTO });
  }

  async readSolicitationsFromUser(req: Request, res: Response) {
    const { userID } = req.params;

    const solicitationController = new SolicitationController();

    const solicitations = await solicitationController.readFromUserID(userID);

    if (solicitations.length === 0) {
      throw new AppError(Message.NOT_FOUND, 404);
    }

    return res.status(200).json({ Solicitations: solicitations });
  }

  async readUserInterestArea(req: Request, res: Response) {
    const { userID } = req.params;

    // manipulando o usuario
    const usersRepository = getCustomRepository(UsersRepository);

    const user = await usersRepository.findOne({ id: userID });

    if (!user) {
      throw new AppError(Message.USER_NOT_FOUND, 404);
    }

    const userInterestAreaRelationUserController =
      new UserInterestAreaRelationUserController();

    const userInterestAreaList =
      await userInterestAreaRelationUserController.readFromUserID(userID);

    return res.status(200).json({ UserInterestArea: userInterestAreaList });
  }

  async readAllFromUser(req: Request, res: Response) {
    const { userID } = req.params;

    // manipulando o usuario
    const usersRepository = getCustomRepository(UsersRepository);

    const user = await usersRepository.findOne({ id: userID });

    if (!user) {
      throw new AppError(Message.USER_NOT_FOUND, 404);
    }

    let userDTO = UserDTO.convertUserToDTO(user) as Object;

    const userRoleController = new UserRoleController();
    const phoneController = new PhoneController();
    const addressController = new AddressController();
    const companyController = new CompanyController();
    const orderController = new OrderController();
    const solicitationController = new SolicitationController();

    const solicitations = await solicitationController.readFromUserID(userID);
    const ordersDTO = await orderController.readOrdersUser(userID);
    const rolesDTO = await userRoleController.readFromUser(userID);
    const phonesDTO = await phoneController.readFromUser(userID);
    const addressDTO = await addressController.readFromUser(userID);
    const companiesDTO = await companyController.readCompaniesUser(userID);

    userDTO = {
      ...userDTO,
      Roles: rolesDTO.length === 0 ? Message.ROLE_NOT_FOUND : rolesDTO,
      Phones: phonesDTO.length === 0 ? Message.PHONE_NOT_FOUND : phonesDTO,
      Address: addressDTO || Message.ADDRESS_NOT_FOUND,
      Companies:
        companiesDTO.length === 0 ? Message.COMPANY_NOT_FOUND : companiesDTO,
      Orders: ordersDTO.length === 0 ? Message.ORDER_NOT_FOUND : ordersDTO,
      Solicitations:
        solicitations.length === 0
          ? Message.SOLICITATION_NOT_FOUND
          : solicitations,
    };

    return res.status(200).json({ User: userDTO });
  }
}

// exportando a classe
export { UserController };
