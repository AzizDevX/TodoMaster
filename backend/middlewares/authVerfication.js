import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

function authVerfication(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "You Must Log In First" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
}

export default authVerfication;
