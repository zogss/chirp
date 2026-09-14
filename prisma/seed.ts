/**
 * Seeds the database with random emoji posts from existing Clerk users, so a fresh database has a
 * feed to look at. Only runs when there are no posts yet.
 *
 *   yarn db:seed
 */
import { createClerkClient } from "@clerk/backend";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";

import { PrismaClient } from "../src/generated/prisma/client";

config({ path: [".env.local", ".env"], quiet: true });

const POSTS_TO_CREATE = 60;
const EMOJIS = [
  "🐦",
  "🐤",
  "🌅",
  "☕️",
  "🚀",
  "🔥",
  "🎉",
  "😂",
  "🥲",
  "🤔",
  "👀",
  "💯",
  "🍕",
  "🌮",
  "🎧",
  "🎮",
  "📚",
  "🌧️",
  "☀️",
  "🌈",
  "🐶",
  "🐱",
  "💻",
  "🧠",
  "🏀",
  "⚽️",
  "🎸",
  "✨",
  "🙌",
  "🫶",
];
const TWO_WEEKS = 14 * 24 * 60 * 60 * 1000;

const pick = <T>(items: T[]) =>
  items[Math.floor(Math.random() * items.length)]!;

const randomContent = () =>
  Array.from({ length: 1 + Math.floor(Math.random() * 6) }, () =>
    pick(EMOJIS),
  ).join("");

async function main() {
  const { DATABASE_URL, CLERK_SECRET_KEY } = process.env;
  if (!DATABASE_URL || !CLERK_SECRET_KEY) {
    throw new Error("DATABASE_URL and CLERK_SECRET_KEY must be set");
  }

  const db = new PrismaClient({
    adapter: new PrismaPg({ connectionString: DATABASE_URL }),
  });

  try {
    if ((await db.post.count()) > 0) {
      console.log("The database already has posts, skipping seed.");
      return;
    }

    const clerk = createClerkClient({ secretKey: CLERK_SECRET_KEY });
    const { data: users } = await clerk.users.getUserList({ limit: 20 });
    const authors = users.filter((user) => user.username);

    if (authors.length === 0) {
      console.log(
        "No Clerk users with a username yet. Sign up in the app, then run the seed again.",
      );
      return;
    }

    const now = Date.now();
    const { count } = await db.post.createMany({
      data: Array.from({ length: POSTS_TO_CREATE }, (_, i) => ({
        authorId: authors[i % authors.length]!.id,
        content: randomContent(),
        // spread over the last two weeks, so the feed shows a mix of relative times
        createdAt: new Date(now - Math.floor(Math.random() * TWO_WEEKS)),
      })),
    });

    console.log(`Seeded ${count} posts from ${authors.length} authors.`);
  } finally {
    await db.$disconnect();
  }
}

await main();
