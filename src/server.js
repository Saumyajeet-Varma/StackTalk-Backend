import http from "http"
import dotenv from "dotenv"
import { Server } from "socket.io"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import app from "./app.js"
import projectModel from "./models/project.model.js"

dotenv.config()

const port = process.env.PORT || 3000
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

    console.log("Socket.io connected")

    socket.join(socket.project._id)

    socket.on('project-message', data => {
        console.log(data)
        socket.broadcast.to(socket.project._id).emit('project-message', data)
    })

    socket.on('event', data => { /* … */ });
    socket.on('disconnect', () => { /* … */ });
});

server.listen(port, () => {
    console.log(`Server is listening on port:${port}`);
    console.log(`http://localhost:${port}`)
})