import { SignedIn, useUser } from "@clerk/nextjs";
import { LoadingPage } from "~/components/loading";
import { PostCreate } from "~/modules/posts/postCreate";

import type { NextPage } from "next";
import { PageLayout } from "~/components/layout";
import { PostList } from "~/modules/posts";

const HomePage: NextPage = () => {
  //* hooks
  const { isLoaded } = useUser();

  //* render
  return (
    <PageLayout>
      <LoadingPage isLoading={!isLoaded} />
      <SignedIn>
        <div className="flex w-full justify-start border-b border-slate-700 p-4">
          <PostCreate />
        </div>
      </SignedIn>
      <PostList />
    </PageLayout>
  );
};

export default HomePage;
