import Link from "next/link";

export default function PostFeed({ posts, admin }) {
  return posts
    ? posts.map((post) => (
        <PostItem post={post} key={post.slug} admin={admin} />
      ))
    : null;
}

function PostItem({ post, admin = false }) {
  //Naive method to calc word count and read time
  const wordCount = post?.content.trim().split(/\s+/g).length;
  //assuming user can read 100 words per minute
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  const heartText = (post) => {
    if (post.heartCount === 1) {
      return "heart";
    } else {
      return "hearts";
    }
  };

  const wordText = () => {
    if (wordCount === 1) {
      return "word";
    } else {
      return "words";
    }
  };

  return (
    <div className="card">
      <Link href={`/${post.username}`}>
        <a>
          <strong>By @{post.username}</strong>
        </a>
      </Link>

      <Link href={`/${post.username}/${post.slug}`}>
        <h2>
          <a>{post.title}</a>
        </h2>
      </Link>

      <footer>
        <span>
          {wordCount} {wordText()}. {minutesToRead} min read
        </span>
        <span className="push-left">
          <img className="btn-heart" src="/pixelheart.png" />{" "}
          {post.heartCount || 0} {heartText(post)}
        </span>
      </footer>
    </div>
  );
}
