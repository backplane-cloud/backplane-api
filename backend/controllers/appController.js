import asyncHandler from "express-async-handler";
import axios from "axios";

import App from "../models/appModel.js";
import Product from "../models/productModel.js";
import Org from "../models/orgModel.js";
import Request from "../models/requestModel.js";
import Service from "../models/serviceModel.js";

import {
  createResource,
  listResources,
  showResource,
} from "../views/resource.js";

import { appEnvironments, appAccess, appPolicy } from "../views/app.js";

import {
  showCostTab,
  showRequestTab,
  resourceOverviewTab,
} from "../views/tabs.js";

import {
  getAzureCost,
  getAzurePolicies,
  getAzureAccess,
  createAzureEnv,
} from "@backplane-software/backplane-azure";

import {
  getGCPCost,
  getGCPAccess,
  getGCPPolicies,
  createGCPEnvironments,
} from "@backplane-software/backplane-gcp";

import {
  getAWSCost,
  getAWSPolicies,
  getAWSAccess,
  createAWSEnv,
} from "@backplane-software/backplane-aws";

import { createOCIEnv, getOCICost } from "@backplane-software/backplane-oci";

import { getOrg } from "./orgController.js";

// These fields determine what to display on HTMX responses from Backplane UI
const fields = [
  "name",
  "description",
  "repo",
  "cloud",
  "appTemplate",
  "platformCode",
  "productCode",
  "ownerEmail",
  "status",
  "cost",
];

// Custom Tabs for HTMX view of resource
const tabs = [
  "Overview",
  "Cost",
  "Requests",
  "Repo",
  "Team",
  "Access",
  "Policy",
  "Environments",
];

// @desc  Get Apps
// @route GET /api/apps
// @access Private
const getApps = asyncHandler(async (req, res) => {
  let query;
  if (req.headers?.filter) {
    if (req.headers.filter === "products") {
      query = {
        productId: req.headers.filterid,
        orgId: req.user.orgId,
        status: "active",
      };
    }
    if (req.headers.filter === "platforms") {
      query = {
        platformId: req.headers.filterid,
        orgId: req.user.orgId,
        status: "active",
      };
    }
    if (req.headers.filter === "orgs") {
      query = {
        orgId: req.headers.filterid,
        status: "active",
      };
    }
  } else {
    if (req.query?.filter === "true") {
      query = req.user.userType != "root" && {
        orgId: req.user.orgId,
      };
    } else {
      query =
        req.user.userType != "root"
          ? { orgId: req.user.orgId, status: "active" }
          : null;
    }
  }

  const apps = await App.find(query);

  if (apps) {
    if (req.headers?.ui) {
      let showbreadcrumb = req.headers["hx-target"] !== "resource-content";
      let HTML = listResources(apps, fields, "Apps", "Apps", showbreadcrumb);
      res.send(HTML);
    } else {
      if (req.sync) {
        return apps;
      } else {
        res.status(200).json(apps);
      }
    }
  } else {
    res.status(400);
    throw new Error("No Apps Found");
  }
});

// @desc  Create App UI
// @route GET /api/apps/create
// @access Private
const createAppUI = asyncHandler(async (req, res) => {
  // Handles return of HTMX for Create New App

  // Retrieve Clouds Service Providers and App Templates for <select-picker>
  let org = await getOrg({
    sync: true,
    params: { id: req.user.orgId.toHexString() },
  });

  let csp = org.csp.map((cloud) => {
    return { id: cloud.provider, name: cloud.provider };
  });

  let appTemplate = org.appTemplate.map((template) => {
    return { id: template.name, name: template.description };
  });

  let HTML = createResource(
    {
      user: req.user.email,
      cloud: { collection: JSON.stringify(csp), label: "Cloud Platform" },
      appTemplate: {
        collection: JSON.stringify(appTemplate),
        label: "Template",
      },
    },
    ["name", "cloud", "appTemplate"],
    "Create App",
    "apps",
    req.headers.action
  );
  res.send(HTML);
});

