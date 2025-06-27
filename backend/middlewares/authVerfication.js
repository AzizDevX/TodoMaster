import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

function authVerfication(req, res, next) {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(401).json({ message: "You Must Loggin First" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

export default authVerfication;
