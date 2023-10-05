const app = require("../db/app");
const { getTopics, getArticleId, getArticles, getArticleComments, postComment } = require("../model/model.js");
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
    .catch((err) => {

      next(err)
    })
}

const sendArticleComments = function (req, res, next) {
  const { article_id } = req.params
  Promise.all([getArticleId(article_id), getArticleComments(article_id)]).then((comments) => {
    res.status(200).send(comments[1])
  })
    .catch((err) => {
      next(err)
    })

}

const recieveArticleComments = function (req, res, next) {
  const { article_id } = req.params
  postComment(article_id, req.body).then((comment) => {

    res.status(201).send(comment)
  })
    .catch((err) => {
      next(err)
    })

}
module.exports = { sendTopics, sendEndpoints, sendArticleId, sendArticles, sendArticleComments, recieveArticleComments };
