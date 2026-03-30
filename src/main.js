import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
import { ENV_VARS } from "./utils/env.js";

const app = express();
app.use(express.json({ limit: "100mb" }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: ENV_VARS.CLIENT_URL }));
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const PORT = ENV_VARS.PORT || 5000;

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
