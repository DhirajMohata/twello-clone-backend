const express = require("express");
const { User, Task } = require("../db");
const zod = require("zod");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { authMiddleware } = require("../middleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/addTask", async (req, res) => {
    const taskObject = req.body;
    taskObject.user = req.userId;
    console.log(taskObject);
    const task = await Task.create(taskObject);
    if(!task) {
        return res.status(411).json({
            message: "Incorrect inputs",
        });
    }
    res.json({
        message: "Task created successfully",
        task,
    });
});

router.get("/getTasks", async (req, res) => {
    const userId = req.userId;
    console.log(userId);
    const tasks = await Task.find({user: userId});
    console.log(tasks);
    res.json(tasks);
});

router.post('/updateTask', async (req, res) => {
    const { taskId, status } = req.body;
  
    console.log(req.body);
      await Task.findByIdAndUpdate(taskId, {
        status: status,
      });
    
  
    res.status(200).json({ message: 'Order updated successfully' });
  });
  
  router.post('/updateTasksBatch', async (req, res) => {
    const {taskId , newStatus} = req.body; // Array of { taskId, status }
    console.log(req.body);
    try {
        await Task.findByIdAndUpdate(taskId, {
            status: newStatus,
          });
        console.log("Tasks updated successfully");
      res.status(200).send({ message: 'Tasks updated successfully' });
    } catch (error) {
      res.status(500).send({ error: 'Error updating tasks' });
    }
  });
  
router.delete("/deleteTask", async (req, res) => {
    const taskId = res.body.id;
    const userId = req.userId;
    const task = await Task.findOneAndDelete({_id: taskId, user: userId});
    if(!task) {
        return res.status(411).json({
            message: "Task not found",
        });
    }
    res.json({
        message: "Task deleted successfully",
    });
});

module.exports = router;