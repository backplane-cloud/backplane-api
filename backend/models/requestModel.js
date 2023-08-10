import mongoose from "mongoose";

const requestSchema = mongoose.Schema(
  {
    requestType: {
      type: String,
      required: [
        true,
        "Please add type of request e.g. linkapp, exemption, budget",
      ],
    },
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Org",
    },
    approvalStatus: {
      type: String,
    },
    approvalCode: {
      type: String,
    },
    approver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    requestedForType: {
      type: String,
    },
    requestedForId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Request = mongoose.model("Request", requestSchema);

export default Request;
