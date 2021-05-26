import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { Status } from "../env/status";
import { CompaniesRepository } from "../repositories/CompanyRepository";
import { CompanyResponseDTO } from "../models/DTO/company/CompanyResponseDTO";
import { UserController } from "./UserController";
import { RoleController } from "./RoleController";
import { UserRoleController } from "./UserRoleController";
import * as validation from "../util/user/UserUtil";
import { CompanyContactController } from "./CompanyContactController";
import { CompanyContactResponseDTO } from "../models/DTO/companyContact/CompanyContactResponseDTO";

class CompanyController {
  async create(req: Request, res: Response) {
    const { companyName, cnpj, inscricaoEstadual, email, phone, userID } =
      req.body;

    if (!companyName || !cnpj || !inscricaoEstadual || !email || !phone) {
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

    const ieAlreadyExist = await companyRepository.findOne({
      inscricaoEstadual,
    });

    if (cnpjAlreadyExist) {
      return res.status(409).json({
        Message: Status.CNPJ_ALREADY_EXIST,
      });
    } else if (ieAlreadyExist) {
      return res.status(409).json({
        Message: Status.IE_ALREADY_EXIST,
      });
    }

    const company = companyRepository.create({
      companyName,
      cnpj,
      inscricaoEstadual,
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

    const companySaved = await companyRepository.save(company);

    const userRoleController = new UserRoleController();

    const userRole = await userRoleController.readFromUserRole(userID, role.id);

    if (!userRole) {
      // criando o array props com o id do usuário e da role
      const propsRole = [userID, role["id"]];

      // criando e salvando a userRole
      await userRoleController.create(req, res, propsRole);
    }

    const companyContact = await companyContactController.createFromController(
      email,
      phone,
      companySaved.id
    );

    const companyDTO = CompanyResponseDTO.responseCompanyDTO(companySaved);
    companyDTO["contact"] =
      CompanyContactResponseDTO.responseCompanyContactDTO(companyContact);

    return res.status(201).json({ company: companyDTO });
  }

  async read(req: Request, res: Response) {
    const { cnpj, inscricaoEstadual } = req.body;

    if (!cnpj || !inscricaoEstadual) {
      return res.status(422).json({
        Message: Status.REQUIRED_FIELD,
      });
    }

    const companyRepository = getCustomRepository(CompaniesRepository);

    const company = await companyRepository.findOne({
      cnpj,
      inscricaoEstadual,
    });

    if (!company) {
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
    }

    return res
      .status(200)
      .json({ company: CompanyResponseDTO.responseCompanyDTO(company) });
  }

  async readFromID(req: Request, res: Response, propsCompany?: any) {
    let { id } = req.params;

    if (Object.values(propsCompany).length !== 0) {
      // sobrescrevendo as variaveis com os valores de props
      [id] = propsCompany;
      // verificando se foi enviado o id do usuário e o numero de telefone
    } else if (!id) {
      return res.status(406).json({
        Message: Status.ID_NOT_FOUND,
      });
    }

    const companyRepository = getCustomRepository(CompaniesRepository);

    const company = await companyRepository.findOne({ id });

    if (!company) {
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
    }

    // verificando se o objeto props não está vazio
    if (Object.values(propsCompany).length !== 0) {
      // retornando a userRole
      return company;
    }

    return res
      .status(200)
      .json({ company: CompanyResponseDTO.responseCompanyDTO(company) });
  }

  async update(req: Request, res: Response) {
    const { id } = req.body;

    // verificando se o id da role não foi passada
    if (!id) {
      // retornando um json de erro personalizado
      return res.status(422).json({
        Message: Status.ID_NOT_FOUND,
      });
    }

    // pegando o repositorio customizado/personalizado
    const companyRepository = getCustomRepository(CompaniesRepository);

    // pesquisando uma role pelo id
    let company = await companyRepository.findOne(id);

    // verificando se a role não existe
    if (!company) {
      // retornando uma resposta de erro em json
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
    }

    const companyContactController = new CompanyContactController();

    let companyContact = await companyContactController.readFromCompany(id);

    if (!companyContact) {
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
    }

    // capturando o tipo de role passado no corpo da requisição, caso não seja passado nada, pega o valor que ja está cadastrado na role
    const {
      companyName = company.companyName,
      cnpj = company.cnpj,
      inscricaoEstadual = company.inscricaoEstadual,
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

    if (company.inscricaoEstadual !== inscricaoEstadual) {
      const inscricaoEstadualExists = await companyRepository.findOne({
        inscricaoEstadual,
      });
      if (inscricaoEstadualExists) {
        // se encontrar algo retorna um json de erro
        return res.status(409).json({ Message: Status.IE_ALREADY_EXIST });
      }
    }

    companyContact = await companyContactController.updateFromController(
      companyContact.id,
      email,
      phone,
      company.id
    );

    if (!companyContact) {
      return res.status(422).json({ Message: Status.INVALID_ID });
    }

    // atualizando a role a partir do id
    await companyRepository.update(id, {
      companyName,
      cnpj,
      inscricaoEstadual,
    });

    // pesquisando a role pelo id
    company = await companyRepository.findOne(id);
    company["contact"] =
      CompanyContactResponseDTO.responseCompanyContactDTO(companyContact);

    // retornando o DTO da role atualizada
    return res
      .status(200)
      .json({ company: CompanyResponseDTO.responseCompanyDTO(company) });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const companyRepository = getCustomRepository(CompaniesRepository);

    const company = await companyRepository.findOne({ id });

    if (!company) {
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
    }

    const userID = company.userID;

    await companyRepository.delete({ id });

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

      const propsUserRole = [userRole.id];

      const userRoleDeleted = await userRoleController.delete(
        req,
        res,
        propsUserRole
      );

      if (userRoleDeleted !== res) {
        return res.status(200).json({ Message: Status.SUCCESS });
      }
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
      return CompanyResponseDTO.responseCompanyDTO(company);
    });

    return res.status(200).json({
      companies: companiesDTO,
    });
  }
}

export { CompanyController };
