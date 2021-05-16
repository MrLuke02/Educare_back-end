import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import * as Erros from "../env/status";
import { AddressRepository } from "../repositories/AddressRepository";
import { AddressResponseDTO } from "../models/DTO/address/AddressResponseDTO";

class AddressController {
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
      userID,
    } = req.body;

    const addressRepository = getCustomRepository(AddressRepository);

    const addressExist = await addressRepository.findOne({ userID });

    if (addressExist) {
      // retornando um json de erro personalizado
      return res.status(409).json({
        Message: Erros.USER_ADDRESS_ALREADY_EXIST,
      });
    } else if (
      !street ||
      !houseNumber ||
      !bairro ||
      !state ||
      !city ||
      !cep ||
      !userID
    ) {
      // retornando um json de erro personalizado
      return res.status(422).json({ Message: Erros.REQUIRED_FIELD });
    }

    const address = addressRepository.create({
      street,
      houseNumber,
      bairro,
      state,
      city,
      cep,
      referencePoint,
      complement,
      userID,
    });

    addressRepository.save(address);

    return res.status(201).json(AddressResponseDTO.responsePhoneDTO(address));
  }

  async read(req: Request, res: Response) {
    const { id } = req.params;

    const addressRepository = getCustomRepository(AddressRepository);

    const address = await addressRepository.findOne(id);

    if (!address) {
      return res.status(406).json({
        Message: Erros.NOT_FOUND,
      });
    }

    return res.status(200).json(AddressResponseDTO.responsePhoneDTO(address));
  }

  async readFromUser(req: Request, res: Response) {
    const { userID } = req.params;

    const addressRepository = getCustomRepository(AddressRepository);

    const address = await addressRepository.findOne({ userID });

    if (!address) {
      return res.status(406).json({
        Message: Erros.NOT_FOUND,
      });
    }

    return res.status(200).json(AddressResponseDTO.responsePhoneDTO(address));
  }

  async update(req: Request, res: Response) {
    const { id } = req.body;

    const addressRepository = getCustomRepository(AddressRepository);

    let address = await addressRepository.findOne(id);

    if (!address) {
      return res.status(406).json({
        Message: Erros.NOT_FOUND,
      });
    }

    const {
      street = address.street,
      houseNumber = address.houseNumber,
      bairro = address.bairro,
      state = address.state,
      city = address.city,
      cep = address.cep,
      referencePoint = address.referencePoint,
      complement = address.complement,
      userID = address.userID,
    } = req.body;

    addressRepository.update(id, {
      street,
      houseNumber,
      bairro,
      state,
      city,
      cep,
      referencePoint,
      complement,
      userID,
    });

    address = await addressRepository.findOne(id);

    return res.status(200).json(AddressResponseDTO.responsePhoneDTO(address));
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const addressRepository = getCustomRepository(AddressRepository);

    const address = await addressRepository.findOne(id);

    if (!address) {
      return res.status(406).json({
        Message: Erros.NOT_FOUND,
      });
    }

    await addressRepository.delete({ id });

    return res.status(200).json({ Message: "Sucesso!" });
  }

  async show(req: Request, res: Response) {
    const addressRepository = getCustomRepository(AddressRepository);

    const addresses = await addressRepository.find();

    if (addresses.length == 0) {
      return res.status(406).json({
        Message: Erros.NOT_FOUND,
      });
    }

    const address = addresses.map((address) => {
      return AddressResponseDTO.responsePhoneDTO(address);
    });

    return res.status(200).json({ addresses: address });
  }
}

export { AddressController };
