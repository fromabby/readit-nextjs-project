import { Request, Response } from "express";
import { User, Subs } from "../entities/index";
import { isEmpty } from "class-validator";
import { connectionSource } from "../data-source";

exports.createSub = async (req: Request, res: Response) => {
  const { name, title, description } = req.body;

  const user: User = res.locals.user;

  try {
    let errors: any = {};

    if (isEmpty(name)) errors.name = "Name must not be empty";
    if (isEmpty(title)) errors.title = "title must not be empty";

    const sub = await connectionSource
      .getRepository(Subs)
      .createQueryBuilder("sub")
      .where("lower(sub.name) = :name", { name: name.toLowerCase() })
      .getOne();

    if (sub) errors.name = "Sub already exists";

    if (Object.keys(errors).length > 0) throw errors

  } catch (error) {
    return res.status(400).json({
      error
    });
  }

  try {
    const sub = new Subs();
    sub.title = title;
    sub.description = description;
    sub.name = name;
    sub.user = user;

    await sub.save();

    return res.json(sub);
  } catch (error) {
    return res.status(400).json({
      error,
    });
  }
};

exports.updateSub = () => {};
exports.deleteSub = () => {};
