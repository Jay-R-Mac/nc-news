const db = require("../db/connection");

function getTopics() {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
}

function getArticleId(articleId) {
  return db
    .query("SELECT * FROM articles WHERE article_id =$1;", [articleId])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Article Not Found",
        });
      }
      return rows[0];
    })

}

module.exports = { getTopics, getArticleId };
