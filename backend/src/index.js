import express from "express";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import errorHandler from "./middleware/errorHandlerMiddleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";

dotenv.config();

// const app = express(); // WE have create this one in socket io. and will use that one
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/messages", messageRoutes);

app.use(errorHandler);

const port = process.env.PORT;

server.listen(port, () => {
  connectDB();
  console.log(`Server is up & running on ${port}`);
});
