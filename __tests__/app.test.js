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
  test("200: Respond with an array of comments for the given article_id of which each comment should have the following properties:", () => {
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
            article_id: 1,
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
        expect(body.msg).toBe("article not found");
      });
  });
  test("404: Responds with an error when queried an invalid article_id", () => {
    return request(app)
      .get("/api/articles/invalid/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("200: Responds with an ampty array when no comments exist from this user id", () => {
    return request(app)
      .get("/api/articles/10/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
      });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with the posted comment", () => {
    const newComment = {
      username: "icellusedkars",
      body: "not a fan of this article",
    };
    return request(app)
      .post("/api/articles/10/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          comment_id: 19,
          votes: 0,
          created_at: expect.any(String),
          author: "icellusedkars",
          body: "not a fan of this article",
          article_id: 10,
        });
      });
  });
  test("400: Responds with an error if a field is missing", () => {
    const newComment = {
      username: "icellusedkars",
    };
    return request(app)
      .post("/api/articles/10/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing info");
      });
  });
  test("400: Responds with an error when correct field but incorrect value", () => {
    const newComment = {
      username: 4645,
      body: "not a fan of this article",
    };
    return request(app)
      .post("/api/articles/10/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid data type entered");
      });
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with an updated article by artcile_id", () => {
    const newArticle = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/6")
      .send(newArticle)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          article_id: 6,
          title: "A",
          topic: "mitch",
          author: "icellusedkars",
          body: "Delicious tin of cat food",
          created_at: "2020-10-18T01:00:00.000Z",
          votes: 1,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("400: Responds with an error if a field is missing", () => {
    const newVote = {};
    return request(app)
      .patch("/api/articles/6")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing info");
      });
  });
  test("400: Responds with an error when correct field but incorrect value", () => {
    const newVote = { inc_votes: "word" };
    return request(app)
      .patch("/api/articles/6")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid data type entered");
      });
  });
});
