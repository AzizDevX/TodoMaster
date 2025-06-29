import todo from "../models/todoSchema.js";
import express from "express";
import authVerfication from "../middlewares/authVerfication.js";
import Joi from "joi";
const router = express.Router();
router.put("/edit", authVerfication, async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "invalide Request" });
    }
    const AddRules = Joi.object({
      FindTask: Joi.string().min(1).max(1000).required(),
      NewName: Joi.string().min(1).max(1000).required(),
    });

    const { error } = AddRules.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        details: error.details[0].message,
      });
    }

    const IsExist = await todo.findOne({
      TaskName: req.body.FindTask,
      User: req.user.id,
    });

    if (!IsExist) {
      return res.status(404).json({ message: "This Task Not Found" });
    }

    const findAllTasks = await todo.find({ User: req.user.id });

    const newName = req.body.NewName;

    const isDuplicate = findAllTasks.some(
      (task) => task.TaskName.toLowerCase() === newName.toLowerCase()
    );

    if (isDuplicate) {
      return res
        .status(400)
        .json({ message: "This task name already exists in Completed Tasks" });
    }

    const EditTask = await todo.findByIdAndUpdate(
      IsExist._id,
      {
        $set: {
          TaskName: newName,
        },
      },
      { new: true }
    );
    if (EditTask) {
      res.status(200).json({ message: "Task Updated" });
    } else {
      res.status(404).json({ message: "Something Worng" });
    }
  } catch (err) {
    res.status(500).json({ message: `Edit task error: ${err}` });
  }
});

router.put("/mark", authVerfication, async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "invalide Request" });
    }
    const AddRules = Joi.object({
      FindTask: Joi.string().min(1).max(1000).required(),
    });

    const { error } = AddRules.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        details: error.details[0].message,
      });
    }

    const IsExist = await todo.findOne({
      TaskName: req.body.FindTask,
      User: req.user.id,
    });

    if (!IsExist) {
      return res.status(404).json({ message: "This Task Not Found" });
    }
    const EditTask = await todo.findByIdAndUpdate(
      IsExist._id,
      {
        $set: {
          IsCompleted: true,
        },
      },
      { new: true }
    );
    if (EditTask) {
      res.status(200).json({ message: "Task Updated" });
    } else {
      res.status(404).json({ message: "Something Worng" });
    }
  } catch (err) {
    res.status(500).json({ message: `Edit task error: ${err}` });
  }
});

export default router;
