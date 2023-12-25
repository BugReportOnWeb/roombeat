import { Request, Response } from "express";
import { guidGenerator } from "../lib/util";

const tempUsers = [
    {
        id: 'testing-id',
        username: 'Testing',
        email: 'testing@testing.com',
        password: 'Testing123*'
    }
]

const loginUser = (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = tempUsers.find(user => user.email == email);
    if (!existingUser) {
        const error = 'User doesn\'t exist';
        return res.status(404).send({ error });
    }

    if (existingUser.password !== password) {
        const error = 'Wrong password';
        return res.status(401).send({ error });
    }

    const userDetails = {
        id: existingUser.id,
        username: existingUser.username,
        email: existingUser.email
    }
    res.send(userDetails);
}

const registerUser = (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const existingUser = tempUsers.find(user => user.email === email);
    if (existingUser) {
        const error = 'User already exist';
        return res.status(409).send({ error });
    }

    const id = guidGenerator();
    const newUser = { id, username, email, password }
    tempUsers.push(newUser);

    const userDetails = { id, username, email };
    res.send(userDetails);
}

export { loginUser, registerUser };

