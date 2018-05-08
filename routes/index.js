const express = require('express');
const router = express.Router();
const tcp = require('../tcp');
const Data = require('../data');
const moment = require('moment');
const fs = require('fs');

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
    tcp.send('water');
    res.send('ok');
});

router.get('/photo', function (req, res, next) {
    tcp.send('photo');
    res.send('ok');
});

router.get('/image', function (req, res, next) {
    const files = fs.readdirSync('imgs');
    let max = -1;
    files.forEach(file => {
        const num = file.substring(0, file.indexOf('.'));
        max = Math.max(max, parseInt(num));
    });
    if (max >= 0) {
        res.send(`imgs/${max}.bmp`);
    } else {
        res.send('');
    }
});

module.exports = router;
