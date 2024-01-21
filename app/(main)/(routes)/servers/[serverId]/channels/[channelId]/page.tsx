import { currentProfile } from "@/lib/currentProfile";
import { redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";
import React from "react";
import { redirect } from "next/navigation";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import { ChannelType } from "@prisma/client";
import MediaRoom from "@/components/MediaRoom";

interface PageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();
  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });
  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
  });
  if (!channel || !member) {
    redirect("/");
  }
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            member={member}
            name={channel.name}
            type="channel"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            paramKey="channelId"
            chatId={channel.id}
            paramValue={channel.id}
          />
          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{ serverId: channel.serverId, channelId: channel.id }}
          />
        </>
      )}
      {channel.type === ChannelType.AUDIO && (
        <MediaRoom chatId={channel.id} video={false} audio={true} />
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoom chatId={channel.id} video={true} audio={true} />
      )}
    </div>
  );
};

export default Page;
