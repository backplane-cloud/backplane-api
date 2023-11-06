import mongoose from "mongoose";

const serviceSchema = mongoose.Schema(
  {
    code: String,
    name: String,
    description: String,
    url: String,
    apikey: String,
    status: String,

    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Org",
    },

    platformId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "Platform",
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    tags: [String],
    meta: Object,
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model("Service", serviceSchema);

export default Service;
