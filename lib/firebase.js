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

//Helper functions

/**
 * gets a users/{uid} document with username
 *  @param {string} username
 */

export async function getUserWithUsername(username) {
  const usersRef = firestore.collection("users");
  const query = usersRef.where("username", "==", username).limit(1);
  const userDoc = (await query.get()).docs[0];
  return userDoc;
}

/**
 * Converts a firestore ducment to JSON
 *  @param {DocumentSnapshot} doc
 */

export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    //firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
}
