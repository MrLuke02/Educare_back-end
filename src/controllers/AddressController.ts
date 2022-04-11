import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { Message } from "../env/message";
import { AppError } from "../errors/AppErrors";
import { AddressDTO } from "../models/DTOs/AddressDTO";
import { AddressRepository } from "../repositories/AddressRepository";
import { UserController } from "./UserController";

class AddressController {
  async create(req: Request, res: Response) {
    const {
      street,
      houseNumber,
      bairro,
      state,
      city,
      cep,
      complement,
      userID,
    } = req.body;

    const addressRepository = getCustomRepository(AddressRepository);

    const addressExist = await addressRepository.findOne({ userID });

    if (addressExist) {
      // retornando um json de erro personalizado
      throw new AppError(Message.USER_ADDRESS_ALREADY_EXIST, 409);
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
      throw new AppError(Message.REQUIRED_FIELD, 400);
    }

    const userController = new UserController();

    const user = await userController.readFromController(userID);

    if (!user) {
      throw new AppError(Message.USER_NOT_FOUND, 404);
    }

    const address = addressRepository.create({
      street,
      houseNumber,
      bairro,
      state,
      city,
      cep,
      complement,
      userID,
    });

    const addressSaved = await addressRepository.save(address);

    return res
      .status(201)
      .json({ Address: AddressDTO.convertAddressToDTO(addressSaved) });
  }

  async createOrUpdateFromController(
    street: string,
    houseNumber: string,
    bairro: string,
    state: string,
    city: string,
    cep: string,
    complement: string,
    userID: string
  ) {
    const userController = new UserController();

    const user = await userController.readFromController(userID);

    if (!user) {
      throw new AppError(Message.USER_NOT_FOUND, 404);
    }

    const addressRepository = getCustomRepository(AddressRepository);

    const addressExist = await addressRepository.findOne({ userID });

    let address = {};

    if (addressExist) {
      await addressRepository.update(addressExist.id, {
        street,
        houseNumber,
        bairro,
        state,
        city,
        cep,
        complement,
      });

      Object.assign(address, {
        street,
        houseNumber,
        bairro,
        state,
        city,
        cep,
        complement,
      });
    } else {
      address = addressRepository.create({
        street,
        houseNumber,
        bairro,
        state,
        city,
        cep,
        complement,
        userID,
      });

      address = await addressRepository.save(address);
    }

    return address;
  }

  async read(req: Request, res: Response) {
    const { id } = req.params;

    const addressRepository = getCustomRepository(AddressRepository);

    const address = await addressRepository.findOne({ id });

    if (!address) {
      throw new AppError(Message.ADDRESS_NOT_FOUND, 404);
    }

    return res
      .status(200)
      .json({ Address: AddressDTO.convertAddressToDTO(address) });
  }

  async update(req: Request, res: Response) {
    const { id } = req.body;

    const addressRepository = getCustomRepository(AddressRepository);

    let address = await addressRepository.findOne(id);

    if (!address) {
      throw new AppError(Message.ADDRESS_NOT_FOUND, 404);
    }

    const {
      street = address.street,
      houseNumber = address.houseNumber,
      bairro = address.bairro,
      state = address.state,
      city = address.city,
      cep = address.cep,
      complement = address.complement,
    } = req.body;

    await addressRepository.update(id, {
      street,
      houseNumber,
      bairro,
      state,
      city,
      cep,
      complement,
    });

    Object.assign(address, {
      street,
      houseNumber,
      bairro,
      state,
      city,
      cep,
      complement,
    });

    return res
      .status(200)
      .json({ Address: AddressDTO.convertAddressToDTO(address) });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const addressRepository = getCustomRepository(AddressRepository);

    const address = await addressRepository.findOne(id);

    if (!address) {
      throw new AppError(Message.ADDRESS_NOT_FOUND, 404);
    }

    await addressRepository.delete({ id });

    return res.status(200).json({ Message: "Sucesso!" });
  }

  async show(req: Request, res: Response) {
    const addressRepository = getCustomRepository(AddressRepository);

    const addresses = await addressRepository.find();

    if (addresses.length == 0) {
      throw new AppError(Message.NOT_FOUND, 404);
    }

    const addressDTO = addresses.map((address) => {
      return AddressDTO.convertAddressToDTO(address);
    });

    return res.status(200).json({ Addresses: addressDTO });
  }

  async readFromUser(userID: string) {
    const addressRepository = getCustomRepository(AddressRepository);

    const address = await addressRepository.findOne({ userID });

    let addressDTO: AddressDTO;

    if (address) {
      addressDTO = AddressDTO.convertAddressToDTO(address);
    }

    return addressDTO;
  }

  async readFromID(addressID: string) {
    const addressRepository = getCustomRepository(AddressRepository);

    const address = await addressRepository.findOne({ id: addressID });

    return address;
  }
}

export { AddressController };
