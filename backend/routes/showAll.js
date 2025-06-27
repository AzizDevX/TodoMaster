import todo from "../models/todoSchema.js";
import express from "express";
import authVerfication from "../middlewares/authVerfication.js";

const router = express.Router();
router.get("/Tasks", authVerfication, async (req, res) => {
  try {
    const userId = req.user.id;
    const GetAllTasks = await todo.find({ User: userId });

    if (GetAllTasks.length === 0) {
      return res.status(404).json({ message: "You Don't Have Any Tasks Yet" });
    }
    const taskNames = GetAllTasks.map((task) => task.TaskName);
    res.status(200).json({ taskNames });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
