// // For Firebase JS SDK v7.20.0 and later, measurementId is optional

import firebase from "firebase/app";    
import "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBIKqPty9zxa8-oPJfVFDgQBaUdN_donPM",
    authDomain: "inone-f777c.firebaseapp.com",
    projectId: "inone-f777c",
    storageBucket: "inone-f777c.appspot.com",
    messagingSenderId: "962218536288",
    appId: "1:962218536288:web:12afbd0367a18f097a4205",
    measurementId: "G-Q1QYMJZH0E"
  };

const app = initializeApp(firebaseConfig);

const auth = firebase.auth(app);
const provider = new firebase.auth.GoogleAuthProvider();

// export { auth, provider };
