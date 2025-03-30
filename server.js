const express = require("express"); //install express
const app = express(); // EXPRESS APP

app.set("view engine", "ejs"); // install ejs and create views folder

app.listen(3000); // listen for request
app.use(express.static("public"));

//Home Page
app.get("/", (req, res) => {
  const blogs = [
    {
      title: "Mia can lift ",
      snippet: "Lorem ipsum dolor sit amet consectetur",
    },
    {
      title: "Wala nang roads",
      snippet: "Lorem ipsum dolor sit amet consectetur",
    },
    {
      title: "Jonnie Confession",
      snippet: "Lorem ipsum dolor sit amet consectetur",
    },
  ];

  res.render("index", { title: "All Blogs", blogs });
});

//About Page
app.get("/about", (req, res) => {
  res.render("about", { title: "About the Thought Loom" });
});

//Routing for create
app.get("/blogs/create", (req, res) => {
  res.render("create", { title: "Create a New Blog" });
});

//Page not FOUND
app.use("/", (req, res) => {
  res.status(404).render("404", { title: "404" });
});
