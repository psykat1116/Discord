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
    const { messageId, serverId, channelId } = req.query;
    const { content } = req.body;
    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!serverId) {
      return res.status(400).json({ error: "Server ID Missing" });
    }
    if (!channelId) {
      return res.status(400).json({ error: "Channel ID Missing" });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res.status(404).json({ error: "Server Not Found" });
    }

    const channel = db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) {
      return res.status(404).json({ error: "Server Not Found" });
    }

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member) {
      return res.status(404).json({ error: "Member Not Found" });
    }

    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message || message.deleted) {
      return res.status(404).json({ error: "Message Not Found" });
    }

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "DELETE") {
      message = await db.message.update({
        where: {
          id: messageId as string,
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
      message = await db.message.update({
        where: {
          id: messageId as string,
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

    const updateKey = `chat:${channelId}:messages:update`;
    const deleteKey = `chat:${channelId}:messages:delete`;

    res?.socket?.server?.io?.emit(updateKey, message);
    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGE_UPDATE_AT_PAGE_ROUTE_ERROR]", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
