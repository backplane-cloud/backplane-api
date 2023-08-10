import mongoose from "mongoose";

const budgetSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  year: String,
  budget: Number,
  budgetAllocated: Number,
  currency: String,
});

const platformSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Please add a Code value"],
    },
    name: {
      type: String,
      required: [true, "Please add a Name value"],
    },
    type: {
      type: String,
    },
    status: {
      type: String,
    },
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Org",
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    budget: {
      type: [budgetSchema],
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

const Platform = mongoose.model("Platform", platformSchema);

export default Platform;
