
const express =require("express");
 require('dotenv').config();
const mongoose = require("mongoose");
const links = require("./models/links");
const app = express();
app.set("view engine","ejs");
app.use(express.static("public"));

//mongodb connection

const PORT = process.env.PORT || 3000;
mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  }
  catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in mode on port ${PORT}`);
  });
});




app.get("/",function(req,res)
{
  res.render("welcome");
});

app.get("/login",function(req,res)
{
  res.render("login");
});


app.get("/home",function(req,res){
  res.render("home");
});


app.get("/link",function(req,res){
    res.render("link");
  });

app.get("/qrScan",function(req,res){
    res.render("qrScan");
  });

app.get("/profile",function(req,res){
  res.render("profile");
});

app.get("/contact",function(req,res){
  res.render("contact");
});


app.get("/add",async(req,res) => {
  try {
    await links.insertMany([
      {
        link: "https://www.google.com/",
        title: "Google"
      },
      {
        link: "https://www.facebook.com/",
        title: "Facebook"
      }

    ]);
   res.send('data added');
  } catch (error) {
    console.log(error);
  }
});

app.get("/links",async(req,res) => {
     
  const linksData = await links.find();

  if(linksData){
    res.send(linksData);
  }else{
    res.send("No data found");
  }
  
  
});









app.listen(3000, function(){
    console.log("Server running on port 3000:http://localhost:3000/");
});
