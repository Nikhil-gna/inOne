const express =require("express");
const dotenv = require('dotenv');
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const serviceAccount = require('./serviceAccountKey.json')
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const csrfMiddleWare = csrf({ cookie: true });

dotenv.config({ path: './.env' });
const PORT = process.env.PORT;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://inone-f777c-default-rtdb.firebaseio.com"
});

const app = express();
app.set("view engine","ejs");

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrfMiddleWare);


app.all("*", (req, res, next) => {
  res.cookie("XSRF-TOKEN", req.csrfToken());
  next();
});

// app.post("/sessionLogin", (req, res) => {
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

app.post('/sessionLogin', (req, res) => {
  // Get the ID token passed and the CSRF token.
  const idToken = req.body.idToken.toString();
  const csrfToken = req.body.csrfToken.toString();
  // Guard against CSRF attacks.
  if (csrfToken !== req.cookies.csrfToken) {
    res.status(401).send('UNAUTHORIZED REQUEST!');
    return;
  }
  // Set session expiration to 5 days.
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  // Create the session cookie. This will also verify the ID token in the process.
  // The session cookie will have the same claims as the ID token.
  // To only allow session cookie setting on recent sign-in, auth_time in ID token
  // can be checked to ensure user was recently signed in before creating a session cookie.
  getAuth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        // Set cookie policy for session cookie.
        const options = { maxAge: expiresIn, httpOnly: true, secure: true };
        res.cookie('session', sessionCookie, options);
        res.end(JSON.stringify({ status: 'success' }));
      },
      (error) => {

        console.log(error);
        res.status(401).send('UNAUTHORIZED REQUEST!');
        res.redirect("/login");
      }
    );
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

app.post('/sessionLogout', (req, res) => {
  res.clearCookie('session');
  res.redirect('/login');
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
