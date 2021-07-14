import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";

import { Message } from "../env/message";
import { CompanyDTO } from "../models/DTOs/CompanyDTO";
import { CompaniesRepository } from "../repositories/CompanyRepository";
import * as validation from "../util/user/Validations";
import { CompanyAddressController } from "./CompanyAddressController";
import { CompanyContactController } from "./CompanyContactController";
import { RoleController } from "./RoleController";
import { UserController } from "./UserController";
import { UserRoleController } from "./UserRoleController";
import { CompanyContact } from "../models/CompanyContact";
import { AppError } from "../errors/AppErrors";

class CompanyController {
  async create(req: Request, res: Response) {
    const { companyName, cnpj, companyCategory, email, phone, userID } =
      req.body;

    if (!companyName || !cnpj || !companyCategory || !email || !phone) {
      throw new AppError(Message.REQUIRED_FIELD, 422);
    } else if (!userID) {
      throw new AppError(Message.ID_NOT_FOUND, 422);
    } else if (!validation.validationCnpj(cnpj)) {
      throw new AppError(Message.INVALID_CNPJ, 422);
    } else if (!validation.validationEmail(email)) {
      throw new AppError(Message.INVALID_EMAIL, 422);
    } else if (!validation.validationPhone(phone)) {
      throw new AppError(Message.INVALID_PHONE, 422);
    }

    const userController = new UserController();

    const user = await userController.readFromController(userID);

    if (!user) {
      throw new AppError(Message.USER_NOT_FOUND, 406);
    }

    const companyRepository = getCustomRepository(CompaniesRepository);

    const cnpjAlreadyExist = await companyRepository.findOne({ cnpj });

    if (cnpjAlreadyExist) {
      throw new AppError(Message.CNPJ_ALREADY_EXIST, 409);
    }

    const company = companyRepository.create({
      companyName,
      cnpj,
      companyCategory,
      userID,
    });

    // tipo padrão de usuário
    const type = "Company";

    const roleController = new RoleController();

    const role = await roleController.readFromType(type);

    if (!role) {
      throw new AppError(Message.ROLE_NOT_FOUND, 406);
    }

    const companyContactController = new CompanyContactController();

    const phoneExist = await companyContactController.readFromPhone(phone);

    if (phoneExist) {
      throw new AppError(Message.PHONE_ALREADY_EXIST, 409);
    }

    const emailExist = await companyContactController.readFromEmail(email);

    if (emailExist) {
      throw new AppError(Message.EMAIL_ALREADY_EXIST, 409);
    }

    const companySaved = await companyRepository.save(company);

    const userRoleController = new UserRoleController();

    const userRole = await userRoleController.readFromUserRole(userID, role.id);

    if (!userRole) {
      // criando e salvando a userRole
      await userRoleController.createFromController(userID, role.id);
    }

    const companyContactDTO =
      await companyContactController.createFromController(
        email,
        phone,
        companySaved.id
      );

    const companyDTO = {
      ...CompanyDTO.convertCompanyToDTO(companySaved),
      Contact: companyContactDTO,
    };

    return res.status(201).json({ Company: companyDTO });
  }

  async read(req: Request, res: Response) {
    const { cnpj } = req.params;

    if (!cnpj) {
      throw new AppError(Message.REQUIRED_FIELD, 422);
    }

    const companyRepository = getCustomRepository(CompaniesRepository);

    const company = await companyRepository.findOne({
      cnpj,
    });

    if (!company) {
      throw new AppError(Message.COMPANY_NOT_FOUND, 406);
    }

    return res
      .status(200)
      .json({ Company: CompanyDTO.convertCompanyToDTO(company) });
  }

