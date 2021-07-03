import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { Status } from "../env/status";
import { CategoryDTO } from "../models/DTOs/CategoryDTO";
import { CategoriesRepository } from "../repositories/CategoryRepository";

class CategoryController {
  async create(req: Request, res: Response) {
    const {
      name,
      description,
      value,
      colorful,
      hasAd,
      deliveryTimeInDays,
      qtdMaxPage,
      qtdMinPage,
      limiteCopiesMonthlyUser,
      limiteCopiesMonthly,
    } = req.body;

    if (
      !name ||
      !description ||
      value === null ||
      colorful === null ||
      hasAd === null ||
      deliveryTimeInDays === null ||
      qtdMinPage === null
    ) {
      return res.status(422).json({
        Message: Status.REQUIRED_FIELD,
      });
    } else if (
      typeof value === "string" ||
      typeof deliveryTimeInDays === "string" ||
      typeof qtdMaxPage === "string" ||
      typeof qtdMinPage === "string" ||
      (limiteCopiesMonthlyUser !== null &&
        typeof limiteCopiesMonthlyUser === "string") ||
      (limiteCopiesMonthly !== null && typeof limiteCopiesMonthly === "string")
    ) {
      return res.status(422).json({
        Message: Status.INVALID_DATA,
      });
    }

    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const categoriesExist = await categoriesRepository.findOne({ name });

    if (categoriesExist) {
      // retornando uma resposta de erro em json
      return res.status(409).json({
        Message: Status.CATEGORY_ALREADY_EXIST,
      });
    }

    const category = categoriesRepository.create({
      name,
      description,
      value,
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
      return res.status(409).json({
        Message: Status.NOT_FOUND,
      });
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
      return res.status(422).json({
        Message: Status.ID_NOT_FOUND,
      });
    }

    // pegando o repositorio customizado/personalizado
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    // pesquisando uma role pelo id
    let category = await categoriesRepository.findOne(id);

    // verificando se a role não existe
    if (!category) {
      // retornando uma resposta de erro em json
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
    }

    // capturando o tipo de role passado no corpo da requisição, caso não seja passado nada, pega o valor que ja está cadastrado na role
    const {
      name = category.name,
      description = category.description,
      value = category.value,
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
        return res.status(409).json({
          Message: Status.CATEGORY_ALREADY_EXIST,
        });
      }
    }

    // atualizando a role a partir do id
    await categoriesRepository.update(id, {
      name,
      description,
      value,
      colorful,
      deliveryTimeInDays,
      hasAd,
      limiteCopiesMonthly,
      limiteCopiesMonthlyUser,
      qtdMaxPage,
      qtdMinPage,
    });

    // pesquisando a role pelo id
    category = await categoriesRepository.findOne(id);

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
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
    }

    await categoriesRepository.delete(id);

    return res.status(200).json({ Message: Status.SUCCESS });
  }

  async show(req: Request, res: Response) {
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const categories = await categoriesRepository.find();

    if (categories.length === 0) {
      return res.status(406).json({
        Message: Status.NOT_FOUND,
      });
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
