import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

//client-side api keys that tells firebase how to connect to
// client-side code in user's browser
//copied from firebase when creating the project
const firebaseConfig = {
  apiKey: "AIzaSyALFP71qf7KjF7KtTKXbnDnGWLwr1JNy-E",
  authDomain: "nextfire-8ec61.firebaseapp.com",
  projectId: "nextfire-8ec61",
  storageBucket: "nextfire-8ec61.appspot.com",
  messagingSenderId: "581493118268",
  appId: "1:581493118268:web:2e61fa139af42b3473fa39",
};

//initializeApp connects the react app to the cloud
//apps can only be initialized once, but sometimes next.js
//runs the code twice, therefore a conditional statement regarding
//the app's length prevents an error
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

//exporting variables that represent the firebase SDK's
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const firestore = firebase.firestore();
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
//allows you to update an existing count on a document
export const increment = firebase.firestore.FieldValue.increment;

export const storage = firebase.storage();
//special firebase event we can listen to that will tell us the progress
//of the file upload
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;

//Helper functions

/**
 * gets a users/{uid} document with username
 *  @param {string} username
 */

export async function getUserWithUsername(username) {
  //async function that references users collection
  const usersRef = firestore.collection("users");
  //runs query where username == username and returns first hit
  //from database
  const query = usersRef.where("username", "==", username).limit(1);
  //run query with await get
  const userDoc = (await query.get()).docs[0];
  //return 1st doc from the array in that query
  return userDoc;
}

/**
 * Converts a firestore document to JSON
 *  @param {DocumentSnapshot} doc
 */

export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    //firestore timestamp NOT serializable to JSON.
    //Must convert to number or string (milliseconds)
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
}
