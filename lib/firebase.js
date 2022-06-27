import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyALFP71qf7KjF7KtTKXbnDnGWLwr1JNy-E",
  authDomain: "nextfire-8ec61.firebaseapp.com",
  projectId: "nextfire-8ec61",
  storageBucket: "nextfire-8ec61.appspot.com",
  messagingSenderId: "581493118268",
  appId: "1:581493118268:web:2e61fa139af42b3473fa39",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const firestore = firebase.firestore();
export const storage = firebase.storage();
