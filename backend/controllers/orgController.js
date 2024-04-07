import asyncHandler from "express-async-handler";
import Org from "../models/orgModel.js";
import Request from "../models/requestModel.js";

// These fields determine what to display on HTMX responses from Backplane UI
const fields = ["code", "name", "description", "type", "ownerId"];
const tabs = [
  "Overview",
  "Azure",
  "GCP",
  "AWS",
  "Templates",
  "Budget",
  "Users",
  "Teams",
  "Assignments",
  "Roles",
  "Access",
  "Policy",
  "Cost",
  "Requests",
  "Platforms",
  "Products",
  "Apps",
];

import {
  viewHTMXify,
  listResources,
  showResource,
  resourceOverviewTab,
} from "../htmx/HTMXify.js";

import { orgCloudCredentialsTab } from "../htmx/org.js";

// @desc  Get Orgs
// @route GET /api/orgs
// @access Private

const getOrgs = asyncHandler(async (req, res) => {
  const orgs = !req.user.allowedActions.includes("/*")
    ? await Org.findById(req.user.orgId)
    : await Org.find().select("");

  // const orgs = await Org.find({ _id: req.user.orgId });
  if (orgs) {
    if (req.headers.ui) {
      // Filter the Org fields down for ListView efficiency i.e. don't send whole document
      let filteredOrgs = orgs.map((org) => {
        const { _id, code, name, type, status, budget, description, ownerId } =
          org;
        return { _id, code, name, type, status, budget, description, ownerId };
      });

      let resources = filteredOrgs;
      let showbreadcrumb = req.headers["hx-target"] !== "resource-content";
      const htmlTable = listResources(
        resources,
        fields,
        "Organsations",
        "orgs",
        showbreadcrumb
      );
      res.send(htmlTable);
    } else {
      res.status(200).json(orgs);
    }
  } else {
    res.status(400);
    throw new Error("No Orgs Found");
  }
});

// @desc  Get an Org
// @route GET /api/orgs/:id
// @access Private
const getOrg = asyncHandler(async (req, res) => {
  //let orgId = req.user.orgId.toHexString();
  if (req.headers.action === "create") {
    let HTML = viewHTMXify(
      {},
      ["name", "description"],
      "Create Organisation",
      "orgs",
      req.headers.action
    );
    res.send(HTML);
  } else {
    let org;

    if (req.params.id.length === 24) {
      org = await Org.findById(req.params.id);

      // if (org) {
      //   res.status(200).json(org);
      // } else {
      //   res.send("Org not found");
      //   res.status(400);
      //   throw new Error("No Orgs Found");
      // }
    } else {
      org = await Org.findOne({ code: req.params.id });
    }

    if (org) {
      if (req.headers.ui) {
        let breadcrumbs = `orgs,${org.name}`;
        let HTML = showResource(org, tabs, breadcrumbs);
        res.send(HTML);
      } else {
        res.status(200).json(org);
      }
    } else {
      res.status(400);
      throw new Error("No Orgs Found");
    }
  }
});

// @desc  Get Cloud Credentials
// @route GET /api/orgs/:id/azure | gcp | aws
// @access Private

const getOrgCloud = asyncHandler(async (req, res) => {
  // Retrieve the Cloud from the URL
  let url = req.url.split("/");

  let cloud = url[url.length - 1].toLowerCase();
  let slug = `orgs/${url[1]}/${cloud}`;

  if (req.headers.action === "create") {
    let fields;
    switch (cloud) {
      case "azure":
        fields = [
          "provider",
          "tenantId",
          "clientId",
          "clientSecret",
          "subscriptionId",
        ];
        break;
      case "gcp":
        fields = [
          "provider",
          "tenantId",
          "type",
          "project_id",
          "private_key_id",
          "private_key",
          "client_email",
          "client_id",
          "auth_uri",
          "token_uri",
          "auth_provider_x509_cert_url",
          "universe_domain",
        ];
        break;
      case "aws":
        fields = ["provider", "clientId", "clientSecret"];
    }

    let HTML = viewHTMXify(
      {},
      fields,
      `Add ${cloud.toUpperCase()} Credentials`,
      slug,
      req.headers.action
    );
    res.send(HTML);
  } else {
    let org;

    if (req.params.id.length === 24) {
      org = await Org.findById(req.params.id);

      // if (org) {
      //   res.status(200).json(org);
      // } else {
      //   res.send("Org not found");
      //   res.status(400);
      //   throw new Error("No Orgs Found");
      // }
      // console.log(org);
    } else {
      org = await Org.findOne({ code: req.params.id });
    }
    // console.log(org, org.csp);
    let cloudCredentials;
    if (org.csp !== undefined) {
      cloudCredentials = org.csp.find((item) => item.provider === cloud);
    }

    if (req.headers.ui) {
      // If Request came from UI
      let HTML = orgCloudCredentialsTab(
        cloudCredentials,
        org.id,
        req.headers.action,
        cloud
      );
      res.send(HTML);
    } else {
      // Request came from REST or CLI
      res.status(200).json(cloudCredentials);
    }
    // res.status(400);
    // throw new Error("No Azure Credentials Found");
  }
});

