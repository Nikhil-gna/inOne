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
  updateDoc,
  arrayUnion,
  arrayRemove,
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
    if (!user) {
      window.location.assign("/login");
    }

    const linkcol = collection(db, "users", user.uid, "links");

    //add data from bottom url and saveing to firestore
    const addform = document.querySelector(".add");
    addform.addEventListener("submit", (e) => {
      e.preventDefault();
      addDoc(linkcol, {
        title: addform.title.value,
        url: addform.url.value,
      }).then(() => {
        addform.title.value = "";
        addform.url.value = "";
      });
    });
    //get data from firestore and display on page
   
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

  addData(link, title);
  // links.push({title:title,url:link});
  // console.log(links);
});

const details = {
  userID: user.uid,
  Name: user.displayName,
  Email: user.email,
  PhotoURL: user.photoURL,
  bio: "Hi,an app you can share all socials links in one place",
};
const links = {
  title: "title",
  url: "link",
};

//set data detials
const colref = collection(db, "users", user.uid, "details");
const docref = doc(colref, "details");
setDoc(docref, details)
  .then(() => {
    console.log("Document written with ID: ", docRef.id);
  })
  .catch((error) => {
    console.error("Error adding document: ", error);
  });

//set data links
const linkcol = collection(db, "users", user.uid, "links");
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
// onSnapshot(linkcol, (snapshot) => {
//   let link = [];

//   snapshot.docs.forEach((doc) => {
//     link.push({ ...doc.data(), id: doc.id });
//     console.log(link);
//   });

//     const buttonContainer = document.getElementById("button-container");
   
//      link.forEach((links) => {
//       const button = document.createElement('a');
//       button.innerText = links.title;
//       button.setAttribute('href', links.url);
//       button.setAttribute('id', links.id);
//       button.setAttribute('class', 'links');
//       buttonContainer.appendChild(button);
//      });
//      bottomsavebtn.addEventListener('click', () => {
//       // const buttonToUpdate = document.getElementById(`button-${links.id}`);
//       // buttonToUpdate.innerText = links.title;
//       // buttonToUpdate.setAttribute('href', links.url);
//       buttonContainer.appendChild(button);
//     });
//   });
 
// Define an array to store the IDs of previously added links

