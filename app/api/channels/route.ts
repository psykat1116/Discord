import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/currentProfile";
import { MemberRole } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    const { name, type } = await req.json();
    if (!serverId) {
      return new NextResponse("serverId is required", { status: 400 });
    }
    if (name === "general") {
      return new NextResponse("'general' is a reserved name", { status: 400 });
    }
    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name,
            type,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[Channel Route Error]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
