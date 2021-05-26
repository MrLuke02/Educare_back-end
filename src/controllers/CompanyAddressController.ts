import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { Status } from "../env/status";
import { CompanyAddressRepository } from "../repositories/CompanyAddressRepository";
import { CompanyAddressResponseDTO } from "../models/DTO/companyAddress/CompanyAddressResponseDTO";
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

    const propsCompany = [companyID];

    const company = await companyController.readFromID(req, res, propsCompany);

    if (company !== res) {
      const companyAddressExist = await companyAddressRepository.findOne({
        companyID,
      });

      if (companyAddressExist) {
        // retornando um json de erro personalizado
        return res.status(409).json({
          Message: Status.COMPANY_ADDRESS_ALREADY_EXIST,
        });
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
        return res.status(422).json({ Message: Status.REQUIRED_FIELD });
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
        companyAddress:
          CompanyAddressResponseDTO.responseCompanyAddressDTO(
            companyAddressSaved
          ),
      });
    }
  }

  async read(req: Request, res: Response, propsComapnyAddress?: any) {
    let { id } = req.params;

    if (Object.values(propsComapnyAddress).length !== 0) {
      // sobrescrevendo as variaveis com os valores de props
      [id] = propsComapnyAddress;
      // verificando se foi enviado o id do usuário e o numero de telefone
    }

    const companyAddressRepository = getCustomRepository(
      CompanyAddressRepository
    );

    const companyAddress = await companyAddressRepository.findOne(id);

    if (!companyAddress) {
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
    }

    if (Object.values(propsComapnyAddress).length !== 0) {
      // sobrescrevendo as variaveis com os valores de props
      return companyAddress;
      // verificando se foi enviado o id do usuário e o numero de telefone
    }

    return res.status(200).json({
      companyAddress:
        CompanyAddressResponseDTO.responseCompanyAddressDTO(companyAddress),
    });
  }

  async readFromCompany(req: Request, res: Response) {
    const { companyID } = req.params;

    const companyAddressRepository = getCustomRepository(
      CompanyAddressRepository
    );

    const companyAddress = await companyAddressRepository.findOne({
      companyID,
    });

    if (!companyAddress) {
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
    }

    return res.status(200).json({
      companyAddress:
        CompanyAddressResponseDTO.responseCompanyAddressDTO(companyAddress),
    });
  }

  async update(req: Request, res: Response) {
    const { id } = req.body;

    const companyAddressRepository = getCustomRepository(
      CompanyAddressRepository
    );

    let companyAddress = await companyAddressRepository.findOne(id);

    if (!companyAddress) {
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
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
      companyID = companyAddress.companyID,
    } = req.body;

    if (companyID !== companyAddress.companyID) {
      // retornando um json de erro personalizado
      return res.status(422).json({
        Message: Status.INVALID_ID,
      });
    }

    companyAddressRepository.update(id, {
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

    companyAddress = await companyAddressRepository.findOne(id);

    return res.status(200).json({
      companyAddress:
        CompanyAddressResponseDTO.responseCompanyAddressDTO(companyAddress),
    });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const companyAddressRepository = getCustomRepository(
      CompanyAddressRepository
    );

    const companyAddress = await companyAddressRepository.findOne(id);

    if (!companyAddress) {
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
    }

    await companyAddressRepository.delete({ id });

    return res.status(200).json({ Message: "Sucesso!" });
  }

  async show(req: Request, res: Response) {
    const addressRepository = getCustomRepository(CompanyAddressRepository);

    const companyAddresses = await addressRepository.find();

    if (companyAddresses.length == 0) {
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
    }

    const companyAddressesDTO = companyAddresses.map((companyAddress) => {
      return CompanyAddressResponseDTO.responseCompanyAddressDTO(
        companyAddress
      );
    });

    return res.status(200).json({ companyAddresses: companyAddressesDTO });
  }
}

export { CompanyAddressController };
