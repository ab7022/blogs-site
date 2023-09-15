const path = require("path")
const express = require("express")
const app = express()
const blogRoutes = require("./routes/blog")
const db = require("./data/database")
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use("/images", express.static("images"));

// Define your routes using the blogRoutes module
app.use(blogRoutes);

app.use(function(error,req,res,next){
    console.log(error)
res.status(500).render("500")
})
db.connectToDatabase().then(function(){
    app.listen(3000)
    
})