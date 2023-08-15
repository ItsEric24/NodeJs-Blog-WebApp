const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const { requireAuth, checkUser } = require('../middleware/authMiddleware');

router.get("*", checkUser);

router.get("/all-blogs", requireAuth, blogController.blogIndex);

router.get("/signup", blogController.getSignUp);

router.post("/signup", blogController.postSignUp);

router.get("/login", blogController.getLogIn);

router.post("/login", blogController.postLogIn)

router.get("/logout", blogController.getLogOut);

router.get("/create", requireAuth, blogController.blogCreateGet);

router.post("/all-blogs", requireAuth, blogController.blogCreatePost);

router.get("/:id", requireAuth, blogController.blogDetails);

router.delete("/:id", requireAuth, blogController.blogDelete);

module.exports = router;
