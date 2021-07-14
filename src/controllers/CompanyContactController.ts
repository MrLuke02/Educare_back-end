import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";

import { Message } from "../env/message";
import { AppError } from "../errors/AppErrors";
import { CompanyContactDTO } from "../models/DTOs/CompanyContactDTO";
import { CompanyContactRepository } from "../repositories/CompanyContactRepository";
import * as validation from "../util/user/Validations";
import { CompanyController } from "./CompanyController";

class CompanyContactController {
  async create(req: Request, res: Response) {
    const { email, phone, companyID } = req.body;

    if (!email || !phone || !companyID) {
      throw new AppError(Message.REQUIRED_FIELD, 244);
    } else if (!validation.validationEmail(email)) {
      throw new AppError(Message.INVALID_EMAIL, 422);
    } else if (!validation.validationPhone(phone)) {
      throw new AppError(Message.INVALID_PHONE, 422);
    }

    const companyContactRepository = getCustomRepository(
      CompanyContactRepository
    );

    const emailExist = await companyContactRepository.findOne({ email });

    if (emailExist) {
      throw new AppError(Message.EMAIL_ALREADY_EXIST, 409);
    }

    const phoneExist = await companyContactRepository.findOne({ phone });

    if (phoneExist) {
      throw new AppError(Message.PHONE_ALREADY_EXIST, 409);
    }

    const companyController = new CompanyController();

    const companyExists = await companyController.readCompanyFromID(companyID);

    if (!companyExists) {
      throw new AppError(Message.COMPANY_NOT_FOUND, 406);
    }

    const companyAlreadyHavePhone = await companyContactRepository.findOne({
      companyID,
    });

    if (companyAlreadyHavePhone) {
      throw new AppError(Message.COMPANY_ALREADY_HAVE_PHONE, 409);
    }

    const companyContact = companyContactRepository.create({
      email,
      phone,
      companyID,
    });

    const companyContactSaved = await companyContactRepository.save(
      companyContact
    );

    return res.status(201).json({
      CompanyContact:
        CompanyContactDTO.convertCompanyContactToDTO(companyContactSaved),
    });
  }

  async createFromController(email: string, phone: string, companyID: string) {
    const companyContactRepository = getCustomRepository(
      CompanyContactRepository
    );

    const companyContact = companyContactRepository.create({
      email,
      phone,
      companyID,
    });

    const companyContactSaved = await companyContactRepository.save(
      companyContact
    );

    const companyContactDTO =
      CompanyContactDTO.convertCompanyContactToDTO(companyContactSaved);

    return companyContactDTO;
  }

  async read(req: Request, res: Response) {
    const { id } = req.params;

    const companyContactRepository = getCustomRepository(
      CompanyContactRepository
    );

    const companyContact = await companyContactRepository.findOne(id);

    if (!companyContact) {
      throw new AppError(Message.COMPANY_CONTACT_NOT_FOUND, 406);
    }

    return res.status(200).json({
      CompanyContact:
        CompanyContactDTO.convertCompanyContactToDTO(companyContact),
    });
  }

  async update(req: Request, res: Response) {
    const { id } = req.body;

    const companyContactRepository = getCustomRepository(
      CompanyContactRepository
    );

    let companyContact = await companyContactRepository.findOne(id);

    if (!companyContact) {
      throw new AppError(Message.COMPANY_CONTACT_NOT_FOUND, 406);
    }

    const { email = companyContact.email, phone = companyContact.phone } =
      req.body;

    if (email !== companyContact.email) {
      const emailExist = await companyContactRepository.findOne(email);

      if (emailExist) {
        throw new AppError(Message.EMAIL_ALREADY_EXIST, 409);
      }
    }
    if (phone !== companyContact.phone) {
      const phoneExist = await companyContactRepository.findOne(phone);

      if (phoneExist) {
        throw new AppError(Message.PHONE_ALREADY_EXIST, 409);
      }
    }
    if (!validation.validationEmail(email)) {
      throw new AppError(Message.INVALID_EMAIL, 422);
    } else if (!validation.validationPhone(phone)) {
      throw new AppError(Message.INVALID_PHONE, 422);
    }

    await companyContactRepository.update(id, {
      email,
      phone,
    });

    companyContact = await companyContactRepository.findOne(id);

    return res.status(200).json({
      CompanyContact:
        CompanyContactDTO.convertCompanyContactToDTO(companyContact),
    });
  }

  async updateFromController(
    id: string,
    email: string,
    phone: string,
    companyID: string
  ) {
    const companyContactRepository = getCustomRepository(
      CompanyContactRepository
    );

    let companyContact = await companyContactRepository.findOne(id);

    if (!companyContact) {
      return companyContact;
    }

    await companyContactRepository.update(id, {
      email,
      phone,
      companyID,
    });

    companyContact = await companyContactRepository.findOne(id);

    const companyContactDTO =
      CompanyContactDTO.convertCompanyContactToDTO(companyContact);

    return companyContactDTO;
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const companyContactRepository = getCustomRepository(
      CompanyContactRepository
    );

    const companyContact = await companyContactRepository.findOne(id);

    if (!companyContact) {
      throw new AppError(Message.COMPANY_CONTACT_NOT_FOUND, 406);
    }

    await companyContactRepository.delete(id);

    return res.status(200).json({ Message: Message.SUCCESS });
  }

  async show(req: Request, res: Response) {
    const companyContactRepository = getCustomRepository(
      CompanyContactRepository
    );

    const companyContacts = await companyContactRepository.find();

    if (companyContacts.length === 0) {
      throw new AppError(Message.NOT_FOUND, 406);
    }

    const companyContactsDTO = companyContacts.map((companyContact) => {
      return CompanyContactDTO.convertCompanyContactToDTO(companyContact);
    });

    return res.status(200).json({ CompanyContacts: companyContactsDTO });
  }

  async readFromPhone(phone: string) {
    // pegando o repositorio customizado/personalizado
    const companyContactRepository = getCustomRepository(
      CompanyContactRepository
    );

    // pesquisando um phone pelo numero
    const phoneExist = await companyContactRepository.findOne({ phone });

    // retornando o DTO do(s) phone(s) pesquisado(s)
    return phoneExist;
  }

  async readFromCompany(companyID: string) {
    // pegando o repositorio customizado/personalizado
    const companyContactRepository = getCustomRepository(
      CompanyContactRepository
    );

    // pesquisando um phone pelo numero
    const companyContact = await companyContactRepository.findOne({
      companyID,
    });

    let companyContactDTO: CompanyContactDTO;

    if (companyContact) {
      companyContactDTO =
        CompanyContactDTO.convertCompanyContactToDTO(companyContact);
    }

    // retornando o DTO do(s) phone(s) pesquisado(s)
    return companyContactDTO;
  }

  async readFromEmail(email: string) {
    // pegando o repositorio customizado/personalizado
    const companyContactRepository = getCustomRepository(
      CompanyContactRepository
    );

    // pesquisando um phone pelo numero
    const emailExist = await companyContactRepository.findOne({
      email,
    });

    // retornando o DTO do(s) phone(s) pesquisado(s)
    return emailExist;
  }

  async readFromContact(contactID: string) {
    const companyContactRepository = getCustomRepository(
      CompanyContactRepository
    );

    const companyAddress_company = await companyContactRepository.find({
      // select -> o que quero de retorno
      // where -> condição
      // relations -> para trazer também as informações da tabela que se relaciona
      select: ["id"],
      where: { id: contactID },
      relations: ["company"],
    });

    const company = companyAddress_company.map((companyContact) => {
      return companyContact.company;
    });

    return company[0];
  }
}

export { CompanyContactController };
