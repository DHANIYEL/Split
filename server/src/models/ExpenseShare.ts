import { Document, Schema, Types, model } from "mongoose";

export interface IExpenseShare extends Document {
  expenseId: Types.ObjectId;
  userId: Types.ObjectId;
  shareAmount: number;
}

const expenseShareSchema = new Schema<IExpenseShare>({
  expenseId: {
    type: Schema.Types.ObjectId,
    ref: "Expense",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  shareAmount: {
    type: Number,
    required: true,
    min: 0,
  },
});

export default model<IExpenseShare>("ExpenseShare", expenseShareSchema);
