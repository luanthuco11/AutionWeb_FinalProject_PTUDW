import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import router from "./routes/index";
import { deleteExpiredTokensJob } from "./cron/deleteExpiredTokens";
import { checkEndTimeProduct } from "./cron/checkEndTimeProduct";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(morgan("dev")); // log the requests

// Dùng Factory tạo route cho resource
app.use("/api/", router);

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

deleteExpiredTokensJob();
checkEndTimeProduct();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
