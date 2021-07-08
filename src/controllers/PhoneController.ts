import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { Status } from "../env/status";
import { PhoneDTO } from "../models/DTOs/PhoneDTO";
import { PhonesRepository } from "../repositories/PhoneRepository";
import * as validation from "../util/user/Validations";
import { UserController } from "./UserController";

class PhoneController {
  // metodo assincrono para o cadastro de phones
  async create(req: Request, res: Response) {
    // capturando e armazenando o numero de telefone e o id do usuário do corpo da requisição
    const { phoneNumber, userID } = req.body;

    if (!phoneNumber || !userID) {
      // retornando um json de erro perdonalizado
      return res.status(422).json({
        Message: Status.REQUIRED_FIELD,
      });
    }

    if (!validation.validationPhone(phoneNumber)) {
      // retornando um json de erro personalizado
      return res.status(422).json({
        Message: Status.INVALID_PHONE,
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
        Message: Status.PHONE_ALREADY_EXIST,
      });
    }

    const userController = new UserController();

    const user = await userController.readFromController(userID);

    if (!user) {
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
    }

    const userAlreadyHavePhone = await phoneRepository.find({ userID });

    if (userAlreadyHavePhone.length > 1) {
      return res.status(409).json({
        Message: Status.USER_ALREADY_HAVE_PHONE,
      });
    }

    // criando o phone
    const phone = phoneRepository.create({
      phoneNumber,
      userID,
    });

    // salvando o phone
    const phoneSaved = await phoneRepository.save(phone);

    // retornando a userRole
    return res.status(201).json({
      Phone: PhoneDTO.convertPhoneToDTO(phoneSaved),
    });
  }

  async createFromController(phoneNumber: string, userID: string) {
    // pegando o repositorio customizado/personalizado
    const phoneRepository = getCustomRepository(PhonesRepository);

    // criando o phone
    const phone = phoneRepository.create({
      phoneNumber,
      userID,
    });

    // salvando o phone
    const phoneSaved = await phoneRepository.save(phone);

    const phoneDTO = PhoneDTO.convertPhoneToDTO(phoneSaved);

    // retornando a userRole
    return phoneDTO;
  }

  // metodo assincrono para a pesquisa de phones pelo id
  async read(req: Request, res: Response) {
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
        Message: Status.NOT_FOUND,
      });
    }

    // retornando o DTO do phone pesquisado
    return res.status(200).json({ Phone: PhoneDTO.convertPhoneToDTO(phone) });
  }

  // metodo assincrono para a atualização dos dados dos phones
  async update(req: Request, res: Response) {
    // capturando e armazenando o id do phone do corpo da requisição
    const { id } = req.body;

    if (!id) {
      // retornando uma resposta de erro em json
      return res.status(422).json({
        Message: Status.ID_NOT_FOUND,
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
        Message: Status.NOT_FOUND,
      });
    }

    // capturando o tipo numero de telefone e o id do usuário passado no corpo da requisição, caso não seja passado nada, pega o valor que ja está cadastrado no phone
    const { phoneNumber = phone.phoneNumber } = req.body;

    if (!validation.validationPhone(phoneNumber)) {
      // retornando um json de erro personalizado
      return res.status(422).json({
        Message: Status.INVALID_PHONE,
      });
    }

    // verificando se o numero de telefone passado e igual ao do phone sendo editado
    if (phone.phoneNumber !== phoneNumber) {
      // pesquisando um phone pelo numero
      const phoneExist = await phoneRepository.findOne({ phoneNumber });
      if (phoneExist) {
        // se encontrar algo retorna um json de erro
        return res.status(409).json({ Message: Status.PHONE_ALREADY_EXIST });
      }
    }

    // atualizando o phone a partir do id
    await phoneRepository.update(id, {
      phoneNumber,
    });

    // pesquisando o phone pelo id
    phone = await phoneRepository.findOne(id);

    // retornando o DTO do phone atualizado
    return res.status(200).json({ Phone: PhoneDTO.convertPhoneToDTO(phone) });
  }

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
        Message: Status.NOT_FOUND,
      });
    }

    await phoneRepository.delete(id);

    // retornando o DTO do phone pesquisado
    return res.status(200).json({ Message: Status.SUCCESS });
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
        Message: Status.NOT_FOUND,
      });
    }

    const phonesDTO = phones.map((phone) => {
      return PhoneDTO.convertPhoneToDTO(phone);
    });

    // retornando os phones encontrados no DB
    return res.status(200).json({ Phones: phonesDTO });
  }

  // metodo assincrono para a pesquisa de phones pelo id do usuário
  async readFromUser(userID: string) {
    // pegando o repositorio customizado/personalizado
    const phoneRepository = getCustomRepository(PhonesRepository);

    // pesquisando um phone pelo id do usuário
    const phones = await phoneRepository.find({ userID });

    let phonesDTO = [];

    if (phones.length > 0) {
      phonesDTO = phones.map((phone) => {
        return PhoneDTO.convertPhoneToDTO(phone);
      });
    }

    // retornando o DTO do(s) phone(s) pesquisado(s)
    return phonesDTO;
  }

  async readFromId(phoneID: string) {
    // pegando o repositorio customizado/personalizado
    const phoneRepository = getCustomRepository(PhonesRepository);

    // pesquisando um phone pelo id
    const phone = await phoneRepository.findOne({ id: phoneID });

    // retornando o DTO do phone pesquisado
    return phone;
  }

  async readFromNumber(phoneNumber: string) {
    // pegando o repositorio customizado/personalizado
    const phoneRepository = getCustomRepository(PhonesRepository);

    // pesquisando um phone pelo numero
    const phoneExist = await phoneRepository.findOne({ phoneNumber });

    // retornando o DTO do(s) phone(s) pesquisado(s)
    return phoneExist;
  }
}

// exportando a classe
export { PhoneController };
