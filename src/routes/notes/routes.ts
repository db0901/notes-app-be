import express from "express";

// notes
import { create, findAll, findOne, remove, update } from "./controllers";
import { createSchema, findAllSchema, findOneSchema } from "./validation";

// middlewares
import { validate } from "middleware/validate";

const router = express.Router();

router.post("/", validate(createSchema), create);
router.get("/", validate(findAllSchema), findAll);
router.get("/:id", validate(findOneSchema), findOne);
router.patch("/:id", update);
router.delete("/:id", remove);

export default router;

// WHEN FINISHED DO TESTING INSTANTLY
