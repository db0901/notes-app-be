import express from "express";

// notes
import { create, findAll, findOne, remove, update } from "./controllers";
import {
  createSchema,
  findAllSchema,
  findOneSchema,
  removeSchema,
  updateSchema,
} from "./validation";

// middlewares
import { authenticateJWT } from "middleware/authenticateJWT";
import { validate } from "middleware/validate";

const router = express.Router();

router.post("/", [validate(createSchema), authenticateJWT], create);
router.get("/", [validate(findAllSchema), authenticateJWT], findAll);
router.get("/:id", [validate(findOneSchema), authenticateJWT], findOne);
router.patch("/:id", [validate(updateSchema), authenticateJWT], update);
router.delete("/:id", [validate(removeSchema), authenticateJWT], remove);

export default router;
