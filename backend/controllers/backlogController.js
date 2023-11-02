import asyncHandler from "express-async-handler";

import { Backlog, BacklogItem, BacklogSprint } from "../models/backlogModel.js";

// @desc  Get Backlogs
// @route GET /api/backlogs
// @access Private
const getBacklogs = asyncHandler(async (req, res) => {
  const backlogs = await Backlog.find(
    req.user.userType != "root" ? { orgId: req.user.orgId } : null
  );
  if (backlogs) {
    res.status(200).json(backlogs);
  } else {
    res.status(400);
    throw new Error("No Backlogs Found");
  }
});

// @desc  Get Backlog
// @route GET /api/backlogs/:id
// @access Private
const getBacklog = asyncHandler(async (req, res) => {
  let backlog;
  if (req.params.id.length === 24) {
    backlog = await Backlog.findById(req.params.id);

    if (backlog) {
      res.status(200).json(backlog);
    } else {
      res.send("Backlog not found");
      // res.status(400);
      // throw new Error("No Orgs Found");
    }
  } else {
    backlog = await Backlog.findOne({ code: req.params.id });
    if (backlog) {
      res.status(200).json(backlog);
    } else {
      res.status(400);
      throw new Error("No Backlog Found");
    }
  }
});

// @desc  Set Backlog
// @route POST /api/backlogs
// @access Private
const setBacklog = asyncHandler(async (req, res) => {
  // if (!req.body.text) {
  //   res.status(400);
  //   throw new Error("Please add a text field");
  // }

  const backlog = await Backlog.create({
    orgId: req.body.orgId,
    productId: req.body.productId,
    ownerId: req.body.ownerId,
    sprintDuration: req.body.sprintDuration,
    velocity: 0,
  });
  console.log("i am here");
  console.log(req.body);
  res.status(200).json(backlog);
});

// @desc  Update Backlog
// @route PUT /api/backlogs/:id
// @access Private
const updateBacklog = asyncHandler(async (req, res) => {
  const backlog = await Backlog.findById(req.params.id);

  if (!backlog) {
    res.status(400);
    throw new Error("Backlog not found");
  }

  const updatedBacklog = await Backlog.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  console.log(updatedBacklog);
  res.status(200).json(updatedBacklog);
});

// @desc  Delete Backlog
// @route DELETE /api/backlogs/:id
// @access Private
const deleteBacklog = asyncHandler(async (req, res) => {
  const backlog = await Backlog.findById(req.params.id).deleteOne();

  if (!backlog) {
    res.status(400);
    throw new Error("Backlog not found");
  }

  res.status(200).json({ id: req.params.id });
});

// @desc  Get Backlog Items
// @route GET /api/backlogs/:id/items
// @access Private
const getBacklogItems = asyncHandler(async (req, res) => {
  console.log("org id", req.params.id);

  const backlogItems = await BacklogItem.find(
    req.user.userType != "root"
      ? req.query.filter
        ? {
            orgId: req.user.orgId,
            backlogId: req.params.id,
            type: req.query.filter,
          }
        : {
            orgId: req.user.orgId,
            backlogId: req.params.id,
          }
      : null
  );
  if (backlogItems) {
    res.status(200).json(backlogItems);
  } else {
    res.status(400);
    throw new Error("No Backlog Items Found");
  }
});

// @desc  Get Backlog Item
// @route GET /api/backlogs/:id/items/:iid
// @access Private
const getBacklogItem = asyncHandler(async (req, res) => {
  const backlogItem = await BacklogItem.findById(req.params.id);
  if (backlogItem) {
    res.status(200).json(backlogItem);
  } else {
    res.status(400);
    throw new Error("No Backlogs Found");
  }
});

// @desc  Set Backlog Item
// @route POST /api/backlogs/:id/items
// @access Private
const setBacklogItem = asyncHandler(async (req, res) => {
  // if (!req.body.text) {
  //   res.status(400);
  //   throw new Error("Please add a text field");
  // }

  const backlogItem = await BacklogItem.create({
    name: req.body.name,
    description: req.body.description,
    type: req.body.type,
    ownerId: req.body.ownerId,
    assignedTo: req.body.assignedTo,
    orgId: req.body.orgId ? req.body.orgId : req.user.orgId,
    status: req.body.status,
    points: req.body.points,
    sprint: req.body.sprint,
    productId: req.body.productId,
    backlogId: req.params.id,
    parentId: req.body.parentId,
  });
  console.log(req.body);
  res.status(200).json(backlogItem);
});

