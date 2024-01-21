"use client";
import qs from "query-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Video, VideoOff } from "lucide-react";

import ToolTipAction from "../ToolTipAction";
const ChatVideoBtn = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const isVideo = searchParams?.get("video");

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || "",
        query: {
          video: isVideo ? undefined : true,
        },
      },
      { skipNull: true }
    );
    router.push(url);
  };

  const Icon = isVideo ? VideoOff : Video;
  const tooltiplabel = isVideo ? "End Video Call" : "Start Video Call";

  return (
    <ToolTipAction side="bottom" label={tooltiplabel}>
      <button onClick={onClick} className="hover:opacity-75 transition mr-4">
        <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
      </button>
    </ToolTipAction>
  );
};

export default ChatVideoBtn;
