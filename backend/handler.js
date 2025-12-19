import serverless from "serverless-http";
import app from "./app.js";

export const hello = serverless(app);
