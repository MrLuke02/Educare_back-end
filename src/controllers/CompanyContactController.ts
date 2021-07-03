import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { Status } from "../env/status";
import { CompanyContactDTO } from "../models/DTOs/CompanyContactDTO";
import { CompanyContactRepository } from "../repositories/CompanyContactRepository";
import * as validation from "../util/user/Validations";
import { CompanyController } from "./CompanyController";

class CompanyContactController {
  async create(req: Request, res: Response) {
    const { email, phone, companyID } = req.body;

    if (!email || !phone || !companyID) {
      return res.status(422).json({ Message: Status.REQUIRED_FIELD });
    } else if (!validation.validationEmail(email)) {
      return res.status(422).json({ Message: Status.INVALID_EMAIL });
    } else if (!validation.validationPhone(phone)) {
      return res.status(422).json({ Message: Status.INVALID_PHONE });
    }

    const companyContactRepository = getCustomRepository(
      CompanyContactRepository
    );

    const emailExist = await companyContactRepository.findOne({ email });

    if (emailExist) {
      return res.status(409).json({
        Message: Status.EMAIL_ALREADY_EXIST,
      });
    }

    const phoneExist = await companyContactRepository.findOne({ phone });

    if (phoneExist) {
      return res.status(409).json({
        Message: Status.PHONE_ALREADY_EXIST,
      });
    }

    const companyController = new CompanyController();

    const companyExists = await companyController.readCompanyFromID(companyID);

    if (!companyExists) {
      return res.status(422).json({
        Message: Status.INVALID_ID,
      });
    }

    const companyAlreadyHavePhone = await companyContactRepository.findOne({
      companyID,
    });

    if (companyAlreadyHavePhone) {
      return res.status(409).json({
        Message: Status.COMPANY_ALREADY_HAVE_PHONE,
      });
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
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
    }

    return res.status(200).json({
      CompanyContact:
        CompanyContactDTO.convertCompanyContactToDTO(companyContact),
    });
  }

  async update(req: Request, res: Response) {
    const { id } = req.body;

    if (!id) {
      // retornando um json de erro personalizado
      return res.status(422).json({
        Message: Status.ID_NOT_FOUND,
      });
    }

    const companyContactRepository = getCustomRepository(
      CompanyContactRepository
    );

    let companyContact = await companyContactRepository.findOne(id);

    if (!companyContact) {
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
    }

    const { email = companyContact.email, phone = companyContact.phone } =
      req.body;

    if (email !== companyContact.email) {
      const emailExist = await companyContactRepository.findOne(email);

      if (emailExist) {
        return res.status(409).json({
          Message: Status.EMAIL_ALREADY_EXIST,
        });
      }
    }
    if (phone !== companyContact.phone) {
      const phoneExist = await companyContactRepository.findOne(phone);

      if (phoneExist) {
        return res.status(409).json({
          Message: Status.PHONE_ALREADY_EXIST,
        });
      }
    }
    if (!validation.validationEmail(email)) {
      return res.status(422).json({ Message: Status.INVALID_EMAIL });
    } else if (!validation.validationPhone(phone)) {
      return res.status(422).json({ Message: Status.INVALID_PHONE });
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
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
    }

    await companyContactRepository.delete(id);

    return res.status(200).json({ Message: Status.SUCCESS });
  }

  async show(req: Request, res: Response) {
    const companyContactRepository = getCustomRepository(
      CompanyContactRepository
    );

    const companyContacts = await companyContactRepository.find();

    if (companyContacts.length === 0) {
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
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

    let companyContactDTO: Object;

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

    const company = companyAddress_company.map((company) => {
      return company.company;
    });

    return company[0];
  }
}

export { CompanyContactController };
