import { Router } from "express";
import { auth as authorize } from "../middlewares/index";

const router = Router();
const { subs } = require("../controllers/index");

router.post("/new", authorize, subs.createSub);
router.put("/update/:id", subs.updateSub);
router.delete("/delete/:id", subs.deleteSub);

export default router;
