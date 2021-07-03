import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { Status } from "../env/status";
import { CompanyDTO } from "../models/DTOs/CompanyDTO";
import { CompaniesRepository } from "../repositories/CompanyRepository";
import * as validation from "../util/user/Validations";
import { CompanyAddressController } from "./CompanyAddressController";
import { CompanyContactController } from "./CompanyContactController";
import { RoleController } from "./RoleController";
import { UserController } from "./UserController";
import { UserRoleController } from "./UserRoleController";
import { CompanyContact } from "../models/CompanyContact";

class CompanyController {
  async create(req: Request, res: Response) {
    const { companyName, cnpj, companyCategory, email, phone, userID } =
      req.body;

    if (!companyName || !cnpj || !companyCategory || !email || !phone) {
      return res.status(422).json({
        Message: Status.REQUIRED_FIELD,
      });
    } else if (!userID) {
      return res.status(422).json({
        Message: Status.ID_NOT_FOUND,
      });
    } else if (!validation.validationCnpj(cnpj)) {
      return res.status(422).json({
        Message: Status.INVALID_CNPJ,
      });
    } else if (!validation.validationEmail(email)) {
      return res.status(422).json({ Message: Status.INVALID_EMAIL });
    } else if (!validation.validationPhone(phone)) {
      return res.status(422).json({ Message: Status.INVALID_PHONE });
    }

    const userController = new UserController();

    const user = await userController.readFromId(userID);

    if (!user) {
      return res.status(406).json({
        Message: Status.USER_NOT_FOUND,
      });
    }

    const companyRepository = getCustomRepository(CompaniesRepository);

    const cnpjAlreadyExist = await companyRepository.findOne({ cnpj });

    if (cnpjAlreadyExist) {
      return res.status(409).json({
        Message: Status.CNPJ_ALREADY_EXIST,
      });
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
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
    }

    const companyContactController = new CompanyContactController();

    const phoneExist = await companyContactController.readFromPhone(phone);

    if (phoneExist) {
      return res.status(409).json({
        Message: Status.PHONE_ALREADY_EXIST,
      });
    }

    const emailExist = await companyContactController.readFromEmail(email);

    if (emailExist) {
      return res.status(409).json({
        Message: Status.EMAIL_ALREADY_EXIST,
      });
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
      return res.status(422).json({
        Message: Status.REQUIRED_FIELD,
      });
    }

    const companyRepository = getCustomRepository(CompaniesRepository);

    const company = await companyRepository.findOne({
      cnpj,
    });

    if (!company) {
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
    }

    return res
      .status(200)
      .json({ Company: CompanyDTO.convertCompanyToDTO(company) });
  }

  async update(req: Request, res: Response) {
    const { companyID } = req.body;

    // verificando se o id da role não foi passada
    if (!companyID) {
      // retornando um json de erro personalizado
      return res.status(422).json({
        Message: Status.ID_NOT_FOUND,
      });
    }

    // pegando o repositorio customizado/personalizado
    const companyRepository = getCustomRepository(CompaniesRepository);

    // pesquisando uma role pelo id
    let company = await companyRepository.findOne({ id: companyID });

    // verificando se a role não existe
    if (!company) {
      // retornando uma resposta de erro em json
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
    }

    const companyContactController = new CompanyContactController();

    const companyContact = (await companyContactController.readFromCompany(
      companyID
    )) as CompanyContact;

    if (!companyContact) {
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
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
      return res.status(422).json({
        Message: Status.INVALID_CNPJ,
      });
    } else if (!validation.validationEmail(email)) {
      return res.status(422).json({ Message: Status.INVALID_EMAIL });
    } else if (!validation.validationPhone(phone)) {
      return res.status(422).json({ Message: Status.INVALID_PHONE });
    }

    if (email !== companyContact.email) {
      const emailExist = await companyContactController.readFromEmail(email);

      if (emailExist) {
        return res.status(409).json({
          Message: Status.EMAIL_ALREADY_EXIST,
        });
      }
    }

    if (phone !== companyContact.phone) {
      const phoneExist = await companyContactController.readFromPhone(phone);

      if (phoneExist) {
        return res.status(409).json({
          Message: Status.PHONE_ALREADY_EXIST,
        });
      }
    }

    if (company.cnpj !== cnpj) {
      // pesquisando uma userRole pelo roleID
      const cnpjExists = await companyRepository.findOne({ cnpj });
      if (cnpjExists) {
        // se encontrar algo retorna um json de erro
        return res.status(409).json({ Message: Status.CNPJ_ALREADY_EXIST });
      }
    }

    const companyContactDTO =
      await companyContactController.updateFromController(
        companyContact.id,
        email,
        phone,
        company.id
      );

    if (!companyContact) {
      return res.status(422).json({ Message: Status.INVALID_ID });
    }

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
    const { comapanyID } = req.params;

    const companyRepository = getCustomRepository(CompaniesRepository);

    const company = await companyRepository.findOne({ id: comapanyID });

    if (!company) {
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
    }

    const userID = company.userID;

    await companyRepository.delete({ id: comapanyID });

    const userHaveCompany = await companyRepository.findOne({ userID });

    if (!userHaveCompany) {
      const roleController = new RoleController();
      const userRoleController = new UserRoleController();
      const type = "Company";

      const role = await roleController.readFromType(type);

      if (!role) {
        return res.status(406).json({
          Message: Status.NOT_FOUND,
        });
      }

      const userRole = await userRoleController.readFromUserRole(
        userID,
        role.id
      );

      if (!userRole) {
        return res.status(406).json({
          Message: Status.NOT_FOUND,
        });
      }

      await userRoleController.deleteFromController(userRole.id);

      return res.status(200).json({ Message: Status.SUCCESS });
    } else {
      return res.status(200).json({ Message: Status.SUCCESS });
    }
  }

  async show(req: Request, res: Response) {
    const companyRepository = getCustomRepository(CompaniesRepository);

    const companies = await companyRepository.find();

    if (companies.length === 0) {
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
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

    if (!companyCategory) {
      return res.status(422).json({
        Message: Status.REQUIRED_FIELD,
      });
    }

    const companyRepository = getCustomRepository(CompaniesRepository);

    const companies = await companyRepository.find({
      companyCategory,
    });

    if (companies.length === 0) {
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
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
          Address: !companyAddressDTO ? Status.NOT_FOUND : companyAddressDTO,
          Contact: !companyContactDTO ? Status.NOT_FOUND : companyContactDTO,
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

    if (!companyID) {
      return res.status(406).json({
        Message: Status.ID_NOT_FOUND,
      });
    }

    const companyRepository = getCustomRepository(CompaniesRepository);

    const company = await companyRepository.findOne({ id: companyID });

    if (!company) {
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
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
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
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
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
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
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
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
      Address: !companyAddressDTO ? Status.NOT_FOUND : companyAddressDTO,
      Contact: !companyContactDTO ? Status.NOT_FOUND : companyContactDTO,
    };

    return res.status(200).json({ Company: companyDTO });
  }
}

export { CompanyController };
