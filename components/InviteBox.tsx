"use client";
import { db } from "@/lib/db";
import { Profile, Server } from "@prisma/client";
import Image from "next/image";
import { redirect, useParams } from "next/navigation";
import React from "react";

interface InviteBoxProps {
  profile: Profile;
  serverData: Server & { profile: Profile };
}

const InviteBox = ({ profile, serverData }: InviteBoxProps) => {
  const params = useParams();
  const { inviteCode } = params as { inviteCode: string };
  const handleClicked = async () => {
    try {
      const server = await db.server.update({
        where: {
          inviteCode: inviteCode,
        },
        data: {
          members: {
            create: [
              {
                profileId: profile.id,
              },
            ],
          },
        },
      });
      if (server) {
        return redirect(`/servers/${server.id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
        onClick={handleClicked}
      >
        Accept Invite
      </button>
    </div>
  );
};

export default InviteBox;
