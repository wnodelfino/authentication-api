import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User';

class AuthController {
    async authenticate(req: Request, res: Response) {
        const repository = getRepository(User);

        const userResponse = await repository.findOne({ where: { email: req.body.email } });

        if (!userResponse) {
            return res.sendStatus(401)
        }
        const {password,hashPassword, ...user} = userResponse    
        const isValidPassword = await bcrypt.compare( req.body.password, userResponse.password);

        if (!isValidPassword) {
            return res.sendStatus(401);
        }

        const token = jwt.sign({ id: userResponse.id }, 'secret', { expiresIn: '1d' });

        return res.json({
            user,
            token,
        });
    }
}

export default new AuthController();