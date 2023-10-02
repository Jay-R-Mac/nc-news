const express = require("express");
const { sendTopics } = require("./controller/controller")

const app = express();

app.get("/api/topics", sendTopics)








module.exports = app