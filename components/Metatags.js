import Head from "next/head";

//bots look for metatags in the head of the document that gives
//description, images, and anything else it can use to understand
//the content of the page. The metadata will ultimately be displayed
//in search engines or posting a link.
export default function MetaTags({
  title = "Nextfire App Metatag Test",
  description = "This is a test",
  image = "/fire.png",
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@fireship_dev" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Head>
  );
}
