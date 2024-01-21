import React from "react";
import { redirect } from "next/navigation";
import initialProfile from "@/lib/initialProfile";
import { db } from "@/lib/db";
import InitialModal from "@/components/modals/InitialModal";

const Page = async () => {
  const profile = await initialProfile();
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  if (server) {
    return redirect(`/servers/${server.id}`);
  }
  return (
    <div className="h-full w-full flex justify-center items-center bg-[url('/Background.png')] bg-no-repeat bg-cover bg-center">
      <InitialModal />
    </div>
  );
};

export default Page;
