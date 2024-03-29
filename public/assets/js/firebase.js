import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import {
  getAuth,
  signOut,
  updateProfile,
  setPersistence,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signInWithPopup,
  onAuthStateChanged,
  browserLocalPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";
import {
  getDatabase,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-database.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-storage.js";
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
  query,
  where,
  orderBy,
  writeBatch,
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
const storage = getStorage(app);
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
      

const auth = getAuth();
signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    console.log(user);
    window.location.href = '/home';
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
    });
    

    break;
  case "home":
    console.log("home");
    const colreff = collection(db, "users", user.uid, "details");
    const docreff = doc(colreff, "details");
    getDoc(docreff)
      .then((doc) => {
        if (doc.exists()) {
          console.log("Document data:", doc.data());
          document.getElementById("name").innerHTML =doc.data().Name ;
          document.getElementById("Photo").src =doc.data().PhotoURL ;

        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error.message);
      });

    onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.assign("/login");
      }
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
    //getting data from firestore and displaying on edit button
    const colref = collection(db, "users", user.uid, "details");
    const docref = doc(colref, "details");
    getDoc(docref)
      .then((doc) => {
        if (doc.exists()) {
          console.log("Document data:", doc.data());
                document.getElementById("dpname").innerHTML = doc.data().Name;
                document.getElementById("Photo").src = doc.data().PhotoURL;
                document.getElementById("editname").value = doc.data().Name;
                document.getElementById("editusername").value = doc.data().userID;
                var email = doc.data().Email;
                var sliceemail = email.slice(0, -10);
                document.getElementById("editEmail").value = sliceemail;
                document.getElementById("editbio").innerHTML = doc.data().bio;

        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error.message);
      });
      //updating form
      const updateForm = document.querySelector(".update");
      updateForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        updateDoc(docref, {
          Name: updateForm.editname.value,
          bio: updateForm.bioupdate.value,
          Email: updateForm.editEmail.value,
          userID:updateForm.editusername.value

        }).then(() => {
          // updateForm.Name.value = "";
            
        });
        updateProfile(auth.currentUser, {
          displayName: updateForm.editname.value, 
          bio: updateForm.bioupdate.value,
          userID:updateForm.editusername.value
          // 0. add all details from 
          // 1.user name form uid
        }).then(() => {
          console.log("Profile updated!");
         
        }).catch((error) => {
          // An error occurred
          // ...
          console.log(error);
        });

      });

      updateForm.addEventListener("submit", async (e) => {
        e.preventDefault();
    
        const photoFile = updateForm.editphoto.files[0]; 
      
        try {
          // Upload the photo to Firebase Storage
          const storageRef = ref(storage, `profile_pictures/${photoFile.name}`);
          await uploadBytes(storageRef, photoFile);
      
          // Get the download URL of the uploaded photo
          const photoURL = await getDownloadURL(storageRef);
      
          // Update the user's profile in Firebase Auth
          await updateProfile(auth.currentUser, {
            photoURL: photoURL,
          });
      
          // Update the user's photoURL in Firestore
          const userDocRef = doc(db, "users", auth.currentUser.uid);
          await updateDoc(userDocRef, {
            photoURL: photoURL,
            
          });
      
          console.log("Profile and photoURL updated!");
        } catch (error) {
          console.log("Error updating profile and photoURL:", error);
        }
      });
      

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
const colreff = collection(db, "users", user.uid, "details");
const docreff = doc(colreff, "details");
getDoc(docreff)
.then((doc) => {
  if (doc.exists()) {
    console.log("Document data:", doc.data());
    document.getElementById("dpName").innerHTML = doc.data().Name;
    document.getElementById("profilepic").src = doc.data().PhotoURL;
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
})
.catch((error) => {
  console.log("Error getting document:", error.message);
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
  bio: "Add your bio",
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
  // const buttonContainer = document.getElementById("drop-items");
  if(page == "home"){
    const homecontainer = document.getElementById("linksbutton");
    newLinks.forEach((links) => {
      const button = document.createElement("a");
      button.innerText = links.title;
      button.setAttribute("href", links.url);
      button.setAttribute("id", links.id);
      button.setAttribute("class", "links");
      homecontainer.appendChild(button);
    });
  }


  newLinks.forEach((link) => {
    const dropCard = document.createElement("div");
    dropCard.classList.add("drop__card");

    const linkDiv = document.createElement("div");
    dropCard.appendChild(linkDiv);

    const iconsdiv = document.createElement("div");
    dropCard.appendChild(iconsdiv);

    const linkTitle = document.createTextNode(link.title);
    const linkAnchor = document.createElement("a");
    linkAnchor.id = link.id;
    linkAnchor.appendChild(linkTitle);
    linkAnchor.href = link.url;
    linkAnchor.classList.add("drop__name");
    linkDiv.appendChild(linkAnchor);

    const deleteAnchor = document.createElement("a");
    deleteAnchor.href = "#";
    deleteAnchor.id = link.id;
    deleteAnchor.classList.add("drop__social");
    deleteAnchor.innerHTML = "<i class='bx bxs-trash-alt'></i>";

    const sortAnchor = document.createElement("a");
    sortAnchor.href = "#";
    sortAnchor.classList.add("drop__social");
    sortAnchor.innerHTML = "<i class='bx bxs-sort-alt'></i>";
    sortAnchor.id = "sortbtn";

    deleteAnchor.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete?")) {
        deleteDoc(doc(linkcol, link.id));
        dropCard.remove();
      }
    });

sortAnchor.addEventListener("click", () => {
  const dropItems = document.getElementById("drop-items");
  const sortable = Sortable.create(dropItems, {
    onEnd: function (evt) {
      // Get the updated order of the links
      const links = [];
      const dropCards = document.querySelectorAll(".drop__card");
      dropCards.forEach((card) => {
        const link = newLinks.find(
          (l) => l.id === card.querySelector(".drop__name").id
        );
        if (link) {
          links.push(link);
          
        }
      });

      console.log(links);
      
      
         // Save the sorted links to Firestore
     
         const firestore = getFirestore(app);
         const batch = writeBatch(firestore);
         
         links.forEach((link, index) => {
          //  const linkRef = doc(firestore, "links", link.id);
           const linkRef = doc(firestore, "users", user.uid, "links", link.id);

          //  const linkRef = doc(linkcol,link.id);
         
           batch.update(linkRef, { order: index });
         });
         
         batch
           .commit()
           .then(() => {
             console.log("Links updated successfully");
           })
           .catch((error) => {
             console.error("Error updating links:", error);
           });
       }
    
  });
  
});
    iconsdiv.appendChild(sortAnchor);
    iconsdiv.appendChild(deleteAnchor);

    dropItems.appendChild(dropCard);
  });
});

// Get the links container and initialize Sortable.js

// Get the links container and initialize Sortable.js

// const sortableContainer = document.getElementById('drop-items');

// const sortable = new Sortable(sortableContainer, {
//   onEnd: event => {
//     const { newIndex, oldIndex } = event;
//     const linkElements = sortableContainer.querySelectorAll('a');
//     const newOrder = [];

//     linkElements.forEach(linkElement => {
//       const linkId = linkElement.getAttribute('data-id');
//       const link = newLink.find(link => link.id === linkId);
//       newOrder.push(link);
//     });

//     newLink.splice(0, newLink.length, ...newOrder);
//     saveLinks();
//   }
// });



const linkss = [
  { url: "https://www.discord.com/", title: "Discord" },
  { url: "https://www.twitter.com/", title: "Twitter" },
  { url: "https://www.facebook.com/", title: "Facebook" },
];

const dropItems = document.getElementById("drop-items");


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