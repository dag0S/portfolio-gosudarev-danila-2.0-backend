import express from "express";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import router from "./routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(logger("dev"));
app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.use("/api", router);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
