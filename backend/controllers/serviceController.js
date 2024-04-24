import asyncHandler from "express-async-handler";

import Service from "../models/serviceModel.js";

import {
  createResource,
  listResources,
  showResource,
} from "../views/resource.js";
// These fields determine what to display on HTMX responses from Backplane UI

const fields = ["name", "description", "url", "apikey", "ownerId"];
const tabs = ["Overview"];

// @desc  Get Services
// @route GET /api/services
// @access Private
const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find(
    req.user.userType != "root" ? { orgId: req.user.orgId } : null
  );
  if (services) {
    if (req.headers.ui) {
      let showbreadcrumb = req.headers["hx-target"] !== "resource-content";
      let HTML = listResources(
        services,
        fields,
        "Services",
        "Services",
        showbreadcrumb
      );
      res.send(HTML);
    } else {
      res.status(200).json(services);
    }
  } else {
    res.status(400);
    throw new Error("No Services Found");
  }
});

// @desc  Get Service
// @route GET /api/services/:id
// @access Private
const getService = asyncHandler(async (req, res) => {
  // Handles return of HTMX for Create New Service
  console.log("req action", req.headers.action);

  if (req.headers.action === "create") {
    let HTML = createResource(
      {},
      fields,
      "Create Service",
      "services",
      req.headers.action
    );
    res.send(HTML);
  } else {
    const service = await Service.findById(req.params.id);
    if (service) {
      if (req.headers.ui) {
        let breadcrumbs = `services,${service.name}`;
        let HTML = showResource(service, tabs, breadcrumbs);

        // let HTML = createResource(
        //   service,
        //   fields,
        //   service.name,
        //   "services",
        //   req.headers.action
        // );
        res.send(HTML);
      } else {
        res.status(200).json(service);
      }
    } else {
      res.status(400);
      throw new Error("No Services Found");
    }
  }
});

// @desc  Set Service
// @route POST /api/services
// @access Private
const setService = asyncHandler(async (req, res) => {
  // if (!req.body.text) {
  //   res.status(400);
  //   throw new Error("Please add a text field");
  // }
  let code = req.body.name.toLowerCase().replace(" ", "-");

  const service = await Service.create({
    name: req.body.name,
    code,
    description: req.body.description,
    url: req.body.url,
    apikey: req.body.apikey,
    orgId: req.body.orgId ? req.body.orgId : req.user.orgId,
    ownerId: req.body.ownerId ? req.body.ownerId : req.user.id,
    tags: req.body.tags,
    status: req.body.status,
  });
  console.log(req.body);
  if (req.headers.ui) {
    let HTML = createResource(service, fields, service.name, "services");
    res.send(HTML);
  } else {
    res.status(200).json(service);
  }
});

// @desc  Update Service
// @route PUT /api/services/:id
// @access Private
const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    res.status(400);
    throw new Error("Service not found");
  }

  const updatedService = await Service.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  if (req.headers.ui) {
    let HTML = createResource(updatedService, fields, "Service", "services");
    res.send(HTML);
  } else {
    res.status(200).json(updatedService);
  }
});

// @desc  Delete Service
// @route DELETE /api/services/:id
// @access Private
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id).deleteOne();

  if (!service) {
    res.status(400);
    throw new Error("Service not found");
  }

  if (req.headers.ui) {
    let HTML = "Service Successfully Deleted";
    res.send(HTML);
  } else {
    res.status(200).json({ id: req.params.id });
  }
});

// @desc  Create Service UI
// @route GET /api/platforms/create
// @access Private
const createServiceUI = asyncHandler(async (req, res) => {
  // Handles return of HTMX for Create New Platform
  // console.log(req.user.orgId.toHexString());
  let HTML = createResource(
    {},
    ["name", "description", "url", "apikey"],
    "Create Service",
    "services",
    req.headers.action,
    req.user.orgId,
    req.headers.returnpath
  );
  res.send(HTML);
});

export {
  getService,
  getServices,
  setService,
  updateService,
  deleteService,
  createServiceUI,
};
