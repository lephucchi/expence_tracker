import express from "express";
import { signinUser } from "../controllers/authControllers.js";
import { signupUser } from "../controllers/authControllers.js";

const router = express.Router();

router.post("/sign-up", signupUser);
router.post("/sign-in", signinUser);

export default router;
