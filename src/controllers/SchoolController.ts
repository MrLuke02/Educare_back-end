import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { Message } from "../env/message";
import { AppError } from "../errors/AppErrors";
import { CompanyDTO } from "../models/DTOs/CompanyDTO";
import { CompaniesRepository } from "../repositories/CompanyRepository";
import { SchoolsRepository } from "../repositories/SchoolRepository";
import * as validation from "../util/user/Validations";
import { CompanyAddressController } from "./CompanyAddressController";
import { CompanyContactController } from "./CompanyContactController";
import { RoleController } from "./RoleController";
import { UserController } from "./UserController";
import { UserRoleController } from "./UserRoleController";

class SchoolController {
  async create(req: Request, res: Response) {
    const { name, cnpj, principalEmail } = req.body;

    if (!cnpj || !name || !principalEmail) {
      throw new AppError(Message.REQUIRED_FIELD, 400);
    } else if (!validation.validationCnpj(cnpj)) {
      throw new AppError(Message.INVALID_CNPJ, 400);
    }

    const userController = new UserController();

    const user = await userController.readFromEmail(principalEmail);

    if (!user) {
      throw new AppError(Message.USER_NOT_FOUND, 404);
    }

    const schoolRepository = getCustomRepository(SchoolsRepository);

    const userHaveSchool = await schoolRepository.findOne({ userID: user.id });

    if (userHaveSchool) {
      throw new AppError(Message.USER_ALREADY_IS_SCHOOL_OWNER, 403);
    }

    const cnpjAlreadyExist = await schoolRepository.findOne({ cnpj });

    if (cnpjAlreadyExist) {
      throw new AppError(Message.CNPJ_ALREADY_EXIST, 409);
    }

    const school = schoolRepository.create({
      name,
      cnpj,
      userID: user.id,
    });

    // tipo padrão de usuário
    const type = "School";

    const roleController = new RoleController();

    const role = await roleController.readFromType(type);

    if (!role) {
      throw new AppError(Message.ROLE_NOT_FOUND, 404);
    }

    const userRoleController = new UserRoleController();

    const userRole = await userRoleController.readFromUserRole(
      user.id,
      role.id
    );

    if (!userRole) {
      // criando e salvando a userRole
      await userRoleController.createFromController(user.id, role.id);
    }

    await schoolRepository.save(school);

    return res.status(201).json({ School: school });
  }

  async read(req: Request, res: Response) {
    const { cnpj } = req.query;

    if (!cnpj) {
      throw new AppError(Message.REQUIRED_FIELD, 400);
    } else if (!validation.validationCnpj(cnpj as string)) {
      throw new AppError(Message.INVALID_CNPJ, 400);
    }

    const schoolRepository = getCustomRepository(SchoolsRepository);

    const school = await schoolRepository.findOne({
      cnpj: cnpj as string,
    });

    if (!school) {
      throw new AppError(Message.SCHOOL_NOT_FOUND, 404);
    }

    return res.status(200).json({ School: school });
  }

  async update(req: Request, res: Response) {
    const { schoolID } = req.body;

    // pegando o repositorio customizado/personalizado
    const schoolRepository = getCustomRepository(SchoolsRepository);

    // pesquisando uma role pelo id
    let school = await schoolRepository.findOne({ id: schoolID });

    // verificando se a role não existe
    if (!school) {
      // retornando uma resposta de erro em json
      throw new AppError(Message.SCHOOL_NOT_FOUND, 404);
    }

    // capturando o tipo de role passado no corpo da requisição, caso não seja passado nada, pega o valor que ja está cadastrado na role
    const { name = school.name, cnpj = school.cnpj } = req.body;

    if (!validation.validationCnpj(cnpj)) {
      throw new AppError(Message.INVALID_CNPJ, 400);
    }

    if (school.cnpj !== cnpj) {
      // pesquisando uma userRole pelo roleID
      const cnpjExists = await schoolRepository.findOne({ cnpj });
      if (cnpjExists) {
        // se encontrar algo retorna um json de erro
        throw new AppError(Message.CNPJ_ALREADY_EXIST, 409);
      }
    }

    // atualizando a role a partir do id
    await schoolRepository.update(schoolID, {
      name,
      cnpj,
    });

    Object.assign(school, {
      name,
      cnpj,
    });

    // retornando o DTO da role atualizada
    return res.status(200).json({ School: school });
  }

