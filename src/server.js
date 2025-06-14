import http from "http"
import dotenv from "dotenv"
import { Server } from "socket.io"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import app from "./app.js"
import projectModel from "./models/project.model.js"
import { generateResult } from "./services/gemini.service.js"

dotenv.config()

const port = process.env.PORT || 8080
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

io.use(async (socket, next) => {

    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1]
        const projectId = socket.handshake.query?.projectId

        if (!mongoose.isValidObjectId(projectId)) {
            return next(new Error("Invalid project Id"))
        }

        if (!token) {
            return next(new Error("Authentication Error"))
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            return next(new Error("Invalid token"))
        }

        socket.user = decoded
        socket.project = await projectModel.findById(projectId)

        next()
    }
    catch (err) {
        next(err)
    }
})

io.on('connection', socket => {

    socket.roomId = socket.project._id.toString()

    console.log("User connected")

    socket.join(socket.roomId)

    socket.on('project-message', async data => {

        const message = data.message

        const aiInMessage = message.includes('@ai')

        socket.broadcast.to(socket.roomId).emit('project-message', data)

        if (aiInMessage) {

            const prompt = message.replace('@ai', '')

            const result = await generateResult(prompt)

            io.to(socket.roomId).emit('project-message', {
                message: result,
                sender: {
                    _id: "ai",
                    username: "@ai"
                }
            })

            return
        }
    })

    socket.on('event', data => { /* … */ });

    socket.on('disconnect', () => {
        console.log("User disconnected")
        socket.leave(socket.roomId)
    });
});

server.listen(port, () => {
    console.log(`Server is listening on port:${port}`);
    console.log(`http://localhost:${port}`)
})