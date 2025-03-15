const {
  convertTimestampToDate,
  createLookup,
  checkArticleIdExist,
  checkColumnExist,
  checkTopicExist,
} = require("../db/seeds/utils");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});
describe("createLookup", () => {
  test("returns a new obkect", () => {
    const array = [
      { id: 1, name: "topic" },
      { id: 2, name: "slug" },
      { id: 3, name: "coding" },
    ];
    const key = "slug";
    const value = "topics";
    const result = createLookup(array, key, value);
    expect(result).not.toBe(array);
    expect(result).toBeObject();
  });
  test("creates a lookup object from an array of objects", () => {
    const array = [
      { id: 1, name: "topic" },
      { id: 2, name: "slug" },
      { id: 3, name: "coding" },
    ];
    const expectedOutput = { topic: 1, slug: 2, coding: 3 };

    expect(createLookup(array, "name", "id")).toEqual(expectedOutput);
  });
});
describe("checkArticleIdExist", () => {
  test("function should resolves with true if an article_id exists", () => {
    const article_id = 1;
    checkArticleIdExist(article_id).then((res) => {
      expect(res.article_id).toBe(article_id);
    });
  });
  test("function should reject when an article_id does not  exists", () => {
    const article_id = 9090;
    checkArticleIdExist(article_id).catch((err) => {
      expect(err.status).toBe(404);
    });
  });
});
describe("checkColumnExist", () => {
  test("function should resolves with true if an column exists", () => {
    const column = "author";
    const table = "articles";
    checkColumnExist(column, table).then(() => {
      expect(true).toBe(true);
    });
  });
  test("function should reject when an article_id does not  exists", () => {
    const column = "fromage";
    const table = "articles";
    checkColumnExist(column, table).catch((err) => {
      expect(err.status).toBe(404);
    });
  });
});
// describe("checkTopicExist", () => {
//   // test("function should resolves with true if a topic exists", () => {
//   //   const topic = "mitch";
//   //   checkTopicExist(topic).then(() => {
//   //     expect(true).toBe(true);
//   //   });
//   // });
//   test("function should reject when a topic does not  exists", () => {
//     const topic = "fromage";
//     checkTopicExist(topic).catch((err) => {
//       expect(err.status).toBe(404);
//     });
//   });
// });
