import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { registerValidator } from "./validations/auth.js";
import { validationResult } from "express-validator";

import userModel from "./modules/User.js";

const app = express();
app.use(express.json());
const port = 5500;
const CONNECTION_STRING =
  "mongodb+srv://mikava365:irakli365@cluster0.z6h2hyj.mongodb.net/blogPost?retryWrites=true&w=majority";

mongoose
  .connect(CONNECTION_STRING)
  .then(() => console.log("DB has been connected"))
  .catch((error) => console.log("DB error", error));

app.post("/auth/register", registerValidator, async (req, res) => {
  try {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).json(error.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new userModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarURL: req.body.avatarURL,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret345",
      {
        expiresIn: "2d",
      }
    );
    const { passwordHash, ...userData } = user._doc;
    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "Registration failed",
    });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    // if user found
    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );
    // if password is correct
    if (!isValidPass) {
      return res.status(404).json({
        message: "Wrong password or login",
      });
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret345",
      {
        expiresIn: "20d",
      }
    );

    const { passwordHash, ...userData } = user._doc;
    res.json({
      ...user._doc,
      token,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "Authorisation failed",
    });
  }
});

app.get("/auth/me", async (req, res) => {
  try {
    const me = await userModel.findOne({ fullName: req.body.fullName });
    if (!me) {
      return res.status(404).json({
        message: "user not found",
      });
    }
  } catch (error) {}
});
app.listen(port, console.log(`server is listening to port: ${port}`));
