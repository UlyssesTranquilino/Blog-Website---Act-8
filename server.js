// Load environment variables from .env file
require("dotenv").config();

// Import packages
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const Blog = require("./models/blog");

// Create Express app
const app = express();
app.use(express.urlencoded({ extended: true }));

// MongoDB connection string from .env
const dbURI = process.env.MONGO_URI;

// Connect to MongoDB & start server
mongoose
  .connect(dbURI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch((err) => console.log("DB connection error:", err));

// Set EJS as view engine
app.set("view engine", "ejs");

// Middleware
app.use(express.static("public")); // Serve static files from /public
app.use(morgan("dev")); // Logging HTTP requests
app.use(express.json()); // Parse incoming JSON
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

// Route: Add multiple blogs to DB (for testing)
app.get("/add-blog", (req, res) => {
  Blog.insertMany([
    {
      title: "The Strength of Determination",
      snippet: "An inspiring story of personal growth and resilience.",
      body: "In moments of great challenge, we often discover strengths we never knew we possessed. This post explores the journey of an individual who overcame self-doubt and adversity, finding strength not only in physical ability but in character and perseverance. It serves as a reminder that determination, when coupled with purpose, can lead to truly transformative outcomes.",
    },
    {
      title: "Infrastructure and Its Discontents",
      snippet: "A critical look at urban development and disappearing roads.",
      body: "As cities continue to expand and evolve, the deterioration and disappearance of roads raise significant concerns about urban planning and sustainability. This article examines the causes behind failing infrastructure, its impact on daily life, and the urgent need for transparent governance and long-term urban strategies that prioritize both mobility and community welfare.",
    },
    {
      title: "The Weight of Secrets",
      snippet: "A personal reflection on vulnerability and confession.",
      body: "There comes a point in every life where silence becomes too heavy to bear. This blog post is a thoughtful reflection on the nature of secrets, the emotional weight they carry, and the catharsis that confession can bring. It delves into the complexities of honesty, fear, and healing — reminding us that speaking our truth can be the first step toward freedom.",
    },
  ])
    .then((result) => res.send(result))
    .catch((err) => console.log(err));
});

// Route: Get all blogs (raw JSON)
app.get("/all-blogs", (req, res) => {
  Blog.find()
    .then((result) => res.send(result))
    .catch((err) => console.log(err));
});

// Route: Get a single blog
app.get("/single-blog", (req, res) => {
  const blogId = "67f0a754124165505de9ea7b";
  Blog.findById(blogId)
    .then((result) => res.send(result))
    .catch((err) => console.log(err));
});

// Route: Home - redirect to /blogs
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

// Route: About page
app.get("/about", (req, res) => {
  res.render("about", { title: "About the Thought Loom" });
});

// Route: Create blog page
app.get("/blogs/create", (req, res) => {
  res.render("create", { title: "Create a New Blog" });
});

// Route: List all blogs on homepage
app.get("/blogs", (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 }) // Sort by newest first
    .then((result) => {
      res.render("index", { blogs: result, title: "All Blogs" });
    })
    .catch((err) => console.log(err));
});

// Get By ID
app.get("/blogs/:id", (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then((result) => {
      res.render("details", { blog: result, title: "Blog Details" });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.delete("/blogs/:id", (req, res) => {
  const id = req.params.id;

  Blog.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: "/blogs" });
    })
    .catch((err) => console.log(err));
});

// Post Request: Posting Blog
app.post("/blogs", (req, res) => {
  const blog = new Blog(req.body);
  console.log(blog);
  blog
    .save()
    .then((result) => {
      res.redirect("/blogs");
    })
    .catch((err) => {
      console.log(err);
    });
});

// 404 Page - catch all unmatched routes
app.use((req, res) => {
  res.status(404).render("404", { title: "404 - Page Not Found" });
});
