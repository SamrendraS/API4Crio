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
  // console.log(name + url + caption);
  if (!name || !caption || !url) {
    return res.status(422).json({ error: "Please enter all fields" });
  }

  // Create a post object
  const post = new Post({
    name,
    url,
    caption,
  });
  //Add functionality to prevent reposts
  Post.find(post).then((item) => {
    if (item.name === name && item.url === url && item.caption === caption)
      return res.status(409).json({ error: "Meme already exists" });
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

/**
 * @swagger
 * /memes/{id}:
 *   get:
 *     tags:
 *       - Memes
 *     description: Returns a single meme
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Meme id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A single meme
 *         schema:
 *           $ref: '#/definitions/Post'
 *       404:
 *         description: Invalid ID
 */
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
      });
    })
    .catch((err) => {
      res.status(404).send({ message: "404: Meme not found" });
      console.log(err);
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
      res.send(map);
    })
    .catch((err) => {
      res.status(404).send({ message: "Could not connect" });
      console.log(err);
    });
});

// /**
//  * @swagger
//  * /customers:
//  *    patch:
//  *      description: Use to return all customers
//  *    parameters:
//  *      - name: customer
//  *        in: query
//  *        description: Name of our customer
//  *        required: false
//  *        schema:
//  *          type: string
//  *          format: string
//  *    responses:
//  *      '201':
//  *        description: Successfully created user
//  */
// router.patch("/memes/:id", (req, res) => {
//   //Receive ID from URL
//   const { id } = req.params;
//   const { url, caption } = req.body;
//   console.log(id);
//   if (!id || (!caption && !url)) {
//     res.status(422).json({ error: "Please enter all fields" });
//     return;
//   }
//   Post.exists({ _id: id }, function (err, doc) {
//     if (doc) {
//       console.log(doc);
//     } else {
//       res.status(404).send({ message: "404: Invalid ID" });
//       console.log("Result :", doc); // false
//       return;
//     }
//   });
//   let user_details = {
//     url,
//     caption,
//   };
//   if (!url) delete user_details.url;
//   if (!caption) delete user_details.caption;

//   Post.updateOne({ _id: id }, { $set: user_details }, function (err, result) {
//     if (err) {
//       res.json({
//         message: "Something went wrong",
//         status: 501,
//       });
//     }

//     res.json({
//       messages: "Post updated successfully",
//       status: 200,
//     });
//   });
// });

module.exports = router;
