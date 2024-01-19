import { db } from "./db";

export const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  let conversation =
    (await findConversation(memberOneId, memberTwoId)) ||
    (await findConversation(memberTwoId, memberOneId));
  if (!conversation) {
    conversation = await createConversation(memberOneId, memberTwoId);
  }
  return conversation;
};

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  return await db.conversation.findFirst({
    where: {
      AND: [{ memberOneId: memberOneId }, { memberTwoId: memberTwoId }],
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
};

const createConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
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
  } catch (error) {
    return null;
  }
};
