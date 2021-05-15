const express = require("express");
const router = express.Router();

ip = "http://admin:admin@172.26.132.83:5984";

const nano = require("nano")(ip);

router.get("/", async function (req, res, next) {
  var sport = [];
  var uni = [];
  var tafe = [];
  var school = [];
  var hospital = [];

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

  var db_school = nano.use("education_school");
  await db_school.list({ include_docs: true }).then((body) => {
    body.rows.forEach((doc) => {
      doc = doc.doc;
      let dict = {
        id: doc._id,
        school: doc.School,
      };

      school.push(dict);
    });
  });

  var db_hospital = nano.use("national_hospital");
  await db_hospital.list({ include_docs: true }).then((body) => {
    body.rows.forEach((doc) => {
      doc = doc.doc;
      let dict = {
        id: doc._id,
        hospital: doc["National Hospital"],
      };

      hospital.push(dict);
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

  var school_ref = school.reduce(function (obj, o) {
    obj[o.id] = o.school;
    return obj;
  }, {});

  var hospital_ref = hospital.reduce(function (obj, o) {
    obj[o.id] = o.hospital;
    return obj;
  }, {});

  var infrastructure = sport.map(function (o) {
    if (uni_ref[o.id] === undefined) {
      uni_ref[o.id] = 0;
    }
    if (tafe_ref[o.id] === undefined) {
      tafe_ref[o.id] = 0;
    }
    if (hospital_ref[o.id] === undefined) {
      hospital_ref[o.id] = 0;
    }
    return {
      id: o.id,
      sport: o.sport,
      uni: uni_ref[o.id],
      taft: tafe_ref[o.id],
      school: school_ref[o.id],
      hospital: hospital_ref[o.id],
    };
  });

  res.send(infrastructure);
});

module.exports = router;
