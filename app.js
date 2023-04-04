require('dotenv').config();
const express = require("express");
const ejs = require('ejs');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const app = express();
const bcrypt = require('bcrypt');
const saltRounds = 10;

mongoose.connect("mongodb+srv://Deadly:9704@cluster0.dct1jfy.mongodb.net/userDB").then(()=>{
  console.log("connection is successful")
}).catch((err)=>{
  console.log(err);
})

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

const userSchema = new mongoose.Schema({
  email:String,
  password:String
});



const User = mongoose.model("User",userSchema);


app.get("/",(req,res)=>{
  res.render("home")
});

app.get("/login",(req,res)=>{
  res.render("login")
});

app.get("/register",(req,res)=>{
  res.render("register")
});

app.post("/register",(req,res)=>{
 bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
  const newUser = new User({
    email:req.body.username,
    password:hash
  });
  newUser.save();
 res.render("secrets")
});
});

app.post("/login",async(req,res)=>{
  try {
    const username = req.body.username;
    const password = req.body.password;
    const usermail = await User.findOne({email:username});
bcrypt.compare(password,usermail.password, function(err, result) {
    if(result === true){
      res.render("secrets");
    }
});
  } catch(err) {
    console.log(err)
  }
});

app.listen(5000,()=>{
  console.log("server is running")
});





