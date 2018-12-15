const express = require('express');
const router = express.Router();
const data = require('../data/');
const path = require('path');
const businesses = data.businesses;

router.get('/', async(req, res) => {
    //leverage getBusinessBySearchTerm with req.body to filter for landing page
    try {
        const allBusinesses = await businesses.getAllBusinesses();
        res.render("homepage", {business: allBusinesses});
    } catch (e) {
        res.sendStatus(500);
    }
});


router.post('/search', async(req,res) => {
        try {
            const allBusinesses = await businesses.getBusinessesBySearchTerm(req.body.input);
            res.send(allBusinesses);
        } catch (e) {
            res.sendStatus(500);
        }
    return    
});


module.exports = router;
