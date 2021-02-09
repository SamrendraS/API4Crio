const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");

// Routes

/**
 * @swagger
 * definitions:
 *   Post:
 *     properties:
 *       name:
 *         type: string
 *       url:
 *         type: string
 *       caption:
 *         type: string
 */

/**
 * @swagger
 * /memes:
 *   post:
 *     tags:
 *       - Memes
 *     description: Creates a new meme
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Meme
 *         description: Post object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Post'
 *     responses:
 *       200:
 *         description: Successfully created
 */

router.post("/memes", (req, res) => {
  const { name, url, caption } = req.body;
  if (!name || !caption || !url) {
    return res.status(422).json({ error: "Please enter all fields" });
  }

  // Create a post object
  const post = new Post({
    name,
    url,
    caption,
  });

  // console.log(post);
  //Add functionality to prevent reposts
  // postSchema.index({ name: 1, url: 1, caption: 1 },{ unique: true },{ sparse: true });
  // Index maintains functionality

  //Save Post in the database
  post
    .save()
    .then((result) => {
      res.status(201).send({ id: result.id });
      return;
    })
    .catch((err) => {
      res.status(409).json({ error: "Meme already exists" });
      return;
    });
});

router.get("/memes/:id", (req, res) => {
  //Receive ID from URL
  const { id } = req.params;
  Post.findById(id)
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "404: Meme not found" });
      }
      res.send({
        id: item._id,
        name: item.name,
        url: item.url,
        caption: item.caption,
      });
      return;
    })
    .catch((err) => {
      res.status(500).send(err);
      return;
    });
});

/**
 * @swagger
 * /memes:
 *   get:
 *     tags:
 *       - Memes
 *     description: Returns latest 100 memes
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of memes
 *         schema:
 *           $ref:  '#/definitions/Post'
 */
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
      }));
      res.status(200).send(map);
    })
    .catch((err) => {
      res.status(404).send({ message: "Could not connect" });
      // console.log(err);
    });
});

router.patch("/memes/:id", (req, res) => {
  const { id } = req.params;
  const { url, caption } = req.body;

  if (!caption) delete req.body.caption;
  if (!url) delete req.body.url;
  mongoose.set("useFindAndModify", false);
  Post.findByIdAndUpdate(id, req.body, { new: true })
    .then((item) => {
      if (!item) {
        res.status(404).send({ message: "404: Meme not found" });
        return;
      }
      if (!id || (!caption && !url)) {
        res.status(422).json({ error: "Please enter required fields" });
        return;
      }
      res.status(200).send({ message: "200: Meme updated  " });
      return;
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

module.exports = router;
