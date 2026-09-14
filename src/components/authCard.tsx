import { SignInButton, SignUpButton } from "@clerk/nextjs";

/** "New to Chirp?" card shown to signed-out visitors in the right column. */
export const AuthCard = () => (
  <section className="flex flex-col gap-3 rounded-2xl border border-line p-4">
    <div>
      <h2 className="text-xl leading-6 font-extrabold">New to Chirp?</h2>
      <p className="mt-1 text-[13px] text-muted">
        Sign up now to share what&apos;s happening, in emojis only.
      </p>
    </div>
    <SignUpButton mode="modal">
      <button
        type="button"
        className="h-10 rounded-full bg-foreground font-bold text-black transition-colors hover:bg-foreground/90"
      >
        Create account
      </button>
    </SignUpButton>
    <SignInButton mode="modal">
      <button
        type="button"
        className="h-10 rounded-full border border-line-strong font-bold text-brand transition-colors hover:bg-brand/10"
      >
        Sign in
      </button>
    </SignInButton>
  </section>
);
