import express from "express";
import jwt from "jsonwebtoken";
import user from "../models/user.js";
import {
  ValidateRegisterReq,
  ValidateLoginReq,
} from "../middlewares/DataVerfication.js";
import bcrypt from "bcryptjs";

import {
  RegisterValidation,
  LoginValidation,
} from "../middlewares/userValidation.js";
const router = express.Router();

router.post(
  "/register",
  ValidateRegisterReq,
  RegisterValidation,
  async (req, res) => {
    try {
      const AlredayRegister = await user.findOne({ Email: req.body.Email });
      const ExistUserName = await user.findOne({ UserName: req.body.UserName });

      if (AlredayRegister) {
        return res
          .status(400)
          .json({ message: "This email is already registered." });
      }

      if (ExistUserName) {
        return res
          .status(400)
          .json({ message: "This username is already taken." });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.Password, salt);

      const NewUser = new user({
        Email: req.body.Email,
        UserName: req.body.UserName,
        Password: hashedPassword,
      });

      const IsSaved = await NewUser.save();
      if (IsSaved) {
        const token = jwt.sign(
          {
            id: NewUser._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );

        res.status(201).json({
          message: ` User Has Been Registered `,
          UserName: NewUser.UserName,
          token: token,
        });
      } else {
        res.status(400).json({ message: `Server Error` });
      }
    } catch (err) {
      res.status(503).json({ message: "Something Wrong" });
      console.log("Something Wrong ", err);
    }
  }
);

router.post("/login", ValidateLoginReq, LoginValidation, async (req, res) => {
  try {
    const IsRegistered = await user.findOne({ Email: req.body.Email });
    if (!IsRegistered) {
      return res.status(404).json({ message: "You Must Register First" });
    }
    const VerifyPassword = await bcrypt.compare(
      req.body.Password,
      IsRegistered.Password
    );
    if (!VerifyPassword) {
      return res.status(401).json({ message: "Wrong Email Or Password" });
    }

    const token = jwt.sign(
      {
        id: IsRegistered._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(200).json({
      message: "logged",
      UserName: IsRegistered.UserName,
      token: token,
    });
  } catch (err) {
    return res.status(500).json({ message: `Internal Server Error` });
  }
});

export default router;
