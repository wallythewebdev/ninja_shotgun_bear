import firebase from 'firebase'
import firestore from 'firebase/firestore'

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAoUr7AiFenJ6Z-tdJJV7jKLR00f-KPNsE",
    authDomain: "ninjashotgunbear.firebaseapp.com",
    databaseURL: "https://ninjashotgunbear.firebaseio.com",
    projectId: "ninjashotgunbear",
    storageBucket: "ninjashotgunbear.appspot.com",
    messagingSenderId: "539356270231",
    appId: "1:539356270231:web:d118f7e9dc6507feabe3d2",
    measurementId: "G-FFSQHM31FQ"
  };
  // Initialize Firebase
  let firebaseApp = firebase.initializeApp(firebaseConfig);
  firebaseApp.analytics();

  export default firebaseApp.firestore()