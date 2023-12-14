import express from "express";

// auth
import { currentSession, login, register } from "./controllers";
import {
  currentSessionSchema,
  loginSchema,
  registerSchema,
} from "./validation";

// middlewares
import { authenticateJWT } from "middleware/authenticateJWT";
import { validate } from "middleware/validate";

const router = express.Router();

router.post("/login", validate(loginSchema), login);
router.post("/register", validate(registerSchema), register);
router.get(
  "/current-session",
  [validate(currentSessionSchema), authenticateJWT],
  currentSession
);

export default router;
