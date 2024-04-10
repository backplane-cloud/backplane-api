import mongoose from "mongoose";

const budgetSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  year: String,
  budget: Number,
  budgetAllocated: Number,
  currency: String,
  approvalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Request",
  },
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

const productSchema = mongoose.Schema(
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
    },
    type: {
      type: String,
    },
    status: {
      type: String,
    },
    platformId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Platform",
    },
    platformCode: {
      type: String,
    },
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Org",
    },
    orgCode: {
      type: String,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    ownerEmail: {
      type: String,
    },
    budget: {
      type: [budgetSchema],
      default: undefined,
    },
    apps: {
      type: Array,
      required: [false, "Please add Product Owner UUID"],
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

const Product = mongoose.model("Product", productSchema);

export default Product;
