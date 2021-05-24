import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import User from '../models/User';

class UserController {
    index(req: Request, res: Response) {
        return res.send({ userID: req.userId });
    }

    async store(req: Request, res: Response) {
        const repository = getRepository(User);

        const userExists = await repository.findOne({ where: { email: req.body.email } });

        if (userExists) {
            return res.sendStatus(409);
        }

        const user = repository.create({ email: req.body.email, password: req.body.password });
        await repository.save(user);

        const {password,hashPassword, ...payload} = user
        return res.json(payload);
    }
}

export default new UserController();