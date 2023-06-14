import React from "react";

type StatusType = "empty" | "error" | "not-found";

interface ProfileFeedEmptyProps {
  status: StatusType;
}

const ProfileFeedEmpty = ({ status }: ProfileFeedEmptyProps) => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex w-full items-center justify-center py-10">
        <div className="text-2xl text-gray-500">
          {status === "empty"
            ? "User has no posts!"
            : status === "error"
            ? "Error loading posts!"
            : "User not found!"}
        </div>
      </div>
    </div>
  );
};

export default ProfileFeedEmpty;
