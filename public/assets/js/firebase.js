import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
        import {
          getAuth,
          signOut,
		  updateProfile,
          setPersistence,
          GoogleAuthProvider,
          signInWithRedirect,
          getRedirectResult,
          browserLocalPersistence,
          browserSessionPersistence,
          inMemoryPersistence,
          createUserWithEmailAndPassword,
        } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";

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
    const provider = new GoogleAuthProvider(app);
    // const database = getDatabase(app);
    const auth = getAuth(app);


        await setPersistence(auth, browserLocalPersistence);

        document.getElementById("signup").addEventListener("click", function (event) {
            event.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password-field").value;

            createUserWithEmailAndPassword(auth, email, password)
              .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                // ...
                return (
                  user
                    .getIdToken()
                    .then((idToken) => {
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
                    })
                    //   .then(() => {
                    //     return signOut(auth).then(() => {
                    //       // Sign-out successful.
                    // 	  alert("Sign-out successful.");
                    //     })
                    // })
                    // .then(() => {
                    //   window.location.assign("/home");
                    // })
                );

                
              })
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
                alert(errorMessage);
                console.log(error);
              });
          });
          
		  googleid.addEventListener("click", (e) => {
      e.preventDefault();
      signInWithRedirect(auth, provider);

      getRedirectResult(auth)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access Google APIs.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;

          // The signed-in user info.
          const user = result.user;
          
          //redirect to /home 
          alert('user signed in');
          console.log(user);
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

	
// auth.onAuthStateChanged(function (user) {
//           if (user) {
//             // User is signed in, redirect to home page
//             window.location.href = "/home";
//             console.log(user);
//           } else {
//             // User is signed out
//             window.location.href = "/login"; 
//             console.log("user is signed out");
//           }
//         });
const user = auth.currentUser;

updateProfile(auth.currentUser, {
  displayName: "hash InOne"
}).then(() => {
  // Profile updated!
  console.log("Profile updated!");
  // ...
}).catch((error) => {
  // An error occurred
  alert(error);
  // ...
});

if (user !== null) {
  user.providerData.forEach((profile) => {
    console.log("Sign-in provider: " + profile.providerId);
    console.log("  Provider-specific UID: " + profile.uid);
    console.log("  Name: " + profile.displayName);
    console.log("  Email: " + profile.email);
    console.log("  Photo URL: " + profile.photoURL);
  });
}

document.getElementById("logout").addEventListener("click", function (event) {
  event.preventDefault();
  // signOut(auth).then(() => {
  //   // Sign-out successful.
  //   alert("Sign-out successful.");
  // });
  alert("Sign-out successful.");
});
