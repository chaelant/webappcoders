const express = require("express");
const router = express.Router();
const data = require('../data/');
const users = data.users;
const businesses = data.businesses;
const reviews = data.reviews;
const bcrypt = require("bcryptjs");
const saltRounds = 16;

router.get("/login", (req, res) => {
  const post = users.getAllUsers();
  res.render("users/login", { post: post });
});

router.get("/signup", (req, res) => {
  const post =  users.getAllUsers();
  res.render("users/signup", { post: post });
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
  if(newUser) {
    //res.json(newUser);
    res.render("users/private", { user: newUser});
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
    if (newUser) {
      //valid user found
      res.render("users/private", {user: newUser});
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

 var entry = await reviews.addReview("123456", userInfo.businessname, 
       userInfo.newtask_description, 4, new Date().getTime, userInfo.businessid, null);
     
   if (entry) {
    //res.json("users/private", {user: entry});
    res.status(400).json({entry});
   }    
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
