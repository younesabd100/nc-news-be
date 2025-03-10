const endpoints = require("../endpoints.json");
const { selectTopics } = require("../model/model.enpoint,js");

exports.getApi = (req, res) => {
  res.status(200).send({ endpoints });
};

exports.getTopics = (req, res) => {
  return selectTopics().then((rows) => {
    res.status(200).send(rows);
  });
};