// @desc  Delete Cloud Credentials
// @route DELETE /api/orgs/:id/azure | gcp | aws
// @access Private

const deleteOrgCloud = asyncHandler(async (req, res) => {
  // Retrieve the Cloud from the URL
  let url = req.url.split("/");
  let cloud = url[url.length - 1].toLowerCase();

  //let orgId = req.user.orgId.toHexString();
  if (req.headers.action === "create") {
    let HTML = viewHTMXify(
      {},
      ["name", "description"],
      "Create Organisation",
      "orgs",
      req.headers.action
    );
    res.send(HTML);
  } else {
    let org;

    if (req.params.id.length === 24) {
      org = await Org.findById(req.params.id);

      // if (org) {
      //   res.status(200).json(org);
      // } else {
      //   res.send("Org not found");
      //   res.status(400);
      //   throw new Error("No Orgs Found");
      // }
      // console.log(org);
    } else {
      org = await Org.findOne({ code: req.params.id });
    }

    let csp = org.csp.filter((item) => item.provider !== cloud);

    let updateOrg = { org, csp };

    const updatedOrg = await Org.findByIdAndUpdate(org.id, updateOrg, {
      new: true,
    });

    if (req.headers.ui) {
      // If Request came from UI
      let HTML = orgCloudCredentialsTab(undefined, org.id, req.headers.action);
      res.send(HTML);
    } else {
      // Request came from REST or CLI
      res.status(200).json(`Cloud Credentials removed for ${cloud}`);
    }
    // res.status(400);
    // throw new Error("No Azure Credentials Found");
  }
});

// @desc  Update Org Cloud Credentials
// @route PUT /api/orgs/:id/azure | gcp | aws
// @access Private

const updateOrgCloud = asyncHandler(async (req, res) => {
  // Retrieve the Cloud from the URL
  let url = req.url.split("/");
  let cloud = url[url.length - 1].toLowerCase();

  const org = await Org.findById(req.params.id);

  if (!org) {
    res.status(400);
    throw new Error("Org not found");
  }

  // Retrieve the Cloud Credentials to Retain and put in array
  const retain = org.csp.filter((item) => item.provider !== cloud);
  let csp;
  if (cloud === "azure") {
    csp = {
      provider: "azure",
      tenantId: req.body.tenantId,
      clientId: req.body.clientId,
      clientSecret: req.body.clientSecret,
      subscriptionId: req.body.subscriptionId,
    };

    retain.push(csp);
  }
  if (cloud === "aws") {
    csp = {
      provider: "aws",
      clientId: req.body.clientId,
      clientSecret: req.body.clientSecret,
    };
    retain.push(csp);
  }

  if (cloud === "gcp") {
    let gcpsecret = {
      type: req.body.type,
      project_id: req.body.project_id,
      private_key_id: req.body.private_key_id,
      private_key: req.body.private_key,
      client_email: req.body.client_email,
      client_id: req.body.client_id,
      auth_uri: req.body.auth_uri,
      token_uri: req.body.token_uri,
      auth_provider_x509_cert_url: req.body.auth_provider_x509_cert_url,
      client_x509_cert_url: req.body.client_x509_cert_url,
      universe_domain: req.body.universe_domain,
    };

    csp = {
      provider: "gcp",
      tenantId: req.body.tenantId,
      gcpsecret,
    };

    retain.push(csp);
  }

  csp = retain;

  let updateOrg = { org, csp };

  const updatedOrg = await Org.findByIdAndUpdate(org.id, updateOrg, {
    new: true,
  });

  if (req.headers.ui) {
    let cloudCredentials = updatedOrg.csp.find(
      (item) => item.provider === cloud
    );

    let HTML = orgCloudCredentialsTab(
      cloudCredentials,
      org.id,
      req.headers.action
    );

    res.send(HTML);
  } else {
    res.status(200).json(updatedOrg);
  }
});

// @desc  Add Org Cloud Credentials
// @route POST /api/orgs/:id/azure | gcp | aws
// @access Private

