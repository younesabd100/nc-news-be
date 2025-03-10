const app = require("../app");
const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
        expect(endpoints["GET /api"].description).toEqual(
          "serves up a json representation of all the available endpoints of the api"
        );
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topics object, and should have the right property", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBeGreaterThan(0);
        body.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("404: Responds with an array of topics object, and should have the right property", () => {
    return request(app)
      .get("/api/nonvalid")
      .expect(404)
      .then((body) => {
        console.log(body);
        expect(body.notFound).toBe(true);
      });
  });
});