  async update(req: Request, res: Response) {
    const { companyID } = req.body;

    // pegando o repositorio customizado/personalizado
    const companyRepository = getCustomRepository(CompaniesRepository);

    // pesquisando uma role pelo id
    let company = await companyRepository.findOne({ id: companyID });

    // verificando se a role não existe
    if (!company) {
      // retornando uma resposta de erro em json
      throw new AppError(Message.COMPANY_NOT_FOUND, 406);
    }

    const companyContactController = new CompanyContactController();

    const companyContact = await companyContactController.readFromCompany(
      companyID
    );

    if (!companyContact) {
      throw new AppError(Message.COMPANY_CONTACT_NOT_FOUND, 406);
    }

    // capturando o tipo de role passado no corpo da requisição, caso não seja passado nada, pega o valor que ja está cadastrado na role
    const {
      companyName = company.companyName,
      cnpj = company.cnpj,
      companyCategory = company.companyCategory,
      email = companyContact.email,
      phone = companyContact.phone,
    } = req.body;

    if (!validation.validationCnpj(cnpj)) {
      throw new AppError(Message.INVALID_CNPJ, 422);
    } else if (!validation.validationEmail(email)) {
      throw new AppError(Message.INVALID_EMAIL, 422);
    } else if (!validation.validationPhone(phone)) {
      throw new AppError(Message.INVALID_PHONE, 422);
    }

    if (email !== companyContact.email) {
      const emailExist = await companyContactController.readFromEmail(email);

      if (emailExist) {
        throw new AppError(Message.EMAIL_ALREADY_EXIST, 409);
      }
    }

    if (phone !== companyContact.phone) {
      const phoneExist = await companyContactController.readFromPhone(phone);

      if (phoneExist) {
        throw new AppError(Message.PHONE_ALREADY_EXIST, 409);
      }
    }

    if (company.cnpj !== cnpj) {
      // pesquisando uma userRole pelo roleID
      const cnpjExists = await companyRepository.findOne({ cnpj });
      if (cnpjExists) {
        // se encontrar algo retorna um json de erro
        throw new AppError(Message.CNPJ_ALREADY_EXIST, 409);
      }
    }

    const companyContactDTO =
      await companyContactController.updateFromController(
        companyContact.id,
        email,
        phone,
        company.id
      );

    // atualizando a role a partir do id
    await companyRepository.update(companyID, {
      companyName,
      cnpj,
      companyCategory,
    });

    // pesquisando a role pelo id
    company = await companyRepository.findOne({ id: companyID });

    const companyDTO = {
      ...CompanyDTO.convertCompanyToDTO(company),
      Contact: companyContactDTO,
    };

    // retornando o DTO da role atualizada
    return res.status(200).json({ Company: companyDTO });
  }

  async delete(req: Request, res: Response) {
    const { companyID } = req.params;

    const companyRepository = getCustomRepository(CompaniesRepository);

    const company = await companyRepository.findOne({ id: companyID });

    if (!company) {
      throw new AppError(Message.COMPANY_NOT_FOUND, 406);
    }

    const userID = company.userID;

    await companyRepository.delete({ id: companyID });

    const userHaveCompany = await companyRepository.findOne({ userID });

    if (!userHaveCompany) {
      const roleController = new RoleController();
      const userRoleController = new UserRoleController();
      const type = "Company";

      const role = await roleController.readFromType(type);

      if (!role) {
        throw new AppError(Message.ROLE_NOT_FOUND, 406);
      }

      const userRole = await userRoleController.readFromUserRole(
        userID,
        role.id
      );

      if (!userRole) {
        throw new AppError(Message.USER_ROLE_NOT_FOUND, 406);
      }

      const userRoleDeleted = await userRoleController.deleteFromController(
        userRole.id
      );

      if (!userRoleDeleted) {
        return res.status(200).json({ Message: Message.SUCCESS });
      }

      throw new AppError(Message.DELETE_USER_ROLE_ERROR, 500);
    } else {
      return res.status(200).json({ Message: Message.SUCCESS });
    }
  }

  async show(req: Request, res: Response) {
    const companyRepository = getCustomRepository(CompaniesRepository);

    const companies = await companyRepository.find();

    if (companies.length === 0) {
      throw new AppError(Message.NOT_FOUND, 406);
    }

    const companiesDTO = companies.map((company) => {
      return CompanyDTO.convertCompanyToDTO(company);
    });

    return res.status(200).json({
      Companies: companiesDTO,
    });
  }

