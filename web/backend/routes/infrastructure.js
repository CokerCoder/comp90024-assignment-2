const express = require("express");
const router = express.Router();

ip = "http://admin:admin@172.26.132.83:5984";

const nano = require("nano")(ip);

router.get("/", async function (req, res, next) {
  var sport = [];
  var uni = [];
  var tafe = [];

  var db_sport = nano.use("sport");
  await db_sport.list({ include_docs: true }).then((body) => {
    body.rows.forEach((doc) => {
      doc = doc.doc;
      let dict = {
        id: doc._id,
        sport: doc.SPORT,
      };

      sport.push(dict);
    });
  });

  var db_uni = nano.use("education_uni");
  await db_uni.list({ include_docs: true }).then((body) => {
    body.rows.forEach((doc) => {
      doc = doc.doc;
      let dict = {
        id: doc._id,
        uni: doc.UNI,
      };

      uni.push(dict);
    });
  });
  console.log(uni);
  var db_tafe = nano.use("education_tafe");
  await db_tafe.list({ include_docs: true }).then((body) => {
    body.rows.forEach((doc) => {
      doc = doc.doc;
      let dict = {
        id: doc._id,
        tafe: doc.TAFE,
      };

      tafe.push(dict);
    });
  });

  var uni_ref = uni.reduce(function (obj, o) {
    obj[o.id] = o.uni;
    return obj;
  }, {});

  var tafe_ref = tafe.reduce(function (obj, o) {
    obj[o.id] = o.tafe;
    return obj;
  }, {});

  var infrastructure = sport.map(function (o) {
    if (uni_ref[o.id] === undefined) {
      uni_ref[o.id] = 0;
    }
    if (tafe_ref[o.id] === undefined) {
      tafe_ref[o.id] = 0;
    }
    return {
      id: o.id,
      sport: o.sport,
      uni: uni_ref[o.id],
      taft: tafe_ref[o.id],
    };
  });

  res.send(infrastructure);
});

module.exports = router;
