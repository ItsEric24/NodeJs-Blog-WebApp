const HeroBlog = require("../models/blog");

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

function blogDetails(req, res) {
  const blogId = req.params.id;

  HeroBlog.findById(blogId)
    .then((result) => {
      res.render("details", { title: result.title, blog: result });
    })
    .catch((err) => {
      res.status(404).render("404", {title: "Blog not found"});
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
      res.redirect("/blogs");
    })
    .catch((err) => {
      console.log(err);
    });
}

function blogDelete(req, res) {
  const blogId = req.params.id;

  HeroBlog.findByIdAndDelete(blogId)
    .then((result) => {
      res.json({ redirect: "/blogs" });
    })
    .catch((err) => {
      res.status(404).render("404", {title: "Blog not Found" });
    });
}

module.exports = {
  blogIndex,
  blogDetails,
  blogCreateGet,
  blogCreatePost,
  blogDelete
};
