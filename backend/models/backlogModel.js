import mongoose from "mongoose";

const backlogSchema = mongoose.Schema(
  {
    code: String,
    sprintDuration: Number,
    velocity: Number,
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Org",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const backlogItemSchema = mongoose.Schema(
  {
    backlogId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Backlog",
    },
    name: String,
    description: String,
    comments: Array,
    type: String,
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "User",
    },
    status: String,
    points: Number,
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "BacklogItem",
    },
    sprint: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "BacklogSprint",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
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

const backlogSprintSchema = mongoose.Schema(
  {
    backlogId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Backlog",
    },
    iteration: Number,
    sprintGoal: String,
    startDate: String,
    endDate: String,
    retro: Array,
    status: String,
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
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

export const Backlog = mongoose.model("Backlog", backlogSchema);
export const BacklogItem = mongoose.model("BacklogItem", backlogItemSchema);
export const BacklogSprint = mongoose.model(
  "BacklogSprint",
  backlogSprintSchema
);
