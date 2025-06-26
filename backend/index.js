import express from "express";
import DbConection from "./config/DbConnection.js";
import router from "./routes/auth.js";
import cors from "cors";
DbConection();
const app = express();
const port = 3001;
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth/", router);

app.listen(port, () => {
  console.log(`Server Alive At Port : ${port}`);
});
