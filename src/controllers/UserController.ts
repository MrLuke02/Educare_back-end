import { Request, Response } from "express";
import md5 from "md5";
import { getCustomRepository } from "typeorm";
import { createToken } from "../auth/token/token.auth";
import { Status } from "../env/status";
import { AddressResponseDTO } from "../models/DTO/address/AddressResponseDTO";
import { PhoneResponseDTO } from "../models/DTO/phone/PhoneResponseDTO";
import { UserResponseDTO } from "../models/DTO/user/UserResponseDTO";
import { UsersRepository } from "../repositories/UserRepository";
import * as validation from "../util/user/UserUtil";
import { AddressController } from "./AddressController";
import { CompanyController } from "./CompanyController";
import { PhoneController } from "./PhoneController";
import { RoleController } from "./RoleController";
import { UserRoleController } from "./UserRoleController";

class UserController {
  // metodo assincrono para o cadastro de usuários
  async create(req: Request, res: Response) {
    // capturando e armazenando os dados do corpo da requisição
    const { name, email, password, phoneNumber } = req.body;

    // verificando se não foi passado um dos campos
    if (!name || !email || !password || !phoneNumber) {
      // retornando um json de erro personalizado
      return res.status(422).json({ Message: Status.REQUIRED_FIELD });
    }

    // verificando se o email não é valido
    if (!validation.validationEmail(email)) {
      // retornando um json de erro personalizado
      return res.status(422).json({
        Message: Status.INVALID_EMAIL,
      });
      // verificando se a senha não é valida
    } else if (!validation.validationPassword(password)) {
      // retornando um json de erro personalizado
      return res.status(422).json({
        Message: Status.INVALID_PASSWORD,
      });
    } else if (!validation.validationPhone(phoneNumber)) {
      // retornando um json de erro personalizado
      return res.status(422).json({
        Message: Status.INVALID_PHONE,
      });
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
      return res.status(409).json({
        Message: Status.USER_ALREADY_EXIST,
      });
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
      return res.status(409).json({
        Message: Status.PHONE_ALREADY_EXIST,
      });
    }

    // tipo padrão de usuário
    const type = "User";

    const roleController = new RoleController();

    const role = await roleController.readFromType(type);

    if (!role) {
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
    }
    // savando o usuário criado a cima
    const userSaved = await usersRepository.save(user);

    // instanciando o UserRoleController
    const userRoleController = new UserRoleController();

    // criando e salvando a userRole
    const userRoleSaved = await userRoleController.createFromController(
      userSaved.id,
      role.id
    );

    const roleSaved = await roleController.readFromId(userRoleSaved.roleID);

    const phone = await phoneController.createFromController(
      phoneNumber,
      user.id
    );

    const userDTO = {
      ...UserResponseDTO.responseUserDTO(userSaved),
      phone: phone.phoneNumber,
      role: [roleSaved.type],
    };

    // retornando o DTO do usuario salvo
    return res.status(201).json({ user: userDTO });
  }

