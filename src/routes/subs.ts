import { Router } from "express";
import auth from '../middleware/auth'

const router = Router();
const subs = require('../controllers/subsController')

router.post("/new", auth, subs.createSub);
router.put("/update/:id", subs.updateSub);
router.delete("/delete/:id", subs.deleteSub);

export default router;