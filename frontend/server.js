const express = require("express");
const path = require("path");
const app = express();

// TODO: set the server socket and do the same in nginx
// TODO: set the server socket with .env

require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const port = process.env.WEB_PORT || 3000;
const host = process.env.WEB_HOST || "127.0.0.1";
const appName = process.env.APP_NAME || "Auto Servis App Frontend";

// health check
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// start server
app.listen(port, host, () => {
  console.log(`${appName} spun up and listening at http://${host}:${port}!`);
  console.log(`Health check available at http://${host}:${port}/health`);
});
