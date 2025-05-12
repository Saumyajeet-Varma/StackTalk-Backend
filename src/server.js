import http from "http"
import dotenv from "dotenv"
import { Server } from "socket.io"
import jwt from "jsonwebtoken"
import app from "./app.js"

dotenv.config()

const port = process.env.PORT || 3000
const server = http.createServer(app)
const io = new Server(server);

io.use((socket, next) => {

    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1]

        if (!token) {
            return next(new Error("Authentication Error"))
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            return next(new Error("Invalid token"))
        }

        socket.user = decoded

        next()
    }
    catch (err) {
        next(err)
    }
})

io.on('connection', socket => {

    console.log("Socket.io connected")

    socket.on('event', data => { /* … */ });
    socket.on('disconnect', () => { /* … */ });
});

server.listen(port, () => {
    console.log(`Server is listening on port:${port}`);
    console.log(`http://localhost:${port}`)
})