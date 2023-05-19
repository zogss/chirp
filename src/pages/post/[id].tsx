import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { PostView } from "~/components/posts";

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  //* hooks
  const { data } = api.posts.getById.useQuery({
    id,
  });

  //* render
  if (!data) return <div>Something went wrong!!</div>;

  return (
    <>
      <Head>
        <title>{`${data.post.content} ${data.author.username}`}</title>
      </Head>
      <PageLayout>
        <PostView {...{ post: data.post, author: data.author }} />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id as string;

  if (typeof id !== "string") throw new Error("id is not a string");

  await ssg.posts.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    // https://nextjs.org/docs/pages/api-reference/functions/get-static-paths#fallback-blocking
    fallback: "blocking",
  };
};

export default SinglePostPage;
