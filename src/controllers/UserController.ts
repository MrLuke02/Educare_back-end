import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { createToken } from "../auth/token.auth";
import { UserResponseDTO } from "../models/DTO/user/UserResponseDTO";
import { UsersRepository } from "../repositories/UserRepository";
import { UserRoleController } from "./UserRoleController";
import { RoleController } from "./RoleController";
import { PhoneController } from "./PhoneController";
import {
  validationEmail,
  validationPassword,
  validationPhone,
} from "../util/user/UserUtil";
import md5 from "md5";
import * as Erros from "../env/status";

class UserController {
  // metodo assincrono para o cadastro de usuários
  async create(req: Request, res: Response) {
    // capturando e armazenando os dados do corpo da requisição
    const { name, email, password, phoneNumber } = req.body;

    // verificando se não foi passado um dos campos
    if (!name || !email || !password || !phoneNumber) {
      // retornando um json de erro personalizado
      return res.status(422).json({ Message: Erros.REQUIRED_FIELD });
    }

    // verificando se o email não é valido
    if (!validationEmail(email)) {
      // retornando um json de erro personalizado
      return res.status(422).json({
        Message: Erros.INVALID_EMAIL,
      });
      // verificando se a senha não é valida
    } else if (!validationPassword(password)) {
      // retornando um json de erro personalizado
      return res.status(422).json({
        Message: Erros.INVALID_PASSWORD,
      });
    } else if (!validationPhone(phoneNumber)) {
      // retornando um json de erro personalizado
      return res.status(422).json({
        Message: Erros.INVALID_PHONE,
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
        Message: Erros.USER_ALREADY_EXIST,
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
        Message: Erros.PHONE_ALREADY_EXIST,
      });
    }

    // tipo padrão de usuário
    const type = "User";

    const roleController = new RoleController();

    const role = await roleController.readFromType(type);

    if (!role) {
      return res.status(406).json({
        Message: Erros.NOT_FOUND,
      });
    }

    // savando o usuário criado a cima
    const userSaved = await usersRepository.save(user);

    // criando o array props com o id do usuário e da role
    const propsRole = [userSaved.id, role["id"]];

    // instanciando o UserRoleController
    const userRoleController = new UserRoleController();

    // criando e salvando a userRole
    await userRoleController.create(req, res, propsRole);

    const propsPhone = [phoneNumber, user.id];

    const phone = await phoneController.create(req, res, propsPhone);

    const userSave = UserResponseDTO.responseUserDTO(userSaved);
    userSave["phone"] = phone["phoneNumber"];
    userSave["role"] = ["User"];

    // retornando o DTO do usuario salvo
    return res.status(201).json({ user: userSave });
  }

