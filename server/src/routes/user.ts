import { Request, Response, Router } from "express";

const router = Router();

const tempUsers = [
    {
        id: 0,
        username: 'Testing',
        email: 'testing@testing.com',
        password: 'Testing123*'
    }
]

router.post('/login', (_req: Request, res: Response) => {
    const response = { message: "login route" };
    res.send(response);
})

// router.get('/login', (_req, res) => {
//     const message = '<h1>Hello Tushar</h1>';
//     res.send(message);
// })

router.post('/register', (_req: Request, res: Response) => {
    const response = { message: "register route" };
    res.send(response);
})

export { router as userRoutes };

