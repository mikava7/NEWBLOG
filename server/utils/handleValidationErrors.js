import { validationResult } from "express-validator";

export default (req, res, next) => {
  //tu validacia ver gaiara daabrune errori
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(404).json(error.array());
  }
  //tu errorebi ar iqna gaagrzele
  next();
};
