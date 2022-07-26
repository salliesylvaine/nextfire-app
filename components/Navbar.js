import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import SignOutButton from "../components/SignOutButton";

//Top Navbar
export default function Navbar() {
  // this is where we access the user data
  // fyi - any components that depend on these values
  // will re-render anytime the user or username changes
  const { user, username } = useContext(UserContext);

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button className="btn-logo">FEED</button>
          </Link>
        </li>
        {/* {user is signed in and has username} */}
        {username && (
          <>
            <li className="push-left">
              <SignOutButton />
            </li>
            <li>
              <Link href="/admin">
                <button className="btn-blue">Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <img src={user?.photoURL} referrerPolicy="no-referrer" />
              </Link>
            </li>
          </>
        )}
        {/* {user is not signed in OR has not created username} */}
        {!username && (
          <li>
            <Link href="/enter">
              <button className="btn-blue">Log In</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
