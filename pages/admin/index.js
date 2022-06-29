import MetaTags from "../../components/Metatags";
import AuthCheck from "../../components/AuthCheck";

export default function AdminPostsPage(props) {
  return (
    <main>
      <AuthCheck>
        <MetaTags title="admin posts" />
        <h1>Admin Posts</h1>
      </AuthCheck>
    </main>
  );
}
