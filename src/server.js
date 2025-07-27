import http from "http"
import dotenv from "dotenv"
import { Server } from "socket.io"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import app from "./app.js"
import projectModel from "./models/project.model.js"
import projectMessageModel from "./models/projectMessage.model.js"
import User from "./models/user.model.js"
import { generateResult } from "./services/gemini.service.js"

dotenv.config()

const port = process.env.PORT || 8080
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
        credentials: true,
    }
});

io.use(async (socket, next) => {

    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(" ")[1]
        const projectId = socket.handshake.query?.projectId

        if (!mongoose.isValidObjectId(projectId)) {
            return next(new Error("Invalid project Id"))
        }

        if (!token) {
            return next(new Error("Authentication Error"))
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const fullUser = await User.findOne({ email: decoded.email }).select("_id username email");

        if (!fullUser) {
            return next(new Error("Invalid token"))
        }

        socket.user = fullUser
        socket.project = await projectModel.findById(projectId)

        next()
    }
    catch (err) {
        next(err)
    }
})

io.on('connection', socket => {

    socket.roomId = socket.project._id.toString()

    socket.join(socket.roomId)
    console.log("User connected")

    // socket.on('event', data => { /* … */ });

    socket.on("project-message", async (data) => {

        try {
            io.to(socket.project._id.toString()).emit("project-message", data);

            await projectMessageModel.create({
                projectId: socket.project._id,
                sender: data.sender,
                message: data.message,
            });

            if (data.message.includes("@ai")) {

                const prompt = data.message.replace("@ai", "");
                const result = await generateResult(prompt);
                const aiMsg = {
                    projectId: socket.project._id,
                    sender: { _id: "ai", username: "@ai" },
                    message: result,
                };

                io.to(socket.project._id.toString()).emit("project-message", aiMsg);
                await projectMessageModel.create(aiMsg);
            }
        }
        catch (err) {
            console.error("socket err:", err.message);
        }
    });

    socket.on('disconnect', () => {
        console.log("User disconnected")
        socket.leave(socket.roomId)
    });
});

server.listen(port, () => {
    console.log(`Server is listening on port:${port}`);
    console.log(`http://localhost:${port}`)
})