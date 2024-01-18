import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!params.serverId) {
      return new NextResponse("Bad Request Server Id Missing", { status: 400 });
    }
    const { serverId } = params;
    const server = await db.server.update({
      where: { id: serverId, profileId: profile.id },
      data: {
        inviteCode: uuidv4(),
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log("[Generate Invite Code Error]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
