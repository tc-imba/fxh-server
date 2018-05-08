const express = require('express');
const router = express.Router();
const tcp = require('../tcp');
const Data = require('../data');

/* GET home page. */
router.get('/', async function (req, res, next) {
    const docs = await Data.find();
    console.log(docs);
    res.render('index', {title: 'fxhsb', data: docs});
});

router.get('/water', function (req, res, next) {
    tcp.water();
    res.send('ok');
});

module.exports = router;
