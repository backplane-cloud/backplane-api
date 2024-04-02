import asyncHandler from "express-async-handler";

import Service from "../models/serviceModel.js";

import { viewHTMXify, HTMXify } from "../htmx/HTMXify.js";
// These fields determine what to display on HTMX responses from Backplane UI

const fields = [
  "code",
  "name",
  "description",
  "url",
  "apikey",
  "orgId",
  "ownerId",
];

// @desc  Get Services
// @route GET /api/services
// @access Private
const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find(
    req.user.userType != "root" ? { orgId: req.user.orgId } : null
  );
  if (services) {
    if (req.headers.ui) {
      let HTML = HTMXify(services, fields, "Services", "services");
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
  const service = await Service.findById(req.params.id);
  if (service) {
    if (req.headers.ui) {
      let HTML = viewHTMXify(
        service,
        fields,
        service.name,
        "services",
        req.headers.edit
      );
      res.send(HTML);
    } else {
      res.status(200).json(service);
    }
  } else {
    res.status(400);
    throw new Error("No Services Found");
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

  const service = await Service.create({
    name: req.body.name,
    code: req.body.code,
    description: req.body.description,
    url: req.body.url,
    apikey: req.body.apikey,
    orgId: req.body.orgId,
    ownerId: req.body.ownerId,
    tags: req.body.tags,
    status: req.body.status,
  });
  console.log(req.body);
  res.status(200).json(service);
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
    let HTML = viewHTMXify(updatedService, fields, "Role", "roles");
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

export { getService, getServices, setService, updateService, deleteService };
