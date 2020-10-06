import firebase from 'firebase'
import firestore from 'firebase/firestore'

// Your web app's Firebase configuration
var firebaseConfig = {
//    YOU WILL NEED TO ADD YOUR OWN FIREBASE CONFIG HERE IF YOU WANT TO RE-USE THE CODE
//     THIS IS TO PREVENT MY FIREBASE ACCOUNT FROM BECOMING SPAMMED WITH DATA
  };
  // Initialize Firebase
  let firebaseApp = firebase.initializeApp(firebaseConfig);
  firebaseApp.analytics();

  export default firebaseApp.firestore()
