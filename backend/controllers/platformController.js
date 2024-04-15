import asyncHandler from "express-async-handler";
import Platform from "../models/platformModel.js";
import Request from "../models/requestModel.js";
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
  "ownerEmail",
  "status",
  "budget",

  "cost",
  "utilisation",
];

const tabs = [
  "Overview",
  "Products",
  "Apps",
  "Cost",
  "Budgets",

  "Requests",

  "Team",
  "Access",
  "Policy",
];

// @desc  Get Platforms
// @route GET /api/platforms
// @access Private
const getPlatforms = asyncHandler(async (req, res) => {
  let query;

  if (req.headers?.filter) {
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

  const platforms = await Platform.find(query);
  //console.log(platforms);
  if (platforms) {
    if (req.headers?.ui) {
      let showbreadcrumb = req.headers["hx-target"] !== "resource-content";
      let HTML = listResources(
        platforms,
        fields,
        "Platforms",
        "Platforms",
        showbreadcrumb
      );
      res.send(HTML);
    } else {
      if (req.sync) {
        return platforms;
      } else {
        res.status(200).json(platforms);
      }
    }
  } else {
    res.status(400);
    throw new Error("No Platforms Found");
  }
});

// @desc  Get Platform
// @route GET /api/platforms/:id
// @access Private
const getPlatform = asyncHandler(async (req, res) => {
  // Handles return of HTMX for Create New Platform
  // console.log(req.headers.action);

  const platform = await Platform.findById(
    req.user?.userType != "root"
      ? { orgId: req.user.orgId, _id: req.params.id }
      : { _id: req.params.id }
  );
  if (platform) {
    if (req.headers?.ui) {
      let breadcrumbs = `platforms,${platform.name}`;
      let HTML = showResource(platform, tabs, breadcrumbs);
      // let HTML = resourceView(platform, tabs);

      res.send(HTML);
    } else {
      if (req.internal) {
        // i.e. a call from Product Controller as part of Product Create to retrieve Platform Code and Org Code.
        return platform;
      } else {
        res.status(200).json(platform);
      }
    }
  } else {
    //res.status(400);
    // throw new Error("No Platforms Found");
    res.send("No Platforms Found for Org");
  }
});

// @desc  Create Platform UI
// @route GET /api/platforms/create
// @access Private
const createPlatformUI = asyncHandler(async (req, res) => {
  // Handles return of HTMX for Create New Platform
  // console.log(req.headers.action);

  let HTML = createResource(
    {},
    ["name", "description"],
    "Create Platform",
    "platforms",
    req.headers.action
  );
  res.send(HTML);
});

// @desc  Find Platform
// @route GET /api/platforms/search
// @access Private
const findPlatform = asyncHandler(async (req, res) => {
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
  const platforms = await Platform.find(query);

  if (platforms) {
    if (req.headers.ui) {
      let HTML = listResources(platforms, fields, "Platforms", "platforms");
      res.send(HTML);
    } else {
      res.status(200).json(platforms);
    }
  } else {
    res.status(400);
    throw new Error("No Apps Found");
  }
});

// @desc  Get Platform Overview
// @route GET /api/platforms/:id/overview
// @access Private
const getPlatformOverviewTab = asyncHandler(async (req, res) => {
  // Handles return of HTMX for Create New Platform
  console.log(req.headers.action);

  if (req.headers.action === "create") {
    let HTML = createResource(
      {},
      ["name", "description"],
      "Create Platform",
      "platforms",
      req.headers.action
    );
    res.send(HTML);
  } else {
    const platform = await Platform.findById(
      req.user.userType != "root"
        ? { orgId: req.user.orgId, _id: req.params.id }
        : { _id: req.params.id }
    );
    if (platform) {
      if (req.headers.ui) {
        let HTML = resourceOverviewTab(platform, fields, req.headers.action);

        res.send(HTML);
      } else {
        res.status(200).json(platform);
      }
    } else {
      //res.status(400);
      // throw new Error("No Platforms Found");
      res.send("No Platforms Found for Org");
    }
  }
});

// @desc  Create Platform
// @route POST /api/platforms
// @access Private
const setPlatform = asyncHandler(async (req, res) => {
  // Check if Platform already exists
  let code = req.body.name.toLowerCase().replace(" ", "-");

  const exists = await Platform.findOne({
    code,
    orgId: req.user.orgId,
  });
  if (exists) {
    console.log(exists);
    res.status(400);
    throw new Error("Platform already exists");
  }

  // Create New Platform
  const platform = await Platform.create({
    code,
    name: req.body.name,
    description: req.body.description,
    orgId: req.user.orgId,
    ownerId: req.user.id,

    status: "active",
    type: "platform",
  });
  console.log(req.body);
  // res.status(200).json(platform);

  if (req.headers.ui) {
    let breadcrumbs = `platforms,${platform.name}`;
    let HTML = showResource(platform, tabs, breadcrumbs);

    res.send(HTML);
  } else {
    res.status(200).json(platform);
  }
});

// @desc  Update Platform
// @route PUT /api/platforms/:id
// @access Private
const updatePlatform = asyncHandler(async (req, res) => {
  const platform = await Platform.findById(req.params.id);

  if (!platform) {
    res.status(400);
    throw new Error("Platform not found");
  }

  // let budget = JSON.parse(req.body.budget);
  // console.log(budget);
  // return;
  let updatePlatform = req.body;

  if (req.body.budget) {
    let budget = JSON.parse(req.body.budget);
    updatePlatform = {
      ...req.body,
      budget,
    };
  }

  const updatedPlatform = await Platform.findByIdAndUpdate(
    req.params.id,
    updatePlatform,
    {
      new: true,
    }
  );

  if (req.headers?.ui) {
    let HTML = resourceOverviewTab(updatedPlatform, fields);
    res.send(HTML);
  } else {
    if (req.sync) {
      return updatedPlatform;
    } else {
      res.status(200).json(updatedPlatform);
    }
  }
});

// @desc  Delete Platform
// @route DELETE /api/platforms/:id
// @access Private
const deletePlatform = asyncHandler(async (req, res) => {
  const platform = await Platform.findById(req.params.id);
  if (
    platform.orgId != req.user.orgId.toHexString() &&
    !req.user.allowedActions.includes("/*")
  ) {
    //res.status(400);
    res.send("You cannot delete Platforms from other Orgs");
    return;
  }

  platform.deleteOne();
  if (!platform) {
    res.status(400);
    throw new Error("Platform not found");
  }

  if (req.headers.ui) {
    let HTML = "Platform Successfully Deleted";
    res.send(HTML);
  } else {
    res.status(200).json({ id: req.params.id });
  }
});

// @desc  Get Platform Requests
// @route GET /api/platforms/:id/requests
// @access Private
const getPlatformRequests = asyncHandler(async (req, res) => {
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
      throw new Error("No Requests Found for Platform");
    }
  }
});

