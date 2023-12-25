import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user";

const router = Router();

router.post('/login', loginUser);
router.post('/register', registerUser);

export { router as userRoutes };

