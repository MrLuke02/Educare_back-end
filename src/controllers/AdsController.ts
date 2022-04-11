import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { Message } from "../env/message";
import { AppError } from "../errors/AppErrors";
import { AdsRepository } from "../repositories/AdsRepository";
import { CompanyController } from "./CompanyController";

class AdsController {
  async create(req: Request, res: Response) {
    const { buffer: file, size, mimetype: type } = req.file;
    let { companyID } = req.body;

    const mimetypes = ["image/png", "image/jpg", "image/jpeg"];

    if (!file || !companyID) {
      throw new AppError(Message.REQUIRED_FIELD, 400);
    }

    const companyController = new CompanyController();

    const company = await companyController.readCompanyFromID(companyID);

    if (!company) {
      throw new AppError(Message.COMPANY_NOT_FOUND, 404);
    }

    if (size > 10 * 1024 * 1024) {
      throw new AppError(Message.FILE_TOO_LARGE, 400);
    } else if (!mimetypes.includes(type)) {
      throw new AppError(Message.INVALID_DATA, 400);
    }

    const adsRepository = getCustomRepository(AdsRepository);

    const ad = adsRepository.create({
      companyID,
      file,
    });

    const adSaved = await adsRepository.save(ad);

    return res.status(201).json({ Ad: adSaved });
  }

  async read(req: Request, res: Response) {
    const { id } = req.params;

    const adsRepository = getCustomRepository(AdsRepository);

    const ad = await adsRepository.findOne({ id });

    if (!ad) {
      throw new AppError(Message.AD_NOT_FOUND, 404);
    }

    return res.status(200).json({ Ad: ad });
  }

  async update(req: Request, res: Response) {
    const { id, companyID } = req.body;

    const { size, mimetype: type, buffer: file } = req.file;

    if (!id) {
      throw new AppError(Message.ID_NOT_FOUND, 400);
    } else if (!file || !size || !type || !companyID) {
      throw new AppError(Message.REQUIRED_FIELD, 400);
    }

    const adsRepository = getCustomRepository(AdsRepository);

    let ad = await adsRepository.findOne({ id });

    if (!ad) {
      throw new AppError(Message.AD_NOT_FOUND, 404);
    }

    const mimetypes = ["image/png", "image/jpg", "image/jpeg"];

    if (size > 10 * 1024 * 1024) {
      throw new AppError(Message.FILE_TOO_LARGE, 400);
    } else if (!mimetypes.includes(type)) {
      throw new AppError(Message.INVALID_DATA, 400);
    }

    const companyController = new CompanyController();

    const company = await companyController.readCompanyFromID(companyID);

    if (!company) {
      throw new AppError(Message.COMPANY_NOT_FOUND, 404);
    }

    await adsRepository.update(id, {
      companyID,
      file,
    });

    Object.assign(ad, {
      companyID,
      file,
    });

    return res.status(200).json({ Ad: ad });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const adsRepository = getCustomRepository(AdsRepository);

    const ad = await adsRepository.findOne({ id });

    if (!ad) {
      throw new AppError(Message.AD_NOT_FOUND, 404);
    }

    await adsRepository.delete({ id });

    return res.status(200).json({ Message: Message.SUCCESS });
  }

  async show(req: Request, res: Response) {
    const adsRepository = getCustomRepository(AdsRepository);

    const ads = await adsRepository.find();

    if (ads.length === 0) {
      throw new AppError(Message.NOT_FOUND, 404);
    }

    return res.status(200).json({ Ads: ads });
  }
}

export { AdsController };
