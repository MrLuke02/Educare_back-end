import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { Message } from "../env/message";
import { AppError } from "../errors/AppErrors";
import { DocumentsRepository } from "../repositories/DocumentRepository";
import { CategoryController } from "./CategoryController";

type FileType = Express.Multer.File;

class DocumentController {
  async create(req: Request, res: Response) {
    const { originalname: name, size, mimetype: type, buffer: file } = req.file;
    let { pageNumber, categoryID } = req.body;

    const mimetypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (
      !name ||
      !size ||
      !type ||
      !file ||
      !categoryID ||
      (!pageNumber && pageNumber !== 0)
    ) {
      throw new AppError(Message.REQUIRED_FIELD, 422);
    }

    if (size > 10 * 1024 * 1024) {
      throw new AppError(Message.FILE_TOO_LARGE, 422);
    } else if (!mimetypes.includes(type)) {
      throw new AppError(Message.INVALID_DATA, 422);
    }

    const categoryController = new CategoryController();

    const category = await categoryController.readFromController(categoryID);

    if (!category) {
      throw new AppError(Message.CATEGORY_NOT_FOUND, 406);
    } else if (
      category.qtdMinPage > pageNumber ||
      (category.qtdMaxPage && category.qtdMaxPage < pageNumber)
    ) {
      throw new AppError(Message.INVALID_PAGE_COUNT, 422);
    }

    const documentRepository = getCustomRepository(DocumentsRepository);

    const document = documentRepository.create({
      name,
      size,
      type,
      file,
      pageNumber,
    });

    const documentSaved = await documentRepository.save(document);

    return res.status(201).json({ Document: documentSaved });
  }

  async createFromController(
    docs: FileType,
    pageNumber: number,
    categoryID: string
  ) {
    const { originalname: name, size, mimetype: type, buffer: file } = docs;

    const mimetypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (
      !name ||
      !size ||
      !type ||
      !file ||
      !categoryID ||
      !categoryID ||
      (!pageNumber && pageNumber !== 0)
    ) {
      throw new AppError(Message.REQUIRED_FIELD, 422);
    }

    if (size > 10 * 1024 * 1024) {
      throw new AppError(Message.FILE_TOO_LARGE, 422);
    } else if (!mimetypes.includes(type)) {
      throw new AppError(Message.INVALID_DATA, 422);
    }

    const categoryController = new CategoryController();

    const category = await categoryController.readFromController(categoryID);

    if (!category) {
      throw new AppError(Message.CATEGORY_NOT_FOUND, 406);
    } else if (
      category.qtdMinPage > pageNumber ||
      (category.qtdMaxPage && category.qtdMaxPage < pageNumber)
    ) {
      throw new AppError(Message.INVALID_PAGE_COUNT, 406);
    }

    const documentRepository = getCustomRepository(DocumentsRepository);

    const document = documentRepository.create({
      name,
      size,
      type,
      file,
      pageNumber,
    });

    const documentSaved = await documentRepository.save(document);

    return documentSaved;
  }

  async read(req: Request, res: Response) {
    const { id } = req.params;

    const documentRepository = getCustomRepository(DocumentsRepository);

    const document = await documentRepository.findOne({ id });

    if (!document) {
      throw new AppError(Message.DOCUMENT_NOT_FOUND, 406);
    }

    return res.status(200).json({ Document: document });
  }

  async readFromController(id: string) {
    const documentRepository = getCustomRepository(DocumentsRepository);

    const document = await documentRepository.findOne({ id });

    return document;
  }

  async update(req: Request, res: Response) {
    const { id } = req.body;

    if (!id) {
      throw new AppError(Message.ID_NOT_FOUND, 422);
    }

    const documentRepository = getCustomRepository(DocumentsRepository);

    let document = await documentRepository.findOne({ id });

    if (!document) {
      throw new AppError(Message.DOCUMENT_NOT_FOUND, 406);
    }

    const {
      originalname: name = document.name,
      size = document.size,
      mimetype: type = document.type,
      buffer: file = document.file,
    } = req.file;
    let { pageNumber = document.pageNumber, categoryID } = req.body;

    const mimetypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!categoryID) {
      throw new AppError(Message.REQUIRED_FIELD, 422);
    }

    if (size > 10 * 1024 * 1024) {
      throw new AppError(Message.FILE_TOO_LARGE, 422);
    } else if (!mimetypes.includes(type)) {
      throw new AppError(Message.INVALID_DATA, 422);
    }

    const categoryController = new CategoryController();

    const category = await categoryController.readFromController(categoryID);

    if (!category) {
      throw new AppError(Message.CATEGORY_NOT_FOUND, 406);
    } else if (
      category.qtdMinPage > pageNumber ||
      (category.qtdMaxPage && category.qtdMaxPage < pageNumber)
    ) {
      throw new AppError(Message.INVALID_PAGE_COUNT, 422);
    }

    await documentRepository.update(id, {
      name,
      size,
      type,
      pageNumber,
      file,
    });

    document = await documentRepository.findOne({ id });

    return res.status(200).json({ Document: document });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const documentRepository = getCustomRepository(DocumentsRepository);

    const document = await documentRepository.findOne({ id });

    if (!document) {
      throw new AppError(Message.DOCUMENT_NOT_FOUND, 406);
    }

    await documentRepository.delete({ id });

    return res.status(200).json({ Message: Message.SUCCESS });
  }

  async show(req: Request, res: Response) {
    const documentRepository = getCustomRepository(DocumentsRepository);

    const documents = await documentRepository.find();

    if (documents.length === 0) {
      throw new AppError(Message.NOT_FOUND, 406);
    }

    return res.status(200).json({ Documents: documents });
  }
}

export { DocumentController };
