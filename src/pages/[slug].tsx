import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import { ProfileFeed } from "~/modules/profile";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { ProfileImageBlock } from "~/modules/profile/profileImageBlock";
import { ProfileData } from "~/modules/profile/profileData";
import { capitalCase } from "change-case";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  //* hooks
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });

  //* render
  if (!data) return <div>Something went wrong!!</div>;

  return (
    <>
      <Head>
        <title>
          {`${capitalCase(data.firstName || "")} (@${data.username || ""})`} -
          Chirp
        </title>
      </Head>
      <PageLayout>
        <ProfileImageBlock {...data} />
        <ProfileData {...data} />
        <ProfileFeed userId={data.id} />
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
    // https://nextjs.org/docs/pages/api-reference/functions/get-static-paths#fallback-blocking
    fallback: "blocking",
  };
};

export default ProfilePage;
