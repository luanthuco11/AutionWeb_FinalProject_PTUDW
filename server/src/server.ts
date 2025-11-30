import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import router from "./routes/index";
import { UserRoute } from "./routes/UserRoute";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
app.use(morgan("dev")); // log the requests

// Dùng Factory tạo route cho resource
app.use("/api/", router);

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});
// const userRoute = new UserRoute();

// app.use("/user", userRoute.router); // ← mount router vào /user

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
