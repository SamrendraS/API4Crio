const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");

// Routes

/**
 * @swagger
 * components:
 *  schemas:
 *      Meme:
 *          type: object
 *          required:
 *            - name
 *            - url
 *            - caption
 *          properties:
 *              name:
 *                  type: string
 *                  description: Name of the meme poster
 *              url:
 *                  type: string
 *                  description: Link of the meme
 *              caption:
 *                  type: string
 *                  description: caption of meme
 *          example:
 *              name: Samrendra
 *              url: https://i.redd.it/pb008vv10yg61.jpg
 *              caption: Amazing power!
 */

/**
 * @swagger
 * tags:
 *  name: Memes
 *  description: API to manage your memes.
 */

/**
 * @swagger
 * /memes:
 *     get:
 *         summary:  Returns all memes
 *         tags: [Memes]
 *         responses:
 *             200:
 *                 description: Returns all memes
 *                 content:
 *                     application/json:
 *                         schema:
 *                             type: array
 *                             items:
 *                             $ref: '#/components/schemas/Meme'
 *             404:
 *                 description: Error connecting to server
 *
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

/**
 * @swagger
 * /memes/{id}:
 *   get:
 *     summary: Get the meme by id
 *     tags: [Memes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Meme id
 *     responses:
 *       200:
 *         description: A single meme
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meme'
 *       404:
 *         description: Invalid meme ID
 */

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
      res.status(404).send({ message: "404: Meme not found" });
      return;
    });
});

/**
 * @swagger
 * /memes:
 *   post:
 *     summary: Creates a new meme
 *     tags: [Memes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Meme'
 *     responses:
 *       201:
 *         description: Successfully created
 *         content:
 *           application/json:
 *             schema:
 *                  type: object
 *                  required:
 *                      - id:
 *                  properties:
 *                      id:
 *                          type: string
 *                          description: Auto Generated unique id for each meme
 *                  example:
 *                          id: 6026c2881131aa2723f71a03
 *
 *       409:
 *         description: Duplicate meme posted
 *       422:
 *         description: Incomplete form data
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

  // Index maintains control on duplicates

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

/**
 * @swagger
 * /memes/{id}:
 *  patch:
 *    summary: Update the meme by its id
 *    tags: [Memes]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The Meme id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Meme'
 *    responses:
 *      200:
 *         description: Successfully updated
 *      404:
 *         description: Meme not found
 *      422:
 *         description: Incomplete form data
 *      500:
 *         description: Error
 */

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
