const app = require("../db/app");
const {
  getTopics,
  getArticleId,
  getArticles,
  getArticleComments,
  postComment,
  castVote,
  deleteComment,
  getUsers,
} = require("../model/model.js");
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
  getArticles()
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch((err) => {
      next(err);
    });
};

const sendArticleComments = function (req, res, next) {
  const { article_id } = req.params;
  Promise.all([getArticleId(article_id), getArticleComments(article_id)])
    .then((comments) => {
      res.status(200).send(comments[1]);
    })
    .catch((err) => {
      next(err);
    });
};

const receiveArticleComments = function (req, res, next) {
  const { article_id } = req.params;
  postComment(article_id, req.body)
    .then((comment) => {
      res.status(201).send(comment);
    })
    .catch((err) => {
      next(err);
    });
};

const receiveArticleVotes = function (req, res, next) {
  const { article_id } = req.params;
  Promise.all([getArticleId(article_id), castVote(article_id, req.body)])
    .then((article) => {
      res.status(200).send(article[1]);
    })
    .catch((err) => {
      next(err);
    });
};

const selectComment = function (req, res, next) {
  const { comment_id } = req.params;

  deleteComment(comment_id)
    .then(() => {
      res.status(204).send();
    })

    .catch((err) => {
      next(err);
    });
};

const sendUsers = function (req, res, next) {
  getUsers().then((users) => {
    res.status(200).send(users);
  });
};
module.exports = {
  sendTopics,
  sendEndpoints,
  sendArticleId,
  sendArticles,
  sendArticleComments,
  receiveArticleComments,
  receiveArticleVotes,
  selectComment,
  sendUsers,
};