// @desc  Get Platform Budgets
// @route GET /api/platforms/:id/budgets
// @access Private
import { orgTab } from "../views/org.js";

const getPlatformBudgets = asyncHandler(async (req, res) => {
  const platform = await Platform.findById(req.params.id);

  if (platform.budget) {
    let budgets = platform.budget;
    console.log(budgets);

    if (req.headers.ui) {
      let HTML = showBudgetTab(
        budgets,
        ["year", "budget", "budgetAllocated", "currency"],
        req.headers.action
      );
      res.send(HTML);
    } else {
      res.status(200).json(budgets);
    }
  } else {
    if (req.headers.ui) {
      res.send("<h1>No Budgets Exist for Platform</h1>");
    } else {
      res.status(400);
      throw new Error("No Budgets Found for Platform");
    }
  }
});

// @desc  Get Platform Cost
// @route GET /api/platforms/:id/cost
// @access Private
const getPlatformCost = asyncHandler(async (req, res) => {
  const platform = await Platform.findById(req.params.id);

  if (platform?.cost.length !== 0) {
    if (req.headers?.ui) {
      let HTML = showCostTab(platform?.cost);
      res.send(HTML);
    } else {
      if (req.sync) {
        return platform?.cost;
      } else {
        res.status(200).json(platform.cost);
      }
    }
  } else {
    return platform?.cost;
    // res.status(400).send("No Cost Data for Platform");
    // throw new Error("No Cost Data for Platform");
  }
});

export {
  getPlatform,
  getPlatforms,
  setPlatform,
  updatePlatform,
  deletePlatform,
  getPlatformRequests,
  getPlatformOverviewTab,
  findPlatform,
  getPlatformBudgets,
  getPlatformCost,
  createPlatformUI,
};
