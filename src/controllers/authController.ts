import { isEmpty, validate } from "class-validator";
import { Request, Response } from "express";
import { User } from "../models/index";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";

exports.register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  try {
    //TODO: validate data
    let errors: any = {};
    const emailUser = await User.findOne({ where: { email } });
    const usernameUser = await User.findOne({ where: { username } });

    if (emailUser) errors.email = "Email is already taken";
    if (usernameUser) errors.username = "Username is already taken";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        errors,
      });
    }

    //TODO: create the user
    const user = new User();

    user.email = email;
    user.username = username;
    user.password = password;

    errors = await validate(user);

    if (errors.length > 0) {
      return res.status(400).json({
        errors,
      });
    }

    await user.save();

    return res.json(user);
    //TODO: return the user
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "something went wrong" });
  }
};

exports.login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    let errors: any = {};

    if (isEmpty(username)) errors.username = "Username must not be empty";
    if (isEmpty(password)) errors.password = "Password must not be empty";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }
    const user = await User.findOne({ where: { username } });

    if (!user) return res.status(404).json({ error: "User not found" });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch)
      return res.status(401).json({ password: "Password is incorrect" });

    console.log(process.env.JWT_SECRET);
    const token = jwt.sign({ username }, process.env.JWT_SECRET);

    res.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true, // not accessible by javascript
        secure: process.env.NODE_ENV === "production", // accessed by https (false in dev mode since no SSL)
        sameSite: "strict", // cookie should only come from the domain
        maxAge: Number(process.env.MAX_AGE), // valid for 3600 seconds = 1 hr
        path: "/", // where the cookie is valid, set to / so the cookie is valid everywhere
      })
    );

    return res.json(user);
  } catch (err) {
    console.log(err);
  }
};

exports.getMyProfile = (_: Request, res: Response) => {
  return res.json(res.locals.user);
};

exports.logout = async (_: Request, res: Response) => {
  try {
    res.set(
      "Set-Cookie",
      cookie.serialize("token", "", {
        httpOnly: true, // not accessible by javascript
        secure: process.env.NODE_ENV === "production", // accessed by https (false in dev mode since no SSL)
        sameSite: "strict", // cookie should only come from the domain
        expires: new Date(0), // valid for 0, expire asap
        path: "/", // where the cookie is valid, set to / so the cookie is valid everywhere
      })
    );

    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      error: "Unauthenticated",
    });
  }
};
