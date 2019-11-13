import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCPLlcOCxsehe1MGGLoVHUZKMQgAB8igeM",
  authDomain: "lego-collection.firebaseapp.com",
  databaseURL: "https://lego-collection.firebaseio.com",
  projectId: "lego-collection",
  storageBucket: "lego-collection.appspot.com",
  messagingSenderId: "249832653716",
  appId: "1:249832653716:web:2224963935c34e22728581",
  measurementId: "G-D79NGV34SX"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
