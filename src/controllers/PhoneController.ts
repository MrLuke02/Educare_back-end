import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import * as Erros from "../env/status";
import { PhoneResponseDTO } from "../models/DTO/phone/PhoneResponseDTO";
import { PhonesRepository } from "../repositories/PhoneRepository";
import { validationPhone } from "../util/user/UserUtil";

class PhoneController {
  // metodo assincrono para o cadastro de phones
  async create(req: Request, res: Response, propsPhone?: any) {
    // capturando e armazenando o numero de telefone e o id do usuário do corpo da requisição
    let { phoneNumber, userID } = req.body;

    if (Object.values(propsPhone).length !== 0) {
      // sobrescrevendo as variaveis com os valores de props
      [phoneNumber, userID] = propsPhone;
      // verificando se foi enviado o id do usuário e o numero de telefone
    } else if (!phoneNumber && !userID) {
      // retornando um json de erro perdonalizado
      return res.status(422).json({
        Message: Erros.REQUIRED_FIELD,
      });
    }

    if (!validationPhone(phoneNumber)) {
      // retornando um json de erro personalizado
      return res.status(422).json({
        Message: Erros.INVALID_PHONE,
      });
    }

    // pegando o repositorio customizado/personalizado
    const phoneRepository = getCustomRepository(PhonesRepository);

    // pesquisando um phone pelo numero
    const phoneExist = await phoneRepository.findOne({ phoneNumber });

    // verificanddo se já existe um phone com o numero enviado
    if (phoneExist) {
      // retornando uma resposta de erro em json
      return res.status(409).json({
        Message: Erros.PHONE_ALREADY_EXIST,
      });
    }

    // criando o phone
    const phone = phoneRepository.create({
      phoneNumber,
      userID,
    });

    // salvando o phone
    const phoneSaved = await phoneRepository.save(phone);

    // verificando se o objeto props não está vazio
    if (Object.values(propsPhone).length !== 0) {
      // retornando a userRole
      return phoneSaved;
    }

    // retornando a userRole
    return res.status(201).json({
      phone: PhoneResponseDTO.responsePhoneDTO(phoneSaved),
    });
  }

  // metodo assincrono para a pesquisa de phones pelo id do usuário
  async readFromUser(req: Request, res: Response, propsPhone?: any) {
    // capturando e armazenando o id do usuário do parametro da URL
    let { userID } = req.params;

    if (Object.values(propsPhone).length !== 0) {
      // sobrescrevendo as variaveis com os valores de props
      [userID] = propsPhone;
      // verificando se foi enviado o id do usuário e o numero de telefone
    }

    // pegando o repositorio customizado/personalizado
    const phoneRepository = getCustomRepository(PhonesRepository);

    // pesquisando um phone pelo id do usuário
    const phone = await phoneRepository.findOne({ userID });

    // verificando se o usuário não possui phones
    if (!phone) {
      // retornando uma resposta de erro em json
      return res.status(406).json({
        Message: Erros.NOT_FOUND,
      });
    }

    // verificando se o objeto props não está vazio
    if (Object.values(propsPhone).length !== 0) {
      // retornando a userRole
      return phone;
    }

    // retornando o DTO do(s) phone(s) pesquisado(s)
    return res.status(200).json({ phone });
  }

  // metodo assincrono para a pesquisa de phones pelo id
  async readFromId(req: Request, res: Response) {
    // capturando e armazenando o id do phone do parametro da URL
    const { id } = req.params;

    // pegando o repositorio customizado/personalizado
    const phoneRepository = getCustomRepository(PhonesRepository);

    // pesquisando um phone pelo id
    const phone = await phoneRepository.findOne({ id });

    // verificando se o phone não existe
    if (!phone) {
      // retornando uma resposta de erro em json
      return res.status(406).json({
        Message: Erros.NOT_FOUND,
      });
    }

    // retornando o DTO do phone pesquisado
    return res
      .status(200)
      .json({ phone: PhoneResponseDTO.responsePhoneDTO(phone) });
  }

