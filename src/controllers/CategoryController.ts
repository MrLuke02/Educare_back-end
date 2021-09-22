import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { Message } from "../env/message";
import { AppError } from "../errors/AppErrors";
import { CategoryDTO } from "../models/DTOs/CategoryDTO";
import { CategoriesRepository } from "../repositories/CategoryRepository";

class CategoryController {
  async create(req: Request, res: Response) {
    const {
      name,
      description,
      price,
      colorful,
      hasAd,
      deliveryTimeInDays,
      qtdMaxPage,
      qtdMinPage,
      limiteCopiesMonthlyUser,
      limiteCopiesMonthly,
    } = req.body;

    const isNullable = [null, undefined];

    if (
      !name ||
      !description ||
      isNullable.includes(colorful) ||
      isNullable.includes(hasAd) ||
      (!price && price !== 0) ||
      (!deliveryTimeInDays && deliveryTimeInDays !== 0) ||
      (!qtdMinPage && qtdMinPage !== 0)
    ) {
      throw new AppError(Message.REQUIRED_FIELD, 400);
    }

    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const categoriesExist = await categoriesRepository.findOne({ name });

    if (categoriesExist) {
      // retornando uma resposta de erro em json
      throw new AppError(Message.CATEGORY_ALREADY_EXIST, 409);
    }

    const category = categoriesRepository.create({
      name,
      description,
      price,
      colorful,
      hasAd,
      deliveryTimeInDays,
      qtdMaxPage,
      qtdMinPage,
      limiteCopiesMonthlyUser,
      limiteCopiesMonthly,
    });

    const categorySaved = await categoriesRepository.save(category);

    return res.status(201).json({
      Category: CategoryDTO.covertCategoryToDTO(categorySaved),
    });
  }

  async read(req: Request, res: Response) {
    const { id } = req.params;

    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const category = await categoriesRepository.findOne({ id });

    if (!category) {
      throw new AppError(Message.CATEGORY_NOT_FOUND, 404);
    }

    return res
      .status(200)
      .json({ Category: CategoryDTO.covertCategoryToDTO(category) });
  }

  async update(req: Request, res: Response) {
    // capturando e armazenando o id da role do corpo da requisição
    const { id } = req.body;

    // verificando se o id da role não foi passada
    if (!id) {
      // retornando um json de erro personalizado
      throw new AppError(Message.ID_NOT_FOUND, 400);
    }

    // pegando o repositorio customizado/personalizado
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    // pesquisando uma role pelo id
    let category = await categoriesRepository.findOne(id);

    // verificando se a role não existe
    if (!category) {
      // retornando uma resposta de erro em json
      throw new AppError(Message.CATEGORY_NOT_FOUND, 404);
    }

    // capturando o tipo de role passado no corpo da requisição, caso não seja passado nada, pega o valor que ja está cadastrado na role
    const {
      name = category.name,
      description = category.description,
      price = category.price,
      colorful = category.colorful,
      hasAd = category.hasAd,
      deliveryTimeInDays = category.deliveryTimeInDays,
      qtdMaxPage = category.qtdMaxPage,
      qtdMinPage = category.qtdMinPage,
      limiteCopiesMonthlyUser = category.limiteCopiesMonthlyUser,
      limiteCopiesMonthly = category.limiteCopiesMonthly,
    } = req.body;

    if (name !== category.name) {
      const nameExists = await categoriesRepository.findOne({ name });

      if (nameExists) {
        // retornando uma resposta de erro em json
        throw new AppError(Message.CATEGORY_ALREADY_EXIST, 409);
      }
    }

    // atualizando a role a partir do id
    await categoriesRepository.update(id, {
      name,
      description,
      price,
      colorful,
      deliveryTimeInDays,
      hasAd,
      limiteCopiesMonthly,
      limiteCopiesMonthlyUser,
      qtdMaxPage,
      qtdMinPage,
    });

    Object.assign(category, {
      name,
      description,
      price,
      colorful,
      deliveryTimeInDays,
      hasAd,
      limiteCopiesMonthly,
      limiteCopiesMonthlyUser,
      qtdMaxPage,
      qtdMinPage,
    });

    // retornando o DTO da role atualizada
    return res
      .status(200)
      .json({ Category: CategoryDTO.covertCategoryToDTO(category) });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const category = await categoriesRepository.findOne(id);

    if (!category) {
      throw new AppError(Message.CATEGORY_NOT_FOUND, 404);
    }

    await categoriesRepository.delete(id);

    return res.status(200).json({ Message: Message.SUCCESS });
  }

  async show(req: Request, res: Response) {
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const categories = await categoriesRepository.find();

    if (categories.length === 0) {
      throw new AppError(Message.NOT_FOUND, 404);
    }

    const categoriesDTO = categories.map((category) => {
      return CategoryDTO.covertCategoryToDTO(category);
    });

    return res.status(200).json({ Categories: categoriesDTO });
  }

  async readFromController(id: string) {
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const category = await categoriesRepository.findOne({ id });

    return category;
  }
}

export { CategoryController };
