import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UserRoleResponseDTO } from "../models/DTO/userRole/UserRoleResponseDTO";
import { UserRoleRepository } from "../repositories/UserRoleRepository";

class UserRoleController {
  // metodo assincrono para a criação de user_roles
  async create(req: Request, res: Response, props?: any) {
    // capturando e armazenando os valores do corpo da requisição
    let { userID, roleID } = req.body;

    // verificando se o objeto props não está vazio
    if (Object.values(props).length !== 0) {
      // sobrescrevendo as variaveis com os valores de props
      [userID, roleID] = props;
    }

    // pegando o repositorio customizado/personalizado
    const userRolesRepository = getCustomRepository(UserRoleRepository);

    // pesquisando uma userRole pelo id do usuario e o id da role
    const userRoleExist = await userRolesRepository.findOne({ userID, roleID });

    // verificanddo se já existe a userRole
    if (userRoleExist) {
      // retornando uma resposta em json
      return res.status(400).json({
        error: "Usuário já possui esta role!",
      });
    }

    // criando a userRole
    const userRole = userRolesRepository.create({
      userID,
      roleID,
    });

    // salvando a userRole
    const userRoleSaved = await userRolesRepository.save(userRole);

    // verificando se o objeto props não está vazio
    if (Object.values(props).length !== 0) {
      // retornando a userRole
      return userRoleSaved;
    }
    // retornando a userRole
    return res.status(201).json({
      userRole: UserRoleResponseDTO.responseUserRoleDTO(userRoleSaved),
    });
  }

  // metodo assincrono para a pesquisa de userRoles pelo id
  async read(req: Request, res: Response) {
    // capturando e armazenando o id da role do parametro do URL
    const { id } = req.params;

    // pegando o repositorio customizado/personalizado
    const userRolesRepository = getCustomRepository(UserRoleRepository);

    // pesquisando uma userRole pelo id
    const userRole = await userRolesRepository.findOne(id);

    // verificando se a userRole não existe
    if (!userRole) {
      // retornando uma resposta de erro em json
      return res.status(406).json({
        error: "Nenhuma userRole encontrada!",
      });
    }

    // retornando a userRole pesquisada
    return res
      .status(200)
      .json({ userRole: UserRoleResponseDTO.responseUserRoleDTO(userRole) });
  }

  // metodo assincrono para a atualização dos dados das userRoles
  async update(req: Request, res: Response) {
    // capturando e armazenando o id da userRole do corpo da requisição
    const { id } = req.body;

    // pegando o repositorio customizado/personalizado
    const userRolesRepository = getCustomRepository(UserRoleRepository);

    // pesquisando uma userRole pelo id
    let userRole = await userRolesRepository.findOne(id);

    // verificando se a userRole não existe
    if (!userRole) {
      // retornando uma resposta de erro em json
      return res.status(406).json({
        error: "Nenhuma userRole encontrada!",
      });
    }

    // capturando o tipo de userRole passado no corpo da requisição, caso não seja passado nada, pega o valor que ja está cadastrado na userRole
    const { userID = userRole.userID, roleID = userRole.roleID } = req.body;

    // verificando se o roleID da userRole passado e igual ao da userRole sendo editada
    if (!(userRole.roleID === roleID)) {
      // pesquisando uma userRole pelo roleID
      const userRoleExists = await userRolesRepository.findOne(roleID);
      if (userRoleExists) {
        // se encontrar algo retorna um json de erro
        return res.status(400).json({ error: "UserRole já existe!" });
      }
    }

    // atualizando a userRole a partir do id
    await userRolesRepository.update(id, {
      userID,
      roleID,
    });

    // pesquisando a userRole pelo id
    userRole = await userRolesRepository.findOne(id);

    // retornando a userRole atualizada
    return res
      .status(200)
      .json({ userRole: UserRoleResponseDTO.responseUserRoleDTO(userRole) });
  }

  // metodo assincrono para a deleção de userRoles
  async delete(req: Request, res: Response) {
    // capturando e armazenando o id da userRole do parametro do URL
    const { id } = req.params;

    // pegando o repositorio customizado/personalizado
    const userRolesRepository = getCustomRepository(UserRoleRepository);

    // pesquisando uma userRole pelo id
    const userRole = await userRolesRepository.findOne({ id });

    // verificando se a userRole não existe
    if (!userRole) {
      // retornando uma resposta de erro em json
      return res.status(406).json({
        error: "Nenhuma userRole encontrada!",
      });
    }

    // deletando a userRole a partir do id
    await userRolesRepository.delete({ id });

    // retornando um json de sucesso
    return res.status(200).json({ message: "Sucesso!" });
  }

  // metodo assincrono para a listagem de todas as userRoles
  async show(req: Request, res: Response) {
    // pegando o repositorio customizado/personalizado
    const userRolesRepository = getCustomRepository(UserRoleRepository);

    // deletando rodas as userRoles do DB
    const userRoles = await userRolesRepository.find();

    // verificando se o DB possui userRoles cadastradas
    if (userRoles.length === 0) {
      // retornando uma resposta de erro em json
      return res.status(406).json({
        error: "Nenhuma userRole encontrada!",
      });
    }

    // retornando as userRoles encontradas no DB
    return res.status(200).json({ userRoles });
  }
}

// exportando a classe
export { UserRoleController };
