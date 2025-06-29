import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  TaskName: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 90,
  },

  IsCompleted: {
    type: Boolean,
    required: true,
  },

  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
});

const todo = mongoose.model("ToDo", todoSchema);
export default todo;
