import { useEffect, useState } from "react";

type ChatScrollProps = {
  chatRef: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  shouldScroll: boolean;
  loadMore: () => void;
  count: number;
};

const useChatScroll = ({
  chatRef,
  bottomRef,
  shouldScroll,
  loadMore,
  count,
}: ChatScrollProps) => {
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const topDiv = chatRef?.current;
    const handleScroll = () => {
      const scrollTop = topDiv?.scrollTop;
      if (scrollTop === 0 && shouldScroll) {
        loadMore();
      }
    };
    topDiv?.addEventListener("scroll", handleScroll);
    return () => {
      topDiv?.removeEventListener("scroll", handleScroll);
    };
  }, [shouldScroll, loadMore, chatRef]);

  useEffect(() => {
    const bottomDiv = bottomRef?.current;
    const topDiv = chatRef?.current;
    const shouldAutoScroll = () => {
      if (!hasInitialized && bottomDiv) {
        setHasInitialized(true);
        return true;
      }
      if (!topDiv) {
        return false;
      }

      const distanceFromBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
      return distanceFromBottom < 100;
    };
    if (shouldAutoScroll()) {
      setTimeout(() => {
        bottomDiv?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [bottomRef, chatRef, hasInitialized, count]);
};

export default useChatScroll;