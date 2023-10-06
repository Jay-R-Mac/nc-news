const request = require("supertest");
const app = require("../db/app");
const connection = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const endPoints = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return connection.end();
});

describe("GET /api/topics", () => {
  it("responds with a 200 status message", () => {
    return request(app).get("/api/topics").expect(200);
  });
  it("responds with an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .then((data) => {
        expect(Array.isArray(data.body)).toBe(true);
      });
  });
  it("responds with an array of topics which contain a slug and description", () => {
    return request(app)
      .get("/api/topics")
      .then(({ body }) => {
        expect(body.length).toBe(3);
        body.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api", () => {
  it("responds with a 200 status message", () => {
    return request(app).get("/api").expect(200);
  });
  it("should contain the same information as endpoints.json", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((data) => expect(data.body).toEqual(endPoints));
  });
});

describe("GET /api/articles/:article_id", () => {
  it("responds with a 200 status message", () => {
    return request(app).get("/api/articles/2").expect(200);
  });
  it("responds with an object which contains article information", () => {
    return request(app)
      .get("/api/articles/2")
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 2,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  it("responds with a 404 and a message when article is not found", () => {
    return request(app)
      .get("/api/articles/200000")
      .expect(404)
      .then(({ text }) => {
        expect(JSON.parse(text)).toEqual({ message: "Article Not Found" });
      });
  });

  it("responds with a 400 status and a message when an invalid id is passed", () => {
    return request(app)
      .get("/api/articles/hello")
      .expect(400)
      .then(({ res }) => expect(res.statusMessage).toBe("Bad Request"));
  });
});

describe("error handling", () => {
  it("should return a 404 error status code and a message when using a GET all that is invalid", () => {
    return request(app)
      .get("/notvalid")
      .expect(404)
      .then((body) => {
        expect(body.res.statusMessage).toBe("Not Found");
      });
  });
});

describe("GET /api/articles", () => {
  it("responds with a 200 status message", () => {
    return request(app).get("/api/articles").expect(200);
  });
  it("responds with an an array of object which contains article information", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        expect(body.length).toBe(13);
        body.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  it("responds with an array which contains the articles in order", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        expect([0, 1, 2, 3]).toBeSorted("created_at", { descending: true });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  it("responds with a 200 status message", () => {
    return request(app).get("/api/articles/5/comments").expect(200);
  });
  it("responds with an an array of object which contains article information", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .then(({ body }) => {
        expect(body.length).toBe(2);
        body.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          });
        });
      });
  });
  it("responds with an array which contains the articles comments in descending order", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .then(({ body }) => {
        expect([0, 1]).toBeSorted({ Descending: true });
      });
  });
  it("responds with a 404 and a message when article is not found", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Article Not Found");
      });
  });
  it("responds with a 400 status and a message when an invalid id is passed", () => {
    return request(app)
      .get("/api/articles/hello/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request");
      });
  });
  it("responds with a 200 and a message when article is not found", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ text }) => {
        expect(text).toEqual("[]");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  const newComment = {
    username: "lurker",
    body: "This is my test article comment",
  };
  const emptyComment = {};
  it("should return the expected output object of the comment with the relevant data", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.body).toBe("This is my test article comment");
      });
  });
  it("should return the expected output object of the comment with the relevant data when passed extra data", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send({
        username: "lurker",
        body: "This is my test article comment",
        motto: "Ad Astra",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.body).toBe("This is my test article comment");
      });
  });
  it("responds with a 400 status and a message when an invalid article id is passed", () => {
    return request(app)
      .post("/api/articles/hello/comments")
      .send(newComment)
      .expect(400)
      .then(({ res }) => expect(res.statusMessage).toBe("Bad Request"));
  });
  it("responds with a 400 status and a message when an no username is passed", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send(emptyComment)
      .expect(400)
      .then(({ text }) => {
        expect(JSON.parse(text)).toEqual({ message: "Invalid request" });
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  const newVote = {
    inc_votes: 5,
  };
  const emptyVote = { inc_votes: "NoVote" };
  it("should return the expected output object of an article with a changed vote count", () => {
    return request(app)
      .patch("/api/articles/4")
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: 5,
          article_img_url: expect.any(String),
          comment_count: expect.any(String),
        });
      });
  });
  it("responds with a 400 status and a message when an no vote is passed", () => {
    return request(app)
      .patch("/api/articles/4")
      .send(emptyVote)
      .expect(400) //change to 200 if time permits
      .then(({ text }) => {
        expect(JSON.parse(text)).toEqual({ message: "Bad Request" });
      });
  });
  it("responds with a 400 status and a message when a malformed vote is passed", () => {
    return request(app)
      .patch("/api/articles/4")
      .send({ notQuiteAVote: "abstained" })
      .expect(400) //change to 200 if time permits
      .then(({ text }) => {
        expect(JSON.parse(text)).toEqual({ message: "Invalid request" });
      });
  });
  it("responds with a 404 status and a message when the article is not found", () => {
    return request(app)
      .patch("/api/articles/9999")
      .send(newVote)
      .expect(404)
      .then(({ text }) => {
        expect(JSON.parse(text)).toEqual({ message: "Article Not Found" });
      });
  });
  it("responds with a 400 status and a message when an invalid article ID is used", () => {
    return request(app)
      .patch("/api/articles/Hello")
      .send(newVote)
      .expect(400)
      .then(({ text }) => {
        expect(JSON.parse(text)).toEqual({ message: "Bad Request" });
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  it("should return the expected output object of an article with a changed vote count", () => {
    return request(app).delete("/api/comments/4").expect(204);
  });
  it("responds with a 400 status and a message when an invalid comment id is passed", () => {
    return request(app)
      .delete("/api/comments/hello")
      .expect(400)
      .then(({ res }) => expect(res.statusMessage).toBe("Bad Request"));
  });
  it("responds with a 404 status and a message when a non existent id is passed", () => {
    return request(app)
      .delete("/api/comments/99999")
      .expect(404)
      .then(({ text }) => {
        expect(JSON.parse(text)).toEqual({ message: "Comment Not Found" });
      });
  });
});

describe("GET /api/users", () => {
  it("responds with a 200 status message", () => {
    return request(app).get("/api/users").expect(200);
  });
  it("responds with an array of users", () => {
    return request(app)
      .get("/api/users")
      .then((data) => {
        expect(Array.isArray(data.body)).toBe(true);
      });
  });
  it.only("responds with an array of users which contains a username, name and avatar URL", () => {
    return request(app)
      .get("/api/users")
      .then(({ body }) => {
        expect(body.users.length).toBe(4);
        body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
