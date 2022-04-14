import { Router } from "express";
import { auth as authorize } from "../middlewares/index";

const router = Router();
const { auth } = require('../controllers/index')

router.post("/register", auth.register);
router.post("/login", auth.login);
router.get("/me", authorize, auth.getMyProfile);
router.get("/logout", authorize, auth.logout);

export default router;
