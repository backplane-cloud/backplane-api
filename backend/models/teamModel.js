import mongoose from "mongoose";

const teamSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A name is required"],
    },
    name: {
      type: String,
      required: [false, "Description is Optional"],
    },
    code: {
      type: String,
      required: [true, "A code is required"],
    },
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Org",
    },
    members: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    owners: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    scope: {
      type: String,
      required: [true, "Please add a scope value e.g. /org/:id"],
    },
  },
  {
    timestamps: true,
  }
);

const Team = mongoose.model("Team", teamSchema);

export default Team;
