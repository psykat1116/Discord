"use client";
import { Profile, Server } from "@prisma/client";
import Image from "next/image";
import React from "react";

interface InviteBoxProps {
  serverData: Server & { profile: Profile };
  onClick: () => void;
}

const InviteBox = ({ serverData, onClick }: InviteBoxProps) => {
  return (
    <div className="w-full sm:w-[500px] p-5 flex flex-col items-center bg-[#232323] gap-3 rounded-sm shadow-md">
      <Image
        src={serverData?.imageUrl}
        alt={serverData.name}
        height={70}
        width={70}
        className="object-cover rounded-sm"
      />
      <p className="text-base text-neutral-400 capitalize">
        {serverData.profile.name} Invited you to join the Server
      </p>
      <p className="text-2xl mb-3">{serverData.name}</p>
      <button
        className="w-full bg-indigo-500 p-2.5 text-lg rounded-sm"
        onClick={onClick}
      >
        Accept Invite
      </button>
    </div>
  );
};

export default InviteBox;
