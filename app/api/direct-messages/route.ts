import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { DirectMessage } from "@prisma/client";
import { NextResponse } from "next/server";

const MESSAGES_PER_PAGE = 10;

export async function GET(req: Request) {
  try {
    const profile = currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const conversationId = searchParams.get("conversationId");
    if (!conversationId) {
      return new NextResponse("Conversation ID Missing", { status: 400 });
    }
    let messages: DirectMessage[];
    if (cursor) {
      messages = await db.directMessage.findMany({
        take: MESSAGES_PER_PAGE,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.directMessage.findMany({
        take: MESSAGES_PER_PAGE,
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }
    let nextCursor = null;
    if (messages.length === MESSAGES_PER_PAGE) {
      nextCursor = messages[MESSAGES_PER_PAGE - 1].id;
    }
    return NextResponse.json({
      item: messages,
      nextCursor,
    });
  } catch (error) {
    console.log("[DIRECT_MESSAGE_FETCH_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
