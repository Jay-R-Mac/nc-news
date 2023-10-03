const app = require("../db/app");
const { getTopics } = require("../model/model.js");
const endpoints = require("../endpoints.json");

const sendTopics = function (req, res, next) {
  getTopics().then((data) => {
    res.status(200).send(data);
  });
};

const sendEndpoints = function (req, res, next) {
  res.status(200).send(endpoints);
};
module.exports = { sendTopics, sendEndpoints };
