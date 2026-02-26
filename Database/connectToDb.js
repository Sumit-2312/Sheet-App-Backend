import mongoose from "mongoose";

async function Connect() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/DSA_SHEET_APP");
        
        console.log("Connected to database via websocket server and http server ");

        return {
            success: true
        };

    } catch (err) {
        return {
            success: false,
            error: err.message
        };
    }
}

export default Connect;