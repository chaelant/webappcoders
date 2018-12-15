const express = require("express");
const router = express.Router();
const data = require('../data/');
const users = data.users;
const businesses = data.businesses;
const reviews = data.reviews;
const bcrypt = require("bcryptjs");
const saltRounds = 16;
let mUser = null;

//Middlewares to block access to restricted routes!!!

// 1. One which will count the number of requests that have been made to the current path
const pathsAccessed = {};
router.use(function(request, response, next) {
    if (!pathsAccessed[request.path]) pathsAccessed[request.path] = 0;
    pathsAccessed[request.path]++;
    console.log("There have now been " +
        pathsAccessed[request.path] +
        " requests made to " + request.path);
    next();
});

router.get("/private", function(request, response) {
    response.status(200).send("You are not allowed to access this without login/signup first!!!");
});

router.get("/reviewcreated", function(request, response) {
    response.status(200).send("You are not allowed to access this without login/signup first!!!");
});

router.get("/login", (req, res) => {
    const post = users.getAllUsers();
    res.render("users/login", { post: post });
});

router.get("/signup", (req, res) => {
    const post =  users.getAllUsers();
    res.render("users/signup", { post: post });
});

router.get("/createBusiness", (req, res) => {
    res.render("users/createBusiness");
});

router.post("/signup", async (req, res) => {
    let userInfo = req.body;
    let errors = [];

    if (!userInfo) {
        res.status(400).json({ error: "You must provide data to create a user" });
        return;
    }

    if (!userInfo.first_name) {
        res.status(400).json({ error: "You must provide a first name" });
        return;
    }

    if (!userInfo.last_name) {
        res.status(400).json({ error: "You must provide a last name" });
        return;
    }
    if (!userInfo.username) {
        res.status(400).json({ error: "You must provide a user name" });
        return;
    }

    var name = userInfo.first_name + userInfo.last_name;
    const hashpassword = await bcrypt.hash(userInfo.password, saltRounds);
    let newUser = await users.addUser(hashpassword, userInfo.username, name, null);
    mUser = newUser;

    if(newUser) {
        //res.json(newUser);
        var userReviews = await reviews.getReviewsByUserId(mUser._id);
        var favbusiness = await users.getFavoriteBusinesses(mUser._id);
        res.render("users/private", { user: newUser, reviews:userReviews, businesses: favbusiness});
    } else {
        errors.push("Either Username or password invalid");
        res.render("users/signup", { hasErrors: true,
            errors: errors });
    }
});

router.post("/login", async (req, res) => {
    let userInfo = req.body;
    let errors = [];

    if (!userInfo) {
        res.status(400).json({ error: "You must provide data to create a user" });
        return;
    }

    if (!userInfo.username) {
        res.status(400).json({ error: "You must provide a first name" });
        return;
    }

    if (!userInfo.password) {
        res.status(400).json({ error: "You must provide a last name" });
        return;
    }

    var newUser = await users.checkIfValidUser(userInfo.username, userInfo.password);
    mUser = newUser;

    if (newUser) {
        //valid user found
        var userReviews = await reviews.getReviewsByUserId(mUser._id);
        var favbusiness = await users.getFavoriteBusinesses(mUser._id);
        res.render("users/private", { user: newUser, reviews:userReviews, businesses: favbusiness});
        //res.render("users/private", {user: newUser, reviews: userReviews});
    } else {
        errors.push("Either Username or password invalid");
        res.render("users/login",
            {hasErrors: true,
                errors: errors});
    }
});

router.post("/review", async (req, res) => {
    let userInfo = req.body;
    let errors = [];
    if (!userInfo) {
        res.status(400).json({ error: "You must provide data to create a user" });
        return;
    }

    if (!userInfo.UserId) {
        res.status(400).json({ error: "Unable to read the userId" });
        return;
    }

    var entries = await businesses.getAllBusinesses();
    res.render("users/reviewselector", { business: entries});
});

router.post("/reviewcreated", async (req, res) => {
    let userInfo = req.body;
    let errors = [];
    let userId = mUser._id;
    if (!userInfo) {
        res.status(400).json({ error: "You must provide data to create a user" });
        return;
    }

    if (!userInfo.businessid) {
        res.status(400).json({ error: "Unable to read the userId" });
        return;
    }

    if (!userInfo.businessname) {
        res.status(400).json({ error: "Unable to read the userId" });
        return;
    }

    let reviewRating = parseFloat(userInfo.newtask_rating);

    var entry = await reviews.addReview(userId, userInfo.businessname,
        userInfo.newtask_description, reviewRating, new Date().getTime, userInfo.businessid, null);

    if (entry) {
        // const allBusinesses = await businesses.getAllBusinesses();
        // res.render("homepage", {business: allBusinesses});
        const reviewedBiz = await businesses.getBusinessById(userInfo.businessid);
        let prevCount = reviewedBiz.review_count;
        let newCount = prevCount + 1;
        await businesses.updateAverageRating(userInfo.businessid);
        await businesses.updateReviewCount(userInfo.businessid, newCount);
        var userReviews = await reviews.getReviewsByUserId(mUser._id);
        res.render("users/private", {user: mUser, reviews: userReviews});
    }
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


router.delete("/:id", (req, res) => {
    let user = userData
        .getUserById(req.params.id)
        .then(() => {
            return userData
                .removePost(req.params.id)
                .then(() => {
                    res.sendStatus(200);
                })
                .catch(() => {
                    res.sendStatus(500);
                });
        })
        .catch(() => {
            res.status(404).json({ error: "User not found" });
        });
});

module.exports = router;
