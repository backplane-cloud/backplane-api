import asyncHandler from "express-async-handler";

import App from "../models/appModel.js";
import Product from "../models/productModel.js";
import Org from "../models/orgModel.js";
import Request from "../models/requestModel.js";
import Service from "../models/serviceModel.js";

// Azure SDK API
import { ClientSecretCredential } from "@azure/identity";
import { SubscriptionClient } from "@azure/arm-subscriptions";
import { BillingManagementClient } from "@azure/arm-billing";
import { ResourceManagementClient } from "@azure/arm-resources";

// GCP SDK API
import { ProjectsClient } from "@google-cloud/resource-manager";
import { CloudBillingClient } from "@google-cloud/billing";
import { BigQuery } from "@google-cloud/bigquery";

// GITHUB REPO
import axios from "axios";

// @desc  Get Apps
// @route GET /api/apps
// @access Private
const getApps = asyncHandler(async (req, res) => {
  const apps = await App.find(
    req.user.userType != "root" ? { orgId: req.user.orgId } : null
  );

  if (apps) {
    res.status(200).json(apps);
  } else {
    res.status(400);
    throw new Error("No Apps Found");
  }
});

// @desc  Get App
// @route GET /api/apps/:id
// @access Private
const getApp = asyncHandler(async (req, res) => {
  const apps = await App.findById(req.params.id);

  if (apps) {
    res.status(200).json(apps);
  } else {
    res.status(400);
    throw new Error("No Apps Found");
  }
});

// @desc  Get App Requests
// @route GET /api/apps/:id/requests
// @access Private
const getAppRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find({ requestedForId: req.params.id });
  if (requests) {
    res.status(200).json(requests);
  } else {
    res.status(400);
    throw new Error("No Requests Found for App");
  }
});

// @desc  Create App
// @route POST /api/apps
// @access Private
const setApp = asyncHandler(async (req, res) => {
  // Check if App already exists
  let ownerId = req.body.ownerId ? req.body.ownerId : req.user.id;
  let orgId = req.body.orgId ? req.body.orgId : req.user.orgId;
  let code = req.body.name.toLowerCase().replace(" ", "-");

  const exists = await App.findOne({
    code,
    orgId,
  });
  if (exists) {
    console.log(exists);
    res.status(400);
    throw new Error(
      `App ${req.body.code} already exists for this organisation.`
    );
  }

  // Get Org
  const org = await Org.findById(orgId);

  if (!org.csp) {
    res.send("No Cloud Credentials Specified for Org, aborting App Creation");
    return;
  }

  // Get Cloud Credentials from Org
  const cloudCredentials = org.csp.find(
    (cloud) => cloud.provider === req.body.cloud
  );

  console.log(`App ${req.body.name} belongs to Organisation ${org.name}`);

  // Create Repo
  // Get appType from Org
  const apptype = req.body.type ? req.body.type : "default";
  const appType = org.appType.find((type) => type.name === apptype);

  const service = appType.services[0];

  // Get Service
  const serviceObj = await Service.findOne({ code: service });
  const apikey = serviceObj.apikey;
  const url = serviceObj.url;

  console.log(`Creating Repo: ${code}`);

  const repo = await axios.post(
    url,
    {
      name: code,
      description: "Backplane Generated Repo",
    },
    { headers: { Authorization: "Bearer " + apikey } }
  );
  console.log(repo.data.full_name, repo.data.owner.html_url);

  // Set Environs for Account Creation
  const environs = ["prod", "nonprod", "test", "dev"];

  // AZURE API CODE
  if (req.body.cloud === "azure") {
    console.log(`Cloud Credentials: ${cloudCredentials}`);
    const tenantId = cloudCredentials.tenantId;
    const clientId = cloudCredentials.clientId;
    const clientSecret = cloudCredentials.clientSecret;
    const subscriptionId = "2a04f460-f517-4085-808d-7877fd30ea72";

    // Authenticate to Cloud Platform
    const credentials = new ClientSecretCredential(
      tenantId,
      clientId,
      clientSecret
    );

    // Do something in the Cloud platform.

    // Azure services
    const resourceClient = new ResourceManagementClient(
      credentials,
      subscriptionId
    );

    // Create Resource Groups
    const location = "ukwest";

    async function createResourceGroups() {
      let collectResults = [];
      const groupParameters = {
        location: location,
      };

      for (let env of environs) {
        let resourceGroupName = `_bp-${org.code}-${req.body.name}-${env}`;
        console.log("\n Creating resource group: " + resourceGroupName);
        const resCreate = await resourceClient.resourceGroups.createOrUpdate(
          resourceGroupName,
          groupParameters
        );

        collectResults.push(resCreate);
      }

      return collectResults;
    }

    const rgResult = await createResourceGroups();
    //console.log("Environments:", rgResult);

    // Build Environment Array of Object for App document
    //const environments = [];
    const getenvirons = () => {
      let collectEnv = [];
      for (let environ of environs) {
        collectEnv.push({
          name: environ,
          accountId: rgResult[environs.indexOf(environ)].id,
          spn: {},
        });
      }
      return collectEnv;
    };

    const environments = getenvirons();

    console.log("Environments:", environments);

    // Create New App
    const app = await App.create({
      orgId,
      ownerId,
      code,
      name: req.body.name,
      cloud: req.body.cloud,
      environments: environments,
      type: "app",
      status: "active",
      repo: repo.data.full_name,
    });
    console.log(`App Successfully Provisioned in ${req.body.cloud}`);

    res.status(200).json({ rgResult, app });
  }

  // GCP CODE
  if (req.body.cloud === "gcp") {
    const projectName = `bp-${org.code}-${code}-prod`;
    const projectId = projectName.toLowerCase();
    const project = projectId;
    console.log(`Creating GCP App ${projectId}`);

    // Creates a client
    const client = new ProjectsClient();

    // async function quickstart() {
    //   // Lists current projects
    //   const projects = client.searchProjectsAsync();
    //   console.log("Projects:");
    //   for await (const project of projects) {
    //     console.info(project);
    //   }
    // }
    // quickstart();

    async function callCreateProject() {
      // Construct request
      const project = {
        projectId,
        displayName: projectName,
        parent: "organizations/447090138215",
      };

      const request = {
        project,
      };

      console.log("Project Object:", project);
      console.log("POST Request Body:", request);

      // Run request
      const [operation] = await client.createProject(request);
      const [response] = await operation.promise();
      console.log(response);

      // Create New App
      const app = await App.create({
        orgId,
        ownerId,
        code,
        name: req.body.name,
        cloud: req.body.cloud,
        environments: project,
      });
      console.log(`App Successfully Provisioned in ${req.body.cloud}`);
      res.status(200).json(app);
    }

    callCreateProject();
  }
});

