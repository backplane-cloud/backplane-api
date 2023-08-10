import asyncHandler from "express-async-handler";
import Platform from "../models/platformModel.js";
import Request from "../models/requestModel.js";

// @desc  Get Platforms
// @route GET /api/platforms
// @access Private
const getPlatforms = asyncHandler(async (req, res) => {
  const platforms = await Platform.find(
    req.user.userType != "root" ? { orgId: req.user.orgId } : null
  );
  //console.log(platforms);
  if (platforms) {
    res.status(200).json(platforms);
  } else {
    res.status(400);
    throw new Error("No Platforms Found");
  }
});

// @desc  Get Platform
// @route GET /api/platforms/:id
// @access Private
const getPlatform = asyncHandler(async (req, res) => {
  const platforms = await Platform.find(
    req.user.userType != "root"
      ? { orgId: req.user.orgId, _id: req.params.id }
      : { _id: req.params.id }
  );
  if (platforms && platforms.length > 0) {
    res.status(200).json(platforms);
  } else {
    //res.status(400);
    // throw new Error("No Platforms Found");
    res.send("No Platforms Found for Org");
  }
});

// @desc  Create Platform
// @route POST /api/platforms
// @access Private
const setPlatform = asyncHandler(async (req, res) => {
  // Check if Platform already exists
  const exists = await Platform.findOne({
    code: req.body.code,
    orgId: req.user.orgId,
  });
  if (exists) {
    console.log(exists);
    res.status(400);
    throw new Error("Platform already exists");
  }

  // Create New Platform
  const platform = await Platform.create({
    code: req.body.code,
    name: req.body.name,
    // orgId: req.body.orgId,
    orgId: req.user.orgId,
    // ownerId: req.body.ownerId,
    ownerId: req.user.id,
    status: "active",
    type: "platform",
  });
  console.log(req.body);
  res.status(200).json(platform);
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

  // if (req.body.budget) {
  //   let budget = JSON.parse(req.body.budget);
  //   updatePlatform = {
  //     ...req.body,
  //     budget,
  //   };
  // }

  const updatedPlatform = await Platform.findByIdAndUpdate(
    req.params.id,
    updatePlatform,
    {
      new: true,
    }
  );

  console.log(updatedPlatform);
  res.status(200).json(updatedPlatform);
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

  res.status(200).send("Platform Successfully Deleted");
});

// @desc  Get Platform Requests
// @route GET /api/platforms/:id/requests
// @access Private
const getPlatformRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find({ requestedForId: req.params.id });
  if (requests) {
    res.status(200).json(requests);
  } else {
    res.status(400);
    throw new Error("No Requests Found for Org");
  }
});

export {
  getPlatform,
  getPlatforms,
  setPlatform,
  updatePlatform,
  deletePlatform,
  getPlatformRequests,
};
