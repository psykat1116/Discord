import InviteBox from "@/components/InviteBox";
import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

interface InvitePageProps {
  params: {
    inviteCode: string;
  };
}

const Page: React.FC<InvitePageProps> = async ({ params }) => {
  const profile = await currentProfile();
  if (!profile) {
    return <RedirectToSignIn />;
  }
  if (!params.inviteCode) {
    return redirect("/");
  }

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  const serverData = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
    },
    include: {
      profile: true,
    },
  });

  if (!serverData) {
    return redirect("/");
  }

  const handleClicked = async () => {
    try {
      const server = await db.server.update({
        where: {
          inviteCode: params.inviteCode,
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
    <div className="w-full h-full flex items-center justify-center bg-[url('/Background.png')] bg-cover bg-center bg-no-repeat">
      <InviteBox serverData={serverData} onClick={handleClicked} />
    </div>
  );
};

export default Page;
