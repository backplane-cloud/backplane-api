import mongoose from "mongoose";

const budgetSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  year: String,
  budget: Number,
  currency: String,
});

const costSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    cost: Number,
  },
  {
    timestamps: true,
  }
);

const appSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [false, "Please add a Name value e.g. 'My App'"],
    },
    description: {
      type: String,
      required: [false, "Please add a Description"],
    },
    code: {
      type: String,
      required: [true, "Please add a Code value e.g. my-app"],
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
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "Product",
    },
    budget: {
      type: [budgetSchema],
      default: undefined,
    },
    cloud: {
      type: String,
      required: [true, "Please add cloud provider e.g. azure | gcp | aws"],
    },
    environments: {
      type: Array,
      required: [false, "Please add App Owner UUID"],
    },
    status: {
      type: String,
      required: [false, "Please add status e.g. active, archived etc."],
    },
    type: {
      type: String,
      required: [false, "Please add type e.g. ..."],
    },
    appTemplate: {
      type: String,
      required: [false, "Please add type e.g. ..."],
    },
    repo: {
      type: String,
      required: [false, "Please add a Name value e.g. 'My App'"],
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

const App = mongoose.model("App", appSchema);

export default App;
