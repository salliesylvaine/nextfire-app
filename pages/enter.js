import { auth, firestore, googleAuthProvider } from "../lib/firebase";
import { useContext, useState, useEffect, useCallback } from "react";
import { UserContext } from "../lib/context";
import debounce from "lodash.debounce";
import SignOutButton from "../components/SignOutButton";

export default function Enter(props) {
  // this is where we access the user data
  // fyi - any components that depend on these values
  // will re-render anytime the user or username changes
  const { user, username } = useContext(UserContext);

  // 1. user signed out <SignInButton/>
  // 2. user signed in, but missing username <Username/>
  // 3. user signed in, has username <SignOutButton/>
  return (
    <main>
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          // <SignOutButton />
          <p>You&apos;re signed in and ready to scroll!</p>
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
}

//sign in with google button
function SignInButton() {
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src={"/google.png"} /> Sign in with Google
    </button>
  );
}

//user selects username
function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const onSubmit = async (e) => {
    e.preventDefault();

    // Create refs for both documents
    const userDoc = firestore.doc(`users/${user.uid}`);
    const usernameDoc = firestore.doc(`usernames/${formValue}`);

    // Commit both docs together as a batch write
    const batch = firestore.batch();
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
  };

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  const onChange = (e) => {
    //Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    //Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  //Hit the database for username match after each debounced change
  //useCallback is required for debounce to work
  //debounce is used to make sure the code is only triggered once
  //per user input. layman's terms, it will wait for the user to
  //stop typing for 500ms before running the function.

  //we have to wrap it in useCallback bc React creates a new function
  //object every time it re-renders which will not be debounced.
  //useCallback allows the function to be memoized so it can easily be
  //debounced between state changes.
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = firestore.doc(`usernames/${username}`);
        const { exists } = await ref.get();
        console.log("Firestore read executed!");
        setIsValid(!exists);
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input
            name="username"
            placeholder="username"
            value={formValue}
            onChange={onChange}
          />
          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />
          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>

          {/* <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div> */}
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}