  async delete(req: Request, res: Response) {
    const { schoolID } = req.params;

    const schoolRepository = getCustomRepository(SchoolsRepository);

    const school = await schoolRepository.findOne({ id: schoolID });

    if (!school) {
      throw new AppError(Message.COMPANY_NOT_FOUND, 404);
    }

    await schoolRepository.delete({ id: schoolID });

    const roleController = new RoleController();
    const userRoleController = new UserRoleController();

    const type = "School";

    const role = await roleController.readFromType(type);

    if (!role) {
      throw new AppError(Message.ROLE_NOT_FOUND, 404);
    }

    const userRole = await userRoleController.readFromUserRole(
      school.userID,
      role.id
    );

    await userRoleController.deleteFromController(userRole.id);

    return res.status(200).json({ Message: Message.SUCCESS });
  }

  async show(req: Request, res: Response) {
    const schoolRepository = getCustomRepository(SchoolsRepository);

    const schools = await schoolRepository.find();

    if (schools.length === 0) {
      throw new AppError(Message.NOT_FOUND, 404);
    }

    return res.status(200).json({
      Schools: schools,
    });
  }

  async readFromID(req: Request, res: Response) {
    let { schoolID } = req.params;

    const schoolRepository = getCustomRepository(SchoolsRepository);

    const school = await schoolRepository.findOne({ id: schoolID });

    if (!school) {
      throw new AppError(Message.COMPANY_NOT_FOUND, 404);
    }

    return res.status(200).json({ School: school });
  }

  // async readCompanyAddress(req: Request, res: Response) {
  //   const { companyID } = req.params;

  //   const companyAddressController = new CompanyAddressController();

  //   const companyAddressDTO = await companyAddressController.readFromCompany(
  //     companyID
  //   );

  //   if (!companyAddressDTO) {
  //     throw new AppError(Message.ADDRESS_NOT_FOUND, 404);
  //   }

  //   return res.status(200).json({
  //     CompanyAddress: companyAddressDTO,
  //   });
  // }

  // async readCompanyContact(req: Request, res: Response) {
  //   const { companyID } = req.params;

  //   const companyContactController = new CompanyContactController();

  //   const companyContactDTO = await companyContactController.readFromCompany(
  //     companyID
  //   );

  //   if (!companyContactDTO) {
  //     throw new AppError(Message.COMPANY_CONTACT_NOT_FOUND, 404);
  //   }

  //   return res.status(200).json({
  //     CompanyContact: companyContactDTO,
  //   });
  // }

  // async readCompanyFromID(companyID: string) {
  //   const companyRepository = getCustomRepository(CompaniesRepository);

  //   const company = await companyRepository.findOne({ id: companyID });

  //   return company;
  // }

  // async readAllFromCompany(req: Request, res: Response) {
  //   const { companyID } = req.params;

  //   const companyRepository = getCustomRepository(CompaniesRepository);

  //   const company = await companyRepository.findOne({ id: companyID });

  //   if (!company) {
  //     throw new AppError(Message.COMPANY_NOT_FOUND, 404);
  //   }

  //   const companyAddressController = new CompanyAddressController();

  //   const companyContactController = new CompanyContactController();

  //   const companyAddressDTO = await companyAddressController.readFromCompany(
  //     companyID
  //   );
  //   const companyContactDTO = await companyContactController.readFromCompany(
  //     companyID
  //   );

  //   let companyDTO = CompanyDTO.convertCompanyToDTO(company) as Object;

  //   companyDTO = {
  //     ...companyDTO,
  //     Address: companyAddressDTO || Message.ADDRESS_NOT_FOUND,
  //     Contact: companyContactDTO || Message.COMPANY_CONTACT_NOT_FOUND,
  //   };

  //   return res.status(200).json({ Company: companyDTO });
  // }
}

export { SchoolController };
