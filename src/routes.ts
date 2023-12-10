import express from "express";
// routes

import authRoutes from "./auth/routes";
import notesRoutes from "./notes/routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/notes", notesRoutes);

export default router;
