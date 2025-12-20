import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import router from "./routes/index";
import { deleteExpiredTokensJob } from "./cron/deleteExpiredTokens";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
); // TRINH DUYET CHAN --> WHY ?
app.use(morgan("dev")); // log the requests

// Dùng Factory tạo route cho resource
app.use("/api/", router);

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

deleteExpiredTokensJob();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
