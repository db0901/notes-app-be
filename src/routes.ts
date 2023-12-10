import express from "express";
// routes

import authRoutes from "routes/auth/routes";
import notesRoutes from "routes/notes/routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/notes", notesRoutes);

export default router;
