import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import Org from "../models/orgModel.js";
import Platform from "../models/platformModel.js";
import Request from "../models/requestModel.js";

import { Backlog } from "../models/backlogModel.js";

// import { ClientSecretCredential } from "@azure/identity";
// import { SubscriptionClient } from "@azure/arm-subscriptions";
// import { BillingManagementClient } from "@azure/arm-billing";

import { getPlatforms, getPlatform } from "./platformController.js";

import {
  createResource,
  listResources,
  showResource,
} from "../views/resource.js";

import {
  showCostTab,
  showBudgetTab,
  showRequestTab,
  resourceOverviewTab,
} from "../views/tabs.js";

// These fields determine what to display on HTMX responses from Backplane UI
const fields = [
  "code",
  "name",
  "description",
  "orgCode",
  "platformCode",
  "ownerEmail",
  "status",
  "budget",

  "cost",
  "utilisation",
];

const tabs = [
  "Overview",
  "Apps",
  "Cost",
  "Budgets",

  "Requests",
  "Backlog",

  "Team",
  "Access",
  "Policy",
];

// @desc  Get Products
// @route GET /api/products
// @access Private
const getProducts = asyncHandler(async (req, res) => {
  let query;

  if (req.headers?.filter) {
    if (req.headers.filter === "orgs") {
      query = {
        orgId: req.headers.filterid,
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

  const products = await Product.find(query);
  if (products) {
    if (req.headers?.ui) {
      let showbreadcrumb = req.headers["hx-target"] !== "resource-content";
      let HTML = listResources(
        products,
        fields,
        "Products",
        "Products",
        showbreadcrumb
      );
      res.send(HTML);
    } else {
      if (req.sync) {
        return products;
      } else {
        res.status(200).json(products);
      }
    }
  } else {
    res.status(400);
    throw new Error("No Products Found");
  }
});

// @desc  Get Product
// @route GET /api/products/:id
// @access Private
const getProduct = asyncHandler(async (req, res) => {
  // Handles return of HTMX for Create New Product

  const product = await Product.findById(
    req.user.userType != "root"
      ? { orgId: req.user.orgId, _id: req.params.id }
      : { _id: req.params.id }
  );

  if (product) {
    if (req.headers.ui) {
      let breadcrumbs = `products,${product.name}`;
      let HTML = showResource(product, tabs, breadcrumbs);
      res.send(HTML);
    } else {
      res.status(200).json(product);
    }
  } else {
    // res.status(400);
    // throw new Error("No Products Found");
    res.send("No Products found matching ID for this Org");
  }
});

// @desc  Create Product UI
// @route GET /api/products/create
// @access Private
const createProductUI = asyncHandler(async (req, res) => {
  // Handles return of HTMX for Create New Product

  // Retrieve Platforms for <select-picker>
  let platforms = await getPlatforms({
    sync: true,
    headers: { filter: "orgs", filterid: req.user.orgId.toHexString() },
  });

  let platformPicker = platforms.map((platform) => {
    return {
      id: platform.id,
      name: platform.name,
    };
  });

  let HTML = createResource(
    {
      platforms: {
        collection: JSON.stringify(platformPicker),
        label: "Platform",
      },
    },
    ["name", "description", "platformId"],
    "Create Product",
    "products",
    req.headers.action
  );
  res.send(HTML);
});

// @desc  Find Products
// @route GET /api/products/search
// @access Private
const findProduct = asyncHandler(async (req, res) => {
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

  const products = await Product.find(query);
  if (products) {
    if (req.headers.ui) {
      let HTML = listResources(products, fields, "Products", "Products", true);
      res.send(HTML);
    } else {
      res.status(200).json(products);
    }
  } else {
    res.status(400);
    throw new Error("No Products Found");
  }
});

// @desc  Get Product Overview
// @route GET /api/products/:id/overview
// @access Private
const getProductOverviewTab = asyncHandler(async (req, res) => {
  // Handles return of HTMX for Create New Product

  if (req.headers.action === "create") {
    let HTML = createResource(
      {},
      ["name", "description", "platformId"],
      "Create Product",
      "products",
      req.headers.action
    );
    res.send(HTML);
  } else {
    const product = await Product.findById(
      req.user.userType != "root"
        ? { orgId: req.user.orgId, _id: req.params.id }
        : { _id: req.params.id }
    );

    if (product) {
      if (req.headers.ui) {
        let HTML = resourceOverviewTab(product, fields, req.headers.action);
        res.send(HTML);
      } else {
        res.status(200).json(product);
      }
    } else {
      // res.status(400);
      // throw new Error("No Products Found");
      res.send("No Products found matching ID for this Org");
    }
  }
});

// @desc  Set Product
// @route POST /api/products
// @access Private
const setProduct = asyncHandler(async (req, res) => {
  // console.log("req.body.orgId:", req.body.orgId);
  // console.log("req.user.orgId:", req.user.orgId);
  // console.log(req.body.orgId === req.user.orgId.toHexString());
  let orgId = req.body.orgId ? req.body.orgId : req.user.orgId;
  let code = req.body.name.toLowerCase().replace(" ", "-");
  if (orgId != req.user.orgId.toHexString()) {
    res.send("You cannot create Products in Other Orgs");
    return;
  }

  // Check if Product already exists
  const exists = await Product.findOne({
    code,
    orgId,
  });

  if (exists) {
    console.log(exists);
    res.status(400);
    throw new Error("Product already exists");
  }

  // Get OrgCode and PlatformCode
  let platform = await getPlatform({
    params: { id: req.body.platformId },
    user: { orgId },
    internal: true,
  });
  let platformCode = platform.code;
  let orgCode = platform.orgCode;

  // Create New Product
  const product = await Product.create({
    code,
    name: req.body.name,
    orgId,
    ownerId: req.body.ownerId ? req.body.ownerId : req.user.id,
    platformId: req.body.platformId,
    status: "active",
    type: "product",
    description: req.body.description,
    platformCode,
    orgCode,
  });

  // Create Backlog
  console.log("Creating Backlog");
  const backlog = await Backlog.create({
    code: product.code,
    orgId,
    productId: product._id,
    ownerId: product.ownerId,
    sprintDuration: 14,
    velocity: 0,
  });
  if (backlog) {
    console.log("Backlog Successfully Created", backlog.id);
  } else {
    console.log("Error Creating Backlog");
  }
  // End Backlog Creation

  console.log(req.body);
  // res.status(200).json(product);

  if (req.headers.ui) {
    let breadcrumbs = `products,${product.name}`;
    let HTML = showResource(product, tabs, breadcrumbs);
    res.send(HTML);
  } else {
    res.status(200).json(product);
  }
});

// @desc  Update Product
// @route PUT /api/products/:id
// @access Private
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(400);
    throw new Error("Product not found");
  }

  let updateProduct = req.body;
  if (req.body.apps) {
    const apps = req.body.apps.split(",");

    updateProduct = {
      ...req.body,
      apps,
    };
  }

  if (req.body.budget) {
    let budget = req.cookies.jwt
      ? JSON.parse(req.body.budget)
      : req.body.budget;
    updateProduct = {
      ...req.body,
      budget,
    };
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    updateProduct,
    {
      new: true,
    }
  );

  // console.log(JSON.stringify(updatedProduct.cloudAccounts));

  if (req.headers?.ui) {
    let HTML = resourceOverviewTab(updatedProduct, fields);
    res.send(HTML);
  } else {
    if (req.sync) {
      return updatedProduct;
    } else {
      res.status(200).json(updatedProduct);
    }
  }
});

