exports.handlePsqlError = (error, request, response, next) => {
  if (error.code === "22P02") {
    response.status(400).send({ msg: "bad request" });
    // } else if (error.code === "42703") {
    //   response.status(400).send({ msg: "category is not found" });
  }
  next(error);
};
exports.handleServerError = (error, request, response, next) => {
  response.status(error.status).send({ msg: error.msg });
};
