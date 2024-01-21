"use client";
import { Member, Profile } from "@prisma/client";
import React, { Fragment, useRef, ElementRef } from "react";
import ChatWelcome from "./ChatWelcome";
import useChatQuery from "@/hooks/useChatQuery";
import { Loader2, ServerCrash } from "lucide-react";
import { Message } from "postcss";
import ChatItem from "./ChatItem";
import { format } from "date-fns";
import { useChatSocket } from "@/hooks/useChatSocket";
import useChatScroll from "@/hooks/useChatScroll";

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramValue: string;
  paramKey: "channelId" | "conversationId";
  type: "channel" | "conversation";
}

type MessageWithMemberAndProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

const DATE_FORMAT = "dd/MM/yyyy, HH:mm:ss";

const ChatMessages: React.FC<ChatMessagesProps> = ({
  name,
  member,
  chatId,
  apiUrl,
  socketQuery,
  socketUrl,
  paramValue,
  type,
  paramKey,
}) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });
  useChatSocket({ queryKey, addKey, updateKey });
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldScroll: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.item?.length ?? 0,
  });

  if (status === "pending") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="text-zinc-500 animate-spin my-4 h-7 w-7" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading Messages...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="text-zinc-500 animate-spin my-4 h-7 w-7" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Oops! Something went wrong
        </p>
      </div>
    );
  }

  return (
    <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome type={type} name={name} />}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 dark:text-zinc-400 text-xs my-4 transition"
            >
              Load Previous Messages
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((val: { item: MessageWithMemberAndProfile[] }, i) => (
          <Fragment key={i}>
            {val?.item?.map((message: MessageWithMemberAndProfile) => (
              <ChatItem
                currentMember={member}
                member={message.member}
                key={message.id}
                id={message.id}
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
