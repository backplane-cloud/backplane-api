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
    apps: {
      type: Array,
      required: [false, "Please add Product Owner UUID"],
    },
    cost: {
      type: Number,
      required: [false, "The Cost is updated automatically"],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
