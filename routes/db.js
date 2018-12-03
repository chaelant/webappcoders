const express = require('express');
const router = express.Router();
const dbOps = require('../mongo');

router.get('/', async(req, res) => {
    try {
        const allBusinesses = await dbOps.getAllBusinesses();
        res.json(allBusinesses);
    } catch (e) {
        res.sendStatus(500);
    }
});

module.exports = router;