const db = require("../db/connection");

function getTopics() {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
}

module.exports = { getTopics };
