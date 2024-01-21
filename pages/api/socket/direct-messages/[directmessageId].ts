import { currentProfilePages } from "@/lib/currentProfilePage";
import { db } from "@/lib/db";
import { NextApiResponseServerIO } from "@/types/ServerType";
import { Member, MemberRole, Message, Profile } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  try {
    const profile = await currentProfilePages(req);
    const { directmessageId, conversationId } = req.query;
    const { content } = req.body;
    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!directmessageId) {
      return res.status(400).json({ error: "Direct Message ID Missing" });
    }
    if (!conversationId) {
      return res.status(400).json({ error: "Conversation ID Missing" });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation Not Found" });
    }

    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) {
      return res.status(404).json({ error: "Member Not Found" });
    }

    let directMessage = await db.directMessage.findFirst({
      where: {
        id: directmessageId as string,
        conversationId: conversationId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!directMessage || directMessage.deleted) {
      return res.status(404).json({ error: "Message Not Found" });
    }

    const isMessageOwner = directMessage.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "DELETE") {
      directMessage = await db.directMessage.update({
        where: {
          id: directmessageId as string,
        },
        data: {
          deleted: true,
          fileUrl: "",
          content: "This Message Has Been Deleted",
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }
    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      directMessage = await db.directMessage.update({
        where: {
          id: directmessageId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const updateKey = `chat:${conversation.id}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, directMessage);
    return res.status(200).json(directMessage);
  } catch (error) {
    console.log("[DIRECT_MESSAGE_UPDATE_AT_PAGE_ROUTE_ERROR]", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