// @desc  Get App
// @route GET /api/apps/:id
// @access Private
const getApp = asyncHandler(async (req, res) => {
  // Handles return of HTMX for Create New App

  // if (req.headers.action === "create") {
  //   // Retrieve Clouds Service Providers for <select-picker>
  //   let org = await getOrg({
  //     sync: true,
  //     params: { id: req.user.orgId.toHexString() },
  //   });

  //   let csp = org.csp.map((cloud) => {
  //     return { id: cloud.provider, name: cloud.provider };
  //   });

  //   let appTemplate = org.appTemplate.map((template) => {
  //     return { id: template.name, name: template.description };
  //   });

  //   let HTML = createResource(
  //     {
  //       user: req.user.email,
  //       cloud: { collection: JSON.stringify(csp), label: "Cloud Platform" },
  //       appTemplate: {
  //         collection: JSON.stringify(appTemplate),
  //         label: "Template",
  //       },
  //     },
  //     ["name", "cloud", "appTemplate"],
  //     "Create App",
  //     "apps",
  //     req.headers.action
  //   );
  //   res.send(HTML);
  // } else {
  const app = await App.findById(req.params.id);

  if (app) {
    console.log("headers", req.headers);
    if (req.headers.ui) {
      let breadcrumbs = `apps,${app.name}`;
      let HTML = showResource(app, tabs, breadcrumbs);
      // let HTML = resourceView(app, tabs);
      res.send(HTML);
    } else {
      res.status(200).json(app);
    }
  } else {
    res.status(400);
    throw new Error("No Apps Found");
  }
  // }
});

// @desc  Find Apps
// @route GET /api/apps/search
// @access Private
const findApp = asyncHandler(async (req, res) => {
  let query;
  if (req.query) {
    query = req.user.userType != "root" && {
      orgId: req.user.orgId,
      name: { $regex: req.query.q, $options: "i" },
    };
  } else {
    query =
      req.user.userType != "root"
        ? {
            orgId: req.user.orgId,
            status: "active",
            name: { $regex: req.query.q, $options: "i" },
          }
        : null;
  }
  console.log(query);
  const apps = await App.find(query);

  if (apps) {
    if (req.headers.ui) {
      let HTML = listResources(apps, fields, "Apps", "apps");
      res.send(HTML);
    } else {
      res.status(200).json(apps);
    }
  } else {
    res.status(400);
    throw new Error("No Apps Found");
  }
});

// @desc  Get App Environments
// @route GET /api/apps/:id/environments
// @access Private
const getAppEnvironments = asyncHandler(async (req, res) => {
  const app = await App.findById(req.params.id);
  if (app) {
    if (req.headers.ui) {
      let HTML = appEnvironments(app.environments);
      res.send(HTML);
    } else {
      res.status(200).json(app.environments);
    }
  } else {
    res.status(400);
    throw new Error("No Apps Found");
  }
});

