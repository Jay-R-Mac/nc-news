const request = require("supertest");
const app = require("../db/app");
const connection = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const endPoints = require("../endpoints.json")

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
    return request(app).get("/api").expect(200)
    .then(data => expect(data.body).toEqual(endPoints));
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
