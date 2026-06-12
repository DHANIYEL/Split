import Group from "../models/Group";
import GroupMember from "../models/GroupMember";

interface CreateGroupPayload {
  title: string;
  members: string[];
  createdBy: string;
}

export const createGroupService = async ({
  title,
  members,
  createdBy,
}: CreateGroupPayload) => {
  const group = await Group.create({
    name: title,
    createdBy,
  });

  const allMembers = [...new Set([createdBy, ...members])];

  await GroupMember.insertMany(
    allMembers.map((userId) => ({
      groupId: group._id,
      userId,
    })),
  );

  return group;
};

export const getMyGroupsService = async (userId: string) => {
  const memberships = await GroupMember.find({
    userId,
  }).select("groupId");

  const groupIds = memberships.map((item) => item.groupId);

  return Group.find({
    _id: { $in: groupIds },
  }).sort({ createdAt: -1 });
};

export const getGroupDetailsService = async (groupId: string) => {
  return Group.findById(groupId).populate("createdBy", "name email");
};

export const getGroupMembersService = async (groupId: string) => {
  return GroupMember.find({
    groupId,
  }).populate("userId", "name email");
};

export const updateGroupService = async ({
  groupId,
  userId,
  title,
}: {
  groupId: string;
  userId: string;
  title: string;
}) => {
  const group = await Group.findById(groupId);

  if (!group) {
    throw new Error("Group not found");
  }

  if (group.createdBy.toString() !== userId) {
    throw new Error("Only group creator can update group");
  }

  group.name = title;

  await group.save();

  return group;
};

export const deleteGroupService = async ({
  groupId,
  userId,
}: {
  groupId: string;
  userId: string;
}) => {
  console.log("userId :", userId);
  console.log("groupId :", groupId);
  const group = await Group.findById(groupId);

  if (!group) {
    throw new Error("Group not found");
  }

  if (group.createdBy.toString() !== String(userId)) {
    throw new Error("Only group creator can delete group");
  }

  await GroupMember.deleteMany({
    groupId,
  });

  await Group.findByIdAndDelete(groupId);

  return true;
};
