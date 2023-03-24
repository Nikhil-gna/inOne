const dotenv = require('dotenv');
const express =require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
var serviceAccount = require('./serviceAccountKey.json')
dotenv.config({ path: './.env' });
// const cookieParser = require('cookie-parser');
const PORT = process.env.PORT;
// const csrf = require('csurf');
// const csrfMiddleWare = csrf({ cookie: true });


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://inone-f777c-default-rtdb.firebaseio.com"
});

const app = express();
app.set("view engine","ejs");

app.use(express.static("public"));
app.use(bodyParser.json());
// app.use(cookieParser());
// app.use(csrfMiddleWare);


// app.all("*", (req, res, next) => {
//   res.cookie("XSRF-TOKEN", req.csrfToken);
// });

// app.post("/login", (req, res) => {
//   const idToken = req.body.idToken.toString();
//   const expiresIn = 60 * 60 * 24 * 5 * 1000;
//   admin.getAuth()
//     .createSessionCookie(idToken, { expiresIn })
//     .then(
//       (sessionCookie) => {
//         const options = { maxAge: expiresIn, httpOnly: true, secure: true };
//         res.cookie("session", sessionCookie, options);
//         res.end(JSON.stringify({ status: "success" }));
//       },
//       (error) => {
//         res.status(401).send("UNAUTHORIZED REQUEST!");
//         res.redirect("/login");
//       }
//     )
// });





app.get("/",function(req,res)
{
  res.render("welcome");
});

app.get("/login",function(req,res)
{
  res.render("login");
});


app.get("/home",function(req,res){
  // const sessionCookie = req.cookies.session || "";
  // admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
  //   .then(() => {
      res.render("home");
    // })
    // .catch((error) => {
    //   res.redirect("/login");
    //   console.log(error);
    // });
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


// app.get("/add",async(req,res) => {
//   try {
//     await links.insertMany([
//       {
//         link: "https://www.google.com/",
//         title: "Google"
//       },
//       {
//         link: "https://www.facebook.com/",
//         title: "Facebook"
//       }

//     ]);
//   } catch (error) {
//     console.log(error);
//   }
// });

// app.get("/links",async(req,res) => {
     
//   const linksData = await links.find();

//   if(linksData){
//     res.send(linksData);
//   }else{
//     res.send("No data found");
//   }
  
  
// });




app.listen(PORT, function(){
    console.log(`Server running on port 3000:http://localhost:${PORT}`);
});
