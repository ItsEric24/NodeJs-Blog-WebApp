const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const blogRoutes = require("./routes/blogRoutes");
const dotenv = require("dotenv").config();

const app = express();

// Connect to mongoDB
mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => {
    console.log("Connected to DataBase");
  })
  .catch((err) => {
    console.log(err);
  });
//
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.use("/blogs", blogRoutes);


app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});


app.use((req, res) => {
  res.render("404");
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