const addOrgCloud = asyncHandler(async (req, res) => {
  // Retrieve the Cloud from the URL
  let url = req.url.split("/");
  let cloud = url[url.length - 1].toLowerCase();

  const org = await Org.findById(req.params.id);

  if (!org) {
    res.status(400);
    throw new Error("Org not found");
  }

  let retain = [];
  // Retrieve the Cloud Credentials to Retain and put in array
  if (org.csp !== undefined) {
    retain = org.csp.filter((item) => item.provider !== cloud);
  }

  let csp;
  if (cloud === "azure") {
    csp = {
      provider: "azure",
      tenantId: req.body.tenantId,
      clientId: req.body.clientId,
      clientSecret: req.body.clientSecret,
      subscriptionId: req.body.subscriptionId,
    };

    retain.push(csp);
  }
  if (cloud === "aws") {
    csp = {
      provider: "aws",
      clientId: req.body.clientId,
      clientSecret: req.body.clientSecret,
    };
    retain.push(csp);
  }

  if (cloud === "gcp") {
    let gcpsecret = {
      type: req.body.type,
      project_id: req.body.project_id,
      private_key_id: req.body.private_key_id,
      private_key: req.body.private_key,
      client_email: req.body.client_email,
      client_id: req.body.client_id,
      auth_uri: req.body.auth_uri,
      token_uri: req.body.token_uri,
      auth_provider_x509_cert_url: req.body.auth_provider_x509_cert_url,
      client_x509_cert_url: req.body.client_x509_cert_url,
      universe_domain: req.body.universe_domain,
    };

    csp = {
      provider: "gcp",
      tenantId: req.body.tenantId,
      gcpsecret,
    };

    retain.push(csp);
  }

  csp = retain;

  let updateOrg = { org, csp };

  const updatedOrg = await Org.findByIdAndUpdate(org.id, updateOrg, {
    new: true,
  });

  if (req.headers.ui) {
    let cloudCredentials = updatedOrg.csp.find(
      (item) => item.provider === cloud
    );

    let HTML = orgCloudCredentialsTab(
      cloudCredentials,
      org.id,
      req.headers.action
    );

    res.send(HTML);
  } else {
    res.status(200).json(updatedOrg);
  }
});

// @desc  Get Org Overview Tab
// @route GET /api/orgs/:id/overview
// @access Private

const getOrgOverviewTab = asyncHandler(async (req, res) => {
  //let orgId = req.user.orgId.toHexString();
  if (req.headers.action === "create") {
    let HTML = viewHTMXify(
      {},
      ["name", "description"],
      "Create Organisation",
      "orgs",
      req.headers.action
    );
    res.send(HTML);
  } else {
    let org;

    if (req.params.id.length === 24) {
      org = await Org.findById(req.params.id);

      // if (org) {
      //   res.status(200).json(org);
      // } else {
      //   res.send("Org not found");
      //   res.status(400);
      //   throw new Error("No Orgs Found");
      // }
    } else {
      org = await Org.findOne({ code: req.params.id });
    }

    if (org) {
      if (req.headers.ui) {
        let HTML = resourceOverviewTab(org, fields, req.headers.action);
        res.send(HTML);
      } else {
        res.status(200).json(org);
      }
    } else {
      res.status(400);
      throw new Error("No Orgs Found");
    }
  }
});

// @desc  Find Org
// @route GET /api/orgs/search
// @access Private

const findOrg = asyncHandler(async (req, res) => {
  let query;

  query = {
    status: "active",
    name: { $regex: req.query.q, $options: "i" },
  };

  console.log(query);
  const orgs = await Org.find(query);
  console.log(orgs);

  if (orgs) {
    if (req.headers.ui) {
      // Filter the Org fields down for ListView efficiency i.e. don't send whole document
      let filteredOrgs = orgs.map((org) => {
        const { _id, code, name, type, status, budget, description, ownerId } =
          org;
        return { _id, code, name, type, status, budget, description, ownerId };
      });

      let resources = filteredOrgs;
      let HTML = listResources(resources, fields, "Orgs", "orgs");
      res.send(HTML);
    } else {
      res.status(200).json(orgs);
    }
  } else {
    res.status(400);
    throw new Error("No Apps Found");
  }
});

