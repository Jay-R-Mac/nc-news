const app = require("../db/app");
const { getTopics } = require("../model/model.js");

const sendTopics = function (req, res, next) {
  getTopics().then((data) => {
    res.status(200).send(data);
  });
};

module.exports = { sendTopics };
