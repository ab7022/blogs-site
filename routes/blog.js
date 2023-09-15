const express = require("express");
const mongodb = require("mongodb");
const db = require("../data/database");
const router = express.Router();
const multer = require("multer");
router.use(express.urlencoded({ extended: true }));
// const upload = multer({dest: "images"})
const ObjectId = mongodb.ObjectId;
const storagerConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storagerConfig });

router.get("/", async function (req, res) {
  const users = await db.getDb().collection("authors").find().toArray();
  res.redirect("/posts");
});

router.get("/add-author", function (req, res) {
  res.render("add-author");
});
router.post("/add-author", upload.single("image"), async function (req, res) {
  const uploadedimageFile = req.file;

  const authors = {
    name: req.body.name,
    email: req.body.email,
  };

  const result = await db.getDb().collection("authors").insertOne({
    name: authors.name,
    email: authors.email,
    imagePath: uploadedimageFile.path,
  });
  console.log(result);
  console.log(uploadedimageFile);
  res.redirect("add-author");
});

router.get("/posts", async function (req, res) {
  const posts = await db
    .getDb()
    .collection("posts")
    .find({}, { title: 1, summary: 1, "author.name": 1, "author.imagePath": 1 })
    .toArray();
  res.render("posts-list", { posts: posts });
});
router.get("/authors", async function (req, res) {
  const authors = await db.getDb().collection("authors").find().toArray();
  console.log(authors);
  res.render("author-detail", { authors: authors });
});
router.post("/posts", async function (req, res) {
  const authorId = new ObjectId(req.body.author);
  const author = await db
    .getDb()
    .collection("authors")
    .findOne({ _id: authorId });
  const newPost = {
    title: req.body.title,
    summary: req.body.summary,
    body: req.body.content,
    date: new Date(),
    author: {
      id: authorId,
      name: author.name,
      email: author.email,
       imagePath: author.imagePath,
    },
  };
  const result = await db.getDb().collection("posts").insertOne(newPost);
  console.log(result);
  res.redirect("posts");
});

router.get("/new-post", async function (req, res) {
  const authors = await db.getDb().collection("authors").find().toArray();
  console.log(authors);
  res.render("create-post", { authors: authors });
});

router.get("/posts/:id/view", async function (req, res, next) {
  let postId = req.params.id;
    postId = new ObjectId(postId);
  const post = await db
    .getDb()
    .collection("posts")
    .findOne({ _id: postId });

  if (!post) {
    return res.status(404).render("404");
  }
  post.humanReadableDate = post.date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  post.date = post.date.toISOString();
  const comments = await db
  .getDb()
  .collection("comments")
  .find({ postId: postId }) // Use postId for querying
  .toArray();
  res.render("post-detail", { post: post,comments:comments});
});

router.get("/posts/:id/edit", async function (req, res) {
  const postId = req.params.id;
  const post = await db
    .getDb()
    .collection("posts")
    .findOne({ _id: new ObjectId(postId) }, { title: 1, summary: 1, body: 1 });
  if (!post) {
    return res.status(404).render("404");
  }
  res.render("update-post", { post: post });
});

// router.post("/posts", async function(req, res) {
// res.redirect("/posts");
// });

router.post("/posts/:id/edit", async function (req, res) {
  const postId = new ObjectId(req.params.id);
  const result = await db
    .getDb()
    .collection("posts")
    .updateOne(
      { _id: postId },
      {
        $set: {
          title: req.body.title,
          summary: req.body.summary,
          body: req.body.content,
          date: new Date(),
        },
      }
    );
  res.redirect("/posts");
});

router.post("/posts/:id/delete", async function (req, res) {
  const postId = new ObjectId(req.params.id);
  const result = await db
    .getDb()
    .collection("posts")
    .deleteOne({ _id: postId });
  res.redirect("/posts");
});
router.get("/posts/:id/comments", async function (req, res) {
  try {
    const postId = new ObjectId(req.params.id);
    const comments = await db
      .getDb()
      .collection("comments")
      .find({ postId }) // Use postId for querying
      .toArray();
    
    res.json(comments); // This sends a response with comments in JSON format
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while retrieving comments" });
  }
});



router.post("/posts/:id/comments", async function (req, res) {
  const postId = new ObjectId(req.params.id);
  const newComment = {
    postId, // Use postId for associating the comment with the post
    title: req.body.title,
    text: req.body.text,
  };
  await db.getDb().collection("comments").insertOne(newComment);
  res.json({message:"comment added"})
}
);
module.exports = router;

