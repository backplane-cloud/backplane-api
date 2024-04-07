import asyncHandler from "express-async-handler";

import Role from "../models/roleModel.js";
import { viewHTMXify, listResources, showResource } from "../htmx/HTMXify.js";

// These fields determine what to display on HTMX responses from Backplane UI
const fields = ["name", "type", "allowActions", "orgId", "ownerId"];
const tabs = ["Overview"];

// @desc  Get Roles
// @route GET /api/roles
// @access Private
const getRoles = asyncHandler(async (req, res) => {
  const roles = await Role.find(
    req.user.userType != "root" ? { orgId: req.user.orgId } : null
  );
  if (roles) {
    if (req.headers.ui) {
      let showbreadcrumb = req.headers["hx-target"] !== "resource-content";
      let HTML = listResources(roles, fields, "Roles", "roles", showbreadcrumb);
      res.send(HTML);
    } else {
      res.status(200).json(roles);
    }
  } else {
    res.status(400);
    throw new Error("No Roles Found");
  }
});

const getInternalRoles = asyncHandler(async (req, res) => {
  const roles = await Role.find();
  if (roles) {
    return roles;
    //res.status(200).json(roles);
  } else {
    res.status(400);
    throw new Error("No Roles Found");
  }
});

// @desc  Get Role
// @route GET /api/roles/:id
// @access Private
const getRole = asyncHandler(async (req, res) => {
  // Handles return of HTMX for Create New Role
  console.log(req.headers.action);

  if (req.headers.action === "create") {
    let HTML = viewHTMXify(
      {},
      ["name", "type", "allowActions"],
      "Create Role",
      "roles",
      req.headers.action
    );
    res.send(HTML);
  } else {
    const role = await Role.findById(req.params.id);
    if (role) {
      if (req.headers.ui) {
        let breadcrumbs = `Roles,${role.name}`;
        let HTML = showResource(role, tabs, breadcrumbs);

        // let HTML = viewHTMXify(
        //   role,
        //   fields,
        //   role.name,
        //   "roles",
        //   req.headers.action
        // );
        res.send(HTML);
      } else {
        res.status(200).json(role);
      }
    } else {
      res.status(400);
      throw new Error("No Roles Found");
    }
  }
});

// @desc  Get Role Actions
// @route GET /api/roles/:id/actions
// @access Private
const getRoleActions = asyncHandler(async (req, res) => {
  const roles = await Role.findById(req.params.id);
  if (roles) {
    res.status(200).json(roles.allowActions);
  } else {
    res.status(400);
    throw new Error("No Roles Found");
  }
});

// @desc  Get Role Actions
// @route GET /api/roles/:id/actions
// @access Private
const getInternalRoleActions = asyncHandler(async (roleid, scope, orgid) => {
  const role = await Role.findById(roleid);

  if (role) {
    const scopedActions = role.allowActions.map(
      (action) => `${scope}${action}`
      // !scope.includes("/orgs")
      //   ? `/orgs/${orgid}${scope}${action}`
      //   : `${scope}${action}`
    );
    return scopedActions; //role.allowActions;
    //res.status(200).json(roles.allowActions);
  } else {
    res.status(400);
    throw new Error("No Roles Found");
  }
});

// @desc  Create Role
// @route POST /api/roles
// @access Private
const setRole = asyncHandler(async (req, res) => {
  //   if (!req.body.text) {
  //     res.status(400);
  //     throw new Error("Please add a text field");
  //   }
  let orgId = req.user.userType != "root" && req.user.orgId;

  const role = await Role.create({
    ...req.body,
    ownerId: req.body.ownerId || req.user.id,
    orgId,
  });
  console.log(role);
  // res.status(200).json(role);

  if (req.headers.ui) {
    let HTML = viewHTMXify(role, fields, role.name, "roles");
    res.send(HTML);
  } else {
    res.status(200).json(role);
  }
});

// @desc  Create Role
// @route POST /api/roles
// @access Private
const setInternalRole = asyncHandler(async (req, res) => {
  //   if (!req.body.text) {
  //     res.status(400);
  //     throw new Error("Please add a text field");
  //   }
  req.body = req;
  // console.log(req.body);
  // return;
  const role = await Role.create({
    ...req.body,
  });

  return role;
});

// @desc  Update Role
// @route PUT /api/roles/:id
// @access Private
const updateRole = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);
  let updatedRole = {};
  if (!role) {
    res.status(400);
    throw new Error("Role not found");
  }

  if (req.body.allowActions) {
    let allowActions = req.body.allowActions.split(",");
    let updateObj = {
      ...req.body,
      allowActions,
    };

    updatedRole = await Role.findByIdAndUpdate(req.params.id, updateObj, {
      new: true,
    });
    // console.log(allowActions);
    // console.log(typeof allowActions);
    // return;
  } else {
    updatedRole = await Role.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
  }

  if (req.headers.ui) {
    let HTML = viewHTMXify(updatedOrg, fields, "Role", "roles");
    res.send(HTML);
  } else {
    res.status(200).json(updatedRole);
  }
});

// @desc  Update Role Actions
// @route PUT /api/roles/:id/actions
// @access Private
const updateRoleActions = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);
  let updatedRole = {};
  if (!role) {
    res.status(400);
    throw new Error("Role not found");
  }

  if (req.body.allowActions) {
    let allowActions = req.body.allowActions.split(",");
    let updateObj = {
      allowActions,
    };

    updatedRole = await Role.findByIdAndUpdate(req.params.id, updateObj, {
      new: true,
    });
  }

  console.log(updatedRole);
  res.status(200).json(updatedRole);
});

// @desc  Delete Role Actions
// @route PATCH /api/roles/:id/actions
// @access Private
const deleteRoleActions = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);
  let updatedRole = {};
  if (!role) {
    res.status(400);
    throw new Error("Role not found");
  }
  let allowActions = role.allowActions.filter(
    (action) => action != req.body.allowActions
  );
  if (req.body.allowActions) {
    let updateObj = {
      allowActions,
    };

    updatedRole = await Role.findByIdAndUpdate(req.params.id, updateObj, {
      new: true,
    });
  }

  res.status(200).json(updatedRole);
});

// @desc  Delete Role
// @route DELETE /api/roles/:id
// @access Private
const deleteRole = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id).deleteOne();

  if (!role) {
    res.status(400);
    throw new Error("Role not found");
  }

  if (req.headers.ui) {
    let HTML = "Role Successfully Deleted";
    res.send(HTML);
  } else {
    res.status(200).json({ id: req.params.id });
  }
});

export {
  getRole,
  getRoles,
  setRole,
  updateRole,
  deleteRole,
  getRoleActions,
  updateRoleActions,
  deleteRoleActions,
  getInternalRoles,
  getInternalRoleActions,
  setInternalRole,
};
