import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { Status } from "../env/status";
import { DocumentsRepository } from "../repositories/DocumentRepository";
import { CategoryController } from "./CategoryController";
import { validationNumber } from "../util/user/NumberValidation";

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

    const convertedPageNumber = validationNumber(pageNumber);

    if (!convertedPageNumber && convertedPageNumber === 0) {
      return res.status(422).json({ Message: Status.INVALID_DATA });
    } else if (!name || !size || !type || !file || !categoryID) {
      return res.status(422).json({ Message: Status.REQUIRED_FIELD });
    }

    if (size > 10 * 1024 * 1024) {
      return res.status(422).json({ Message: Status.FILE_TOO_LARGE });
    } else if (!mimetypes.includes(type)) {
      return res.status(422).json({ Message: Status.INVALID_DATA });
    }

    const categoryController = new CategoryController();

    const category = await categoryController.readFromController(categoryID);

    if (!category) {
      return res.status(406).json({ Message: Status.NOT_FOUND });
    } else if (
      category.qtdMinPage > convertedPageNumber ||
      (category.qtdMaxPage && category.qtdMaxPage < convertedPageNumber)
    ) {
      return res.status(406).json({ Message: Status.INVALID_PAGE_COUNT });
    }

    const documentRepository = getCustomRepository(DocumentsRepository);

    const document = documentRepository.create({
      name,
      size,
      type,
      file,
      pageNumber: convertedPageNumber,
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

    const convertedPageNumber = validationNumber(pageNumber);

    if (!convertedPageNumber && convertedPageNumber !== 0) {
      throw new Error(Status.INVALID_DATA);
    } else if (!name || !size || !type || !file || !categoryID) {
      throw new Error(Status.REQUIRED_FIELD);
    }

    if (size > 10 * 1024 * 1024) {
      throw new Error(Status.FILE_TOO_LARGE);
    } else if (!mimetypes.includes(type)) {
      throw new Error(Status.INVALID_DATA);
    }

    const categoryController = new CategoryController();

    const category = await categoryController.readFromController(categoryID);

    if (!category) {
      throw new Error(Status.NOT_FOUND);
    } else if (
      category.qtdMinPage > convertedPageNumber ||
      (category.qtdMaxPage && category.qtdMaxPage < convertedPageNumber)
    ) {
      throw new Error(Status.INVALID_PAGE_COUNT);
    }

    const documentRepository = getCustomRepository(DocumentsRepository);

    const document = documentRepository.create({
      name,
      size,
      type,
      file,
      pageNumber: convertedPageNumber,
    });

    const documentSaved = await documentRepository.save(document);

    return documentSaved;
  }

  async read(req: Request, res: Response) {
    const { id } = req.params;

    const documentRepository = getCustomRepository(DocumentsRepository);

    const document = await documentRepository.findOne({ id });

    if (!document) {
      return res.status(406).json({ Message: Status.NOT_FOUND });
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

    const documentRepository = getCustomRepository(DocumentsRepository);

    let document = await documentRepository.findOne({ id });

    if (!document) {
      return res.status(406).json({ Message: Status.NOT_FOUND });
    }

    const { originalname: name, size, mimetype: type, buffer: file } = req.file;
    let { pageNumber, categoryID } = req.body;

    const mimetypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const convertedPageNumber = validationNumber(pageNumber);

    if (!convertedPageNumber && convertedPageNumber === 0) {
      return res.status(422).json({ Message: Status.INVALID_DATA });
    } else if (!name || !size || !type || !file || !categoryID) {
      return res.status(422).json({ Message: Status.REQUIRED_FIELD });
    }

    if (size > 10 * 1024 * 1024) {
      return res.status(422).json({ Message: Status.FILE_TOO_LARGE });
    } else if (!mimetypes.includes(type)) {
      return res.status(422).json({ Message: Status.INVALID_DATA });
    }

    const categoryController = new CategoryController();

    const category = await categoryController.readFromController(categoryID);

    if (!category) {
      return res.status(406).json({ Message: Status.NOT_FOUND });
    } else if (
      category.qtdMinPage > convertedPageNumber ||
      (category.qtdMaxPage && category.qtdMaxPage < convertedPageNumber)
    ) {
      return res.status(406).json({ Message: Status.INVALID_PAGE_COUNT });
    }

    await documentRepository.update(id, {
      name,
      size,
      type,
      pageNumber: convertedPageNumber,
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
      return res.status(406).json({ Message: Status.NOT_FOUND });
    }

    await documentRepository.delete({ id });

    return res.status(200).json({ Message: Status.SUCCESS });
  }

  async show(req: Request, res: Response) {
    const documentRepository = getCustomRepository(DocumentsRepository);

    const documents = await documentRepository.find();

    if (documents.length === 0) {
      return res.status(406).json({ Message: Status.NOT_FOUND });
    }

    return res.status(200).json({ Documents: documents });
  }
}

export { DocumentController };
