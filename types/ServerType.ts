import { Member, Profile, Server } from "@prisma/client";

export type ServerWithMemberAndProfile = Server & {
  members: (Member & { profile: Profile })[];
};
