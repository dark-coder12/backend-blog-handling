const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const MONGODB_URL =
  "mongodb+srv://izx12:faithlehane@cluster0.yc42gjo.mongodb.net/A3?retryWrites=true&w=majority";

const User = require("./models/User");
const Post = require("./models/Post");
const Comment = require("./models/Comment");

mongoose
  .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })

  .then(() => {})
  .catch((error) => {});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) return res.status(409).json({ message: "Email Error" });

    if (!email.includes("@") || !email.includes("."))
      return res.status(409).json({ message: "Invalid email" });

    if (password.length < 2)
      return res.status(409).json({ message: "Password should be >= 2" });

    const user = new User({ name, email, password });

    await user.save();

    return res.status(200).json({ message: "User created" });
  } catch (error) {}
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Incorrect email / pass" });
    } else {
      if (password !== user.password) {
        return res.status(401).json({ message: "Wrong Password" });
      }
    }

    return res.status(200).json({ message: "Successful Login" });
  } catch (error) {}
});

app.get("/profile/:name", async (req, res) => {
  try {
    const { name } = req.params;

    const user = await User.findOne({ name });

    if (!user) {
      return res.status(401).json({ message: "No user" });
    }

    res.status(200).json(user);
  } catch (error) {}
});

app.put("/profile", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(409).json({ message: "Empty field error" });

    if (name.length == 0 || email.length == 0 || password.length == 0)
      return res.status(409).json({ message: "Empty field error" });

    const user = await User.findOne({ email });

    user.name = name;
    user.password = password;

    await user.save();

    res.json({ message: "Updation successful" });
  } catch (error) {}
});

app.post("/users/:email/posts", async (req, res) => {
  try {
    const { email } = req.params;
    const { content } = req.body;

    if (content == null || content.length == 0)
      return res.status(409).json({ message: "Empty blog post error" });

    const post = new Post({ authorMail: email, content });
    await post.save();

    res.status(201).json(post);
  } catch (error) {}
});

app.get("/users/:email/posts", async (req, res) => {
  try {
    const { email } = req.params;

    const posts = await Post.find({ authorMail: email });

    res.status(200).json(posts);
  } catch (error) {}
});

app.get("/users/:email/posts/:postId", async (req, res) => {
  try {
    const { email, postId } = req.params;
    const post = await Post.findOne({ _id: postId, authorMail: email });

    if (!post) {
      return res.status(404).json({ message: "Post doesnt exist" });
    }

    res.status(200).json(post);
  } catch (error) {}
});

app.put("/users/:email/posts/:postId", async (req, res) => {
  try {
    const { email, postId } = req.params;
    const { content } = req.body;

    const post = await Post.findOne({ _id: postId, authorMail: email });

    if (!post) {
      return res.status(404).json({ message: "Post doesnt exist" });
    }

    post.content = content;
    await post.save();

    res.status(200).json(post);
  } catch (error) {}
});

app.delete("/users/:email/posts/:postId", async (req, res) => {
  try {
    const { email, postId } = req.params;

    const post = await Post.findOne({ _id: postId, authorMail: email });

    if (!post) {
      return res.status(404).json({ message: "Post doesnt exist" });
    }

    await Post.deleteOne({ _id: postId, authorMail: email });

    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    console.error(error);
  }
});
app.post("/users/:email/posts/:postId/comments", async (req, res) => {
  try {
    const { email, postId } = req.params;
    const { userComment } = req.body;

    if (userComment == null || userComment.length == 0)
      return res.status(409).json({ message: "Empty comment error" });

    const post = await Post.findOne({ _id: postId, authorMail: email });

    if (!post) {
      return res.status(404).json({ message: "Post doesnt exist" });
    }

    const com = new Comment({ postID: postId, comment: userComment });

    await com.save();

    res.status(200).json(com);
  } catch (error) {}
});

app.get("/users/:email/posts/:postId/comments", async (req, res) => {
  try {
    const { email, postId } = req.params;

    const post = await Post.findOne({ _id: postId, authorMail: email });

    if (!post) {
      return res.status(404).json({ message: "Post doesnt exist" });
    }

    const comments = await Comment.find({ postID: postId });

    return res.status(200).json(comments);
  } catch (err) {
    console.log(err);
  }
});

app.listen(8080, () => {
  console.log("Up on 8080");
});
