import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { ENV_VARS } from "./utils/env.js";

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const PORT = ENV_VARS.PORT || 5000;

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
