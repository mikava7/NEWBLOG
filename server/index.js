import express from "express";
import mongoose from "mongoose";
import {
  registerValidator,
  loginValidator,
  postCreateValidation,
} from "./validations.js";
import checkAuth from "./utils/checkAuth.js";

import { register, login, getMe } from "./controllers/UserController.js";
import {
  create,
  getAll,
  getOne,
  remove,
  update,
} from "./controllers/PostController.js";

const app = express();
app.use(express.json());
const port = 5000;

const CONNECTION_STRING =
  "mongodb+srv://mikava365:irakli365@cluster0.z6h2hyj.mongodb.net/blogPost?retryWrites=true&w=majority";

mongoose
  .connect(CONNECTION_STRING)
  .then(() => console.log("DB has been connected"))
  .catch((error) => console.log("DB error", error));

app.post("/auth/register", registerValidator, register);
app.post("/auth/login", loginValidator, login);
app.get("/auth/me", checkAuth, getMe);

app.get("/posts", getAll);
app.get("/posts/:id", getOne);
app.post("/posts", checkAuth, postCreateValidation, create);
app.delete("/posts/:id", checkAuth, remove);
app.patch("/posts/:id", checkAuth, update);

app.listen(5000, console.log(`server is listening to port: ${port}`));
