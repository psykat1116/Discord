import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/currentProfile";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { serverId } = params;
    if (!serverId) {
      return new NextResponse("Bad Request", { status: 400 });
    }
    const { name, imageUrl } = await req.json();
    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log("[Server Setting Update Error]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req:Request,{ params }: { params: { serverId: string } }) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { serverId } = params;
    if (!serverId) {
      return new NextResponse("Bad Request", { status: 400 });
    }
    const server = await db.server.delete({
      where: {
        id: serverId,
        profileId: profile.id,
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_DELETE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
