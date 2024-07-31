const express = require("express");
const userRouter = require("./user");
const taskRouter = require("./task");

const router = express.Router();
router.use("/user", userRouter);
router.use("/task", taskRouter);

module.exports = router;
