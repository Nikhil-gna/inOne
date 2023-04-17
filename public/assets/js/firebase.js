import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import {
  getAuth,
  signOut,
  updateProfile,
  setPersistence,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  browserLocalPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";
import {
  getDatabase,
  set,
  get,
  ref,
  child,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-database.js";
import {
  getFirestore,
  collection,
  setDoc,
  getDoc,
  getDocs,
  doc,
  deleteDoc,
  onSnapshot,
  updateDoc, arrayUnion, arrayRemove,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBIKqPty9zxa8-oPJfVFDgQBaUdN_donPM",
  authDomain: "inone-f777c.firebaseapp.com",
  projectId: "inone-f777c",
  storageBucket: "inone-f777c.appspot.com",
  messagingSenderId: "962218536288",
  appId: "1:962218536288:web:12afbd0367a18f097a4205",
  measurementId: "G-Q1QYMJZH0E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider(app);
// const database = getDatabase(app);
const auth = getAuth(app);
await setPersistence(auth, browserLocalPersistence);

// ####################################### add function based on page ###############################################################

const page = document.body.id;
const user = auth.currentUser;
switch (page) {
  case "login":
    console.log("login");

    const sign = document.getElementById("signup");
    sign.addEventListener("click", function (event) {
      event.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password-field").value;

      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          // ...
          console.log(user);
          window.location.assign("/home");
          return user.getIdToken().then((idToken) => {
            return fetch("/sessionLogin", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "CSRF-Token": Cookies.get("XSRF-TOKEN"),
              },
              body: JSON.stringify({
                idToken: idToken,
              }),
            });
          });
          //   .then(() => {
          //     return signOut(auth).then(() => {
          //       // Sign-out successful.
          // 	  alert("Sign-out successful.");
          //     })
          // })
          // .then(() => {
          //   window.location.assign("/home");
          // })
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
          alert(errorMessage);
          console.log(error);
        });
    });
    const googlebtn = document.getElementById("googleid");
    googlebtn.addEventListener("click", (e) => {
      e.preventDefault();
      signInWithRedirect(auth, provider);

      getRedirectResult(auth)
        .then((result) => {
          
          // window.location.assign("/home");
          // This gives you a Google Access Token. You can use it to access Google APIs.
          // window.location.assign("/home");
          const credential = GoogleAuthProvider.credentialFromResult(result);
          // window.location.assign("/home");
          // console.log(user);
          const token = credential.accessToken;

          // The signed-in user info.
          const user = result.user;

          //redirect to /home
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        })
      
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          alert(errorMessage);
          // ...
        });
       
       
    });
    onAuthStateChanged(auth, (user) => {
      if (user) {
        window.location.assign("/home");
       } 
    });

    break;
  case "home":
    console.log("home");
    
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.assign("/login");
       } 
    });
    const dbRef = ref(getDatabase());
get(child(dbRef, "users/" + user.uid + "/details"))
  .then((snapshot) => {
    if (snapshot.exists()) {
      document.getElementById("name").innerHTML = snapshot.val().username;
      document.getElementById("Photo").src = snapshot.val().photoURL;
    } else {
      console.log("No data available");
    }
  })
  .catch((error) => {
    console.error(error);
  });


    break;
  case "link":
    console.log("link");

    const linkcol = collection(db, "users", user.uid,"links");
    
    //add data from bottom url and saveing to firestore
   const addform = document.querySelector(".add");
    addform.addEventListener("submit", (e) => {
      e.preventDefault();
      addDoc(linkcol, {
        title: addform.title.value,
        url: addform.url.value,
      })
        .then(() => {
          addform.title.value = "";
          addform.url.value = "";
        })
    })
    //get data from firestore and display on page
    
    
    if (!user) {
      window.location.assign("/login");
     } 
    break;
  case "qrscan":
    console.log("qrscan");
    if (!user) {
      window.location.assign("/login");
     } 
    break;
  case "profile":
    console.log("profile");
    if (!user) {
      window.location.assign("/login");
     } 
    const logout = document.getElementById("logout");

    logout.addEventListener("click", function () {
      // localStorage.removeItem("token");
      if (confirm("Are you sure you want to logout?")) {
        window.location.href = "/login";
        signOut(auth)
          .then(() => {
            console.log("signed out");
          })
          .catch((error) => {
            console.log(error.message);
          });

        alert("logged out");
      }
    });

    break;

  default:
    console.log("default");
    break;
}

// onAuthStateChanged(auth, (user) => {
//   if (!user) {
//    } else {
//    }
// });

// updateProfile(auth.currentUser, {
//   displayName: "hash InOne",
// })
//   .then(() => {
//     // Profile updated!
//     console.log("Profile updated!");
//     // ...
//   })
//   .catch((error) => {
//     // An error occurred
//     alert(error);
//     // ...
//   });

