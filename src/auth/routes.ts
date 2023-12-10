import express from "express";

// auth
import { login, register } from "./controllers";
import { loginSchema, registerSchema } from "./validation";

// middlewares
import { validate } from "../middleware/validate";

const router = express.Router();

router.post("/login", validate(loginSchema), login);
router.post("/register", validate(registerSchema), register);

export default router;
