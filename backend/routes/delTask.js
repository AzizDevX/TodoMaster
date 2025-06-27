import todo from "../models/todoSchema.js";
import express from "express";
import authVerfication from "../middlewares/authVerfication.js";
import Joi from "joi";

const router = express.Router();
router.delete("/delete", authVerfication, async (req, res) => {
  try {
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
    const UserId = req.user.id;
    const TaskId = await todo.findOne({
      User: UserId,
      TaskName: req.body.TaskName,
    });
    if (!TaskId) {
      return res
        .status(404)
        .json({ message: "You Dont Have Task With This Name" });
    }
    const deleteTask = await todo.findByIdAndDelete(TaskId._id);
    res.status(200).json({ message: deleteTask });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});
export default router;
