const express = require('express');
const router = express.Router();
const data = require('../data/');
const users = data.users;

router.get('/', async(req, res) =>{
    try {
        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(500);
    }
});

module.exports = router;