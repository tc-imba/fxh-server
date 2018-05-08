const express = require('express');
const router = express.Router();
const tcp = require('../tcp');
const Data = require('../data');
const moment = require('moment');

async function getData() {
    const end = moment().toDate();
    const start = moment().subtract(5, 'm').toDate();
    const docs = await Data.find({
        updatedAt: {
            $gte: start,
            $lte: end
        }
    }).sort({updatedAt: 1}).exec();
    return docs;
}

/* GET home page. */
router.get('/', async function (req, res, next) {
    const docs = await getData();
    res.render('index', {title: 'fxhsb', data: docs});
});

router.get('/data', async function (req, res, next) {
    const docs = await getData();
    res.send(JSON.stringify(docs));
});

router.get('/water', function (req, res, next) {
    tcp.water();
    res.send('ok');
});

module.exports = router;
