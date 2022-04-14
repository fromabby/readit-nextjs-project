import { validate } from "class-validator";
import { Request, Response, Router } from "express";
import { User } from "../entity/User";

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  try {
    //TODO: validate data
    let errors: any = {};
    //!Not working
    // const emailUser = await User.findOne({ email });
    // const usernameUser = await User.findOne({ username });

    // if (emailUser) errors.email = "Email is already taken";
    // if (usernameUser) errors.username = "Username is already taken";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        errors,
      });
    }

    //TODO: create the user
    const user = new User({ email, username, password });

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

const router = Router();

router.post("/register", register);

export default router;
