import { useUser } from "@clerk/nextjs";

import type { NextPage } from "next";
import Head from "next/head";
import { PageLayout } from "~/components/layout";

const SinglePostPage: NextPage = () => {
  //* hooks
  const { isSignedIn, isLoaded } = useUser();

  //* render
  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <PageLayout>Post view</PageLayout>
    </>
  );
};

export default SinglePostPage;
