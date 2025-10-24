const express = require("express");
const path = require("path");
const app = express();

// TODO: set the server socket and do the same in nginx

// In Docker: vars already injected by compose, no need to load file
// Local dev: load frontend/.env.dev.local
if (!process.env.DOCKER_ENV)
  require("dotenv").config({ path: ".env.dev.local" });

const appName = process.env.APP_NAME;

const host = process.env.WEB_HOST;
const port = process.env.WEB_PORT;

// health check
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// start server
app.listen(port, host, () => {
  console.log(`${appName} spun up and listening at http://${host}:${port}!`);
  console.log(`Environment: ${process.env.DOCKER_ENV ? "Docker" : "Local"}`);
  console.log(
    `Health check available at http://${
      process.env.DOCKER_ENV ? process.env.LOCAL_DEV_HOST : host
    }:${port}/health`
  );
});
