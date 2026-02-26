import { WebSocketServer } from "ws";
import Connect from "./Database/connectToDb.js";
// import handleAuth from "./auth";

async function startServer() {
    try {
        await Connect(); // wait for DB

        const server = new WebSocketServer({ port: 8080 });

        console.log("WebSocket server started successfully");

        server.on("connection", (socket, req) => {
            // const user = handleAuth(req); // can do this if user needs to be login to use the code editor 

            socket.on("message", (message) => {
                console.log("Received:", message.toString());
            });

            socket.on("close", () => {
                console.log("Client disconnected");
            });

            socket.on("error", (err) => {
                console.log("Socket error:", err);
            });
        });

        server.on("error", (err) => {
            console.log("Server error:", err);
        });

    } catch (err) {
        console.error("Failed to start server:", err.message);
        process.exit(1); // stop process completely
    }
}

startServer();