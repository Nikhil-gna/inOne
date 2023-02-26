
const express =require("express");
const app = express();
app.set("view engine","ejs");

app.use(express.static("public"));


app.get("/signin",function(req,res){
  res.render("signin");
});
app.get("/login",function(req,res)
{
  res.render("login");
});
app.get("/",function(req,res)
{
  res.render("welcome");
});
app.get("/home",function(req,res){
    res.render("home");
  });

app.get("/profile",function(req,res){
  res.render("profile");
});
app.get("/contact",function(req,res){
  res.render("contact");
});
app.get("/buyMeCoffee",function(req,res){
  res.render("buyMeCoffee");
});













app.listen(3000, function(){
    console.log("Server running on port 3000");
});