  // metodo assincrono para a autenticação de usuários
  async read(req: Request, res: Response) {
    // capturando e armazenando os dados do corpo da requisição
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ Message: Erros.REQUIRED_FIELD });
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
        Message: Erros.NOT_FOUND,
      });
    }

    const userRoleController = new UserRoleController();

    const userRole_role = await userRoleController.readFromUser(user.id);

    if (!userRole_role) {
      return res.status(406).json({
        Message: Erros.NOT_FOUND,
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

    // criando um token de acordo com a constante payload criada a cima
    const token = await createToken(payload, res);

    // retornando o token criado
    return res.status(200).json({ token });
  }

  // metodo assincrono para a atualização de usuários
  async update(req: Request, res: Response) {
    // capturando e armazenando o id do corpo da requisição
    const { id } = req.body;

    // pegando o repositorio customizado/personalizado
    const usersRepository = getCustomRepository(UsersRepository);

    // pesquisando um usuário pelo id
    let user = await usersRepository.findOne({ id });

    // verificanddo se existe um usuário com o id enviado
    if (!user) {
      // retornando uma resposta em json
      return res.status(406).json({ Message: Erros.NOT_FOUND });
    }

    const phoneController = new PhoneController();

    let propsPhone = [user.id];

    const phone = await phoneController.readFromUser(req, res, propsPhone);

    if (phone !== res) {
      // capturando e armazenando os dados do corpo da requisição, caso não seja passado algum dado, a constante receberá o atributo do usuário pesquisado
      const {
        name = user.name,
        email = user.email,
        password = user.password,
        phoneNumber = phone["phoneNumber"],
      } = req.body;

      // verificando se o email é valido
      if (!validationEmail(email)) {
        // retornando um json de erro personalizado
        return res.status(422).json({
          Message: Erros.INVALID_EMAIL,
        });
        // verificando se a senha foi passada e se é valida
      } else if (!validationPassword(password)) {
        // retornando um json de erro personalizado
        return res.status(422).json({
          Message: Erros.INVALID_PASSWORD,
        });
      }

      // verificando se o email passado e igual ao do usuário
      if (!(user.email === email)) {
        // pesquisando um usuário por email, caso o email passado não seja o mesmo do usuário
        const emailExists = await usersRepository.findOne({ email });
        if (emailExists) {
          // se encontrar algo retorna um json de erro
          return res.status(409).json({ Message: Erros.USER_ALREADY_EXIST });
        }
      }

      propsPhone = [phone["id"], phoneNumber, user.id];

      const phoneSaved = await phoneController.update(req, res, propsPhone);

      if (phoneSaved !== res) {
        // tranformando a senha em hash
        const passwordCrypted = md5(password);

        // atualizando o usuário a partir do id
        await usersRepository.update(id, {
          name,
          email,
          password: passwordCrypted,
        });

        // pesquisando o usuário pelo id
        user = await usersRepository.findOne({ id });

        const userSave = UserResponseDTO.responseUserDTO(user);
        userSave["phone"] = phoneSaved["phoneNumber"];

        // retornando o DTO do usuario salvo
        return res.status(201).json({ user: userSave });
      }
    }
  }

  // metodo assincrono para a deleção de usuários
  async delete(req: Request, res: Response) {
    // capturando e armazenando o id do usuário do parametro do URL
    const { id } = req.params;

    // pegando o repositorio customizado/personalizado
    const usersRepository = getCustomRepository(UsersRepository);

    // pesquisando o usuário pelo id
    const userExist = await usersRepository.findOne({
      id,
    });

    // verificanddo se existe um usuário com o id enviado
    if (!userExist) {
      // retornando uma resposta em json
      return res.status(406).json({
        Message: Erros.NOT_FOUND,
      });
    }

    // deletando o usuário a partir do id
    usersRepository.delete({ id });

    // retornando um json de sucesso
    return res.status(200).json({
      Message: Erros.SUCCESS,
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
        Message: Erros.NOT_FOUND,
      });
    }

    const userRoleController = new UserRoleController();
    const phoneController = new PhoneController();

    const usersDTOPromise = users.map(async (user) => {
      const userRole_role = await userRoleController.readFromUser(user.id);
      const propsPhone = [user.id];
      const phones = await phoneController.readFromUser(req, res, propsPhone);

      const roles = userRole_role.map((userRole) => {
        return userRole.role.type;
      });

      const phone = [];

      for (const key in phones) {
        phone.push(phones[key]["phoneNumber"]);
      }

      if (roles.length === 0 && phone.length === 0) {
        user["roles"] = "Nada encontrado!";
        user["phone"] = "Nada encontrado!";
      } else if (roles.length === 0) {
        user["roles"] = "Nada encontrado!";
        user["phone"] = phone;
      } else if (phone.length === 0) {
        user["phone"] = "Nada encontrado!";
        user["roles"] = roles;
      } else {
        user["roles"] = roles;
        user["phone"] = phone;
      }

      return UserResponseDTO.responseUserDTO(user);
    });

    const usersDTO = [];

    for (const user of usersDTOPromise) {
      usersDTO.push(await user);
    }

    // retornando os usuários encontrados no DB
    return res.status(200).json({ users: usersDTO });
  }
}

// exportando a classe
export { UserController };
