const express = require("express");
const { sendTopics } = require("../controller/controller");

const app = express();

app.get("/api/topics", sendTopics);

app.all("/*", (req, res) => {
  res.status(404).send({ message: "Not Found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "Internal Server Error" });
});

module.exports = app;
