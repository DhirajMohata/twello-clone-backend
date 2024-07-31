const mongoose = require("mongoose");
const { string } = require("zod");
require("dotenv").config();

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email : {
        type: String,
        required: true,
        unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 5,
    },
  });

const User = mongoose.model("User", UserSchema);

const TaskSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    priority : {
        type: String,
        required: true,
    },
    date: {
        type: String,
    },
    status: {
        type: String,
        required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
});

const Task = mongoose.model("Task", TaskSchema);

module.exports = { User, Task };