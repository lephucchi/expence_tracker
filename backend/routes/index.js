import "dotenv/config";
import express from "express";
import authRoutes from "./authRoutes.js";
// import accoutRoutes from './accoutRoutes.js';
import userRoutes from "./userRoutes.js";
// import transactionRoutes from './transactionRoutes.js'

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
// router.use('/account', accoutRoutes);
// router.use('/transaction', transactionRoutes);

export default router;
