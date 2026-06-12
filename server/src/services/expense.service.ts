import Expense from "../models/Expense";
import ExpenseShare from "../models/ExpenseShare";
import GroupMember from "../models/GroupMember";

interface CreateExpensePayload {
  groupId: string;
  title: string;
  description?: string;
  amount: number;
  paidBy: string;
  createdBy: string;
}

export const createExpenseService = async ({
  groupId,
  title,
  description,
  amount,
  paidBy,
  createdBy,
}: CreateExpensePayload) => {
  const expense = await Expense.create({
    groupId,
    title,
    description,
    amount,
    paidBy,
    createdBy,
  });

  const members = await GroupMember.find({
    groupId,
  });

  const shareAmount = amount / members.length;

  await ExpenseShare.insertMany(
    members.map((member) => ({
      expenseId: expense._id,
      userId: member.userId,
      shareAmount,
    })),
  );

  return expense;
};

export const getGroupExpensesService = async (groupId: string) => {
  return Expense.find({
    groupId,
  })
    .populate("paidBy", "name")
    .sort({
      createdAt: -1,
    });
};

export const getExpenseDetailsService = async (expenseId: string) => {
  return Expense.findById(expenseId)
    .populate("paidBy", "name")
    .populate("createdBy", "name");
};

export const updateExpenseService = async (
  expenseId: string,
  userId: string,
  payload: any,
) => {
  const expense = await Expense.findById(expenseId);

  if (!expense) {
    throw new Error("Expense not found");
  }

  if (expense.createdBy.toString() !== String(userId)) {
    throw new Error("Only creator can update expense");
  }

  return Expense.findByIdAndUpdate(expenseId, payload, { new: true });
};

export const deleteExpenseService = async (
  expenseId: string,
  userId: string,
) => {
  const expense = await Expense.findById(expenseId);

  if (!expense) {
    throw new Error("Expense not found");
  }

  if (expense.createdBy.toString() !== String(userId)) {
    throw new Error("Only creator can delete expense");
  }

  await ExpenseShare.deleteMany({
    expenseId,
  });

  await Expense.findByIdAndDelete(expenseId);

  return true;
};
