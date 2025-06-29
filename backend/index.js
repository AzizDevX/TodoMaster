import express from "express";
import DbConection from "./config/DbConnection.js";
import auth from "./routes/auth.js";
import addTask from "./routes/addTask.js";
import DelTask from "./routes/delTask.js";
import Edit from "./routes/editTask.js";

import showAll from "./routes/showAll.js";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
DbConection();
const app = express();
const port = process.env.port;
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", auth);
app.use("/api", addTask);
app.use("/api", DelTask);
app.use("/api", showAll);
app.use("/api", Edit);

app.listen(port, () => {
  console.log(`Server Alive At Port : ${port}`);
});
