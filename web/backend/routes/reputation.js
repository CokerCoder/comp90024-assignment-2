const express = require("express");
const router = express.Router();

ip = "http://admin:admin@172.26.132.83:5984";

const nano = require("nano")(ip);

router.get("/", async function (req, res, next) {
  var shape = null;

  let id = req.query.id;
  var db = nano.use("geo_json");
  await db.view(
    "geo_json",
    "id",
    { key: 3458, include_docs: true },
    function (err, res) {
      if (!err) {
        console.log(JSON.strinfigy(res));
        shape = JSON.stringify(res);
      } else {
        console.log(err);
      }
    }
  );

  res.send(shape);
});

module.exports = router;
