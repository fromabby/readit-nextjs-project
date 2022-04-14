import { Router } from "express";
import { auth as authorize } from "../middlewares/index";

const router = Router();
const { post } = require('../controllers/index')

router.post("/new", authorize, post.createPost);
router.put("/update/:id", post.updatePost);
router.delete("/delete/:id", post.deletePost);

export default router;