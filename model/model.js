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
    });
}

function getArticles(topic) {
  const defaultQueryString = `SELECT articles.article_id,
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
`;

  const topicQueryString = `SELECT articles.article_id,
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
WHERE articles.topic = $1
GROUP BY articles.article_id
ORDER BY articles.created_at DESC;
`;
  if (topic) {
    return db.query(topicQueryString, [topic]).then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Topic Not Found",
        });
      }
      return rows;
    });
  } else {
    return db.query(defaultQueryString).then(({ rows }) => {
      return rows;
    });
  }
}

function getArticleComments(articleId) {
  return db
    .query(
      "SELECT * FROM comments WHERE article_id =$1 ORDER BY comments.created_at DESC;",
      [articleId]
    )
    .then(({ rows }) => {
      return rows;
    });
}

function postComment(article, newComment) {
  const { username, body } = newComment;
  const author = username;
  const article_id = article;
  if (!username || !body) {
    return Promise.reject({ status: 400, message: "Invalid request" });
  }
  return db
    .query(
      "INSERT INTO comments (author, body, article_id) VALUES ($1,$2,$3) RETURNING *;",
      [author, body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

function castVote(article, vote) {
  const { inc_votes } = vote;

  if (!inc_votes) {
    return Promise.reject({ status: 400, message: "Invalid request" });
  }
  return db
    .query(
      `
    UPDATE articles 
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING (SELECT COUNT(comment_id) FROM comments WHERE article_id = $2) AS comment_count, *;
  `,
      [inc_votes, article]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

function deleteComment(commentId) {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING*", [commentId])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Comment Not Found",
        });
      }
    });
}

function getUsers() {
  return db.query("SELECT * FROM users;").then(({ rows }) => {
    return rows;
  });
}
module.exports = {
  getTopics,
  getArticleId,
  getArticles,
  getArticleComments,
  postComment,
  castVote,
  deleteComment,
  getUsers,
};
