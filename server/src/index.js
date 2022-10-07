const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const db = require("./DAL/models/index.js");
const { PORT } = require("../config.js");

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin: "*"
}));

// @sequelize-sync
// db.sequelize.sync({ alter: true }).then(() => {
//     console.log("sequelize resync database")
// });

// @routes
const shortlinksRoutes = require("./Core/routes/shorterlinks");

app.use("/api/v1/shortlinks", shortlinksRoutes)

app.get('/', (req, res) => {
    res.send(`Hello world! ${PORT}`)
});

app.listen(PORT, () => console.log(`Server okey => PORT: ${PORT}`));