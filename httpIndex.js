import express from 'express';
import cors from 'cors';
import AuthRouter from './Routers/AuthRouter.js';
import Connect from './Database/connectToDb.js';

const app = express();
app.use(cors());
app.use(express.json());

async function startHttpServer() {
    try {
        await Connect(); // wait for DB

        app.use('/auth', AuthRouter);

        app.listen(3000, () => {
            console.log("HTTP server running on port 3000");
        });

    } catch (err) {
        console.error("Failed to start HTTP server:", err.message);
        process.exit(1);
    }
}

startHttpServer();