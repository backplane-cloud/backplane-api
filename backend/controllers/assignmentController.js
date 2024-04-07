import asyncHandler from "express-async-handler";

import Assignment from "../models/assignmentModel.js";
import Team from "../models/teamModel.js";

import { viewHTMXify, listResources, showResource } from "../htmx/HTMXify.js";

// These fields determine what to display on HTMX responses from Backplane UI
const fields = [
  "id",
  "type",
  "scope",
  "principal",
  "principalRef",
  "role",
  "orgId",
];

const tabs = ["Overview"];

// @desc  Get Assignments
// @route GET /api/assignments
// @access Private
const getAssignments = asyncHandler(async (req, res) => {
  const assignments = await Assignment.find(
    req.user.userType != "root" ? { orgId: req.user.orgId } : null
  );
  if (assignments) {
    if (req.headers.ui) {
      let showbreadcrumb = req.headers["hx-target"] !== "resource-content";
      let HTML = listResources(
        assignments,
        fields,
        "Assignments",
        "assignments",
        showbreadcrumb
      );
      res.send(HTML);
    } else {
      res.status(200).json(assignments);
    }
  } else {
    res.status(400);
    throw new Error("No Assignments Found");
  }
});

// @desc  Get Assignment
// @route GET /api/assignments/:id
// @access Private
const getAssignment = asyncHandler(async (req, res) => {
  // Handles return of HTMX for Create New Role Assignment
  console.log(req.headers.action);

  if (req.headers.action === "create") {
    let HTML = viewHTMXify(
      {},
      ["type", "principal", "principalRef", "scope", "role", "expires"],
      "Create Role Assignment",
      "assignments",
      req.headers.action
    );
    res.send(HTML);
  } else {
    let orgId = req.user.orgId.toHexString();
    console.log(orgId);
    console.log(req.user.userType);
    console.log({ id: req.params.id, orgId });
    const assignment = await Assignment.findById(
      req.user.userType != "root"
        ? { _id: req.params.id, orgId } // Only return the assignment within the same Org as the User
        : { _id: req.params.id }
    );

    if (assignment) {
      if (req.headers.ui) {
        let breadcrumbs = `assignment,${assignment.type}`;

        let HTML = showResource(assignment, tabs, breadcrumbs);

        // let HTML = viewHTMXify(
        //   assignment,
        //   fields,
        //   "Assignment",
        //   "assignments",
        //   req.headers.action
        // );
        res.send(HTML);
      } else {
        res.status(200).json(assignment);
      }
    } else {
      //res.status(400);
      res.send("Assignment Does not exist in this Org");
      //throw new Error("No Assignments Found");
    }
  }
});

// @desc  Get User Assignments
// @route GET /api/assignments/user/:id
// @access Private
const getUserAssignments = asyncHandler(async (req, res) => {
  console.log("reqid", req.id);
  console.log("orgid", req.orgId);
  const assignments = await Assignment.find({
    principal: req.id,
    orgId: req.orgId,
  });
  //console.log(assignments);

  if (assignments) {
    return assignments;
    //res.status(200).json(assignments);
  } else {
    res.status(400);
    throw new Error("No Assignments Found");
  }
});

// @desc  Get Team Assignments
// @route GET /api/assignments/user/:id
// @access Private
const getTeamAssignments = asyncHandler(async (req, res) => {
  const assignments = await Assignment.find({
    type: "team",
  });
  console.log(getTeamAssignments);

  if (assignments) {
    return assignments;
    //res.status(200).json(assignments);
  } else {
    res.status(400);
    throw new Error("No Assignments Found");
  }
});

// @desc  Create Assignment
// @route POST /api/assignments
// @access Private
const setAssignment = asyncHandler(async (req, res) => {
  //   if (!req.body.text) {
  //     res.status(400);
  //     throw new Error("Please add a text field");
  //   }
  // console.log(req.body.principalRef);
  // return;
  // console.log(req.body);
  // console.log(req.body.principalRef);
  // return;

  /* 
  For Team Assignments, the Assignment cannot be at a higher scope than the Team is scoped to. 
  For example a platform level team cannot be assigned at an Org level. 
  */

  if (!req.body) {
    req.body = req; // This is for internal code calls for Registering first user
  }

  if (req.body.type === "team") {
    // Get Team Scope
    const team = await Team.findById(req.body.principal);
    const teamScope = team.scope.split("/").slice(-2);

    console.log("Team Scope:", team.scope);
    console.log("Assignment Scope:", req.body.scope);
    console.log("Slice: ", teamScope);

    if (
      !req.body.scope.includes(teamScope[0]) &&
      !req.body.scope.includes(teamScope[1])
    ) {
      console.log("Team Assignment cannot exceed Team Scope");
      return res.json(
        `Cannot assign Team ${team.name} at higher scope than Team Scope ${team.scope}`
      );
    }
  }

  // Duplicate Assignment Check
  const checkAssignment = await Assignment.find({
    scope: req.body.scope,
    principal: req.body.principal,
    role: req.body.role,
  });
  if (checkAssignment && checkAssignment.length > 0) {
    res.send("Assignment already exists.");
    return;
  }

  // Create Assignment
  let assignment;

  if (req?.user !== undefined) {
    assignment = await Assignment.create({
      ...req.body,
      orgId: req.user.orgId,
      createdBy: req.user.id,
    });
    console.log(req.body);
    // res.status(200).json(assignment);
  } else {
    assignment = await Assignment.create({
      ...req.body,
    });
    // return;
  }

  console.log("Created Assignment", assignment);

  // if (req?.headers?.ui !== undefined && req?.headers?.action !== "register") {
  //   // if (req.headers.ui) {
  //   let HTML = viewHTMXify(assignment, fields, "Assignment", "assignments");
  //   res.send(HTML);
  // } else {
  // res.status(200).json(assignment);
  // }
  return assignment;
});

// @desc  Update Assignment
// @route PUT /api/assignments/:id
// @access Private
const updateAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);

  if (!assignment) {
    res.status(400);
    throw new Error("Assignment not found");
  }

  if (assignment.type === "team") {
    // Get Team Scope
    const team = await Team.findById(assignment.principal);
    const teamScope = team.scope.split("/").slice(-2);

    console.log("Team Scope:", team.scope);
    console.log("Assignment Scope:", req.body.scope);
    console.log("Slice: ", teamScope);

    if (
      !req.body.scope.includes(teamScope[0]) &&
      !req.body.scope.includes(teamScope[1])
    ) {
      console.log("Team Assignment cannot exceed Team Scope");
      return res.json(
        `Cannot assign Team ${team.name} at higher scope than Team Scope ${team.scope}`
      );
    }
  }

  const updatedAssignment = await Assignment.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  if (req.headers.ui) {
    let HTML = viewHTMXify(updatedAssignment, fields, "Organsations", "orgs");
    res.send(HTML);
  } else {
    res.status(200).json(updatedAssignment);
  }
});

// @desc  Delete Assignment
// @route DELETE /api/assignments/:id
// @access Private
const deleteAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id).deleteOne();

  if (!assignment) {
    res.status(400);
    throw new Error("Assignment not found");
  }

  if (req.headers.ui) {
    let HTML = "Assignment Successfully Deleted";
    res.send(HTML);
  } else {
    res.status(200).json({ id: req.params.id });
  }
});

export {
  getAssignment,
  getAssignments,
  setAssignment,
  updateAssignment,
  deleteAssignment,
  getUserAssignments, // For AuthZ Middleware
  getTeamAssignments, // For AuthZ Middleware
};
