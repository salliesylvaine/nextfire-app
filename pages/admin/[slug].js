//by putting the file name in [], it makes the route to the file dynamic
//ex: [slug].js or [username]
//slug is the unique identifying part of a web address,
//typically at the end of a url

import MetaTags from "../../components/Metatags";
import { useState } from "react";
import { useRouter } from "next/router";

import { useDocumentData } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import toast from "react-hot-toast";

import styles from "../../styles/Admin.module.css";
import AuthCheck from "../../components/AuthCheck";
import { firestore, auth } from "../../lib/firebase";
import ImageUploader from "../../components/ImageUploader";

//importing directly from Firestore, issues when trying to export it from lib/firebase
import { serverTimestamp } from "firebase/firestore";

//importing ErrorMessage from react-hook-form to comply with v.7
import { ErrorMessage } from "@hookform/error-message";

export default function AdminPostsEdit(props) {
  return (
    // <main>
    //   <MetaTags title="admin page" />
    //   <h1>Edit Posts</h1>
    // </main>
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  const postRef = firestore
    .collection("users")
    .doc(auth.currentUser.uid)
    .collection("posts")
    .doc(slug);
  const [post] = useDocumentData(postRef);

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>
              To upload an image, click the button below and load the image.
              Once complete, you will get a link that you can copy and paste
              anywhere in your post. Note: currently accepts .png, .jpeg, and
              .gif
            </p>

            <PostForm
              postRef={postRef}
              defaultValues={post}
              preview={preview}
            />
          </section>
          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>
              {preview ? "Edit" : "Preview"}
            </button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue">Live View</button>
            </Link>
          </aside>
        </>
      )}
    </main>
  );
}

//defaultValues = data from firestore document
function PostForm({ defaultValues, postRef, preview }) {
  //connects html form to react
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
  });

  //isDirty means the user has interacted with it
  const { isValid, isDirty } = formState;

  const [post] = useDocumentData(postRef);
  const router = useRouter();

  const updatePost = async ({ content, published }) => {
    await postRef.update({ content, published, updatedAt: serverTimestamp() });

    reset({ content, published });

    toast.success("Post updated successfully!");

    router.push(`/${post.username}/${post.slug}`);
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch("content")}</ReactMarkdown>
        </div>
      )}
      <div className={preview ? styles.hidden : styles.controls}>
        <ImageUploader />

        <textarea
          {...register("content", {
            maxLength: { value: 20000, message: "content is too long" },
            minLength: { value: 10, message: "content is too short" },
            required: { value: true, message: "content is required" },
          })}
        ></textarea>

        <ErrorMessage
          className="text-danger"
          errors={errors}
          name="content"
          as="p"
        />
        <fieldset>
          <input
            className={styles.checkbox}
            type="checkbox"
            {...register("published")}
          />
          <label>Published</label>
        </fieldset>

        <button
          type="submit"
          className="btn-green"
          disabled={!isDirty || !isValid}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
