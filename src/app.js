import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connect from "./db/db.js";
import userRoutes from "./routes/user.route.js"

dotenv.config()

const app = express()

connect()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"))

app.use("/users", userRoutes)

app.get('/', (req, res) => {
    res.send("Hello world");
})

export default app;