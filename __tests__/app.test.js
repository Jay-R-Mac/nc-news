const request = require("supertest");
const app = require("../app.js");
const connection = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const { string } = require("pg-format");

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
        body.forEach((topic)=>{
          expect(topic).toMatchObject({
            slug : expect.any(String),
            description: expect.any(String)
          })
        })
        
      });
  });
});

describe("error handling", ()=>{
  it("should return a 404 error status code when using a GET all",()=>{
    return request(app).get("/api/notvalid").expect(404)
  })
})