import mongoose from "mongoose";
const UserSchema = mongoose.Schema({
  Email: {
    type: String,
    require: true,
    unique: true,
    minlength: 3,
    maxlength: 100,
  },
  UserName: {
    type: String,
    require: true,
    unique: true,
    maxlength: 64,
  },

  Password: {
    type: String,
    require: true,
  },
});

const User = mongoose.model("Users", UserSchema);
export default User;
