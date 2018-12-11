const express = require('express');
const router = express.Router();
const data = require('../data/');
const getBusinessById = data.businesses.getBusinessById;
const getReviewsByBusiness = data.reviews.getReviewsByBusiness;
const getUserById = data.users.getUserById;


router.get('/', async(req, res) => {
    const entity = req.body;
    try {
        await getBusinessById(entity.business._id);
        await getReviewsByBusiness(entity.business._id);
        await getUserById(entity.user._id);
    } catch (err) {
        
    }


});

module.exports = router;