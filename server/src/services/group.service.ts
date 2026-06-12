import Expense from "../models/Expense";
import ExpenseShare from "../models/ExpenseShare";
import Group from "../models/Group";
import GroupMember from "../models/GroupMember";
import User from "../models/User";

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

export const getGroupBalancesService = async (groupId: string) => {
  const expenses = await Expense.find({
    groupId,
  });

  const balances: Record<
    string,
    {
      userId: string;
      name: string;
      paid: number;
      share: number;
      balance: number;
    }
  > = {};

  for (const expense of expenses) {
    const paidBy = expense.paidBy.toString();

    if (!balances[paidBy]) {
      const user = await User.findById(paidBy);

      balances[paidBy] = {
        userId: paidBy,
        name: user?.name || "",
        paid: 0,
        share: 0,
        balance: 0,
      };
    }

    balances[paidBy].paid += expense.amount;

    const shares = await ExpenseShare.find({
      expenseId: expense._id,
    });

    for (const share of shares) {
      const userId = share.userId.toString();

      if (!balances[userId]) {
        const user = await User.findById(userId);

        balances[userId] = {
          userId,
          name: user?.name || "",
          paid: 0,
          share: 0,
          balance: 0,
        };
      }

      balances[userId].share += share.shareAmount;
    }
  }

  Object.keys(balances).forEach((key) => {
    balances[key].balance = balances[key].paid - balances[key].share;
  });

  return Object.values(balances);
};
