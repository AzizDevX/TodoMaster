import todo from "../models/todoSchema.js"
import express from "express"
const router = express.Router();

router.post("/create",async (req , res)=>{
    const isExist = await todo.findOne({User : req.body.User})
    const TaskN = await todo.findOne({Number : req.body.Number})
    const UserId = isExist.findById()
    if(!isExist){
        res.status(403).json({message : "You Need Register First"})
    }
    const NewTask = new todo({
        number: TaskN +1,
        TaskName : req.body.TaskName,
        User: UserId,
    })
   const save = await todo.save()
   const {TaskName , Number , User} = save._Doc
    res.status(201).json({
        message: "Book Has Been Added",TaskName,Number,User
    })
})