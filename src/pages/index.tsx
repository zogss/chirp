import { SignIn, useUser } from "@clerk/nextjs";
import { LoadingPage } from "~/components/loading";
import { PostList } from "~/modules/posts";
import { PostCreate } from "~/modules/posts/postCreate";

import type { NextPage } from "next";
import { PageLayout } from "~/components/layout";

const HomePage: NextPage = () => {
  //* hooks
  const { isSignedIn, isLoaded } = useUser();

  //* render
  return (
    <PageLayout>
      <LoadingPage isLoading={!isLoaded} />
      <div className="flex w-full justify-start border-b border-slate-400 p-4">
        {isSignedIn && <PostCreate />}
      </div>
      <PostList />
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </PageLayout>
  );
};

export default HomePage;
