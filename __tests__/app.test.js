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
      .then(({ body }) =>  {console.log(body)
        expect(body.article).toMatchObject({
          article_id: 2,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        })
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
  it("should return a 404 error status code and a message when using a GET", () => {
    return request(app)
      .get("/notvalid")
      .expect(404)
      .then((body) => {
        expect(body.res.statusMessage).toBe("Not Found");
      });
  });
});
