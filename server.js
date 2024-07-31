const express = require("express");
const rootRouter = require("./routes/index");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
mongoose.connect(process.env.DATABASE_URL).then(console.log("connexr")).catch((error) => console.log(error));

const allowedOrigins = ['http://localhost:3000' , 'https://twello-clone-frontend.vercel.app'];
const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.options('*', cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

app.use("/api/v1", rootRouter);

app.listen(5000);

module.exports = app;