// @desc  Delete Product
// @route DELETE /api/products/:id
// @access Private
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product.orgId != req.user.orgId.toHexString()) {
    res.send("You cannot delete products from other Orgs");
    return;
  }

  product.deleteOne();

  if (!product) {
    res.status(400);
    throw new Error("Product not found");
  }

  if (req.headers.ui) {
    let HTML = "Product Successfully Deleted";
    res.send(HTML);
  } else {
    res.status(200).json({ id: req.params.id });
  }
});

// @desc  Get Product Cost
// @route GET /api/products/:id/cost
// @access Private
const getProductCost = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  console.log("processing", product.name, product.id);
  if (product.cost.length !== 0) {
    if (req.headers?.ui) {
      let HTML = showCostTab(product?.cost);
      res.send(HTML);
    } else {
      if (req.sync) {
        return product.cost;
      } else {
        res.status(200).json(product.cost);
      }
    }
  } else {
    if (req.sync) {
      return [{ cost: 0 }];
    } else {
      res.status(400).send("No Cost Data for Product");
      throw new Error("No Cost Data for Product");
    }
  }

  // // Get Product
  // if (!product) {
  //   res.status(400);
  //   throw new Error("Product Not Found");
  // }

  // // Get Cloud Provider

  // const cloudProvider = product.cloud;

  // console.log(cloudProvider);
  // if (cloudProvider === "azure") {
  //   // Get Cloud Accounts
  //   const cloudAccounts = product.cloudAccounts;
  //   console.log(product.cloudAccounts[0]);

  //   // Get Org for Product
  //   const platform = await Platform.findById(product.platformId);
  //   const org = await Org.findById(platform.orgId);
  //   console.log(`Product ${product.name} belongs to Organisation ${org.name}`);

  //   // Get Cloud Credentials from Org
  //   const cloudCredentials = org.csp.find(
  //     (element) => element.provider === cloudProvider
  //   );
  //   console.log(`Cloud Credentials: ${cloudCredentials}`);
  //   const tenantId = cloudCredentials.tenantId;
  //   const clientId = cloudCredentials.clientId;
  //   const clientSecret = cloudCredentials.clientSecret;

  //   // Authenticate to Cloud Platform
  //   const credentials = new ClientSecretCredential(
  //     tenantId,
  //     clientId,
  //     clientSecret
  //   );

  //   // Use Cloud API to retrieve cost for Cloud Accounts
  //   async function listSubscriptions() {
  //     try {
  //       // use credential to authenticate with Azure SDKs
  //       const client = new SubscriptionClient(credentials);
  //       let results = [];
  //       // get details of each subscription
  //       for await (const item of client.subscriptions.list()) {
  //         const subscriptionDetails = await client.subscriptions.get(
  //           item.subscriptionId
  //         );
  //         /*
  //           Each item looks like:

  //           {
  //           id: '/subscriptions/123456',
  //           subscriptionId: '123456',
  //           displayName: 'YOUR-SUBSCRIPTION-NAME',
  //           state: 'Enabled',
  //           subscriptionPolicies: {
  //               locationPlacementId: 'Internal_2014-09-01',
  //               quotaId: 'Internal_2014-09-01',
  //               spendingLimit: 'Off'
  //           },
  //           authorizationSource: 'RoleBased'
  //           },
  //       */
  //         //console.log(subscriptionDetails);
  //         results.push(subscriptionDetails);
  //         //console.log(results)
  //       }
  //       console.log(results[0].subscriptionId);

  //       const billing = new BillingManagementClient(
  //         credentials,
  //         results[0].subscriptionId
  //       );

  //       return results;
  //     } catch (err) {
  //       console.error(JSON.stringify(err));
  //     }
  //   }

  //   listSubscriptions()
  //     .then((p) => {
  //       //console.log(p);
  //       res.status(200).json(p);
  //     })
  //     .catch((ex) => {
  //       console.log(ex);
  //     });
  // } else {
  //   res.status(400).json(`${cloudProvider} not yet implemented`);
  // }
});

// @desc  Get Product Requests
// @route GET /api/products/:id/requests
// @access Private
const getProductRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find({ requestedForId: req.params.id });
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
      throw new Error("No Requests Found for /oridyct");
    }
  }
});

// @desc  Get Product Budgets
// @route GET /api/products/:id/budgets
// @access Private
import { orgTab } from "../views/org.js";

const getProductBudgets = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product.budget) {
    let budgets = product.budget;
    console.log(budgets);

    if (req.headers.ui) {
      let HTML = showBudgetTab(
        budgets,
        ["year", "budget", "currency"],
        req.headers.action
      );
      res.send(HTML);
    } else {
      res.status(200).json(budgets);
    }
  } else {
    if (req.headers.ui) {
      res.send("<h1>No Budgets Exist for Product</h1>");
    } else {
      res.status(400);
      throw new Error("No Budgets Found for Product");
    }
  }
});

export {
  getProduct,
  getProducts,
  setProduct,
  updateProduct,
  deleteProduct,
  getProductCost,
  getProductRequests,
  getProductOverviewTab,
  findProduct,
  getProductBudgets,
  createProductUI,
};
