import mongoose from "mongoose";

const roleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    allowActions: {
      type: [String],
      required: [true, "Please add an action value"],
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

const Role = mongoose.model("Role", roleSchema);

export default Role;
