import mongoose from "mongoose";

const cloudSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  provider: String,
  tenantId: String,
  clientId: String,
  clientSecret: String,
  subscriptionId: String,
  gcpsecret: Object,
  ocisecret: Object,
});

const budgetSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  year: String,
  budget: Number,
  budgetAllocated: Number,
  currency: String,
});

const appTemplateSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  description: String,
  services: [String],
  environments: [String],
});

const costSchema = mongoose.Schema(
  {
    // _id: mongoose.Schema.Types.ObjectId,
    cost: Number,
  },
  {
    timestamps: true,
  }
);

const orgSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Please add a Code value"],
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Please add a Name value"],
    },
    description: {
      type: String,
      required: [false, "Please add a Description value"],
    },
    type: {
      type: String,
    },
    status: {
      type: String,
    },
    license: {
      type: String,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "User",
    },
    ownerEmail: {
      type: String,
    },
    csp: {
      type: [cloudSchema],
      default: undefined,
    },
    budget: {
      type: [budgetSchema],
      default: undefined,
    },
    appTemplate: {
      type: [appTemplateSchema],
      default: undefined,
    },
    cost: {
      type: [costSchema],
      required: [false, "The Cost is updated automatically"],
    },
  },
  {
    timestamps: true,
  }
);

const Org = mongoose.model("Org", orgSchema);

export default Org;
