import express from "express"
import type { Request,  Response } from "express";
import cors from "cors";

const app = express();
const PORT = 8080;

app.use(cors());

app.get("/", (req: Request, res: Response) => {
    res.json({message: "hello world"});
})

app.listen(PORT, () => {
    console.log("Server is running on port 8080")
})
export default app;