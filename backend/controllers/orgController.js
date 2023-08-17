import asyncHandler from "express-async-handler";

import Org from "../models/orgModel.js";
import Request from "../models/requestModel.js";

// @desc  Get Orgs
// @route GET /api/orgs
// @access Private
const getOrgs = asyncHandler(async (req, res) => {
  const orgs = !req.user.allowedActions.includes("/*")
    ? await Org.findById(req.user.orgId)
    : await Org.find();

  // const orgs = await Org.find({ _id: req.user.orgId });
  if (orgs) {
    res.status(200).json(orgs);
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

  if (req.params.id.length === 24) {
    const org = await Org.findById(req.params.id);

    if (org) {
      res.status(200).json(org);
    } else {
      res.send("Org not found");
      // res.status(400);
      // throw new Error("No Orgs Found");
    }
  } else {
    org = await Org.findOne({ code: req.params.id });
    if (org) {
      res.status(200).json(org);
    } else {
      res.status(400);
      throw new Error("No Orgs Found");
    }
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
  console.log("req body", req.body);

  // Check if Org already exists
  const code = req.body.name.toLowerCase().replace(" ", "-");
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
  let csp = "";
  if (req.cookies) {
    csp = req.cookies.jwt ? JSON.parse(req.body.csp) : req.body.csp;
  } else {
    csp = req.body.csp;
  }

  const org = await Org.create({
    code,
    name: req.body.name,
    license: req.body.license,
    type: req.body.type,
    status: req.body.status,
    //ownerId: req.body.owner || req.user.id,
    status: "active",
    type: "org",
    csp,
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

  if (post) {
    res.status(200); // Only valid when request is from HTTP Post
    res.json(org);
  } else {
    return org;
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
    let csp = JSON.parse(req.body.csp);

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

  if (req.body.appType) {
    // console.log(JSON.parse(req.body.appType));
    // return;
    let appType = req.cookies.jwt
      ? JSON.parse(req.body.appType)
      : req.body.appType;

    updateOrg = {
      ...updateOrg,
      appType,
    };
  }

  const updatedOrg = await Org.findByIdAndUpdate(req.params.id, updateOrg, {
    new: true,
  });

  res.status(200).json(updatedOrg);
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

  res.status(200).json({ id: req.params.id });
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

export { getOrg, getOrgs, setOrg, updateOrg, deleteOrg, getOrgRequests };