// const user = auth.currentUser;

if (user !== null) {
  user.providerData.forEach((profile) => {
    console.log("Sign-in provider: " + profile.providerId);
    console.log("  Provider-specific UID: " + profile.uid);
    console.log("  Name: " + profile.displayName);
    console.log("  Email: " + profile.email);
    console.log("  Photo URL: " + profile.photoURL);

    set(ref(database, "users/" + user.uid + "/details"), {
      username: profile.displayName,
      email: profile.email,
      photoURL: profile.photoURL,
    });
  });
}

const dbRef = ref(getDatabase());
get(child(dbRef, "users/" + user.uid + "/details"))
  .then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
      document.getElementById("dpName").innerHTML = snapshot.val().username;
      document.getElementById("profilepic").src = snapshot.val().photoURL;
    } else {
      console.log("No data available");
    }
  })
  .catch((error) => {
    console.error(error);
  });

const link = document.getElementById("url-input");
const title = document.getElementById("title-input");
set(ref(database, "users/" + user.uid + "/links"), {
  title: "title",
  url: "link",
});



//###################################################### firestore ###############################################

//database init


$(".addData").on("click", (e) => {
  e.preventDefault();
  const link = $(".url").val();
  const title = $(".title").val();
   
  $(".url").val("");
  $(".title").val("");
  
  addData(link,title);
  // links.push({title:title,url:link});
  // console.log(links);
});


const details = {
  userID: user.uid,
  Name: user.displayName,
  Email: user.email,
  PhotoURL: user.photoURL,
  bio:"Hi,an app you can share all socials links in one place"
};
const links = 
  {
    title:"title" ,
    url: "link",
  }

//set data detials
const colref = collection(db, "users", user.uid,"details");
const docref = doc(colref, "details");
setDoc(docref, details)

  .then(() => {
    console.log("Document written with ID: ", docRef.id);
  })
  .catch((error) => {
    console.error("Error adding document: ", error);
  });

 //set data links
  const linkcol = collection(db, "users", user.uid,"links");
  const linkdoc = doc(linkcol);


  // setDoc(linkdoc)

  // getDocs(linkcol)
  // .then((snapshot) => {
  //   // let link = [];
  //   // snapshot.docs.forEach((doc) => {
  //   //   link.push({...doc.data(),id:doc.id});
  //   // });
  //   // console.log(link);
   
  // })
  // .catch((error) => {
  //   console.log("Error getting documents: ", error);
  // });

  //get data from firestore realtime collection
  



getDoc(docref)
  .then((doc) => {
    if (doc.exists()) {
      console.log("Document data:", doc.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  })
  .catch((error) => {
    console.log("Error getting document:", error.message);
  });

  ////////////////////////////////////////////get data from firestore realtime collection////////////////////////////////////////
  onSnapshot(linkcol, (snapshot) => {
    let link = [];
    snapshot.docs.forEach((doc) => {
      link.push({...doc.data(),id:doc.id});
    });
    console.log(link);

    // link.forEach(element => {
    //   const button = document.createElement('a');
    //   button.innerText = element.title;
    //   button.setAttribute('href', element.url);
    //   // button.setAttribute('id', 'dynamic');
    //   button.setAttribute('class', 'links');
    //   document.body.appendChild(button);
    // });
      
const buttonContainer = document.getElementById('button-container');

link.forEach((element) => {
  const button = document.createElement('a');
  
  button.innerText = element.title;
  button.setAttribute('href', element.url);
  button.setAttribute('id', `button-${element.id}`);
  button.setAttribute('class', 'links');
  button.addEventListener('click', () => {
    const buttonToUpdate = document.getElementById(`button-${element.id}`);
    buttonToUpdate.innerText = `Updated ${element.title}`;
    buttonToUpdate.setAttribute('href', element.url);
  });
  buttonContainer.appendChild(button);
  
    });
    
   
    
  })

const docRef = doc(db, "users", user.uid);
// get data
getDoc(docRef)
  .then((doc) => {
    if (doc.exists()) {
      // console.log("Document data:", doc.data().links[1]);
      const newdata = [];
      newdata.push(doc.data().links[1].url);
      
      console.log(doc.data().links[1].url);
      // document.getElementById("dynamic").innerHTML = "";
      // document.getElementById("dynamic").href = doc.data().links[1].url;
      document.getElementById("dynamic").setAttribute("href", doc.data().links[1].url);
      document.getElementById("dynamic").innerHTML = doc.data().links[1].title;
     
      
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  })
  .catch((error) => {
    console.log("Error getting document:", error.message);
  });
  