  async readFromNumber(phoneNumber: string) {
    // pegando o repositorio customizado/personalizado
    const phoneRepository = getCustomRepository(PhonesRepository);

    // pesquisando um phone pelo numero
    const phoneExist = await phoneRepository.findOne({ phoneNumber });

    // retornando o DTO do(s) phone(s) pesquisado(s)
    return phoneExist;
  }

  // metodo assincrono para a atualização dos dados dos phones
  async update(req: Request, res: Response, propsPhone?: any) {
    // capturando e armazenando o id do phone do corpo da requisição
    let { id } = req.body;

    if (Object.values(propsPhone).length !== 0) {
      // sobrescrevendo as variaveis com os valores de props
      [id] = propsPhone;
      // verificando se o id foi enviado
    } else if (!id) {
      // retornando uma resposta de erro em json
      return res.status(422).json({
        Message: Erros.ID_NOT_FOUND,
      });
    }

    // pegando o repositorio customizado/personalizado
    const phoneRepository = getCustomRepository(PhonesRepository);

    // pesquisando um phone pelo id
    let phone = await phoneRepository.findOne(id);

    // verificando se o phone não existe
    if (!phone) {
      // retornando uma resposta de erro em json
      return res.status(406).json({
        Message: Erros.NOT_FOUND,
      });
    }

    // capturando o tipo numero de telefone e o id do usuário passado no corpo da requisição, caso não seja passado nada, pega o valor que ja está cadastrado no phone
    let { phoneNumber = phone.phoneNumber, userID = phone.userID } = req.body;

    if (!validationPhone(phoneNumber)) {
      // retornando um json de erro personalizado
      return res.status(422).json({
        Message: Erros.INVALID_PHONE,
      });
    }

    if (Object.values(propsPhone).length !== 0) {
      // sobrescrevendo as variaveis com os valores de props
      [id, phoneNumber, userID] = propsPhone;
      // verificando se foi enviado o id do usuário e o numero de telefone
    }

    // verificando se o numero de telefone passado e igual ao do phone sendo editado
    if (!(phone.phoneNumber === phoneNumber)) {
      // pesquisando um phone pelo numero
      const phoneExist = await phoneRepository.findOne({ phoneNumber });
      if (phoneExist) {
        // se encontrar algo retorna um json de erro
        return res.status(409).json({ Message: Erros.PHONE_ALREADY_EXIST });
      }
    }

    // atualizando o phone a partir do id
    await phoneRepository.update(id, {
      phoneNumber,
      userID,
    });

    // pesquisando o phone pelo id
    phone = await phoneRepository.findOne(id);

    // verificando se o objeto props não está vazio
    if (Object.values(propsPhone).length !== 0) {
      // retornando a userRole
      return phone;
    }

    // retornando o DTO do phone atualizado
    return res
      .status(200)
      .json({ phone: PhoneResponseDTO.responsePhoneDTO(phone) });
  }

  // metodo assincrono para a deleção de phones
  async delete(req: Request, res: Response) {
    // capturando e armazenando o id do phone do parametro da URL
    const { id } = req.params;

    // pegando o repositorio customizado/personalizado
    const phoneRepository = getCustomRepository(PhonesRepository);

    // pesquisando um phone pelo id
    const phone = await phoneRepository.findOne({ id });

    // verificando se o phone não existe
    if (!phone) {
      // retornando uma resposta de erro em json
      return res.status(406).json({
        Message: Erros.NOT_FOUND,
      });
    }

    // deletando o phone a partir do id
    await phoneRepository.delete({ id });

    // retornando um json de sucesso
    return res.status(200).json({ Message: Erros.SUCCESS });
  }

  // metodo assincrono para a listagem de todos os phones
  async show(req: Request, res: Response) {
    // pegando o repositorio customizado/personalizado
    const phoneRepository = getCustomRepository(PhonesRepository);

    // pesquisando todos os phones do DB
    const phones = await phoneRepository.find();

    // verificando se o DB possui phones cadastrados
    if (phones.length === 0) {
      // retornando uma resposta de erro em json
      return res.status(406).json({
        Message: Erros.NOT_FOUND,
      });
    }

    // retornando os phones encontrados no DB
    return res.status(200).json({ phones });
  }
}

// exportando a classe
export { PhoneController };
