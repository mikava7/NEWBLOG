import { body } from "express-validator";

export const loginValidator = [
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
];

export const registerValidator = [
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
  body("fullName").isLength({ min: 3 }),
  body("avatarURL").optional().isURL(),
];

export const postCreateValidation = [
  body("title").isLength({ min: 3 }).isString(),
  body("text").isLength({ min: 5 }).isString(),
  body("tags").optional().isString(),
  body("imageURL").optional().isString(),
];
