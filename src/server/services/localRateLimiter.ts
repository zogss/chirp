import { randomUUID } from "node:crypto";
import { createClient, type RedisClientType } from "redis";

import { env } from "~/env";
import type { RateLimiter } from "./rateLimiter";

/**
 * Sliding window log: each allowed request is a member of a sorted set scored by its timestamp, so
 * the set's size is the number of requests in the last `window` milliseconds. Runs atomically, since
 * Redis doesn't interleave other commands with a script.
 *
 * Returns `{ allowed (1 or 0), reset timestamp }`, the reset being when the oldest request expires.
 */
const SLIDING_WINDOW_SCRIPT = `
local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])

redis.call("ZREMRANGEBYSCORE", key, "-inf", now - window)

local allowed = redis.call("ZCARD", key) < limit
if allowed then
  redis.call("ZADD", key, now, ARGV[4])
  redis.call("PEXPIRE", key, window)
end

local oldest = redis.call("ZRANGE", key, 0, 0, "WITHSCORES")
return { allowed and 1 or 0, tonumber(oldest[2]) + window }
`;

const CONNECTION_ERROR = `Couldn't connect to the local Redis at ${env.LOCAL_REDIS_URL}. Is it running? (docker compose up -d)`;

const connect = async () => {
  const client: RedisClientType = createClient({
    url: env.LOCAL_REDIS_URL,
    socket: {
      connectTimeout: 2000,
      // give up after a few quick retries, so requests fail with a clear error instead of hanging
      // while Redis isn't running
      reconnectStrategy: (retries) =>
        retries < 3 ? 200 * (retries + 1) : new Error(CONNECTION_ERROR),
    },
  });
  // without a listener, connection errors would crash the dev server
  client.on("error", (error: Error) =>
    console.error("[local Redis]", error.message),
  );

  await client.connect();
  return client;
};

const globalForRedis = globalThis as unknown as {
  localRedis: Promise<RedisClientType> | undefined;
};

/** A single connection, reused across hot reloads, and re-created once it's closed. */
const getClient = async () => {
  const client = await globalForRedis.localRedis?.catch(() => undefined);
  if (client?.isOpen) return client;

  globalForRedis.localRedis = connect();
  return globalForRedis.localRedis;
};

interface LocalRateLimiterOptions {
  maxRequests: number;
  windowSeconds: number;
  prefix: string;
}

/** Rate limiter for local development, backed by the Redis from `docker-compose.yml`. */
export const createLocalRateLimiter = ({
  maxRequests,
  windowSeconds,
  prefix,
}: LocalRateLimiterOptions): RateLimiter => ({
  limit: async (identifier) => {
    const client = await getClient().catch((error: unknown) => {
      throw new Error(CONNECTION_ERROR, { cause: error });
    });
    const now = Date.now();

    try {
      const [allowed, reset] = (await client.eval(SLIDING_WINDOW_SCRIPT, {
        keys: [`${prefix}:${identifier}`],
        arguments: [
          String(now),
          String(windowSeconds * 1000),
          String(maxRequests),
          `${now}:${randomUUID()}`,
        ],
      })) as [number, number];

      return { success: allowed === 1, reset, pending: Promise.resolve() };
    } catch (error) {
      // Redis went away after connecting (e.g. its container was stopped)
      if (!client.isReady) throw new Error(CONNECTION_ERROR, { cause: error });
      throw error;
    }
  },
});
