import { type User } from "@clerk/nextjs/server";
import moment from "moment";
import React from "react";
import ProfileManagementButton from "../profileManagementButton";

export const ProfileData = ({
  firstName,
  lastName,
  createdAt,
  username,
}: Partial<User>) => (
  <div className="flex w-full flex-col items-start justify-start gap-2 border-b border-slate-700 p-4">
    {firstName ? (
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold">{`${firstName || ""} ${
            lastName || ""
          }`}</h1>
          <h2 className="text-base text-gray-600">{`@${username || ""}`}</h2>
        </div>
        <ProfileManagementButton />
      </div>
    ) : (
      <span className="text-xl font-bold text-gray-400">{`@${
        username || ""
      }`}</span>
    )}
    {createdAt && (
      <div className="flex items-center gap-1 fill-gray-600 text-gray-600">
        <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden="true">
          <g>
            <path d="M7 4V3h2v1h6V3h2v1h1.5C19.89 4 21 5.12 21 6.5v12c0 1.38-1.11 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-12C3 5.12 4.12 4 5.5 4H7zm0 2H5.5c-.27 0-.5.22-.5.5v12c0 .28.23.5.5.5h13c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5H17v1h-2V6H9v1H7V6zm0 6h2v-2H7v2zm0 4h2v-2H7v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm4-4h2v-2h-2v2z"></path>
          </g>
        </svg>
        <span className="block">
          joined {moment(createdAt).format("MMM YYYY")}
        </span>
      </div>
    )}
  </div>
);
