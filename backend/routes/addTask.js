import todo from "../models/todoSchema.js";
import express from "express";
import authVerfication from "../middlewares/authVerfication.js";
import user from "../models/user.js";
import Joi from "joi";
const router = express.Router();

router.post("/create", authVerfication, async (req, res) => {
  const AddRules = Joi.object({
    TaskName: Joi.string().min(1).max(1000).required(),
  });

  const { error } = AddRules.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      details: error.details[0].message,
    });
  }

  const UserID = req.user.id;
  const IsRegister = await user.findById(UserID);
  if (!IsRegister) {
    return res.status(400).json({ message: "User Dosent Exist" });
  }
  const TaskRegistered = await todo.findOne({
    User: req.user.id,
    TaskName: req.body.TaskName,
  });

  if (TaskRegistered) {
    return res.status(400).json({ message: "This Task Alreday Registred" });
  }

  const NewTask = new todo({
    TaskName: req.body.TaskName,
    User: UserID,
  });
  await NewTask.save();
  res.status(201).json({ message: "Task Added", NewTask });
});

export default router;
