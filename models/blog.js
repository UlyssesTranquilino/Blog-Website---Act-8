const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    snippet: {
      type: String,
      requried: true,
    },
    body: {
      type: String,
      required: true,
    },
  },
  { timeStamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
