import "reflect-metadata";
import { AppDataSource } from "./data-source";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";

// console.log(path.resolve(__dirname+'/.env'))
dotenv.config({ path: path.resolve(__dirname + "/.env") });

import authRoutes from "./routes/auth";
import trim from "./middleware/trim";

const app = express();

app.use(cookieParser());

app.use(express.json());
app.use(morgan("dev"));
app.use(trim);

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("Hello world"));

app.listen(5000, async () => {
  console.log("server running at http://localhost:5000");

  try {
    await AppDataSource.initialize();
  } catch (err) {
    console.log(err);
  }
});
