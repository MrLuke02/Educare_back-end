import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { Status } from "../env/status";
import { DocumentsRepository } from "../repositories/DocumentRepository";
import { CategoryController } from "./CategoryController";

class DocumentController {
  async create(req: Request, res: Response) {
    const { originalname: name, size, mimetype: type, buffer: file } = req.file;
    let { pageNumber, categoryID } = req.body;

    const mimetypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!pageNumber || !name || !size || !type || !file || !categoryID) {
      return res.status(422).json({ Message: Status.REQUIRED_FIELD });
    } else {
      pageNumber = Number(pageNumber);

      if (!pageNumber) {
        return res.status(422).json({ Message: Status.INVALID_DATA });
      }
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
      category.qtdMinPage > pageNumber ||
      (category.qtdMaxPage && category.qtdMaxPage < pageNumber)
    ) {
      return res.status(406).json({ Message: Status.INVALID_PAGE_COUNT });
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

  async read(req: Request, res: Response) {
    const { id } = req.params;

    const documentRepository = getCustomRepository(DocumentsRepository);

    const document = await documentRepository.findOne({ id });

    if (!document) {
      return res.status(406).json({ Message: Status.NOT_FOUND });
    }

    return res.status(200).json({ Document: document });
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

    if (!pageNumber || !name || !size || !type || !file || !categoryID) {
      return res.status(422).json({ Message: Status.REQUIRED_FIELD });
    } else {
      pageNumber = Number(pageNumber);

      if (!pageNumber) {
        return res.status(422).json({ Message: Status.INVALID_DATA });
      }
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
      category.qtdMinPage > pageNumber ||
      (category.qtdMaxPage && category.qtdMaxPage < pageNumber)
    ) {
      return res.status(406).json({ Message: Status.INVALID_PAGE_COUNT });
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
      return res.status(406).json({ Message: Status.NOT_FOUND });
    }

    await documentRepository.delete({ id });

    return res.status(200).json({ Message: Status.SUCCESS });
  }
}

export { DocumentController };