// @desc  Update App
// @route PUT /api/apps/:id
// @access Private
const updateApp = asyncHandler(async (req, res) => {
  const app = await App.findById(req.params.id);

  if (!app) {
    res.status(400);
    throw new Error("App not found");
  }

  let updateApp = req.body;
  if (req.body.cloudAccounts) {
    const cloudAccounts = req.body.cloudAccounts.split(",");

    updateApp = {
      ...req.body,
      cloudAccounts,
    };
  }

  if (req.body.budget) {
    let budget = req.cookies.jwt
      ? JSON.parse(req.body.budget)
      : req.body.budget;
    updateApp = {
      ...req.body,
      budget,
    };
  }

  const updatedApp = await App.findByIdAndUpdate(req.params.id, updateApp, {
    new: true,
  });

  // // If Budget is updated on App, it must Update Parent Product budgetAllocated
  // if (req.body.budget) {
  //   let prevBudgetAmount = app.budget[0].budget;
  //   let newBudgetAmount = req.body.budget.budget;
  //   let budgetDelta = newBudgetAmount - prevBudgetAmount;

  //   //if (budgetDelta !== 0) {
  //   // Get Parent Product Budget
  //   const product = await Product.findById(app.productId.toString());
  //   console.log("Found product:", product);

  //   // Update Budget Allocated
  //   let newBudget = [
  //     {
  //       ...product.budget[0],
  //       budgetAllocated:
  //         parseInt(product.budget[0].budgetAllocated) +
  //         parseInt(req.body.budget.budget), //product.budget[0].budgetAllocated + budgetDelta,
  //     },
  //   ];

  //   const updateProduct = {
  //     ...product,
  //     budget: newBudget,
  //   };

  //   // Update Product Budget
  //   const updatedProduct = await Product.findByIdAndUpdate(
  //     app.productId.toString(),
  //     updateProduct,
  //     {
  //       new: true,
  //     }
  //   );
  //console.log("Updated budget", newBudget);
  //}
  //}

  //console.log(JSON.stringify(updatedApp.cloudAccounts));
  res.status(200).json(updatedApp);
});

