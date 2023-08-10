import mongoose from "mongoose";

const assignmentSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, "Please add a text value"],
    },
    scope: {
      type: String,
      required: [true, "Please add a scope value e.g. /org/:id"],
    },
    principal: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "principalRef",
    },
    principalRef: {
      type: String,
      required: true,
      enum: ["User", "Team"],
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    expires: {
      type: Date,
    },
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Org",
    },
  },
  {
    timestamps: true,
  }
);

const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;
