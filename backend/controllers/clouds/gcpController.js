import asyncHandler from "express-async-handler";
import App from "../../models/appModel.js";

// GCP SDK API
import { ProjectsClient, FoldersClient } from "@google-cloud/resource-manager";
import { OrgPolicyClient } from "@google-cloud/org-policy";

import { CloudBillingClient } from "@google-cloud/billing";
import { BigQuery } from "@google-cloud/bigquery";
import { PoliciesClient } from "@google-cloud/iam";

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
  const resource = "projects/backplane-core"; // Need to use the App ID to retrieve the Project Name
  // Imports the Resourcemanager library
  //const { FoldersClient } = require("@google-cloud/resource-manager").v3;

  // Instantiates a client
  const resourcemanagerClient = new ProjectsClient();

  async function callGetIamPolicy() {
    // Construct request
    const request = {
      resource,
    };

    // Run request
    const response = await resourcemanagerClient.getIamPolicy(request);
    return response;
  }

  const assignments = await callGetIamPolicy();
  //console.log("Get GCP Access");
  //res.send("Get GCP Access - Logic not yet implemented");
  // console.log(assignments);
  res.json(assignments[0].bindings);
});

const getGCPCost = asyncHandler(async (req, res) => {
  console.log("Get GCP Cost");
  res.send("Get GCP Access - Logic not yet implemented");
});

const getGCPPolicy = asyncHandler(async (req, res) => {
  // TODO(developer): replace with your prefered project ID.
  const projectId = "backplane-core"; // Need to use the App ID to retrieve the Project Name

  // Creates a client
  // eslint-disable-next-line no-unused-vars
  const client = new OrgPolicyClient();

  //TODO(library generator): write the actual function you will be testing
  async function listConstraints() {
    const constraints = await client.listConstraints({
      parent: `projects/${projectId}`,
    });
    return constraints;
  }
  const policies = await listConstraints();

  //console.log("Get GCP Policy");
  //res.send("Get GCP Policy - Logic not yet implemented");
  res.json(policies[0]);
});

export { getGCPAccess, getGCPCost, getGCPPolicy, createGCPEnvironments };