// @desc  Get App Overview
// @route GET /api/apps/:id/overview
// @access Private
const getAppOverview = asyncHandler(async (req, res) => {
  const app = await App.findById(req.params.id);
  if (app) {
    if (req.headers.ui) {
      let HTML = resourceOverviewTab(app, fields, req.headers.action);
      res.send(HTML);
    } else {
      res.status(200).json(app);
    }
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
  console.log(requests);
  if (requests.length != 0) {
    if (req.headers.ui) {
      let HTML = showRequestTab(requests);
      res.send(HTML);
    } else {
      res.status(200).json(requests);
    }
  } else {
    if (req.headers.ui) {
      res.send("<h1>No Requests Found</h1>");
    } else {
      res.status(400);
      throw new Error("No Requests Found for App");
    }
  }
});

// @desc  Get App Access
// @route GET /api/apps/:id/access
// @access Private
const getAppAccess = asyncHandler(async (req, res) => {
  const app = await App.findById(req.params.id);
  let orgId = req.body.orgId ? req.body.orgId : req.user.orgId;

  const cloud = app.cloud;

  const environments = app.environments;
  let access;
  // Get Org
  const org = await Org.findById(orgId);

  if (!org.csp) {
    // Check for Cloud Service Provider Credentials
    res.send("No Cloud Credentials Specified for Org, aborting App Creation");
    return;
  }
  if (cloud === "azure") {
    // Get Cloud Credentials from Org for Cloud
    const cloudCredentials = org.csp.find(
      (cloud) => cloud.provider === "azure"
    );
    access = await getAzureAccess({ cloudCredentials, environments });
  }

  if (cloud === "gcp") {
    // Get Cloud Credentials from Org for Cloud
    const cloudCredentials = org.csp.find((cloud) => cloud.provider === "gcp");
    // const parent = `organizations/${cloudCredentials.tenantId}`;

    const client_email = cloudCredentials.gcpsecret.client_email;
    const private_key = cloudCredentials.gcpsecret.private_key;

    access = await getGCPAccess({ client_email, private_key, environments });

    // GCP Transform code so the access looks like [{ environments, assignments}]
    let assignments = [];
    access.map((entry) => {
      entry.bindings.map((binding) => {
        binding.members.map((member) => {
          let ace = { role: binding.role, member };
          assignments.push(ace);
        });
      });
    });
    access = [{ environments: "prod", assignments }];
  }

  if (cloud === "aws") {
    // Get Cloud Credentials from Org for Cloud
    const cloudCredentials = org.csp.find((cloud) => cloud.provider === "aws");
    // const parent = `organizations/${cloudCredentials.tenantId}`;

    const accessKeyId = cloudCredentials.clientId;
    const secretAccessKey = cloudCredentials.clientSecret;

    access = await getAWSAccess({ accessKeyId, secretAccessKey, environments });
  }

  if (access) {
    if (req.headers.ui) {
      let HTML = appAccess(access, cloud);
      res.send(HTML);
    } else {
      res.status(200).json(access);
    }
  } else {
    res.status(400);
    throw new Error("No Access Found for App");
  }
});

// @desc  Get App Policies
// @route GET /api/apps/:id/policies
// @access Private
const getAppPolicies = asyncHandler(async (req, res) => {
  const app = await App.findById(req.params.id);
  let orgId = req.body.orgId ? req.body.orgId : req.user.orgId;

  const cloud = app.cloud;
  const environments = app.environments;
  let policies;
  // Get Org
  const org = await Org.findById(orgId);
  if (!org.csp) {
    // Check for Cloud Service Provider Credentials
    res.send("No Cloud Credentials Specified for Org, aborting App Creation");
    return;
  }

  if (cloud === "azure") {
    // Get Cloud Credentials from Org for Cloud
    const cloudCredentials = org.csp.find(
      (cloud) => cloud.provider === "azure"
    );

    policies = await getAzurePolicies({ cloudCredentials, environments });
  }

  if (cloud === "gcp") {
    // Get Cloud Credentials from Org for Cloud
    const cloudCredentials = org.csp.find((cloud) => cloud.provider === "gcp");
    const client_email = cloudCredentials.gcpsecret.client_email;
    const private_key = cloudCredentials.gcpsecret.private_key;
    policies = await getGCPPolicies({
      client_email,
      private_key,
      environments,
    });
  }

  if (cloud === "aws") {
    // Get Cloud Credentials from Org for Cloud
    const cloudCredentials = org.csp.find((cloud) => cloud.provider === "aws");
    // const parent = `organizations/${cloudCredentials.tenantId}`;

    const accessKeyId = cloudCredentials.clientId;
    const secretAccessKey = cloudCredentials.clientSecret;

    policies = await getAWSPolicies({
      accessKeyId,
      secretAccessKey,
      environments,
    });
  }

  // if (policies) {
  //   res.status(200).json(policies);
  // } else {
  //   res.status(400);
  //   throw new Error("No Policies Found for App");
  // }

  if (policies) {
    if (req.headers.ui) {
      let HTML = appPolicy(policies, cloud);
      res.send(HTML);
    } else {
      res.status(200).json(policies);
    }
  } else {
    res.status(400);
    throw new Error("No Access Found for App");
  }
});

// @desc  Get App Cost
// @route GET /api/apps/:id/cost
// @access Private
const getAppCost = asyncHandler(async (req, res) => {
  // console.log(req.params.id, req.body.orgId, req.sync);
  const app = await App.findById(req.params.id);
  let orgId = req.body.orgId ? req.body.orgId : req.user.orgId;

  const cloud = app.cloud;
  const environments = app.environments;

  // Get Org Cloud Credentials
  // const org = await Org.findById(orgId);
  // if (!org.csp) {
  //   // Check for Cloud Service Provider Credentials
  //   res.send("No Cloud Credentials Specified for Org, aborting App Creation");
  //   return;
  // }

  // Get Cloud Credentials from Org for Cloud
  // const cloudCredentials = org.csp.find(
  //   (credentials) => credentials.provider === cloud
  // );
  let cost;
  if (!req.headers?.ui && !req.user) {
    // Only get Live cost for Cost Sync, i.e. if UI or CLI, return cost history

    switch (cloud) {
      case "azure":
        cost = await getAzureCost({ environments });
        break;
      case "aws":
        cost = await getAWSCost({ environments });
        break;
      case "gcp":
        cost = await getGCPCost({ environments });
        break;
      case "oci":
        cost = await getOCICost({ environments });
        break;
    }
  } else {
    // Get the Cost data stored on the App resource

    cost = app.cost;
  }

  if (cost) {
    if (req.headers?.ui) {
      // let showbreadcrumb = req.headers["hx-target"] !== "resource-content";
      let HTML = showCostTab(cost);
      res.send(HTML);
    } else {
      if (req.sync) {
        return cost;
      } else {
        res.status(200).json(cost);
      }
    }
  } else {
    res.status(400);
    throw new Error("No Cost Found for App");
  }
});

// @desc  Create App
// @route POST /api/apps
// @access Private

const setApp = asyncHandler(async (req, res) => {
  // Check if App already exists in Organisation
  let ownerId = req.body.ownerId ? req.body.ownerId : req.user.id;
  let orgId = req.body.orgId ? req.body.orgId : req.user.orgId;
  let code = req.body.name.trim().toLowerCase().replace(/\s+/g, "-");

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
    // Check for Cloud Service Provider Credentials
    res.send("No Cloud Credentials Specified for Org, aborting App Creation");
    return;
  }

  // Get Cloud Credentials from Org for Cloud
  const cloudCredentials = org.csp.find(
    (cloud) => cloud.provider === req.body.cloud
  );

  if (!cloudCredentials) {
    console.log(`No Cloud Credentials configured for ${req.body.cloud}`);
    // res.status(400);
    // throw new Error(`No Cloud Credentials configured for ${req.body.cloud}`);
    res.send(`No Cloud Credentials configured for ${req.body.cloud}`);
  }

  console.log(`App ${req.body.name} belongs to Organisation ${org.name}`);

  // Get App Template to determine the environments to create and services to provision
  const apptemplate = req.body.template ? req.body.template : "default";
  const appTemplate = org.appTemplate
    ? org.appTemplate.find((template) => template.name === apptemplate)
    : {
        name: "default",
        description: "Default App type",
        environments: ["prod", "nonprod", "test", "dev"],
        services: [],
      };

  // Create Repo
  let repo;
  if (appTemplate.services.length != 0) {
    const service = appTemplate.services[0]; // Need to Map through other services and genericify this code

    // Get Service
    const serviceObj = await Service.findOne({ code: service });
    const apikey = serviceObj.apikey;
    const url = serviceObj.url;

    console.log(`Creating Repo: ${code}`);

    repo = await axios.post(
      url,
      {
        name: code,
        description: "Backplane Generated Repo",
      },
      { headers: { Authorization: "Bearer " + apikey } }
    );

    console.log(repo.data.full_name, repo.data.owner.html_url);
  }

  let environments;
  const environs = appTemplate.environments;

  // AZURE ENVIRONMENT CREATION
  if (req.body.cloud === "azure") {
    // Get Default Subscription ID. Need to have cloud creds per platform and product.
    const subscriptionId = cloudCredentials.subscriptionId;

    environments = await createAzureEnv({
      cloudCredentials,
      environs,
      subscriptionId,
      orgId,
      orgCode: org.code,
      appCode: code,
    });
  }

  // AWS ENVIRONMENT CREATION
  if (req.body.cloud === "aws") {
    // Get Default Subscription ID. Need to have cloud creds per platform and product.
    // const subscriptionId = cloudCredentials.subscriptionId;
    const accessKeyId = cloudCredentials.clientId;
    const secretAccessKey = cloudCredentials.clientSecret;
    // const payload = {
    //   environs,
    //   orgCode: org.code,
    //   appCode: code,
    //   accessKeyId,
    //   secretAccessKey,
    //   emailAddress: req.user.email,
    // };
    // console.log("Payload to AWS", payload);
    // return;
    // console.log(`${code}@${req.user.email.split("@")[1]}`);
    // return;
    environments = await createAWSEnv({
      environs,
      orgCode: org.code,
      appCode: code,
      accessKeyId,
      secretAccessKey,
      emailAddress: `${code}@${req.user.email.split("@")[1]}`,
    });
  }

  // GCP ENVIRONMENT CREATION
  if (req.body.cloud === "gcp") {
    // const parent = "organizations/447090138215"; // Need to store this at Org level. e.g. org.cloudParent
    const parent = `organizations/${cloudCredentials.tenantId}`;
    const client_email = cloudCredentials.gcpsecret.client_email;
    const private_key = cloudCredentials.gcpsecret.private_key;
    // let result = await listProjects(JSON.stringify(cloudCredentials));
    // console.log(result);
    // return;
    // const creds = cloudCredentials;

    // let result = await createProject(
    //   creds.gcpsecret.client_email,
    //   creds.gcpsecret.private_key,
    //   parent,
    //   "akira-lewis-henry"
    // );
    // console.log(result);
    // return;

    environments = await createGCPEnvironments({
      environs,
      parent,
      orgCode: org.code,
      appCode: code,
      client_email,
      private_key,
    });
  }

  // OCI ENVIRONMENT CREATION
  if (req.body.cloud === "oci") {
    environments = await createOCIEnv({
      config: cloudCredentials.ocisecret,
      environs,
      orgCode: org.code,
      appCode: code,
    });
  }

  // console.log("environments before app create", environments);
  // return;

  // Create App
  const app = await App.create({
    orgId,
    ownerId,
    code,
    name: req.body.name,
    cloud: req.body.cloud,
    environments,
    type: "app",
    appTemplate: apptemplate,
    status: "active",
    repo: repo ? repo.data.full_name : "No Repo",
    // repo: req.body.template === "sandbox" ? "No Repo" : repo.data.full_name,
  });
  console.log(`App Successfully Provisioned in ${req.body.cloud}`);
  // res.status(200).json({ app });

  if (req.headers.ui) {
    let breadcrumbs = `apps,${app.name}`;
    let HTML = showResource(app, tabs, breadcrumbs);
    res.send(HTML);
  } else {
    res.status(200).json(app);
  }
});

// @desc  Update App
// @route PUT /api/apps/:id
// @access Private
const updateApp = asyncHandler(async (req, res) => {
  console.log("hello");
  console.log(req.body);
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

  if (req.headers?.ui) {
    let HTML = resourceOverviewTab(updatedApp, fields);
    res.send(HTML);
  } else {
    if (req.sync) {
      return updatedApp;
    } else {
      res.status(200).json(updatedApp);
    }
  }
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

  if (req.headers.ui) {
    let HTML = "App Successfully Deleted";
    res.send(HTML);
  } else {
    res.status(200).json({ id: req.params.id });
  }
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
  getAppAccess,
  getAppPolicies,
  getAppCost,
  getAppEnvironments,
  getAppOverview,
  findApp,
  createAppUI,
};
