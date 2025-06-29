import todo from "../models/todoSchema.js";
import express from "express";
import authVerfication from "../middlewares/authVerfication.js";

const router = express.Router();
router.get("/Tasks", authVerfication, async (req, res) => {
  try {
    const userId = req.user.id;
    const GetAllTasks = await todo.find({ User: userId });

    if (GetAllTasks.length === 0) {
      return res.status(200).json({ taskNames: [] });
    }
    res.status(200).json({ tasks: GetAllTasks });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
