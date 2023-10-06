const express = require("express");
const {
  sendTopics,
  sendEndpoints,
  sendArticleId,
  sendArticles,
  sendArticleComments,
  receiveArticleComments,
  receiveArticleVotes,
  selectComment,
  sendUsers,
} = require("../controller/controller");

const app = express();

app.use(express.json());

app.get("/api/topics", sendTopics);

app.get("/api/users", sendUsers);

app.get("/api", sendEndpoints);

app.get("/api/articles/:article_id", sendArticleId);

app.get("/api/articles", sendArticles);

app.get("/api/articles/:article_id/comments", sendArticleComments);

app.post("/api/articles/:article_id/comments", receiveArticleComments);

app.patch("/api/articles/:article_id/", receiveArticleVotes);

app.delete("/api/comments/:comment_id", selectComment);

app.all("/*", (req, res) => {
  res.status(404).send({ message: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err)
  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad Request" });
  } else if (err.status) {
    res.status(err.status).send({ message: err.message });
  } else {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = app;