let previousLinkIds = [];
onSnapshot(linkcol, (snapshot) => {
 
  // Define an array to store the newly added links
  let newLinks = [];

  snapshot.docs.forEach((doc) => {
    const link = { ...doc.data(), id: doc.id };
    if (!previousLinkIds.includes(link.id)) {
      // This is a newly added link
      newLinks.push(link);
      previousLinkIds.push(link.id);
    }
  });

  console.log(newLinks);
  const buttonContainer = document.getElementById("drop-items");

  // Create buttons for the newly added links
  // newLinks.forEach((link) => {
  //   const button = document.createElement("a");
  //   button.innerText = link.title;
  //   button.setAttribute("href", link.url);
  //   button.setAttribute("id", link.id);
  //   button.setAttribute("class", "links");
  //   buttonContainer.appendChild(button);
  // });


  // newLinks.forEach((link) => {
  //   const dropCard = document.createElement("div");
  //   dropCard.classList.add("drop__card");
  
  //   const linkDiv = document.createElement("div");
  //   dropCard.appendChild(linkDiv);
  
  //   const iconsdiv = document.createElement("div");
  //   dropCard.appendChild(iconsdiv);
  
  
  //   const linkTitle = document.createTextNode(link.title);
  //   const linkAnchor = document.createElement("a");
  //   linkAnchor.id = link.id;
  //   linkAnchor.appendChild(linkTitle);
  //   linkAnchor.href = link.url;
  //   linkAnchor.classList.add("drop__name");
  //   linkDiv.appendChild(linkAnchor);
  
  //   const deleteAnchor = document.createElement("a");
  //   deleteAnchor.href = "#";
  //   deleteAnchor.id=link.id;
  //   deleteAnchor.classList.add("drop__social");
  //   deleteAnchor.innerHTML = "<i class='bx bxs-trash-alt'></i>";
  
  //   const sortAnchor = document.createElement("a");
  //   sortAnchor.href = "#";
  //   sortAnchor.classList.add("drop__social");
  //   sortAnchor.innerHTML = "<i class='bx bxs-sort-alt'></i>";
  //   sortAnchor.id = "sortbtn";
  
  //   deleteAnchor.addEventListener("click", () => {
  //     if (confirm("Are you sure you want to delete?")) {
  //       deleteDoc(doc(linkcol, link.id));
  //       dropCard.remove();
  //     }
      
  //   });

    
  //   sortAnchor.addEventListener("click", () => {
  //     const dropItems = document.getElementById('drop-items')



  //   });

    
  //   iconsdiv.appendChild(sortAnchor);
  //   iconsdiv.appendChild(deleteAnchor);

  //   dropItems.appendChild(dropCard);

  // });


  // Get the links container and initialize Sortable.js

// Get the links container and initialize Sortable.js
const sortableContainer = document.getElementById('drop-items');

const sortable = new Sortable(sortableContainer, {
  onEnd: event => {
    const { newIndex, oldIndex } = event;
    const linkElements = sortableContainer.querySelectorAll('a');
    const newOrder = [];

    linkElements.forEach(linkElement => {
      const linkId = linkElement.getAttribute('data-id');
      const link = newLink.find(link => link.id === linkId);
      newOrder.push(link);
    });

    newLink.splice(0, newLink.length, ...newOrder);
    saveLinks();
  }
});

// Load links from Firestore or use the default array
let newLink;
(async function() {
  const docRef = doc(db, 'links', 'links');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    newLink = docSnap.data().links;
  } else {
    newLink = [
      {
        "title": "instagram",
        "url": "https://www.instagram.com/",
        "id": "GQnaQ7ZUSt6tAFUEQaui"
      },
      {
        "title": "discord",
        "url": "https://www.discord.com/",
        "id": "JBsQuuRAU0vTg2p6KctB"
      },
      {
        "url": "https://www.apple.com/",
        "title": "apple",
        "id": "Oi9fc4ZvbEj1LI3tjJXC"
      },
      {
        "title": "youtube",
        "url": "https://www.youtube.com/",
        "id": "o5U133VALKeuCjslqGY6"
      }
    ];
    await setDoc(doc(db, 'links', 'links'), { links: newLink });
  }
  displayLinks();
})();

// Save the links array to Firestore
async function saveLinks() {
  await setDoc(doc(db, 'links', 'links'), { links: newLink });
  console.log('Links saved successfully!');
}

// Display the links in the container
function displayLinks() {
  const linksHTML = newLink.map(link => `
    <a href="${link.url}" data-id="${link.id}">
      <div class="title">${link.title}</div>
    </a>
  `).join('');

  sortableContainer.innerHTML = linksHTML;
}

});




const linkss = [
  { url: "https://www.discord.com/", title: "Discord" },
  { url: "https://www.twitter.com/", title: "Twitter" },
  { url: "https://www.facebook.com/", title: "Facebook" },
];

const dropItems = document.getElementById("drop-items");

// linkss.forEach((link) => {
//   const dropCard = document.createElement("div");
//   dropCard.classList.add("drop__card");

//   const linkDiv = document.createElement("div");
//   dropCard.appendChild(linkDiv);

//   const iconsdiv = document.createElement("div");
//   dropCard.appendChild(iconsdiv);


//   const linkTitle = document.createTextNode(link.title);
//   const linkAnchor = document.createElement("a");
//   linkAnchor.id = "link";
//   linkAnchor.appendChild(linkTitle);
//   linkAnchor.href = link.url;
//   linkAnchor.classList.add("drop__name");
//   linkDiv.appendChild(linkAnchor);

//   const deleteAnchor = document.createElement("a");
//   deleteAnchor.href = "#";
//   deleteAnchor.classList.add("drop__social");
//   deleteAnchor.innerHTML = "<i class='bx bxs-trash-alt'></i>";

//   const sortAnchor = document.createElement("a");
//   sortAnchor.href = "#";
//   sortAnchor.classList.add("drop__social");
//   sortAnchor.innerHTML = "<i class='bx bxs-sort-alt'></i>";
//   sortAnchor.id = "sortbtn";

//   deleteAnchor.addEventListener("click", () => {
//     dropCard.remove();
//   });
  
//   iconsdiv.appendChild(sortAnchor);
//   iconsdiv.appendChild(deleteAnchor);

//   dropItems.appendChild(dropCard);
// });



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
      document
        .getElementById("dynamic")
        .setAttribute("href", doc.data().links[1].url);
      document.getElementById("dynamic").innerHTML = doc.data().links[1].title;
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  })
  .catch((error) => {
    console.log("Error getting document:", error.message);
  });
