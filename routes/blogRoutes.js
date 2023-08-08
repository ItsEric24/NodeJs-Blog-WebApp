const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");

router.get("/", blogController.blogIndex);

router.get("/create", blogController.blogCreateGet);

router.post("/", blogController.blogCreatePost);

router.get("/:id", blogController.blogDetails);

router.delete("/:id", blogController.blogDelete);

module.exports = router;
