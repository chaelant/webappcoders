const express = require('express');
const router = express.Router();
const data = require('../data/');
const users = data.users;

router.get("/createBusiness", (req, res) => {
    res.render("users/createBusiness");
});

router.post("/createBusiness", (req, res) => {
    const buis = {
        rating: 0, //this gets updated with each added review
        price: req.body.price,
        phone: req.body.phone,
        alias: req.body.name,
        is_closed: false,
        categories: [req.body.categories],
        review_count: 0, //this gets updated with each added review
        name: req.body.name,
        coordinates: req.body.address,
        image_url: req.body.image_url,
        location: {display_address: req.body.address},
        transactions: "idk",
        distance: "idk" //dependent on user location
    };

    businesses.addBusiness(buis);
    res.redirect("/");
});

module.exports = router;