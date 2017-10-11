const express = require('express');
const router = express.Router();
const db = require('../db/config');

/* GET home page. */
router.get('/', function(req, res, next) {
  db.keys('log:*', (err, keys) => {
    if (err) {
      return res.status(500).send({ error: err });
    }

    let multi = db.multi();
    keys.forEach((key) => {
      multi.lrange(key, 0, -1);
    });
  
    multi.exec((err, results) => {
      if (err) {
        return res.status(500).send({ error: err });
      }
      let properties = {};
      keys.forEach((key, i) => {
        properties[key.replace('log:', '')] = results[i].map((click) => {
          return JSON.parse(click);
        });
      });

      res.render('index', { properties: properties });
    });
  });
});

module.exports = router;
