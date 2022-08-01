import { firestore, auth, increment } from "../lib/firebase";
import { useDocument } from "react-firebase-hooks/firestore";

//Allows user to heart or like a post
export default function HeartButton({ postRef }) {
  //Listen to heart document for currently logged in user
  const heartRef = postRef.collection("hearts").doc(auth.currentUser.uid);
  const [heartDoc] = useDocument(heartRef);

  console.log(heartDoc);

  //Create a user-to-post relationship
  const addHeart = async () => {
    const uid = auth.currentUser.uid;
    //lets us update 2 documents at the same time
    //since they need to succeed or fail together
    const batch = firestore.batch();

    batch.update(postRef, { heartCount: increment(1) });
    batch.set(heartRef, { uid });

    await batch.commit();
  };

  //Remove a user-to-post relationship
  const removeHeart = async () => {
    const batch = firestore.batch();

    batch.update(postRef, { heartCount: increment(-1) });
    batch.delete(heartRef);

    await batch.commit();
  };

  return heartDoc?.exists() ? (
    <button onClick={removeHeart}>
      {" "}
      <img id="heart" src="/brokenheart.png" /> UnHeart
    </button>
  ) : (
    <button onClick={addHeart}>
      <img id="heart" src="/pixelheart.png" /> Heart
    </button>
  );
}
