import { Document, Schema, Types, model } from "mongoose";

export interface IGroupMember extends Document {
  groupId: Types.ObjectId;
  userId: Types.ObjectId;
  joinedAt: Date;
}

const groupMemberSchema = new Schema<IGroupMember>({
  groupId: {
    type: Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<IGroupMember>("GroupMember", groupMemberSchema);
