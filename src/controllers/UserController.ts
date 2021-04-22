import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from "../repositories/UserRepository";

class UserController {

  async create(req: Request, res: Response) {
    const { name, email, password, phone, address, isAdm } = req.body;
    const usersRepository = getCustomRepository(UsersRepository);

    const userAlreadyExists = await usersRepository.findOne({ email });


    if (userAlreadyExists) {
      return res.status(400).json({
        "error": "Usuário já existe!"
      })
    }

    const user = usersRepository.create({
      name, email, password, phone, address, isAdm
    });

    await usersRepository.save(user);

    return res.json(user);

  }

  async read(req: Request, res: Response) {
    const { email, password } = req.body;
    const usersRepository = getCustomRepository(UsersRepository);

    const user = await usersRepository.findOne({ email, password });

    if (!user) {
      return res.status(400).json({
        "error": "Nenhum usuario encontrado"
      });
    }

    return res.json(user);
  }


  async update(req: Request, res: Response) {
    //recebe todos os dados do  usuario a ser editado
    const { id } = req.body;
    const usersRepository = getCustomRepository(UsersRepository);

    //porem usa apenas o id para localiza-lo no bd
    let user = await usersRepository.findOne({
      id
    });


    if (!user) {
      return res.status(400).json("User not found");
    }


    const { name = user.name, email = user.email, password = user.password, address = user.address, isAdm = user.isAdm, phone = user.phone } = req.body;



    await usersRepository.update(id, {
      name, email, password,
      address, isAdm, phone
    })


    user = await usersRepository.findOne({ id });
    return res.json(user);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const usersRepository = getCustomRepository(UsersRepository);
    const userExist = await usersRepository.findOne({
      id
    });

    if (!userExist) {
      return res.json({
        "message": "User not found"
      });
    }

    usersRepository.delete({ id });


    return res.json({
      "message": "sucess"
    });


  }





}







export { UserController };