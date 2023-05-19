import { SignIn, useUser } from "@clerk/nextjs";
import { LoadingPage } from "~/components/loading";
import { PostList } from "~/modules/posts";

import { PostCreate } from "../modules/posts/postCreate";

import type { NextPage } from "next";

const Home: NextPage = () => {
  //* hooks
  const { isSignedIn, isLoaded } = useUser();

  //* render
  return !isLoaded ? (
    <LoadingPage />
  ) : (
    <div className="flex min-h-screen w-full flex-col border-x border-slate-400 md:max-w-2xl">
      <div className="flex w-full justify-start border-b border-slate-400 p-4">
        {isSignedIn && <PostCreate />}
      </div>
      <PostList />
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  );
};

export default Home;
