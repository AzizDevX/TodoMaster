import mongoose from "mongoose";
const UserSchema = mongoose.Schema({
  Email: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 100,
  },
  UserName: {
    type: String,
    required: true,
    unique: true,
    maxlength: 64,
  },

  Password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("Users", UserSchema);
export default User;