// @desc  Delete App
// @route DELETE /api/apps/:id
// @access Private
const deleteApp = asyncHandler(async (req, res) => {
  const app = await App.findById(req.params.id).deleteOne();

  if (!app) {
    res.status(400);
    throw new Error("App not found");
  }

  res.status(200).json({ id: req.params.id });
});

// @desc  Get App Billing
// @route GET /api/apps/:id/billing
// @access Private
const getAppBilling = asyncHandler(async (req, res) => {
  // Get App
  const app = await App.findById(req.params.id);
  if (!app) {
    res.status(400);
    throw new Error("App Not Found");
  }

  // Get Cloud Provider
  const cloudProvider = app.cloud;

  console.log(cloudProvider);

  // GCP
  if (cloudProvider === "gcp") {
    console.log("Getting GCP Billing info");

    // const bigquery = new BigQuery();
    // async function query() {
    //   // Queries the U.S. given names dataset for the state of Texas.

    //   const query = `SELECT name FROM \`all_billing_data\``;

    //   // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
    //   const options = {
    //     query: query,
    //     // Location must match that of the dataset(s) referenced in the query.
    //     //projectId: "backplane-core",
    //   };

    //   // Run the query as a job
    //   const [job] = await bigquery.createQueryJob(options);
    //   console.log(`Job ${job.id} started.`);

    //   // Wait for the query to finish
    //   const [rows] = await job.getQueryResults();

    //   // Print the results
    //   console.log("Rows:");
    //   rows.forEach((row) => console.log(row));
    // }
    // query();

    // const billingClient = new CloudBillingClient();
    // const name = "backplane-core";

    // async function callGetBillingAccount() {
    //   const request = {
    //     name,
    //   };
    //   console.log(request);

    //   const response = await billingClient.listBillingAccounts(request);
    //   console.log(response);
    // }

    // callGetBillingAccount();

    res.send("Hi From GCP APP Billing");
    return;
  }

  if (cloudProvider === "azure") {
    // Get Cloud Accounts
    //const cloudAccounts = app.cloudAccounts;
    //console.log(app.cloudAccounts[0]);

    // Get Org for App
    // const platform = await Platform.findById(app.platformId);
    const org = await Org.findById(app.orgId);
    console.log(`App ${app.name} belongs to Organisation ${org.name}`);

    // Get Cloud Credentials from Org
    const cloudCredentials = org.csp.find(
      (element) => element.provider === cloudProvider
    );
    console.log(`Cloud Credentials: ${cloudCredentials}`);

    const tenantId = cloudCredentials.tenantId;
    const clientId = cloudCredentials.clientId;
    const clientSecret = cloudCredentials.clientSecret;

    // Authenticate to Cloud Platform
    const credentials = new ClientSecretCredential(
      tenantId,
      clientId,
      clientSecret
    );

    const subscription = app.environments.map(
      (env) => env.accountId.split("/")[2]
    )[0];
    console.log(subscription);
    //const client = new SubscriptionClient(credentials);

    const billing = new BillingManagementClient(credentials, subscription);
    console.log(billing);
    return;

    // Use Cloud API to retrieve cost for Cloud Accounts
    async function listSubscriptions() {
      try {
        // use credential to authenticate with Azure SDKs
        const client = new SubscriptionClient(credentials);
        let results = [];
        // get details of each subscription
        for await (const item of client.subscriptions.list()) {
          const subscriptionDetails = await client.subscriptions.get(
            item.subscriptionId
          );
          /* 
            Each item looks like:
        
            {
            id: '/subscriptions/123456',
            subscriptionId: '123456',
            displayName: 'YOUR-SUBSCRIPTION-NAME',
            state: 'Enabled',
            subscriptionPolicies: {
                locationPlacementId: 'Internal_2014-09-01',
                quotaId: 'Internal_2014-09-01',
                spendingLimit: 'Off'
            },
            authorizationSource: 'RoleBased'
            },
        */
          //console.log(subscriptionDetails);
          results.push(subscriptionDetails);
          //console.log(results)
        }
        console.log(results[0].subscriptionId);

        const billing = new BillingManagementClient(
          credentials,
          results[0].subscriptionId
        );

        return results;
      } catch (err) {
        console.error(JSON.stringify(err));
      }
    }

    listSubscriptions()
      .then((p) => {
        //console.log(p);
        res.status(200).json(p);
      })
      .catch((ex) => {
        console.log(ex);
      });
  } else {
    res.status(400).json(`${cloudProvider} not yet implemented`);
  }
});

export {
  getApp,
  getApps,
  setApp,
  updateApp,
  deleteApp,
  getAppBilling,
  getAppRequests,
};
