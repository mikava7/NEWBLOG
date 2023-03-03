import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { registerValidator } from "./validations/auth.js";
import { validationResult } from "express-validator";

import userModel from "./modules/User.js";

const app = express();
app.use(express.json());
const port = 5000;
const CONNECTION_STRING =
  "mongodb+srv://mikava365:irakli365@cluster0.z6h2hyj.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(CONNECTION_STRING)
  .then(() => console.log("DB has been connected"))
  .catch((error) => console.log("DB error", error));

app.post("/auth/register", registerValidator, (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json(error.array());
  }
  const doc = new userModel({
    email: req.body.email,
    password: req.body.password,
    avatarURL: req.body.avatarURL,
    passwordHash: req.body.passwordHash,
  });

  res.json({ success: true });
});

app.listen(port, console.log(`server is listening to port: ${port}`));
