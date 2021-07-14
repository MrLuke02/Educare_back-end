import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";

import { Message } from "../env/message";
import { AppError } from "../errors/AppErrors";
import { RoleDTO } from "../models/DTOs/RoleDTO";
import { RolesRepository } from "../repositories/RolesRepository";

class RoleController {
  // metodo assincrono para o cadastro de roles
  async create(req: Request, res: Response) {
    // capturando e armazenando o tipo de role do corpo da requisição
    const { type } = req.body;

    // verificando se não foi passado o tipo de role
    if (!type) {
      // retornando um json de erro personalizado
      throw new AppError(Message.REQUIRED_FIELD, 422);
    }

    // pegando o repositorio customizado/personalizado
    const rolesRepository = getCustomRepository(RolesRepository);

    // pesquisando uma role pelo type
    const roleExist = await rolesRepository.findOne({ type });

    // verificanddo se já existe uma role com o type enviado
    if (roleExist) {
      // retornando uma resposta de erro em json
      throw new AppError(Message.ROLE_ALREADY_EXIST, 409);
    }

    // criando o role
    const role = rolesRepository.create({
      type,
    });

    // salvando a role
    const roleSaved = await rolesRepository.save(role);

    // retornando o DTO da role salva
    return res.status(201).json({ Role: RoleDTO.convertRoleToDTO(roleSaved) });
  }

  // metodo assincrono para a pesquisa de roles pelo id
  async read(req: Request, res: Response) {
    // capturando e armazenando o id da role do parametro do URL
    const { id } = req.params;

    // pegando o repositorio customizado/personalizado
    const rolesRepository = getCustomRepository(RolesRepository);

    // pesquisando uma role pelo id
    const role = await rolesRepository.findOne(id);

    // verificando se a role não existe
    if (!role) {
      // retornando uma resposta de erro em json
      throw new AppError(Message.ROLE_NOT_FOUND, 406);
    }

    // retornando o DTO da role pesquisada
    return res.status(200).json({ Role: RoleDTO.convertRoleToDTO(role) });
  }

  // metodo assincrono para a atualização dos dados das roles
  async update(req: Request, res: Response) {
    // capturando e armazenando o id da role do corpo da requisição
    const { id } = req.body;

    // verificando se o id da role não foi passada
    if (!id) {
      // retornando um json de erro personalizado
      throw new AppError(Message.ID_NOT_FOUND, 422);
    }

    // pegando o repositorio customizado/personalizado
    const rolesRepository = getCustomRepository(RolesRepository);

    // pesquisando uma role pelo id
    let role = await rolesRepository.findOne(id);

    // verificando se a role não existe
    if (!role) {
      // retornando uma resposta de erro em json
      throw new AppError(Message.ROLE_NOT_FOUND, 406);
    }

    // capturando o tipo de role passado no corpo da requisição, caso não seja passado nada, pega o valor que ja está cadastrado na role
    const { type = role.type } = req.body;

    // verificando se o tipo de role passado e igual ao da role sendo editada
    if (!(role.type === type)) {
      // pesquisando uma role pelo type
      const roleExists = await rolesRepository.findOne({ type });
      if (roleExists) {
        // se encontrar algo retorna um json de erro
        throw new AppError(Message.ROLE_ALREADY_EXIST, 409);
      }
    }

    // atualizando a role a partir do id
    await rolesRepository.update(id, {
      type,
    });

    // pesquisando a role pelo id
    role = await rolesRepository.findOne(id);

    // retornando o DTO da role atualizada
    return res.status(200).json({ Role: RoleDTO.convertRoleToDTO(role) });
  }

  // metodo assincrono para a deleção de roles
  async delete(req: Request, res: Response) {
    // capturando e armazenando o id da role do parametro do URL
    const { id } = req.params;

    // pegando o repositorio customizado/personalizado
    const rolesRepository = getCustomRepository(RolesRepository);

    // pesquisando uma role pelo id
    const role = await rolesRepository.findOne({ id });

    // verificando se a role não existe
    if (!role) {
      // retornando uma resposta de erro em json
      throw new AppError(Message.ROLE_NOT_FOUND, 406);
    }

    // deletando a role a partir do id
    await rolesRepository.delete({ id });

    // retornando um json de sucesso
    return res.status(200).json({ Message: Message.SUCCESS });
  }

  // metodo assincrono para a listagem de todas as roles
  async show(req: Request, res: Response) {
    // pegando o repositorio customizado/personalizado
    const rolesRepository = getCustomRepository(RolesRepository);

    // pesquisando todas as roles do DB
    const roles = await rolesRepository.find();

    // verificando se o DB possui roles cadastradas
    if (roles.length === 0) {
      // retornando uma resposta de erro em json
      throw new AppError(Message.NOT_FOUND, 406);
    }

    const rolesDTO = roles.map((role) => {
      return RoleDTO.convertRoleToDTO(role);
    });

    // retornando as roles encontradas no DB
    return res.status(200).json({ Roles: rolesDTO });
  }

  async readFromType(type: string) {
    // pegando o repositorio customizado/personalizado
    const rolesRepository = getCustomRepository(RolesRepository);

    // pesquisando uma role pelo id
    const role = await rolesRepository.findOne({ type });

    // retornando o DTO da role pesquisada
    return role;
  }

  async readFromId(id: string) {
    // pegando o repositorio customizado/personalizado
    const rolesRepository = getCustomRepository(RolesRepository);

    // pesquisando uma role pelo id
    const role = await rolesRepository.findOne({ id });

    const roleDTO = RoleDTO.convertRoleToDTO(role);

    // retornando o DTO da role pesquisada
    return roleDTO;
  }
}

// exportando a classe
export { RoleController };
