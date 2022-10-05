import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors({
    origin: "*"
}));

app.get('/', (req, res) => {
    res.send('Hello world!')
});

app.listen(process.env.PORT || 5000, () => console.log('Server okey'));