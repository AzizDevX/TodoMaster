import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    Number:{
        type : Number,
        default: 0,
    },
    TaskName :{
        type : String,
        required: true,
        minlength : 1,
        maxlength : 90,
    },
    User:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required: true,

    }
    
})

const todo = mongoose.model("ToDo",todoSchema)
export default todo