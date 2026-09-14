export const FEED_PAGE_SIZE = 20;

/**
 * Input of the posts feed. Server prefetching and client components must build it the same way,
 * otherwise their query keys don't match and the prefetched data isn't used.
 */
export const feedInput = (authorId?: string) =>
  authorId ? { limit: FEED_PAGE_SIZE, authorId } : { limit: FEED_PAGE_SIZE };

/** The feed's `nextCursor` is the cursor of the next page, `undefined` on the last one. */
export const feedQueryOptions = {
  getNextPageParam: (lastPage: { nextCursor?: string }) => lastPage.nextCursor,
};