  // metodo assincrono para a autenticação de usuários
  async read(req: Request, res: Response) {
    // capturando e armazenando os dados do corpo da requisição
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ Message: Status.REQUIRED_FIELD });
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
      // retornando uma resposta em json
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
    }

    const userRoleController = new UserRoleController();

    const userRole_role = await userRoleController.readFromUser(user.id);

    if (!userRole_role) {
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
    }

    // pegando somente os tipos de roles que o usuário possui
    const roles = userRole_role.map((userRole) => {
      return userRole.role.type;
    });

    // criando o objeto playload, que será passado para a função generate
    const payload = {
      iss: "Educare_api",
      nameUser: user.name,
      sub: user.id,
      roles,
    };

    let token: string;

    try {
      // criando um token de acordo com a constante payload criada a cima
      token = await createToken(payload);
    } catch (error) {
      return res.status(error.Status).json({ Message: error.Message });
    }

    // retornando o token criado
    return res.status(200).json({ token });
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
      return res.status(406).json({ Message: Status.NOT_FOUND });
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
      return res.status(422).json({
        Message: Status.INVALID_EMAIL,
      });
      // verificando se a senha foi passada e se é valida
    } else if (!validation.validationPassword(password)) {
      // retornando um json de erro personalizado
      return res.status(422).json({
        Message: Status.INVALID_PASSWORD,
      });
    }

    // verificando se o email passado e igual ao do usuário
    if (!(user.email === email)) {
      // pesquisando um usuário por email, caso o email passado não seja o mesmo do usuário
      const emailExists = await usersRepository.findOne({ email });
      if (emailExists) {
        // se encontrar algo retorna um json de erro
        return res.status(409).json({ Message: Status.EMAIL_ALREADY_EXIST });
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

    // pesquisando o usuário pelo id
    user = await usersRepository.findOne({ id: userID });

    const userSave = UserResponseDTO.responseUserDTO(user);

    // retornando o DTO do usuario salvo
    return res.status(201).json({ user: userSave });
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
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
    }

    // deletando o usuário a partir do id
    usersRepository.delete({ id: userID });

    // retornando um json de sucesso
    return res.status(200).json({
      Message: Status.SUCCESS,
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
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
    }

    const userRoleController = new UserRoleController();
    const phoneController = new PhoneController();

    const usersDTOPromise = users.map(async (user) => {
      const userRole_role = await userRoleController.readFromUser(user.id);
      const phones = await phoneController.readFromUser(user.id);

      const roles = userRole_role.map((userRole) => {
        return userRole.role.type;
      });

      const phone = [];

      for (const key in phones) {
        phone.push(phones[key].phoneNumber);
      }

      let userDTO = UserResponseDTO.responseUserDTO(user) as Object;

      if (roles.length === 0 && phone.length === 0) {
        userDTO = {
          ...userDTO,
          phone: Status.NOT_FOUND,
          roles: Status.NOT_FOUND,
        };
        // user["phone"] = Status.NOT_FOUND;
        // user["roles"] = Status.NOT_FOUND;
      } else if (roles.length === 0) {
        userDTO = {
          ...userDTO,
          phone: phone,
          roles: Status.NOT_FOUND,
        };
        // user["phone"] = phone;
        // user["roles"] = Status.NOT_FOUND;
      } else if (phone.length === 0) {
        userDTO = {
          ...userDTO,
          phone: Status.NOT_FOUND,
          roles: roles,
        };
        // user["phone"] = Status.NOT_FOUND;
        // user["roles"] = roles;
      } else {
        userDTO = {
          ...userDTO,
          phone: phone,
          roles: roles,
        };
        // user["phone"] = phone;
        // user["roles"] = roles;
      }

      return userDTO;
    });

    const usersDTO = [];

    for (const user of usersDTOPromise) {
      usersDTO.push(await user);
    }

    // retornando os usuários encontrados no DB
    return res.status(200).json({ users: usersDTO });
  }

  async readFromId(id: string) {
    // pegando o repositorio customizado/personalizado
    const usersRepository = getCustomRepository(UsersRepository);

    // pesquisando um usuário pelo email e senha
    const user = await usersRepository.findOne({
      id,
    });

    return user;
  }

  async readAddressFromUser(req: Request, res: Response) {
    const { userID } = req.params;

    const addressController = new AddressController();

    const address = await addressController.readFromUser(userID);

    if (!address) {
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
    }

    return res
      .status(200)
      .json({ address: AddressResponseDTO.responseAddressDTO(address) });
  }

  async readPhoneFromUser(req: Request, res: Response) {
    const { userID } = req.params;

    const phoneController = new PhoneController();

    const phones = await phoneController.readFromUser(userID);

    if (phones.length === 0) {
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
    }

    const phonesDTO = phones.map((phone) => {
      return PhoneResponseDTO.responsePhoneDTO(phone);
    });

    return res.status(200).json({ phones: phonesDTO });
  }

  async readCompanyFromUser(req: Request, res: Response) {
    const { userID } = req.params;

    const companyController = new CompanyController();

    const companiesDTO = await companyController.readCompaniesUser(userID);

    if (companiesDTO.length === 0) {
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
    }

    return res.status(200).json({ companies: companiesDTO });
  }

  async readAllFromUser(req: Request, res: Response) {
    const { userID } = req.params;

    // manipulando o usuario
    const usersRepository = getCustomRepository(UsersRepository);

    const user = await usersRepository.findOne({ id: userID });

    if (!user) {
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
    }

    let userDTO = UserResponseDTO.responseUserDTO(user) as Object;

    // manipulando os papeis do usuario
    const userRoleController = new UserRoleController();

    const userRoles = await userRoleController.readFromUser(userID);

    if (userRoles.length === 0) {
      userDTO = {
        ...userDTO,
        roles: Status.NOT_FOUND,
      };
    } else {
      const roles = userRoles.map((roles) => {
        return roles.role.type;
      });
      userDTO = {
        ...userDTO,
        roles: roles,
      };
    }

    // manipulando os telefones do usuario
    const phoneController = new PhoneController();

    const phones = await phoneController.readFromUser(userID);

    if (phones.length === 0) {
      userDTO = {
        ...userDTO,
        phones: Status.NOT_FOUND,
      };
    } else {
      const phonesDTO = phones.map((phone) => {
        return PhoneResponseDTO.responsePhoneDTO(phone);
      });
      userDTO = {
        ...userDTO,
        phones: phonesDTO,
      };
    }

    // manipulando o endereço do usuario
    const addressController = new AddressController();

    const address = await addressController.readFromUser(userID);

    if (!address) {
      userDTO = {
        ...userDTO,
        address: Status.NOT_FOUND,
      };
    } else {
      userDTO = {
        ...userDTO,
        address: AddressResponseDTO.responseAddressDTO(address),
      };
    }

    // manipulando as empresas do usuario
    const companyController = new CompanyController();

    const companiesDTO = await companyController.readCompaniesUser(userID);

    if (companiesDTO.length === 0) {
      userDTO = {
        ...userDTO,
        companies: Status.NOT_FOUND,
      };
    } else {
      userDTO = {
        ...userDTO,
        companies: companiesDTO,
      };
    }

    return res.status(200).json({ user: userDTO });
  }
}

// exportando a classe
export { UserController };
