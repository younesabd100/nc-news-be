exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handlePsqlError = (error, request, response, next) => {
  if (error.code === "22P02") {
    response.status(400).send({ msg: "bad request" });
  }
  if (error.code === "42703") {
    response.status(400).send({ msg: "column not found " });
  }
  next(error);
};
exports.handleServerError = (error, request, response, next) => {
  // console.log(error);
  response.status(error.status).send({ msg: error.msg });
};
