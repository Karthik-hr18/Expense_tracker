import express from "express";
import mongoose from "mongoose";
import dotEnv from "dotenv";
import route from "./route/routes.js";
import cors from "cors";


const app = express();
app.use(cors());
app.use(express.json());
dotEnv.config();

const PORT = process.env.PORT || 7000;
const MONGO_URL = process.env.MONGO_URL;
app.get("/", (req, res) => {
    res.send("Expense Tracker API Running");
});
mongoose.connect(MONGO_URL).then(() => {
    console.log("DB Connected Successfully");
    app.listen(PORT, () => {
        console.log(`Listening in port: ${PORT}`)
    });
}).catch((error) => {
    console.log(error)
});

app.use("/api", route);