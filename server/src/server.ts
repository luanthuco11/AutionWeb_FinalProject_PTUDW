import express from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());
app.use(morgan("dev")); // log the requests

// Dùng Factory tạo route cho resource
app.use("/", routes);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



