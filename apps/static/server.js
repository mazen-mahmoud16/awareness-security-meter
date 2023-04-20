// This Project needs a PROXY ENV Variable which is the server address

const express = require("express");
const path = require("path");
const app = express();
const { createProxyMiddleware } = require("http-proxy-middleware");

app.use(
  "/api",
  createProxyMiddleware({
    target: process.env.PROXY || "http://localhost:8080/",
    changeOrigin: true,
  })
);

app.use(express.static(path.join(__dirname, "dist")));

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(process.env.PORT || 3000);
