import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { createToken } from "../auth/token.auth";
import { UserResponseDTO } from "../models/DTO/user/UserResponseDTO";
import { RolesRepository } from "../repositories/RolesRepository";
import { UsersRepository } from "../repositories/UserRepository";
import { UserRoleRepository } from "../repositories/UserRoleRepository";
import { UserRoleController } from "./UserRoleController";
import { validationEmail, validationPassword } from "../util/user/UserUtil";
import md5 from "md5";
import * as Erros from "../env/status";

class UserController {
  // metodo assincrono para o cadastro de usuários
  async create(req: Request, res: Response) {
    // capturando e armazenando os dados do corpo da requisição
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(422).json({ Message: Erros.REQUIRED_FIELD });
    }

    if (!validationEmail(email)) {
      return res.status(422).json({
        Message: Erros.INVALID_EMAIL,
      });
    } else if (!validationPassword(password)) {
      return res.status(422).json({
        Message: Erros.INVALID_PASSWORD,
      });
    }

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
      phone,
      address,
    });

    // savando o usuário criado a cima
    const userSaved = await usersRepository.save(user);

    // instanciando o UserRoleController
    const userRoleController = new UserRoleController();

    // pegando o repositorio customizado/personalizado
    const roleRepository = getCustomRepository(RolesRepository);

    // tipo padrão de usuário
    const type = "User";

    // pesquisando uma role pelo tipo
    const role = await roleRepository.findOne({ type });

    // criando o array props com o id do usuário e da role
    const props = [userSaved.id, role.id];

    // criando e salvando a userRole
    await userRoleController.create(req, res, props);

    // retornando o DTO do usuario salvo e a userRole salva
    return res
      .status(201)
      .json({ user: UserResponseDTO.responseUserDTO(userSaved) });
  }

  // metodo assincrono para a autenticação de usuários
  async read(req: Request, res: Response) {
    // capturando e armazenando os dados do corpo da requisição
    const { email, password } = req.body;

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

    // pegando o repositorio customizado/personalizado
    const userRoleRepository = getCustomRepository(UserRoleRepository);

    // pesquisando userRole e role pelo id do usuário
    const userRole_role = await userRoleRepository.find({
      // select -> o que quero de retorno
      // where -> condição
      // relations -> para trazer também as informações da tabela que se relaciona
      select: ["roleID"],
      where: { userID: user.id },
      relations: ["role"],
    });

    // pegando somente os tipos de roles que o usuário possui
    const roles = userRole_role.map((userRole) => {
      return userRole.role.type;
    });

    // criando o objeto playload, que será passado para a função generate
    const payload = {
      iss: "Educare_api",
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

    if (req.body.password && !validationPassword(req.body.password)) {
      return res.status(422).json({
        Message: Erros.INVALID_PASSWORD,
      });
    }

    // pegando o repositorio customizado/personalizado
    const usersRepository = getCustomRepository(UsersRepository);

    // pesquisando um usuário pelo id
    let user = await usersRepository.findOne({ id });

    // verificanddo se existe um usuário com o id enviado
    if (!user) {
      // retornando uma resposta em json
      return res.status(406).json({ Message: Erros.NOT_FOUND });
    }

    // capturando e armazenando os dados do corpo da requisição, caso não seja passado algum dado, a constante receberá o atributo do usuário pesquisado
    const {
      name = user.name,
      email = user.email,
      password = user.password,
      address = user.address,
      phone = user.phone,
    } = req.body;

    if (!validationEmail(email)) {
      return res.status(422).json({
        Message: Erros.INVALID_EMAIL,
      });
    }

    // verificando se o email passado e igual ao do usuário
    else if (!(user.email === email)) {
      // pesquisando um usuário por email, caso o email passado não seja o mesmo do usuário
      const emailExists = await usersRepository.findOne({ email });
      if (emailExists) {
        // se encontrar algo retorna um json de erro
        return res.status(409).json({ Message: Erros.USER_ALREADY_EXIST });
      }
    }

    const passwordCrypted = md5(password);

    // atualizando o usuário a partir do id
    await usersRepository.update(id, {
      name,
      email,
      password: passwordCrypted,
      phone,
      address,
    });

    // pesquisando o usuário pelo id
    user = await usersRepository.findOne({ id });

    // retornando o DTO do usuário atualizado
    return res
      .status(200)
      .json({ user: UserResponseDTO.responseUserDTO(user) });
  }

  // metodo assincrono para a deleção de usuários
  async delete(req: Request, res: Response) {
    // capturando e armazenando o id do usuário do parametro do URL
    const { id } = req.params;

    if (!id) {
      res.status(422).json({
        Message: Erros.ID_NOT_FOUND,
      });
    }

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

    // retornando os usuários encontrados no DB
    return res.status(200).json({ users });
  }
}

// exportando a classe
export { UserController };
