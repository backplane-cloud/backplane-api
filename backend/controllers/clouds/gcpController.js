import asyncHandler from "express-async-handler";

import App from "../../models/appModel.js";

// GCP SDK API
import { ProjectsClient } from "@google-cloud/resource-manager";
import { CloudBillingClient } from "@google-cloud/billing";
import { BigQuery } from "@google-cloud/bigquery";

// GCP CODE
const createGCPEnvironments = asyncHandler(async (req, res) => {
  const { environs, parent, orgCode, appCode } = req;

  // const projectId = displayName.toLowerCase();
  // // const project = projectId;
  // console.log(`Creating GCP App ${projectId}`);

  const client = new ProjectsClient();

  let project;

  environs.map((env) => {
    let projectId = `bp-${orgCode.split("-")[0]}-${appCode.split("-")[0]}`;
    project = {
      projectId,
      displayName: `bp-${orgCode.split("-")[0]}-${
        appCode.split("-")[0]
      }-${env}`,
      parent, //: "organizations/447090138215",
    };
  });

  const request = {
    project,
  };

  console.log("Project Object:", project);
  console.log("POST Request Body:", request);

  // Run request
  const [operation] = await client.createProject(request);
  const [response] = await operation.promise();
  console.log(response);
  return response;
  //
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
