import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";

import { Message } from "../env/message";
import { AppError } from "../errors/AppErrors";
import { AddressDTO } from "../models/DTOs/AddressDTO";
import { CompanyAddressDTO } from "../models/DTOs/CompanyAddressDTO";
import { CompanyAddressRepository } from "../repositories/CompanyAddressRepository";
import { CompanyController } from "./CompanyController";

class CompanyAddressController {
  async create(req: Request, res: Response) {
    const {
      street,
      houseNumber,
      bairro,
      state,
      city,
      cep,
      referencePoint,
      complement,
      companyID,
    } = req.body;

    const companyAddressRepository = getCustomRepository(
      CompanyAddressRepository
    );

    const companyController = new CompanyController();

    const companyExists = await companyController.readCompanyFromID(companyID);

    if (!companyExists) {
      throw new AppError(Message.COMPANY_NOT_FOUND, 406);
    }

    const companyAddressExist = await companyAddressRepository.findOne({
      companyID,
    });

    if (companyAddressExist) {
      // retornando um json de erro personalizado
      throw new AppError(Message.COMPANY_ADDRESS_ALREADY_EXIST, 409);
    } else if (
      !street ||
      !houseNumber ||
      !bairro ||
      !state ||
      !city ||
      !cep ||
      !companyID
    ) {
      // retornando um json de erro personalizado
      throw new AppError(Message.REQUIRED_FIELD, 422);
    }

    const companyAddress = companyAddressRepository.create({
      street,
      houseNumber,
      bairro,
      state,
      city,
      cep,
      referencePoint,
      complement,
      companyID,
    });

    const companyAddressSaved = await companyAddressRepository.save(
      companyAddress
    );

    return res.status(201).json({
      CompanyAddress:
        CompanyAddressDTO.convertCompanyAddressToDTO(companyAddressSaved),
    });
  }

  async read(req: Request, res: Response) {
    const { id } = req.params;

    const companyAddressRepository = getCustomRepository(
      CompanyAddressRepository
    );

    const companyAddress = await companyAddressRepository.findOne(id);

    if (!companyAddress) {
      throw new AppError(Message.ADDRESS_NOT_FOUND, 406);
    }

    return res.status(200).json({
      CompanyAddress:
        CompanyAddressDTO.convertCompanyAddressToDTO(companyAddress),
    });
  }

  async update(req: Request, res: Response) {
    const { id } = req.body;

    const companyAddressRepository = getCustomRepository(
      CompanyAddressRepository
    );

    let companyAddress = await companyAddressRepository.findOne(id);

    if (!companyAddress) {
      throw new AppError(Message.ADDRESS_NOT_FOUND, 406);
    }

    const {
      street = companyAddress.street,
      houseNumber = companyAddress.houseNumber,
      bairro = companyAddress.bairro,
      state = companyAddress.state,
      city = companyAddress.city,
      cep = companyAddress.cep,
      referencePoint = companyAddress.referencePoint,
      complement = companyAddress.complement,
    } = req.body;

    await companyAddressRepository.update(id, {
      street,
      houseNumber,
      bairro,
      state,
      city,
      cep,
      referencePoint,
      complement,
    });

    companyAddress = await companyAddressRepository.findOne(id);

    return res.status(200).json({
      CompanyAddress:
        CompanyAddressDTO.convertCompanyAddressToDTO(companyAddress),
    });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const companyAddressRepository = getCustomRepository(
      CompanyAddressRepository
    );

    const companyAddress = await companyAddressRepository.findOne(id);

    if (!companyAddress) {
      throw new AppError(Message.ADDRESS_NOT_FOUND, 406);
    }

    await companyAddressRepository.delete({ id });

    return res.status(200).json({ Message: "Sucesso!" });
  }

  async show(req: Request, res: Response) {
    const addressRepository = getCustomRepository(CompanyAddressRepository);

    const companyAddresses = await addressRepository.find();

    if (companyAddresses.length == 0) {
      throw new AppError(Message.NOT_FOUND, 406);
    }

    const companyAddressesDTO = companyAddresses.map((companyAddress) => {
      return CompanyAddressDTO.convertCompanyAddressToDTO(companyAddress);
    });

    return res.status(200).json({ CompanyAddresses: companyAddressesDTO });
  }

  async readFromAddress(addressID: string) {
    const companyAddressRepository = getCustomRepository(
      CompanyAddressRepository
    );

    const companyAddress_company = await companyAddressRepository.find({
      // select -> o que quero de retorno
      // where -> condição
      // relations -> para trazer também as informações da tabela que se relaciona
      select: ["id"],
      where: { id: addressID },
      relations: ["company"],
    });

    const company = companyAddress_company.map((company) => {
      return company.company;
    });

    return company[0];
  }

  async readFromCompany(companyID: string) {
    const companyAddressRepository = getCustomRepository(
      CompanyAddressRepository
    );

    const companyAddress = await companyAddressRepository.findOne({
      companyID,
    });

    let companyAddressDTO: AddressDTO;

    if (companyAddress) {
      companyAddressDTO =
        CompanyAddressDTO.convertCompanyAddressToDTO(companyAddress);
    }

    return companyAddressDTO;
  }
}

export { CompanyAddressController };
