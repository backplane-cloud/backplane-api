import asyncHandler from "express-async-handler";

import App from "../../models/appModel.js";

// // GCP SDK API
// import { ProjectsClient } from "@google-cloud/resource-manager";
// import { CloudBillingClient } from "@google-cloud/billing";
// import { BigQuery } from "@google-cloud/bigquery";

// AWS CODE
const createAWSEnvironments = asyncHandler(async (req, res) => {
  console.log("Create AWS Environments");
});

const getAWSAccess = asyncHandler(async (req, res) => {
  console.log("Get AWS Access");
});

const getAWSCost = asyncHandler(async (req, res) => {
  console.log("Get AWS Cost");
});

const getAWSPolicy = asyncHandler(async (req, res) => {
  console.log("Get AWS Policy");
});

export { getAWSAccess, getAWSCost, getAWSPolicy, createAWSEnvironments };
