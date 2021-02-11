const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

postSchema.index(
  { name: 1, url: 1, caption: 1 },
  { unique: true },
  { sparse: true }
);
postSchema.index({ createdAt: -1 });

mongoose.model("Post", postSchema);
