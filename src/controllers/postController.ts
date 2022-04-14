import { Request, Response } from "express";
import auth from "../middleware/auth";
import { Post, Subs } from "../models";

exports.createPost = async (req: Request, res: Response) => {
  const { title, body, subName } = req.body;

  const user = res.locals.user;

  if (title.trim() === "") {
    return res.status(400).json({
      error: "Title must not be empty",
    });
  }

  try {
    //TODO: find sub
    const sub = await Subs.findOneOrFail({ where: { name: subName } });

    const post = new Post();

    post.title = title;
    post.body = body;
    post.user = user;
    post.subName = sub.name;

    await post.save();

    return res.json(post);
  } catch (error) {
    return res.status(500).json({
      error: "cannot post",
    });
  }
};

exports.updatePost = () => {};
exports.deletePost = () => {};
