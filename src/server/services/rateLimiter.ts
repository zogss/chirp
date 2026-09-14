import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { env } from "~/env";
import { createLocalRateLimiter } from "./localRateLimiter";

// 5 chirps per minute, per user
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW_SECONDS = 60;
const RATE_LIMIT_PREFIX = "chirp:ratelimit";

export interface RateLimitResult {
  success: boolean;
  /** Unix timestamp (in milliseconds) at which the window resets. */
  reset: number;
  /** Background work (e.g. Upstash analytics) to let finish after the response is sent. */
  pending: Promise<unknown>;
}

export interface RateLimiter {
  limit: (identifier: string) => Promise<RateLimitResult>;
}

const createUpstashRateLimiter = (): RateLimiter => {
  // validated by `src/env.js` in production, unless the build ran with SKIP_ENV_VALIDATION
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error(
      "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required in production",
    );
  }

  return new Ratelimit({
    redis: new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    }),
    limiter: Ratelimit.slidingWindow(
      RATE_LIMIT_MAX_REQUESTS,
      `${RATE_LIMIT_WINDOW_SECONDS} s`,
    ),
    analytics: true,
    prefix: RATE_LIMIT_PREFIX,
  });
};

let rateLimiter: Promise<RateLimiter> | undefined;

/**
 * Upstash in production. In development (and tests) a local Redis instead (`docker compose up -d`),
 * so working on the app doesn't need an Upstash database.
 *
 * Created on first use, so building without the runtime environment variables works.
 */
export const getRateLimiter = () =>
  (rateLimiter ??=
    env.NODE_ENV === "production"
      ? Promise.resolve(createUpstashRateLimiter())
      : new Promise((resolve) =>
          resolve(
            createLocalRateLimiter({
              maxRequests: RATE_LIMIT_MAX_REQUESTS,
              windowSeconds: RATE_LIMIT_WINDOW_SECONDS,
              prefix: RATE_LIMIT_PREFIX,
            }),
          ),
        ));
