import asyncHandler from "express-async-handler";

import App from "../../models/appModel.js";

// GCP SDK API
import { ProjectsClient } from "@google-cloud/resource-manager";
import { CloudBillingClient } from "@google-cloud/billing";
import { BigQuery } from "@google-cloud/bigquery";

// GCP CODE
const createGCPEnvironments = asyncHandler(async (req, res) => {
  console.log("Create GCP Environments");
});
const getGCPAccess = asyncHandler(async (req, res) => {
  console.log("Get GCP Access");
});

const getGCPCost = asyncHandler(async (req, res) => {
  console.log("Get GCP Cost");
});

const getGCPPolicy = asyncHandler(async (req, res) => {
  console.log("Get GCP Policy");
});

export { getGCPAccess, getGCPCost, getGCPPolicy, createGCPEnvironments };
