import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import { ProfileFeed } from "~/modules/profile";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { ProfileImageBlock } from "~/modules/profile/profileImageBlock";
import { ProfileData } from "~/modules/profile/profileData";
import { capitalCase } from "change-case";
import ProfileFeedEmpty from "~/modules/profile/profileFeed/profileFeedEmpty";
import { PostListSkeleton } from "~/components/posts";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  //* hooks
  const { data, error, isFetching } = api.profile.getUserByUsername.useQuery({
    username,
  });

  //* render
  return (
    <>
      <Head>
        <title>
          {`${
            data ? capitalCase(data.firstName || "") : "..."
          } (@${username}) - Chirp`}
        </title>
      </Head>
      <PageLayout>
        <ProfileImageBlock {...{ ...data, username: username }} />
        <ProfileData {...{ ...data, username: username }} />
        {error?.data?.httpStatus === 404 ? (
          <ProfileFeedEmpty status="not-found" />
        ) : data?.id ? (
          <ProfileFeed userId={data.id} />
        ) : isFetching ? (
          <PostListSkeleton items={5} />
        ) : (
          <ProfileFeedEmpty status="error" />
        )}
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const slug = context.params?.slug as string;

  if (typeof slug !== "string") throw new Error("slug is not a string");

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default ProfilePage;
