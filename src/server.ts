import "reflect-metadata";
import { connectionSource } from "./data-source";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";

// console.log(path.resolve(__dirname+'/.env'))
dotenv.config({ path: path.resolve(__dirname + "/.env") });

import { authRoutes, postRoutes, subsRoutes } from "./routes/index";
import trim from "./middleware/trim";

const app = express();
const PORT = process.env.PORT
const ENVIRONMENT = process.env.NODE_ENV

app.use(cookieParser());

app.use(express.json());
app.use(morgan("dev"));
app.use(trim);

app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/subs", subsRoutes);

app.get("/", (req, res) => res.send("Hello world"));

app.listen(PORT, async () => {
  console.log(`server running at http://localhost:${PORT}`);

  try {
    await connectionSource.initialize();
  } catch (err) {
    console.log(err);
  }
});
