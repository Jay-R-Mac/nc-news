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

function getArticles() {
  return db.query(
    `SELECT articles.article_id,
    articles.title,
    articles.topic,
    articles.author,
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT OUTER JOIN comments
   ON articles.article_id = comments.article_id
   GROUP BY articles.article_id
   ORDER BY articles.created_at DESC;
   `)
    .then(({ rows }) => {
      return rows
    })
}

function getArticleComments(articleId) {
  return db
    .query("SELECT * FROM comments WHERE article_id =$1 ORDER BY comments.created_at DESC;", [articleId])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Article Not Found",
        });
      }
      return rows;
    })

}

function postComment(article, newComment) {
  const { username, body } = newComment
  const author = username
  const article_id = article
  return db.query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Article Not Found",
        });
      }
      return db.query("INSERT INTO comments (author, body, article_id) VALUES ($1,$2,$3) RETURNING *;", [author, body, article_id])
        .then(({ rows }) => {
          return rows[0]
        })

    })
}




module.exports = { getTopics, getArticleId, getArticles, getArticleComments, postComment };
