import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
  //   res.send(token);
  if (token) {
    try {
      const decoded = jwt.verify(token, "secret345");
      req.userId = decoded._id;
      next();
    } catch (error) {
      return res.status(400).json({ message: "no id " });
    }
  } else {
    return res.status(403).json({ message: "no exess" });
  }
};
