import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UserRepository";

class UserController {
  // metodo assincrono para o cadastro de usuários
  async create(req: Request, res: Response) {
    // capturando e armazenando os dados do corpo da requisição
    const { name, email, password, phone, address, isAdm } = req.body;

    // pegando o repositorio customizado/personalizado
    const usersRepository = getCustomRepository(UsersRepository);

    // pesquisando um usuário pelo email
    const userAlreadyExists = await usersRepository.findOne({ email });

    // verificanddo se já existe um usuário com o email enviado
    if (userAlreadyExists) {
      // retornando uma resposta em json
      return res.status(400).json({
        error: "Usuário já existe!",
      });
    }

    // criando o usuário
    const user = usersRepository.create({
      name,
      email,
      password,
      phone,
      address,
      isAdm,
    });

    // savando o usuário criado a cima
    await usersRepository.save(user);

    // retornando o usuario salvo
    return res.json(user);
  }

  // metodo assincrono para a autenticação de usuários
  async read(req: Request, res: Response) {
    // capturando e armazenando os dados do corpo da requisição
    const { email, password } = req.body;

    // pegando o repositorio customizado/personalizado
    const usersRepository = getCustomRepository(UsersRepository);

    // pesquisando um usuário pelo email e senha
    const user = await usersRepository.findOne({ email, password });

    // verificanddo se existe um usuário com o email e senha enviados
    if (!user) {
      // retornando uma resposta em json
      return res.status(400).json({
        error: "Nenhum usuario encontrado!",
      });
    }

    // retornando o usuario pesquisado a cima
    return res.json(user);
  }

  // metodo assincrono para a atualização de usuários
  async update(req: Request, res: Response) {
    // capturando e armazenando o id do corpo da requisição
    const { id } = req.body;

    // pegando o repositorio customizado/personalizado
    const usersRepository = getCustomRepository(UsersRepository);

    // pesquisando um usuário pelo id
    let user = await usersRepository.findOne({
      id,
    });

    // verificanddo se existe um usuário com o id enviado
    if (!user) {
      // retornando uma resposta em json
      return res.status(400).json("Nenhum usuário encontrado!");
    }

    // capturando e armazenando os dados do corpo da requisição, caso não seja passado algum dado, a constante receberá o atributo do usuário pesquisado
    const {
      name = user.name,
      email = user.email,
      password = user.password,
      address = user.address,
      isAdm = user.isAdm,
      phone = user.phone,
    } = req.body;

    // atualizando o usuário a partir do id
    await usersRepository.update(id, {
      name,
      email,
      password,
      address,
      isAdm,
      phone,
    });

    // pesquisando o usuário pelo id
    user = await usersRepository.findOne({ id });

    // retornando o usuário atualizado
    return res.json(user);
  }

  // metodo assincrono para a deleção de usuários
  async delete(req: Request, res: Response) {
    // capturando e armazenando o id do parametro do URL
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
      return res.json({
        message: "Nenhum usuário encontrado!",
      });
    }

    // deletando o usuário a partir do id
    usersRepository.delete({ id });

    // retornando um json de sucesso
    return res.json({
      message: "Sucesso!",
    });
  }
}

// esportando a classe
export { UserController };
