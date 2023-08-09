const express = require("express")
const db = require("../data/database")
const router = express.Router()
router.get("/",function(req,res){
res.redirect("/posts")
})

router.get("/posts",function(req,res){
res.render("posts-list")
})
router.get("/new-post",async function(req,res){
  const [authors] = await db.query("SELECT *FROM authors")
res.render("create-post",{authors:authors})
})

// router.post("/posts", async function(req,res){
//     const data = [
//      req.body.title,
//      req.body.summary,
//  req.body.content,
//  req.body.author,
//     ]    
//    await db.query("INSERT INTO posts (title,summary,body,author_id) VALUES(?)",[data[0]])
//     res.redirect("/posts")
// })
router.post("/posts", async function(req, res) {
    const data = [
        req.body.title,
        req.body.summary,
        req.body.content,
        req.body.author
    ];
    // Add this line before the db.query line

    // Use question marks as placeholders for values and provide all values from the data array
    await db.query("INSERT INTO posts (title, summary, body, author_id) VALUES (?)", [data,]);

    res.redirect("/posts");
});

module.exports = router