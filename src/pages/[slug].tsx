import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { prisma } from "~/server/db";
import { appRouter } from "~/server/api/root";
import superjson from "superjson";
import { PageLayout } from "~/components/layout";
import Image from "next/image";
import { ProfileFeed } from "~/modules/profile";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";

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
        <title>{data.username}</title>
      </Head>
      <PageLayout>
        <div className="relative h-40 bg-slate-600">
          <Image
            src={data.profileImageUrl}
            alt={`${data.username || ""} - profile image`}
            width={128}
            height={128}
            className="absolute bottom-0 left-0 -mb-16 ml-4 rounded-full border-4 border-black"
          />
        </div>
        <div className="h-16" />
        <div className="p-4 text-2xl font-bold">{`@${
          data.username || ""
        }`}</div>
        <div className="border-b border-slate-400" />
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
