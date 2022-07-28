import styles from "../../styles/Post.module.css";
import PostContent from "../../components/PostContent";
import { firestore, getUserWithUsername, postToJSON } from "../../lib/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import AuthCheck from "../../components/AuthCheck";
import HeartButton from "../../components/HeartButton";
import Link from "next/link";

//implement incremental static regeneration
//(pre-renders the page)
export async function getStaticProps({ params }) {
  //tells next to fetch data on the server at buildtime in order
  //to prerendering the page
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    const postRef = userDoc.ref.collection("posts").doc(slug);
    post = postToJSON(await postRef.get());

    path = postRef.path;
  }

  return {
    props: { post, path },
    //revalidate tells next to regenerate this page on the server
    //when new requests come in, but only in a certain time interval.
    revalidate: 5000,
  };
}

//determines which actual pages to render
export async function getStaticPaths() {
  const snapshot = await firestore.collectionGroup("posts").get();

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();

    return {
      params: { username, slug },
    };
  });
  //Improve my using Admin SDK to select empty docs
  return {
    paths,
    fallback: "blocking",
    //by adding fallback: "blocking", when a user navigates to a
    //page that hasn't been rendered yet, it tells next to fallback
    //to server-side rendering. once it renders the page, it can be
    //cached on the CDN like all the other pages.
  };
}

//hydrates from server rendered content to realtime data
export default function Post(props) {
  //references the database via path to server rendered content
  const postRef = firestore.doc(props.path);
  //gets feed of data in realtime
  const [realtimePost] = useDocumentData(postRef);

  //defaults to realtime data, otherwise falls back to pre-rendered
  //data on the server.
  const post = realtimePost || props.post;

  return (
    <main className={styles.container}>
      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>
            {post.heartCount || 0}{" "}
            <img id="heart-count" src="/pixelheart.png" />
          </strong>
        </p>

        <AuthCheck
          fallback={
            <Link href="/enter">
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          <HeartButton postRef={postRef} />
          <Link href={`/admin/${post.slug}`}>
            <button className="btn-blue">Edit Post</button>
          </Link>
        </AuthCheck>
      </aside>
    </main>
  );
}
