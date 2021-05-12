var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var cors = require("cors");
var indexRouter = require("./routes/index");

var culture = require("./routes/culture");
var health = require("./routes/health");
var infrastructure = require("./routes/infrastructure");
var sentiment = require("./routes/sentiment");
var transport = require("./routes/transport");
var reputation = require("./routes/reputation");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.disable("etag");
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/culture", culture);
app.use("/sentiment", sentiment);
app.use("/health", health);
app.use("/infrastructure", infrastructure);
app.use("/transport", transport);
app.use("/reputation", reputation);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
app.listen(8000, function () {
  console.log("listening");
});
