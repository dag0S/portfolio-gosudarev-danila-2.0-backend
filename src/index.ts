import express from "express";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

import router from "./routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 4321;

app.use(logger("dev"));
app.use(express.static(path.resolve(__dirname, "static/books/")));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api", router);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
