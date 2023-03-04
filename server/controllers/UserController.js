import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { validationResult } from "express-validator";
import userModel from "../modules/User.js";

export const register = async (req, res) => {
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
        expiresIn: "20d",
      }
    );
    const { passwordHash, ...userData } = user._doc;
    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).res.json({
      message: "Registration failed",
    });
  }
};

export const login = async (req, res) => {
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
};

export const getMe = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const { passwordHash, ...userData } = user._doc;

    console.log(userData);
    res.json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "no eccesss" });
  }
};
