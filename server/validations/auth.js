import { body } from "express-validator";

export const registerValidator = [
  body("email").isEmail(),
  body("password", "irefek jfiro ii").isLength({ min: 5 }),
  body("fullName").isLength({ min: 3 }),
  body("avatarURL").optional().isURL(),
];
