import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import db from "./src/DAL/models/index.cjs"

// const { db } = require("./src/DAL/models/index.cjs");
dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors({
    origin: "*"
}));

await db.sequelize.sync({ alter: true }).then(() => {
    console.log("sequelize resync database")
});

app.get('/', (req, res) => {
    res.send('Hello world!')
});

app.listen(process.env.PORT || 5000, () => console.log('Server okey'));