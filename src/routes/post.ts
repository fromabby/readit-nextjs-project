import { Router } from "express";
import auth from '../middleware/auth'

const router = Router();
const post = require('../controllers/postController')

router.post("/new", auth, post.createPost);
router.put("/update/:id", post.updatePost);
router.delete("/delete/:id", post.deletePost);

export default router;