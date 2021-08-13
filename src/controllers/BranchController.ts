import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";

import { Message } from "../env/message";
import { AppError } from "../errors/AppErrors";
import { BranchesRepository } from "../repositories/BranchRepository";

class BranchController {
  async create(req: Request, res: Response) {
    const { branch } = req.body;

    if (!branch) {
      throw new AppError(Message.REQUIRED_FIELD, 422);
    }

    const branchRepository = getCustomRepository(BranchesRepository);

    const branchAlreadyExist = await branchRepository.findOne({ branch });

    if (branchAlreadyExist) {
      throw new AppError(Message.BRANCH_ALREADY_EXIST, 409);
    }

    let branchSaved = branchRepository.create({ branch });

    branchSaved = await branchRepository.save(branchSaved);

    return res.status(201).json({ Branch: branchSaved });
  }

  async read(req: Request, res: Response) {
    const { id } = req.params;

    const branchRepository = getCustomRepository(BranchesRepository);

    const branch = await branchRepository.findOne({ id });

    if (!branch) {
      throw new AppError(Message.BRANCH_NOT_FOUND, 406);
    }

    return res.status(200).json({ Branch: branch });
  }

  async update(req: Request, res: Response) {
    const { id } = req.body;

    if (!id) {
      throw new AppError(Message.ID_NOT_FOUND, 422);
    }

    const branchRepository = getCustomRepository(BranchesRepository);

    let branchExists = await branchRepository.findOne({ id });

    if (!branchExists) {
      throw new AppError(Message.BRANCH_NOT_FOUND, 406);
    }

    const { branch = branchExists.branch } = req.body;

    await branchRepository.update(id, { branch });

    branchExists = await branchRepository.findOne({ id: id });

    return res.status(200).json({ Branch: branchExists });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const branchRepository = getCustomRepository(BranchesRepository);

    const branch = await branchRepository.findOne({ id });

    if (!branch) {
      throw new AppError(Message.BRANCH_NOT_FOUND, 406);
    }

    await branchRepository.delete({ id });

    return res.status(200).json({ Message: Message.SUCCESS });
  }

  async show(req: Request, res: Response) {
    const branchRepository = getCustomRepository(BranchesRepository);

    const branches = await branchRepository.find();

    if (branches.length < 0) {
      throw new AppError(Message.NOT_FOUND, 406);
    }

    return res.status(200).json({ Branches: branches });
  }
}

export { BranchController };
