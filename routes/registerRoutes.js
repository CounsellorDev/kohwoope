// Registration Routes
const express = require("express");
const router = express.Router();
const User = require("../models/register");
const Joi = require("@hapi/joi");
const bcrypt = require("bcryptjs");
const passport = require("passport");

// @hapijs/joi schema validation
const userSchema = Joi.object({
  fullName: Joi.string().required(),
  userName: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  confirmPassword: Joi.string(),
  referralCode: Joi.string().allow(null)
});

router
  .route("/register")
  .get((req, res) => {
    res.render("pages/register");
  })
  .post(async (req, res, next) => {
    try {
      // @hapijs/joi validating inputs
      const result = await userSchema.validateAsync(req.body);
      if (result.error) {
        console.log("error validating user");
        // return req.flash("error", 'something went wrong');
      }

      // @hapijs/joi validating useremail
      const userEmail = await User.findOne({ email: result.email });
      if (userEmail) {
        console.log("email already exist in our database");
        req.flash("error", "email already registered, try another");
        return res.redirect("/register");
      }

      // @hapijs/joi validating username
      const uSerName = await User.findOne({ userName: result.userName });
      if (uSerName) {
        console.log("Username already exist in our database");
        req.flash("error", "Username already in use");
        return res.redirect("/register");
      }
      // @hapijs/joi validating userNumber
      const userNumber = await User.findOne({ phoneNumber: result.phoneNumber });
      if (userNumber) {
        console.log("phoneNumber already exist in our database");
        req.flash("error", "phoneNumber already in use");
        return res.redirect("/register");
      }
      // password validation
      if (result.password !== result.confirmPassword) {
        console.log("password not match");
        req.flash("error", "password not match");
        return res.redirect("/register");
      }
      // creating a new user
      const newUser = new User(result);

      // hashing the password
      await bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            console.log("hashing failed");
          }
          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              console.log("newUser has been saved successfully", user);
              req.flash("success", "Registeration successfully please login");
              return res.redirect("/login");
            })
            .catch((err) => {
              console.log(err);
            });
        });
      });
    } catch (error) {
      next(error);
    }
  });

// login  GET route
router.get("/login", (req, res) => {
  if (res.locals.user) {
    res.redirect("/");
  }
  res.render("pages/login");
});

// login POST route
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: true,
  })(req, res, next);
});

module.exports = router;