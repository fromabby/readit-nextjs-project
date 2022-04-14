import { Router } from "express";
import authorize from "../middleware/auth";

const router = Router();
const auth = require('../controllers/authController')

router.post("/register", auth.register);
router.post("/login", auth.login);
router.get("/me", authorize, auth.getMyProfile);
router.get("/logout", authorize, auth.logout);

export default router;
