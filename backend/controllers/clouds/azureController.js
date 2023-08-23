import asyncHandler from "express-async-handler";

import Org from "../../models/orgModel.js";
import App from "../../models/appModel.js";

// Azure SDK API

// import { SubscriptionClient } from "@azure/arm-subscriptions";
// import { BillingManagementClient } from "@azure/arm-billing";
// import { ResourceManagementClient } from "@azure/arm-resources";

// ACTIVE
import { ClientSecretCredential } from "@azure/identity";
import { AuthorizationManagementClient } from "@azure/arm-authorization";
import { PolicyClient } from "@azure/arm-policy";

// GET ACCESS ASSIGNMENTS
const getAzureAccess = asyncHandler(async (req, res) => {
  // Get App
  const app = await App.findById(req.params.id);
  if (!app) {
    res.status(400);
    throw new Error("App Not Found");
  }

  // Get Cloud Credentials from Org
  const org = await Org.findById(app.orgId);
  console.log(`App ${app.name} belongs to Organisation ${org.name}`);

  const cloudCredentials = org.csp.find(
    (element) => element.provider === "azure"
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

  async function roleAssignments_listForScope() {
    let result = [];
    for await (const item of client.roleAssignments.listForScope(
      `/subscriptions/${subscription}`
    )) {
      result.push(item);
    }
    return result;
  }

  async function roleAssignments_listForResourceGroup() {
    let masterResult = [];
    const resultArr = await Promise.all(
      app.environments.map(async (env) => {
        let result = [];
        let rg = env.accountId.split("/")[4];
        console.log(rg);
        for await (const item of client.roleAssignments.listForResourceGroup(
          rg
        )) {
          result.push(item);
        }
        masterResult.push({ environment: env, assignments: result });
      })
    );

    return masterResult;
  }

  let client = {};
  async function main() {
    client = new AuthorizationManagementClient(credentials, subscription);
    //let assignments = await roleAssignments_listForScope();
    let assignments = await roleAssignments_listForResourceGroup();
    res.status(200).json(assignments);
  }

  main();
});

// GET POLICY ASSIGNMENTS
const getAzurePolicy = asyncHandler(async (req, res) => {
  // Get App
  const app = await App.findById(req.params.id);
  if (!app) {
    res.status(400);
    throw new Error("App Not Found");
  }

  // Get Cloud Credentials from Org

  const org = await Org.findById(app.orgId);
  console.log(`App ${app.name} belongs to Organisation ${org.name}`);

  // Get Cloud Credentials from Org
  const cloudCredentials = org.csp.find(
    (element) => element.provider === "azure"
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

  const client = new PolicyClient(credentials, subscription);
  //policyAssignments.listForResourceGroup
  async function policyAssignments_listForResourceGroup() {
    const arrayList = [];
    for await (const item of client.policyAssignments.listForResourceGroup(
      "_bp-demo-organisation-undefined-prod"
    )) {
      arrayList.push(item);
      console.log(item);
    }
    return arrayList;
  }

  const policies = await policyAssignments_listForResourceGroup();

  res.status(200).json(policies);
});

// GET BILLING
const getAzureCost = asyncHandler(async (req, res) => {
  console.log;
  // Get App
  const app = await App.findById(req.params.id);
  if (!app) {
    res.status(400);
    throw new Error("App Not Found");
  }

  // Get Cloud Credentials from Org

  const org = await Org.findById(app.orgId);
  console.log(`App ${app.name} belongs to Organisation ${org.name}`);

  // Get Cloud Credentials from Org
  const cloudCredentials = org.csp.find(
    (element) => element.provider === "azure"
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

  // const billing = new BillingManagementClient(credentials, subscription);
  // console.log(billing);
  // return;

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
});

export { getAzureCost, getAzureAccess, getAzurePolicy };
