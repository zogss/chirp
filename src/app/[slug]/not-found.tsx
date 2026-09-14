import { EmptyState } from "~/components/emptyState";
import { NavigationHeader } from "~/components/header";

export default function ProfileNotFound() {
  return (
    <>
      <NavigationHeader title="Profile" />
      <div className="aspect-3/1 w-full bg-banner" />
      <div className="px-4 pt-3">
        <div className="mt-[-15%] aspect-square w-1/4 max-w-33.5 min-w-12 rounded-full border-4 border-black bg-banner" />
      </div>
      <EmptyState
        title="This account doesn't exist"
        description="Check the username and try again."
      />
    </>
  );
}
