const jwt = require("jsonwebtoken");
const { User } = require("../models/blog");

// JWT validation

const requireAuth = (req, res, next) => {
  const token = req.cookies.newUser;

  // check if JWT exists & is verified
  if (token) {
    jwt.verify(token, "mysecretkey", (err, decodedToken) => {
      if (err) {
        res.redirect("/blogs/login");
        console.log(err);
      } else {
        next();
      }
    });
  } else {
    res.redirect("/blogs/login");
  }
};

// check the user
const checkUser = (req, res, next) => {
  const token = req.cookies.newUser;

  if (token) {
    jwt.verify(token, "mysecretkey", async (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  }else{
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };
