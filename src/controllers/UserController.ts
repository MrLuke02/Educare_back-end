import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UserRepository";

class UserController {
  // metodo asincrono para o cadastro de usuários
  async create(req: Request, res: Response) {
    // capturando e armazenando os dados do corpo da requisição em constantes
    const { name, email, password, phone, address, isAdm } = req.body;

    // obtendo o repositório customizado atraves do getCustomRepository, e armazenando na constante
    const usersRepository = getCustomRepository(UsersRepository);

    // pesquisando um usuário pelo email e armazenando na constante
    const userAlreadyExists = await usersRepository.findOne({ email });

    // ferificando se a pesquisa a cima encrontrou algum usuário
    if (userAlreadyExists) {
      // se tiver encontrado, retorne um json de usuário já existe
      return res.status(400).json({
        error: "Usuário já existe!",
      });
    }

    // criando o usuario
    const user = usersRepository.create({
      name,
      email,
      password,
      phone,
      address,
      isAdm,
    });

    // salvando o usuario criado a cima
    await usersRepository.save(user);

    // retornando um json do usuário salvo
    return res.json(user);
  }

  // metodo asincrono para o login de usuário
  async read(req: Request, res: Response) {
    // capturando e armazenando os dados do corpo da requisição em constantes
    const { email, password } = req.body;

    // obtendo o repositório customizado atraves do getCustomRepository, e armazenando na constante
    const usersRepository = getCustomRepository(UsersRepository);

    // pesquisando um usuário pelo email e senha
    const user = await usersRepository.findOne({ email, password });

    // ferificando se a pesquisa a cima não retornou algum usuário
    if (!user) {
      // se não tiver encontrado nada, retorna um json de Nenhum usuário encontrado
      return res.status(400).json({
        error: "Nenhum usuario encontrado!",
      });
    }

    // retorna um json do usuario encontrado
    return res.json(user);
  }

  // metodo asincrono para a edição do usuário
  async update(req: Request, res: Response) {
    // recebendo o id do usuario passado no corpo da requisição
    const { id } = req.body;

    // obtendo o repositório customizado atraves do getCustomRepository, e armazenando na constante
    const usersRepository = getCustomRepository(UsersRepository);

    // pesquisando um usuário pelo id
    let user = await usersRepository.findOne({
      id,
    });

    // verificando se a pesquisa a cima não retornou algum usuário
    if (!user) {
      // se não tiver encontrado nada, retorna um json de nenhum usuário não encontrado
      return res.status(400).json({
        error: "Nenhum usuario encontrado!",
      });
    }

    // capturando e armazenando os dados necessários para a edição do usuário do corpo da requisição
    // caso não seja passado algum dos seguintes parametros, as constantes receberão os dados do usuário pesquisado anteriormente
    const {
      name = user.name,
      email = user.email,
      password = user.password,
      address = user.address,
      isAdm = user.isAdm,
      phone = user.phone,
    } = req.body;

    // atualizando o usuário de acordo com o id
    await usersRepository.update(id, {
      name,
      email,
      password,
      address,
      isAdm,
      phone,
    });

    // pesquisando novamente um usuário pelo id
    user = await usersRepository.findOne({ id });

    // retornando um json do usuário da pesquisa acima
    return res.json(user);
  }

  // metodo asincrono para a deleção do usuário
  async delete(req: Request, res: Response) {
    // recebendo o id do usuario passado no corpo da requisição
    const { id } = req.params;

    // obtendo o repositório customizado atraves do getCustomRepository, e armazenando na constante
    const usersRepository = getCustomRepository(UsersRepository);

    // pesquisando um usuário pelo id
    const userExist = await usersRepository.findOne({
      id,
    });

    // verificando se a pesquisa a cima não retornou algum usuário
    if (!userExist) {
      // se não tiver encontrado nada, retorna um json de nehum usuário não encontrado
      return res.json({
        error: "Nenhum usuário não encontrado!",
      });
    }

    // deletando o usuário pelo id
    usersRepository.delete({ id });

    // retornando um json de sucesso
    return res.json({
      message: "Sucesso!",
    });
  }
}

export { UserController };
