const { HeroBlog, User } = require("../models/blog");
const jwt = require("jsonwebtoken");

// handle errors

const handleErrors = (err) => {
  const errors = { username: "", email: "", password: "" };
  console.log(err.message, err.code);

  // incorrect username
  if (err.message === "Incorrect username") {
    errors.username = err.message;
  }

  // incorrect password
  if (err.message === "Incorrect password") {
    errors.password = err.message;
  }

  // Duplicate Error Code
  if (err.code === 11000) {
    errors.username = "Username already exists";
    errors.email = "Email already exists";
    return errors;
  }

  // Validation Errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, "mysecretkey", {
    expiresIn: maxAge,
  });
};

function blogIndex(req, res) {
  HeroBlog.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("index", {
        title: "Hero Blogs",
        blogs: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function getSignUp(req, res) {
  res.render("signup", { title: "Sign up" });
}

function getLogIn(req, res) {
  res.render("login", { title: "Log in" });
}

async function postSignUp(req, res) {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({ username, email, password });
    const token = createToken(user._id);
    res.cookie("newUser", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (error) {
    const err = handleErrors(error);
    res.status(400).json({ err });
  }
}

async function postLogIn(req, res) {
  const { username, password } = req.body;

  try {
    const user = await User.login(username, password);
    const token = createToken(user._id);
    res.cookie("newUser", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (error) {
    const err = handleErrors(error);
    res.status(400).json({ err });
  }
}

function getLogOut(req, res){
  res.cookie("newUser", '', { maxAge: 1 });
  res.redirect('/');
}

function blogDetails(req, res) {
  const blogId = req.params.id;

  HeroBlog.findById(blogId)
    .then((result) => {
      res.render("details", { title: result.title, blog: result });
    })
    .catch((err) => {
      res.status(404).render("404", { title: "Blog not found" });
    });
}

function blogCreateGet(req, res) {
  res.render("create", { title: "Create Blogs" });
}

function blogCreatePost(req, res) {
  const blog = new HeroBlog(req.body);

  blog
    .save()
    .then((result) => {
      res.redirect("/blogs/all-blogs");
    })
    .catch((err) => {
      console.log(err);
    });
}

function blogDelete(req, res) {
  const blogId = req.params.id;

  HeroBlog.findByIdAndDelete(blogId)
    .then((result) => {
      res.json({ redirect: "/blogs/all-blogs" });
    })
    .catch((err) => {
      res.status(404).render("404", { title: "Blog not Found" });
    });
}

module.exports = {
  blogIndex,
  getSignUp,
  getLogIn,
  postSignUp,
  postLogIn,
  getLogOut,
  blogDetails,
  blogCreateGet,
  blogCreatePost,
  blogDelete,
};