// @desc  Set Org
// @route POST /api/orgs
// @access Private
const setOrg = asyncHandler(async (req, res) => {
  let post;
  if (!req.body) {
    req.body = req;
    post = false;
  } else {
    post = true;
  }

  // Check if Org already exists
  const code = req.body.name.toLowerCase().replace(/ /g, "-");

  const exists = await Org.findOne({ code });
  if (exists) {
    console.log(exists);
    res.status(400);
    throw new Error("Org already exists");
  }

  // Create New Org

  // Set Default App Type
  const appType = {
    name: "default",
    description: "Default App Type",
    services: ["github"],
  };

  // Set Default Budget
  const budget = [
    {
      year: new Date().getFullYear(),
      budget: req.body.budget || 0,
      budgetAllocated: 0,
      currency: req.body.currency || "USD",
    },
  ];
  console.log("Budget:", budget);
  console.log("Code:", req.body.name.toLowerCase().replace(" ", "-"));
  console.log(appType);

  // If request from CLI then JSON.parse not required.
  // let csp = "";
  // if (req.cookies) {
  //   csp = req.cookies.jwt ? JSON.parse(req.body.csp) : req.body.csp;
  // } else {
  //   csp = req.body.csp;
  // }

  const org = await Org.create({
    code,
    description: req.body.description,
    name: req.body.name,
    license: req.body.license,
    type: req.body.type,
    status: req.body.status,
    //ownerId: req.body.owner || req.user.id,
    status: "active",
    type: "org",
    // csp,
    appType,
    budget,
  });

  // console.log(req.body);
  // console.log({
  //   name: `Org Owner for ${org.name}`,
  //   type: "builtin",
  //   allowActions: `/orgs/${org.id}/write,/orgs/${org.id}/delete,/orgs/${org.id}/read,`,
  //   orgId: org.id,
  // });
  // return;

  // if (post) {
  //   res.status(200); // Only valid when request is from HTTP Post
  //   res.json(org);
  // } else {
  //   return org;
  // }

  if (req.headers?.ui && req.headers?.action !== "register") {
    let HTML = resourceView(org, tabs);
    res.send(HTML);
  }
  console.log("Returning Org", JSON.stringify(org));
  if (req.name) {
    return org;
  } else {
    res.status(200).json(org);
  }
});

// @desc  Update Org
// @route PUT /api/orgs/:id
// @access Private
const updateOrg = asyncHandler(async (req, res) => {
  const org = await Org.findById(req.params.id);

  if (!org) {
    res.status(400);
    throw new Error("Org not found");
  }

  let updateOrg = req.body;

  if (req.body.csp) {
    let csp = req.cookies.jwt ? JSON.parse(req.body.csp) : req.body.csp;

    // Hardcoded Test
    // csp = [
    //   { provider: "aws", secret: "123" },
    //   { provider: "azure", secret: "123" },
    // ];
    // console.log(`CSP from Hardcoded: ${csp} Type: ${typeof csp}`);
    // console.log(csp[0].provider);
    // console.log(JSON.stringify(csp));

    // let postman = JSON.parse(req.body.csp);
    // console.log(`CSP Postman: ${postman} Type: ${typeof postman}`);
    // console.log(postman[0].provider);
    // console.log(JSON.stringify(postman));
    // return;

    updateOrg = {
      ...req.body,
      csp,
    };
  }

  if (req.body.budget) {
    let budget = req.cookies.jwt
      ? JSON.parse(req.body.budget)
      : req.body.budget;

    updateOrg = {
      ...updateOrg,
      budget,
    };
  }

  if (req.body.appTemplate) {
    // console.log(JSON.parse(req.body.appType));
    // return;
    let appTemplate = req.cookies.jwt
      ? JSON.parse(req.body.appTemplate)
      : req.body.appTemplate;

    updateOrg = {
      ...updateOrg,
      appTemplate,
    };
  }

  const updatedOrg = await Org.findByIdAndUpdate(req.params.id, updateOrg, {
    new: true,
  });

  if (req.headers.ui) {
    let HTML = resourceOverviewTab(updatedOrg, fields);
    res.send(HTML);
  } else {
    res.status(200).json(updatedOrg);
  }
});

// @desc  Delete Org
// @route DELETE /api/orgs/:id
// @access Private
const deleteOrg = asyncHandler(async (req, res) => {
  const org = await Org.findById(req.params.id).deleteOne();
  if (!org) {
    res.status(400);
    throw new Error("Org not found");
  }

  if (req.headers.ui) {
    let HTML = "Org Successfully Deleted";
    res.send(HTML);
  } else {
    res.status(200).json({ id: req.params.id });
  }
});

// @desc  Get Org Requests
// @route GET /api/orgs/:id/requests
// @access Private
const getOrgRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find({ orgId: req.params.id });
  if (requests) {
    res.status(200).json(requests);
  } else {
    res.status(400);
    throw new Error("No Requests Found for Org");
  }
});

export {
  getOrg,
  getOrgs,
  setOrg,
  updateOrg,
  deleteOrg,
  getOrgRequests,
  getOrgOverviewTab,
  findOrg,
  getOrgCloud,
  updateOrgCloud,
  deleteOrgCloud,
  addOrgCloud,
};
