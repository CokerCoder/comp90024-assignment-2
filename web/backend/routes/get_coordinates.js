const express = require("express");
const router = express.Router();

ip = "http://admin:admin@172.26.132.83:5984";

const nano = require("nano")(ip);

router.get("/", async function (req, res, next) {
  var shape = [];
  let id = req.query.id;
  var db = nano.use("tweet_docs");
  await db.view("twitter", "get_tweets").then((body) => {
    body.rows.forEach((doc) => {
      console.log(doc.value.Coordinates);
      shape.push(doc.value.Coordinates);
    });
  });
  res.send(shape);
});

module.exports = router;
