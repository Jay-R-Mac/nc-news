const app = require("../db/app");
const { getTopics, getArticleId, getArticles } = require("../model/model.js");
const endpoints = require("../endpoints.json");

const sendTopics = function (req, res, next) {
  getTopics().then((data) => {
    res.status(200).send(data);
  });
};

const sendEndpoints = function (req, res, next) {
  res.status(200).send(endpoints);
};

const sendArticleId = function (req, res, next) {
  const { article_id } = req.params;

  getArticleId(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })

    .catch((err) => {
      next(err);
    });
};

const sendArticles = function (req, res, next) {
  getArticles().then((articles) => {
    res.status(200).send(articles)
  })


}
module.exports = { sendTopics, sendEndpoints, sendArticleId, sendArticles };
