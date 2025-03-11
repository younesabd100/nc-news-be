const app = require("../app");
const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
require("jest-sorted");

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
        const { article } = body;
        expect(article.length).toBeGreaterThan(0);
        article.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with the appropriate article in the database", () => {
    return request(app)
      .get("/api/articles/6")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.article_id).toBe(6);
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("404: Responds with a not found message when queried an article_id that is not in the database", () => {
    return request(app)
      .get("/api/articles/600")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article not found");
      });
  });
  test("400: Responds with a bad request when queried an invalid character as article_id", () => {
    return request(app)
      .get("/api/articles/string")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});
describe("GET /api/articles", () => {
  test("200: Responds with an array of article object, and should have the right property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.length).toBeGreaterThan(0);
        article.forEach((art) => {
          expect(art).toMatchObject({
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("200: Responds with an array of article object, and should be sorted by date descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.length).toBeGreaterThan(0);
        const dateSorted = [];
        article.map((art) => dateSorted.push(art.created_at));
        expect(dateSorted).toBeSorted({ descending: true });
      });
  });

  test("404: Responds with not found when passing the wrong path", () => {
    return request(app)
      .get("/api/nonvalid")
      .expect(404)
      .then((body) => {
        expect(body.notFound).toBe(true);
      });
  });
});
describe("GET /api/articles/:article_id/comments", () => {
  test("200: an array of comments for the given article_id of which each comment should have the following properties:", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toBeGreaterThan(0);
        comments.forEach((com) => {
          expect(com).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
  test("200: Responds with an array of comments object, and should be sorted by date descending order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;

        expect(comments.length).toBeGreaterThan(0);
        const dateSorted = [];
        comments.map((art) => dateSorted.push(art.created_at));
        expect(dateSorted).toBeSorted({ descending: true });
      });
  });

  test("404: Responds with a not found message when queried an article_id that is not in the database", () => {
    return request(app)
      .get("/api/articles/600/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("no comments or incorect article_id");
      });
  });
  test("404: Responds when no comments exist from this user id", () => {
    return request(app)
      .get("/api/articles/10/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("no comments or incorect article_id");
      });
  });
});
