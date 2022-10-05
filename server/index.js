const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const db = require("./src/DAL/models/index.js");

dotenv.config();

const app = express();

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin: "*"
}));

// @sequelize-sync
// db.sequelize.sync({ alter: true }).then(() => {
//     console.log("sequelize resync database")
// });

// @routes
const authRoutes = require("./src/Core/routes/auth")

app.use("/api/v1/auth", authRoutes)

app.get('/', (req, res) => {
    res.send('Hello world!')
});

app.listen(process.env.PORT || 5000, () => console.log('Server okey'));