const express = require("express");
const { User, Task } = require("../db");
const zod = require("zod");
const jwt = require("jsonwebtoken");
require("dotenv").config(); 
const JWT_SECRET = process.env.JWT;
const bcrypt = require("bcrypt");

const router = express.Router();

const signupSchema = zod.object({
  username: zod.string(),
  email: zod.string().email(),
  password: zod.string().min(5),
});

router.post("/signup", async (req, res) => {
    
  const userObject = req.body;
  const hashedPassword = await bcrypt.hash(userObject.password, 10);

  const response = signupSchema.safeParse(userObject);

  if (!response.success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }

  const existingUser = await User.findOne({
    email: userObject.email,
  });

  if (existingUser)
    res.status(411).json({
      message: "Email already taken",
    });

  const user = await User.create({
    username: userObject.username,
    email: userObject.email,
    password: hashedPassword,
  });

  const userId = user._id;


  const token = jwt.sign({ userId }, JWT_SECRET);

  res.json({
    message: "User created successfully",
    token: token,
  });
});


router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (isMatch) {
        const userId = user._id;
        const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' }); 
        
        res.json({ token, username:user.username });
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });



module.exports = router;