// @desc  Update Backlog Item
// @route PUT /api/backlogs/:id/items/:iid
// @access Private
const updateBacklogItem = asyncHandler(async (req, res) => {
  const backlogItem = await BacklogItem.findById(req.params.id);

  if (!backlogItem) {
    res.status(400);
    throw new Error("Backlog not found");
  }

  const updatedBacklogItem = await BacklogItem.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  console.log(updatedBacklogItem);
  res.status(200).json(updatedBacklogItem);
});

// @desc  Delete Backlog Item
// @route DELETE /api/backlogs/:id/items/:iid
// @access Private
const deleteBacklogItem = asyncHandler(async (req, res) => {
  const backlog = await BacklogItem.findById(req.params.id).deleteOne();

  if (!backlog) {
    res.status(400);
    throw new Error("Backlog not found");
  }

  res.status(200).json({ id: req.params.id });
});

// @desc  Get Backlog Sprints
// @route GET /api/backlogs/:id/sprints
// @access Private
const getBacklogSprints = asyncHandler(async (req, res) => {
  const backlogSprints = await BacklogSprint.find(
    req.user.userType != "root"
      ? {
          orgId: req.user.orgId,
          backlogId: req.params.id,
        }
      : null
  );
  if (backlogSprints) {
    res.status(200).json(backlogSprints);
  } else {
    res.status(400);
    throw new Error("No Backlog Items Found");
  }
});

// @desc  Get Backlog Sprint
// @route GET /api/backlogs/sprints/:id
// @access Private
const getBacklogSprint = asyncHandler(async (req, res) => {
  const backlogSprint = await BacklogSprint.findById(req.params.id);
  if (backlogSprint) {
    res.status(200).json(backlogSprint);
  } else {
    res.status(400);
    throw new Error("No Backlogs Found");
  }
});

// @desc  Set Backlog Sprint
// @route POST /api/backlogs/:id/sprints
// @access Private
const setBacklogSprint = asyncHandler(async (req, res) => {
  // if (!req.body.text) {
  //   res.status(400);
  //   throw new Error("Please add a text field");
  // }

  const backlogSprint = await BacklogSprint.create({
    ...req.body,
    orgId: req.body.orgId ? req.body.orgId : req.user.orgId,
    ownerId: req.body.ownerId ? req.body.ownerId : req.user._id,
    backlogId: req.params.id,
  });
  console.log(req.body);
  res.status(200).json(backlogSprint);
});

// @desc  Update Backlog Sprint
// @route PUT /api/backlogs/sprint/:id
// @access Private
const updateBacklogSprint = asyncHandler(async (req, res) => {
  const backlogSprint = await BacklogSprint.findById(req.params.id);

  if (!backlogSprint) {
    res.status(400);
    throw new Error("Backlog not found");
  }

  const updatedBacklogSprint = await BacklogSprint.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  console.log(updatedBacklogSprint);
  res.status(200).json(updatedBacklogSprint);
});

// @desc  Delete Backlog Item
// @route DELETE /api/backlogs/sprint/:id
// @access Private
const deleteBacklogSprint = asyncHandler(async (req, res) => {
  const backlogSprint = await BacklogSprint.findById(req.params.id).deleteOne();

  if (!backlogSprint) {
    res.status(400);
    throw new Error("Backlog not found");
  }

  res.status(200).json({ id: req.params.id });
});

export {
  getBacklog,
  getBacklogs,
  setBacklog,
  updateBacklog,
  deleteBacklog,
  getBacklogItem,
  getBacklogItems,
  setBacklogItem,
  updateBacklogItem,
  deleteBacklogItem,
  getBacklogSprint,
  getBacklogSprints,
  setBacklogSprint,
  updateBacklogSprint,
  deleteBacklogSprint,
};