  async readFromCategory(req: Request, res: Response) {
    const { companyCategory } = req.params;

    const companyRepository = getCustomRepository(CompaniesRepository);

    const companies = await companyRepository.find({
      companyCategory,
    });

    if (companies.length === 0) {
      throw new AppError(Message.NOT_FOUND, 406);
    }

    const companiesDTO = companies.map((company) => {
      return CompanyDTO.convertCompanyToDTO(company);
    });

    return res.status(200).json({ Companies: companiesDTO });
  }

  async readCompaniesUser(userID: string) {
    const companyRepository = getCustomRepository(CompaniesRepository);

    const companies = await companyRepository.find({ userID });

    if (companies.length > 0) {
      const companyAddressController = new CompanyAddressController();

      const companyContactController = new CompanyContactController();

      const companiesDTO = [];

      for (const company of companies) {
        const companyAddressDTO =
          await companyAddressController.readFromCompany(company.id);

        const companyContactDTO =
          await companyContactController.readFromCompany(company.id);

        let companyDTO = CompanyDTO.convertCompanyToDTO(company) as Object;

        companyDTO = {
          ...companyDTO,
          Address: companyAddressDTO || Message.ADDRESS_NOT_FOUND,
          Contact: companyContactDTO || Message.COMPANY_CONTACT_NOT_FOUND,
        };

        companiesDTO.push(companyDTO);
      }

      return companiesDTO;
    } else {
      return companies;
    }
  }

  async readFromID(req: Request, res: Response) {
    let { companyID } = req.params;

    const companyRepository = getCustomRepository(CompaniesRepository);

    const company = await companyRepository.findOne({ id: companyID });

    if (!company) {
      throw new AppError(Message.COMPANY_NOT_FOUND, 406);
    }

    return res
      .status(200)
      .json({ Company: CompanyDTO.convertCompanyToDTO(company) });
  }

  async readCompanyAddress(req: Request, res: Response) {
    const { companyID } = req.params;

    const companyAddressController = new CompanyAddressController();

    const companyAddressDTO = await companyAddressController.readFromCompany(
      companyID
    );

    if (!companyAddressDTO) {
      throw new AppError(Message.ADDRESS_NOT_FOUND, 406);
    }

    return res.status(200).json({
      CompanyAddress: companyAddressDTO,
    });
  }

  async readCompanyContact(req: Request, res: Response) {
    const { companyID } = req.params;

    const companyContactController = new CompanyContactController();

    const companyContactDTO = await companyContactController.readFromCompany(
      companyID
    );

    if (!companyContactDTO) {
      throw new AppError(Message.COMPANY_CONTACT_NOT_FOUND, 406);
    }

    return res.status(200).json({
      CompanyContact: companyContactDTO,
    });
  }

  async readCompanyFromID(companyID: string) {
    const companyRepository = getCustomRepository(CompaniesRepository);

    const company = await companyRepository.findOne({ id: companyID });

    return company;
  }

  async readAllFromCompany(req: Request, res: Response) {
    const { companyID } = req.params;

    const companyRepository = getCustomRepository(CompaniesRepository);

    const company = await companyRepository.findOne({ id: companyID });

    if (!company) {
      throw new AppError(Message.COMPANY_NOT_FOUND, 406);
    }

    const companyAddressController = new CompanyAddressController();

    const companyContactController = new CompanyContactController();

    const companyAddressDTO = await companyAddressController.readFromCompany(
      companyID
    );
    const companyContactDTO = await companyContactController.readFromCompany(
      companyID
    );

    let companyDTO = CompanyDTO.convertCompanyToDTO(company) as Object;

    companyDTO = {
      ...companyDTO,
      Address: companyAddressDTO || Message.ADDRESS_NOT_FOUND,
      Contact: companyContactDTO || Message.COMPANY_CONTACT_NOT_FOUND,
    };

    return res.status(200).json({ Company: companyDTO });
  }
}

export { CompanyController };
