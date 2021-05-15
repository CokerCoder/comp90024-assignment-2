const express = require("express");
const router = express.Router();

ip = "http://admin:admin@172.26.132.83:5984";

const nano = require("nano")(ip);

router.get("/", async function (req, res, next) {
  var enters = [];
  var drags = [];
  var db_enter = nano.use("entertainment");
  await db_enter.list({ include_docs: true }).then((body) => {
    body.rows.forEach((doc) => {
      doc = doc.doc;
      enters.push(doc);
    });
  });

  var db_drags = nano.use("profile");
  await db_drags.list({ include_docs: true }).then((body) => {
    body.rows.forEach((doc) => {
      doc = doc.doc;
      let dict = {
        id: doc._id,
        clients_that_recvd_alchl_drug_trtmnt_servs_per_1000_pop:
          doc.clients_that_recvd_alchl_drug_trtmnt_servs_per_1000_pop,
      };

      drags.push(dict);
    });
  });

  var enter_ref = enters.reduce(function (obj, o) {
    obj[o._id] = o;
    return obj;
  }, {});

  var entertainment = drags.map(function (o) {
    return {
      id: o.id,
      clients_that_recvd_alchl_drug_trtmnt_servs_per_1000_pop:
        o.clients_that_recvd_alchl_drug_trtmnt_servs_per_1000_pop,
      entertainment_gambling: enter_ref[o.id].entertainment_gambling,
      entertainment_wagering: enter_ref[o.id].entertainment_wagering,
      entertainment_liquor: enter_ref[o.id].entertainment_liquor,
    };
  });
  res.send(entertainment);
});

module.exports = router;
