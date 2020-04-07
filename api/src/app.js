if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "development";
}

import "./config/environment";
import "./services/database";

import express from "express";
import cors from "cors";
import expressIp from "express-ip";
import { errors } from "celebrate";
import expressUserAgent from "express-useragent";
import routes from "./routes";

const app = express();

app.use(cors());
app.use(expressIp().getIpInfoMiddleware);
app.use(expressUserAgent.express());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/v1", routes);
app.use(errors());

export default app;
