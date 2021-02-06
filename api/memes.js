const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");

router.get("/memes/:id", (req, res) => {
  //Receive ID from URL
  const { id } = req.params;
  Post.findById(id)
    .then((item) => {
      res.send({
        id: item._id,
        name: item.name,
        url: item.url,
        caption: item.caption,
        createdAt: item.createdAt,
        editedAt: item.editedAt,
      });
    })
    .catch((err) => {
      res.status(404).send({ message: "Invalid ID" });
      console.log(err);
    });
});

// router.get("/memes/:id", (req, res) => {
//   const { id } = req.params;
//   Post.find({ _id: id })
//     .then((posts) => {
//       console.log(posts);
//       const item = posts[0];
//       res.send({
//         id: item._id,
//         name: item.name,
//         url: item.url,
//         caption: item.caption,
//       });
//     })
//     .catch((err) => {
//       res.status(404).send({ message: "Invalid ID" });
//       console.log(err);
//     });
// });

router.get("/memes", (req, res) => {
  Post.find()
    .sort("-createdAt") //Return latest posts
    .limit(100) //Return only 100 posts
    .then((posts) => {
      const map = posts.map((item) => ({
        id: item._id,
        name: item.name,
        url: item.url,
        caption: item.caption,
        createdAt: item.createdAt,
        editedAt: item.editedAt,
      }));
      res.send(map);
    })
    .catch((err) => {
      res.status(404).send({ message: "Could not connect" });
      console.log(err);
    });
});

router.patch("/memes/:id", (req, res) => {
  const { id } = req.params;
  const { url, caption } = req.body;

  if (id || !caption || !url) {
    return res.status(422).json({ error: "Please enter all fields" });
  }
  let user_details = {
    url,
    caption,
  };

  Post.updateOne({ _id: id }, { $set: user_details }, function (err, result) {
    if (err) {
      res.json({
        message: "Something went wrong",
        status: 501,
      });
    }

    res.json({
      messages: "Post updated successfully",
      status: 200,
    });
  });
});

router.post("/memes", (req, res) => {
  const { name, url, caption } = req.body;
  console.log(name + url + caption);
  if (!name || !caption || !url) {
    return res.status(422).json({ error: "Please enter all fields" });
  }

  // Create a post object
  const post = new Post({
    name,
    url,
    caption,
  });

  //Save Post in the database
  post
    .save()
    .then((result) => {
      res.send({ id: result.id });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
