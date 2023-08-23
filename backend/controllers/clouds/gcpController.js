import asyncHandler from "express-async-handler";

import App from "../../models/appModel.js";

// GCP SDK API
import { ProjectsClient } from "@google-cloud/resource-manager";
import { CloudBillingClient } from "@google-cloud/billing";
import { BigQuery } from "@google-cloud/bigquery";

// GCP CODE
const createGCPEnvironments = asyncHandler(async (req, res) => {
  console.log("Create GCP Environments");
  return;
});
const getGCPAccess = asyncHandler(async (req, res) => {
  console.log("Get GCP Access");
  res.send("Get GCP Access - Logic not yet implemented");
});

const getGCPCost = asyncHandler(async (req, res) => {
  console.log("Get GCP Cost");
  res.send("Get GCP Access - Logic not yet implemented");
});

const getGCPPolicy = asyncHandler(async (req, res) => {
  console.log("Get GCP Policy");
  res.send("Get GCP Policy - Logic not yet implemented");
});

export { getGCPAccess, getGCPCost, getGCPPolicy, createGCPEnvironments };
