require('dotenv').config();
const express = require("express");
const ejs = require('ejs');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const app = express();

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


userSchema.plugin(encrypt, { secret: process.env.SECRET,encryptedFields: ['password']});

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

app.post("/register",async(req,res)=>{
try {
  const newUser = new User({
    email:req.body.username,
    password:req.body.password
  });
 await newUser.save();
 res.render("secrets")
} catch(err){
  console.log(err)
}
});

app.post("/login",async(req,res)=>{
  try {
    const username = req.body.username;
    const password = req.body.password;
    const usermail = await User.findOne({email:username});
    if(usermail.password === password){
      res.render("secrets");
    } else {
      res.send("password does not match");
    }
  } catch(err) {
    console.log(err)
  }
});

app.listen(5000,()=>{
  console.log("server is running")
});





